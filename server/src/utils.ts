import dotenv from "dotenv";
import { Request, Response } from "express";

dotenv.config();

export const getTimeUTC = function() {
    return new Date().toISOString();
}

export function delay(timeMS: number): Promise<unknown> {
    return new Promise(resolve => setTimeout(resolve, timeMS));
}

export class Logger {
    static log(context: string, obj: any) {
        console.log(`${getTimeUTC()} [LOG][${context}] ${obj}`);
    }

    static logError(context: string, error: unknown, additionalContext: string = "") {
        console.log(`${getTimeUTC()} [ERROR][${context}] ${additionalContext}`);
        if(error) {
            console.error(error);
        }
        console.log(`\n`);
    }
}

export function dispatchError(context: string, res: Response, error: unknown) {
    res.status(400).json({
        message: `[Server] ${error}`
    });
    Logger.logError(context, error, "dispatchError");
}

export function verifyAuth(req: Request) {
    if(!process.env.AUTH_TOKEN) {
        return;
    }
    
    if(!req?.body?.authToken || req.body.authToken !== process.env.AUTH_TOKEN) {
        throw new Error("Authentication failed");
    }
}