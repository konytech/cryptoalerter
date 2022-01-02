import { Watcher } from "./../types/watcher";
import { Schema, connection } from "mongoose";

const coinInfoSchema = new Schema({
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
    iconBase64: {
        type: String,
        required: true,
    }
});

const watcherSchema = new Schema({
    coinInfo: coinInfoSchema,
    active: {
        type: Boolean,
        required: true,
    },
    order: {
        type: Number,
        required: true,
    },
    type: {
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
    targetPercentage: {
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