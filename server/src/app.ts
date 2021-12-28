import express, { Express } from "express";
import { MongoClientOptions } from "mongodb";
import mongoose from "mongoose";
import cors from "cors";
import watcherRoutes from "./routes/index";
import dotenv from "dotenv";
import 'source-map-support/register';
import { Watcher } from "./types/watcher";
import WatcherModel from "./models/watcher"

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
mongoose.connect(uri, options, async () => {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`)
    });
});