import axios from 'axios'
import { CoinInfo } from '../types/watcher';

async function find(url: string) {
    //console.log(`Perform cmcId lookup for url: ${url}`);

    const splittedUrl = url.split("/").filter(x => x); // remove empty values
    let name = splittedUrl[splittedUrl.length - 1];
    
    const html = await axios.get(url);
    
    let cmcId!: number;
    let symbol!: string;
    let tryCounter = 1;
    const maxTries = 2;
    while(tryCounter <= maxTries) {
        if(tryCounter == 2) {
            // Second try (e.g. Binance-Coin)
            name = name.replace("-", " ");
        }

        try {
            symbol = new RegExp(`class="nameSymbol">([a-zA-Z]*)<`).exec(html.data)![1];
        } catch (error) {
            if(tryCounter == maxTries) {
                throw new Error("Unable to find symbol for url: " + url);
            }
        }

        if(symbol) {
            try {
                cmcId = +new RegExp(`"info":{"id":(\\d*).*symbol":"${symbol}"`, 'i').exec(html.data)![1];
            } catch (error) {
                if(tryCounter == maxTries) {
                    throw new Error("Unable to find cmcId for url: " + url);
                }
            }
        }

        if(cmcId && symbol) {
            break;
        }
        tryCounter++;
    }

    const coinInfo: CoinInfo = {
        url,
        cmcId,
        symbol
    };
    return coinInfo;
}

export default {
    find
};