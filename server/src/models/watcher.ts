import { Watcher } from "./../types/watcher";
import { model, Schema, connection } from "mongoose";

console.log(connection);

const watcherSchema = new Schema({
    url: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    cmcId: {
        type: Number,
        required: true,
    },
    active: {
        type: Boolean,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    targetPrice: {
        type: Number,
        required: false,
    },
    entryPrice: {
        type: Number,
        required: false,
    },
    triggerLimitPercent: {
        type: Number,
        required: false,
    },
    amountBoughtToSell: {
        type: Number,
        required: false,
    }
},
{
    timestamps: true
});

export default connection.model<Watcher>("Watcher", watcherSchema);