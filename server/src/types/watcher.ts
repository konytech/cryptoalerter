import { Document } from 'mongoose';

export interface General extends Document {
    lastCheckTimestamp: number;
}

export interface Watcher extends Document {
    url: string;                    // REQUIRED
    symbol: string;                 // REQUIRED
    cmcId: number;                  // REQUIRED
    active: boolean;                // REQUIRED
    creationDate: number;           // REQUIRED
    order: number;                  // REQUIRED
    targetPrice: number;            // OPT
    entryPrice: number;             // OPT
    triggerLimitPercent: number;    // OPT
    amountBoughtToSell: number;     // OPT
}