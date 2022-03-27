import { Response, Request } from "express";
import { AlertType, Watcher } from "../types/watcher";
import { dispatchError, Logger, verifyAuth } from "../utils";
import WatcherModel from "../models/watcher";

const getWatchers = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyAuth(req);
        const watchers: Watcher[] = await WatcherModel.find();
        res.status(200).json({ watchers });
    } catch (error) {
        dispatchError("getWatchers", res, error);
    }
}

const addWatcher = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyAuth(req);
        const reqWatcher = req.body.watcher as Watcher;
        Logger.log("addWatcher", `Request received.`);

        if (reqWatcher.note && reqWatcher.note.length > 2000) {
            dispatchError("addWatcher", res, "Note is too long. Max: 2000 characters");
            return;
        }

        if (reqWatcher.amountToSell && (isNaN(reqWatcher.amountToSell) || reqWatcher.amountToSell < 0)) {
            dispatchError("addWatcher", res, `Invalid amountToSell: ${reqWatcher.amountToSell}`);
            return;
        }

        switch (reqWatcher.type) {
            case AlertType.TargetPriceBelow:
            case AlertType.TargetPriceAbove:
                if (isNaN(reqWatcher.targetPrice) || reqWatcher.targetPrice < 0) {
                    dispatchError("addWatcher", res, `Invalid targetPrice: ${reqWatcher.targetPrice}`);
                    return;
                }
                break;
            case AlertType.TargetNegativePercentage:
            case AlertType.TargetPositivePercentage:
                if (isNaN(reqWatcher.targetPercentage) || reqWatcher.targetPercentage < 0) {
                    dispatchError("addWatcher", res, `Invalid targetPercentage: ${reqWatcher.targetPercentage}`);
                    return;
                }
                break;
            default:
                dispatchError("addWatcher", res, `Invalid type: ${reqWatcher.type}`);
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
        dispatchError("addWatcher", res, error);
    }
}

const setWatcherActive = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyAuth(req);
        const watcherId: string = req.body.watcherId;
        const active: boolean = req.body.active;
        Logger.log("setWatcherActive", `Request received. watcherId=${watcherId}, active=${active}`);

        WatcherModel.findByIdAndUpdate(watcherId, { active },
            (error, watcher) => {
                if (error) {
                    dispatchError("setWatcherActive", res, error);
                }
                else {
                    res.status(200).json({ active });
                    Logger.log("setWatcherActive", `Updated watcher state. watcherId=${watcherId}, active=${active}`);
                }
            });
    } catch (error) {
        dispatchError("setWatcherActive", res, error);
    }
}

const deleteWatcher = async (req: Request, res: Response): Promise<void> => {
    try {
        verifyAuth(req);
        const watcherId: string = req.body.watcherId;
        Logger.log("deleteWatcher", `Request received. watcherId=${watcherId}`);

        WatcherModel.findOneAndDelete({ _id: watcherId }, undefined,
            (error, watcher) => {
                if (error) {
                    dispatchError("deleteWatcher", res, error);
                }
                else {
                    res.status(200).send();
                    Logger.log("deleteWatcher", `Deleted watcher. watcherId=${watcherId}`);
                }
            });
    } catch (error) {
        dispatchError("deleteWatcher", res, error);
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