// Server common
interface CoinInfo {
    url: string;
    symbol: string;
    cmcId: number;
}

interface Watcher {
    _id?: number;
    coinInfo: CoinInfo;
    active?: boolean;
    order?: number;
    targetPrice?: number;
    entryPrice?: number;
    triggerLimitPercent?: number;
    amountBoughtToSell?: number;
}

// Client only
interface WatcherProps {
    watcher: Watcher
}

type ApiDataType = {
    message: string
    status: string
    watchers: Watcher[]
    watcher?: Watcher
}