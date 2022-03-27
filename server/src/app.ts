import express, { Express } from "express";
import { MongoClientOptions } from "mongodb";
import mongoose from "mongoose";
import cors from "cors";
import watcherRoutes from "./routes/index";
import dotenv from "dotenv";
import 'source-map-support/register';
import { AlertType, Watcher } from "./types/watcher";
import WatcherModel from "./models/watcher"
import { getTimeUTC } from "./utils";
import cmcApi from "./external/cmc-api"
import mailer from "./external/mailer";

dotenv.config();

const app: Express = express();
const PORT: string | number = process.env.PORT || 4000;

app.use(
    express.urlencoded({
        extended: true
    }),
    express.json()
);
app.use(cors());
app.use(watcherRoutes);

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.aywb8.mongodb.net/${process.env.MONGO_DB}`;
const options: MongoClientOptions = {
    // Options
    loggerLevel: "debug",
    retryWrites: true,
    w: "majority"
};

console.log(`Attempting connection to mongoDB...`);
mongoose.connect(uri, options, async () => {
    app.listen(PORT, async () => {
        console.log(`Server running on http://localhost:${PORT}`);

        // Start watching for alerts to trigger
        for (; ;) {
            try {
                await watch();
            } catch (error) {
                console.log(`${getTimeUTC()} [Main] Watch routine failed:\n${error}`);
            }
            await delay(1000 * 60);
        }
    });
});

//Bind connection to error event (to get notification of connection errors)
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));

function delay(time: number) {
    return new Promise(resolve => setTimeout(resolve, time));
}

async function watch() {
    console.log(`${getTimeUTC()} [Watch] Watch routine started...`);

    const docs = await WatcherModel.find({ active: true });
    if (!docs || docs.length === 0) {
        console.log(`${getTimeUTC()} [Watch] No watcher found in DB`);
        return;
    }

    const watchers = docs as Array<Watcher>;

    // Only keep cmcIds and remove duplicates
    const cmcIdsToCheck = [...new Set(watchers.map(x => x.coinInfo.cmcId))];

    const response = await cmcApi.getLatestQuotes(cmcIdsToCheck);
    watchers.forEach(async watcher => {
        const currentPrice = response.data[watcher.coinInfo.cmcId].quote.USD.price;
        //console.log(`${getTimeUTC()} [Watch] Watcher ${watcher.coinInfo.symbol}, ${currentPrice}`);
        const targetReached = watcherTargetReached(watcher, currentPrice);

        if (targetReached) {
            console.log(`${getTimeUTC()} [Watch] Target reached for ${watcher.coinInfo.symbol}, ID=${watcher._id}`);

            // Trigger alert
            const alertSubject = `${watcher.coinInfo.symbol} - Alert target price reached`;
            let alertText = `Target price reached: ${getWatcherTargetPrice(watcher)} USD`;
            alertText += `\nCurrent price: ${currentPrice} USD`;

            if (watcher.amountToSell > 0) {
                const profits = watcher.amountToSell * currentPrice - watcher.amountToSell * watcher.entryPrice;
                alertText += `\nUnrealized gains: ${profits} USD`;
            }

            alertText += `\n\nWatcher:\n`;
            alertText += JSON.stringify(watcher, null, 4);
            mailer.sendAlert(alertSubject, alertText);

            // Update DB
            watcher.active = false;
            await watcher.save();
        }
    });

    console.log(`${getTimeUTC()} [Watch] Watch routine ended`);
}

function watcherTargetReached(watcher: Watcher, price: number): boolean {
    switch (watcher.type) {
        case AlertType.TargetPriceAbove:
        case AlertType.TargetPositivePercentage:
            return price > getWatcherTargetPrice(watcher);
        case AlertType.TargetPriceBelow:
        case AlertType.TargetNegativePercentage:
            return price < getWatcherTargetPrice(watcher);
        default:
            throw new Error(`Unimplemented type: ${watcher.type}`);
    }
}

function getWatcherTargetPrice(watcher: Watcher): number {
    switch (watcher.type) {
        case AlertType.TargetPriceAbove:
        case AlertType.TargetPriceBelow:
            return watcher.targetPrice;
        case AlertType.TargetPositivePercentage:
            return watcher.entryPrice + watcher.entryPrice * watcher.targetPercentage / 100;
        case AlertType.TargetNegativePercentage:
            return watcher.entryPrice - watcher.entryPrice * watcher.targetPercentage / 100;
        default:
            throw new Error(`Unimplemented type: ${watcher.type}`);
    }
}