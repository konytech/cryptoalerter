export const enum AlertType {
    TargetPriceAbove = 10,
    TargetPriceBelow = 20,
    TargetPositivePercentage = 30,
    TargetNegativePercentage = 40
}

export function getTriggerDescription(watcher: Watcher) {
    console.log(watcher);
    switch (watcher.type) {
        case AlertType.TargetPriceAbove:
            return `Triggers when > ${watcher.targetPrice} USD or UP ${((watcher.targetPrice! - watcher.entryPrice!) / watcher.entryPrice! * 100).toFixed(1)}%`;
        case AlertType.TargetPriceBelow:
            return `Triggers when < ${watcher.targetPrice} USD or DOWN ${((watcher.entryPrice! - watcher.targetPrice!) / watcher.entryPrice! * 100).toFixed(1)}%`;
        case AlertType.TargetPositivePercentage:
            return `Triggers when > ${(watcher.entryPrice! + watcher.entryPrice! * watcher.targetPercentage! / 100).toFixed(8)} USD or UP ${watcher.targetPercentage}%`;
        case AlertType.TargetNegativePercentage:
            return `Triggers when < ${(watcher.entryPrice! - watcher.entryPrice! * watcher.targetPercentage! / 100).toFixed(8)} USD or DOWN ${watcher.targetPercentage}%`;
        default:
            throw new Error(`Invalid type`);
    }
}