import { Response, Request } from "express";
import { Watcher } from "../types/watcher";
import cmcIdFinder from "../external/cmcIdFinder";
import cmcApi from "../external/cmc-api"

const getCoinInfo = async (req: Request, res: Response): Promise<void> => {
    try {
        const reqUrl = req.body.url as string;
        const coinInfo = await cmcIdFinder.find(reqUrl);
        const response = await cmcApi.getLatestQuotes([coinInfo.cmcId]);
        const entryPrice = response.data[coinInfo.cmcId].quote.USD.price;

        const watcher = {
            coinInfo,
            entryPrice
        } as Watcher;

        res.status(200).json({ watcher });
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