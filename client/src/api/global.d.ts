// Server common
interface CoinInfo {
    url: string;
    symbol: string;
    cmcId: number;
    iconBase64: string;
}

interface Watcher {
    _id?: string;
    coinInfo: CoinInfo;
    active?: boolean;
    order?: number;
    type?: number;
    entryPrice?: number;
    targetPrice?: number;
    targetPercentage?: number;
    amountToSell?: number;
    note?: string;
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