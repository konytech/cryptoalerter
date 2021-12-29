import { Response, Request } from "express";
import { CoinInfo } from "../types/watcher";
import cmcIdFinder from "../external/cmcIdFinder";

const getCoinInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const reqUrl = req.body.url as string;
        const coinInfo = await cmcIdFinder.find(reqUrl);
        res.status(200).json({ coinInfo });
    } catch (error) {
        res.status(400).json({ 
            message: `[Server] ${error}`
        });
        console.log(error);
    }
}

export { 
    getCoinInfo 
};