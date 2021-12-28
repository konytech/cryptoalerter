interface Watcher {
    _id?: number;
    url: string;
    symbol: string;
    active?: boolean;
    order?: number;
    targetPrice?: number;
    entryPrice?: number;
    triggerLimitPercent?: number;
    amountBoughtToSell?: number;
}

interface WatcherProps {
    watcher: Watcher
}

type ApiDataType = {
    message: string
    status: string
    watchers: Watcher[]
    watcher?: Watcher
}