import { Response, Request } from "express";
import { Watcher } from "./../../types/watcher";
import WatcherModel from "../../models/watcher";

const getWatchers = async (req: Request, res: Response): Promise<void> => {
    try {
        const watchers: Watcher[] = await WatcherModel.find();
        res.status(200).json({ todos: watchers });
    } catch (error) {
        throw error;
    }
}

const addWatcher = async (req: Request, res: Response): Promise<void> => {
    try {
        // TODO log req body
        const body = req.body as Pick<Watcher, 'url' | 'symbol'>
        
        // Validate url etc
        const cmcId = 0;
        const order = 0;
        
        const watcher: Watcher = new WatcherModel({
            url: body.url,
            symbol: body.symbol,
            cmcId,
            active: true,
            creationDate: new Date().getTime(),
            order,
            // targetPrice: -1,
            // entryPrice: -1,
            // triggerLimitPercent: -1,
            // amountBoughtToSell: -1
        });
        
        const newWatcher: Watcher = await watcher.save();
        const allWatchers: Watcher[] = await WatcherModel.find();
        
        res.status(201).json({ 
            message: 'Watcher added', 
            watcher: newWatcher, 
            watchers: allWatchers 
        });
    } catch (error) {
        throw error
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