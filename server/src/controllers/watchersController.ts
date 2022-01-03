import { Response, Request } from "express";
import { AlertType, Watcher } from "../types/watcher";
import WatcherModel from "../models/watcher";

function dispatchError(res: Response, error: string) {
    res.status(400).json({
        message: `[Server] ${error}`
    });
    console.log(error);
}

const getWatchers = async (req: Request, res: Response): Promise<void> => {
    try {
        const watchers: Watcher[] = await WatcherModel.find();
        res.status(200).json({ watchers });
    } catch (error) {
        dispatchError(res, `${error}`);
    }
}

const addWatcher = async (req: Request, res: Response): Promise<void> => {
    try {
        const reqWatcher = req.body.watcher as Watcher;
        //console.log("[WatchersController.addWatcher] " + reqWatcher);

        if (reqWatcher.note && reqWatcher.note.length > 2000) {
            dispatchError(res, "Note is too long. Max: 2000 characters");
            return;
        }

        if (reqWatcher.amountToSell && (isNaN(reqWatcher.amountToSell) || reqWatcher.amountToSell < 0)) {
            dispatchError(res, `Invalid amountToSell: ${reqWatcher.amountToSell}`);
            return;
        }

        switch (reqWatcher.type) {
            case AlertType.TargetPriceBelow:
            case AlertType.TargetPriceAbove:
                if (isNaN(reqWatcher.targetPrice) || reqWatcher.targetPrice < 0) {
                    dispatchError(res, `Invalid targetPrice: ${reqWatcher.targetPrice}`);
                    return;
                }
                break;
            case AlertType.TargetNegativePercentage:
            case AlertType.TargetPositivePercentage:
                if (isNaN(reqWatcher.targetPercentage) || reqWatcher.targetPercentage < 0) {
                    dispatchError(res, `Invalid targetPercentage: ${reqWatcher.targetPercentage}`);
                    return;
                }
                break;
            default:
                dispatchError(res, `Invalid type: ${reqWatcher.type}`);
                return;
        }

        // Validate url etc
        const order = 0;

        const watcher: Watcher = new WatcherModel({
            coinInfo: reqWatcher.coinInfo,
            active: true,
            order,
            type: reqWatcher.type,
            entryPrice: reqWatcher.entryPrice,
            targetPrice: reqWatcher.targetPrice,
            targetPercentage: reqWatcher.targetPercentage,
            amountToSell: reqWatcher.amountToSell,
            note: reqWatcher.note,
            isNew: true
        });

        const newWatcher: Watcher = await watcher.save();

        res.status(201).json({
            message: 'Watcher added',
            watcher: newWatcher
        });
    } catch (error) {
        dispatchError(res, `${error}`);
    }
}

const setWatcherActive = async (req: Request, res: Response): Promise<void> => {
    try {
        const watcherId: string = req.body.watcherId;
        const active: boolean = req.body.active;
        console.log(`[WatchersController.setWatcherActive] Request received. watcherId=${watcherId}, active=${active}`);

        WatcherModel.findByIdAndUpdate(watcherId, { active },
            (error, watcher) => {
                if (error) {
                    dispatchError(res, `${error}`);
                }
                else {
                    res.status(200).json({ active });
                    console.log(`[WatchersController.setWatcherActive] Updated watcher state. watcherId=${watcherId}, active=${active}`);
                }
            });
    } catch (error) {
        dispatchError(res, `${error}`);
    }
}

const deleteWatcher = async (req: Request, res: Response): Promise<void> => {
    try {
        const watcherId: string = req.body.watcherId;
        console.log(`[WatchersController.deleteWatcher] Request received. watcherId=${watcherId}`);

        WatcherModel.findOneAndDelete({ _id: watcherId }, undefined,
            (error, watcher) => {
                if (error) {
                    dispatchError(res, `${error}`);
                }
                else {
                    res.status(200).send();
                    console.log(`[WatchersController.deleteWatcher] Deleted watcher. watcherId=${watcherId}`);
                }
            });
    } catch (error) {
        dispatchError(res, `${error}`);
    }
}

// TODO Update
// https://www.freecodecamp.org/news/how-to-build-a-todo-app-with-react-typescript-nodejs-and-mongodb/
// https://github.com/ibrahima92/fullstack-typescript-mern-todo/blob/master/server/src/controllers/todos/index.ts

// TODO Delete
// https://www.freecodecamp.org/news/how-to-build-a-todo-app-with-react-typescript-nodejs-and-mongodb/
// https://github.com/ibrahima92/fullstack-typescript-mern-todo/blob/master/server/src/controllers/todos/index.ts

export {
    getWatchers,
    addWatcher,
    setWatcherActive,
    deleteWatcher
};