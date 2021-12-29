import { Document } from 'mongoose';

// export interface General extends Document {
//     lastCheckTimestamp: number;
// }

export interface CoinInfo {
    url: string;
    symbol: string;
    cmcId: number;
}

export interface Watcher extends Document {
    coinInfo: CoinInfo;             // REQUIRED
    active: boolean;                // REQUIRED
    order: number;                  // REQUIRED
    targetPrice: number;            // OPT
    entryPrice: number;             // OPT
    triggerLimitPercent: number;    // OPT
    amountBoughtToSell: number;     // OPT
}