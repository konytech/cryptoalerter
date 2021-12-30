import { Watcher } from "./../types/watcher";
import { Schema, connection } from "mongoose";

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
    entryPrice: {
        type: Number,
        required: false,
    },
    targetPrice: {
        type: Number,
        required: false,
    },
    triggerPercentage: {
        type: Number,
        required: false,
    },
    amountToSell: {
        type: Number,
        required: false,
    },
    note: {
        type: String,
        required: false,
    },
},
    {
        timestamps: true
    }
);

export default connection.model<Watcher>("Watcher", watcherSchema);