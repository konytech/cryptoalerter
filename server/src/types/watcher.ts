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
    type: number;                   // REQUIRED
    entryPrice: number;             // OPT
    targetPrice: number;            // OPT
    targetPercentage: number;       // OPT
    amountToSell: number;           // OPT
    note: string;                   // OPT
}

export class AlertType {
    static TargetPriceAbove: number = 10
    static TargetPriceBelow: number = 20
    static TargetPositivePercentage: number = 30
    static TargetNegativePercentage: number = 40
}