import { Response, Request } from "express";
import { Watcher } from "../types/watcher";
import WatcherModel from "../models/watcher";

const getWatchers = async (req: Request, res: Response): Promise<void> => {
    try {
        const watchers: Watcher[] = await WatcherModel.find();
        res.status(200).json({ watchers });
    } catch (error) {
        throw error;
    }
}

const addWatcher = async (req: Request, res: Response): Promise<void> => {
    try {
        const reqWatcher = req.body.watcher as Watcher;
        //console.log(reqWatcher);
        
        // Validate url etc
        const id = 0;
        const cmcId = 0;
        const order = 0;
        
        const watcher: Watcher = new WatcherModel({
            id: id,
            url: reqWatcher.coinInfo.url,
            symbol: reqWatcher.coinInfo.symbol,
            cmcId,
            active: true,
            order,
            // targetPrice: -1,
            // entryPrice: -1,
            // triggerLimitPercent: -1,
            // amountBoughtToSell: -1
            isNew: true
        });
        
        const newWatcher: Watcher = await watcher.save();
        const allWatchers: Watcher[] = await WatcherModel.find();
        
        res.status(201).json({ 
            message: 'Watcher added', 
            watcher: newWatcher, 
            watchers: allWatchers 
        });
    } catch (error) {
        res.status(400).json({ 
            message: `[Server] ${error}`
        });
        console.log(error);
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
    addWatcher
};