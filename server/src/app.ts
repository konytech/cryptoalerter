import express, { Express } from "express";
import { MongoClient } from "mongodb";
import cors from "cors";
import watcherRoutes from "./routes";
import dotenv from "dotenv";

const app: Express = express();
const PORT: string | number = process.env.PORT || 4000;

app.use(cors())
app.use(watcherRoutes)
dotenv.config();

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.aywb8.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`;
const client = new MongoClient(uri/*, { tls: true }*/);
client
    .connect()
    .then(() => {
        console.log(`Connected to MongoDB`);
        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`)
        });
    });