import axios from 'axios'
import { CoinInfo } from '../types/watcher';

async function getBase64(url: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary').toString('base64');
}

async function find(url: string) {
    //console.log(`Perform cmcId lookup for url: ${url}`);

    //const splittedUrl = url.split("/").filter(x => x); // remove empty values
    //let name = splittedUrl[splittedUrl.length - 1];

    const html = await axios.get<string, any>(url);
    const htmlStr: string = html.data;

    let cmcId!: number;
    let symbol!: string;
    let iconBase64!: string;
    let tryCounter = 1;
    const maxTries = 1;
    while (tryCounter <= maxTries) {
        // if(tryCounter == 2) {
        //     // Second try (e.g. Binance-Coin)
        //     name = name.replace("-", " ");
        // }

        try {
            symbol = new RegExp(`class="nameSymbol">([a-zA-Z]*)<`).exec(htmlStr)![1];
        } catch (error) {
            if (tryCounter == maxTries) {
                throw new Error("Unable to find symbol for url: " + url);
            }
        }

        if (symbol) {
            try {
                cmcId = +new RegExp(`"info":{"id":(\\d*).*symbol":"${symbol}"`, 'i').exec(htmlStr)![1];
            } catch (error) {
                if (tryCounter == maxTries) {
                    throw new Error("Unable to find cmcId for url: " + url);
                }
            }
        }

        if (cmcId) {
            try {
                let url = `64x64/${cmcId}.`;
                const cmcIdIndex = htmlStr.indexOf(url);
                for (let i = cmcIdIndex + 1; i < htmlStr.length; i++) {
                    if (htmlStr[i] == '"') {
                        url += htmlStr.substring(cmcIdIndex + url.length, i);
                        break;
                    }
                }
                for (let i = cmcIdIndex - 1; i > 0; i--) {
                    if (htmlStr[i - 1] == '"') {
                        url = htmlStr.substring(i, cmcIdIndex) + url;
                        break;
                    }
                }
                iconBase64 = await getBase64(url);
            } catch (error) {
                if (tryCounter == maxTries) {
                    throw new Error("Unable to find iconUrl for url: " + url);
                }
            }
        }

        if (cmcId && symbol && iconBase64) {
            break;
        }
        tryCounter++;
    }

    const coinInfo: CoinInfo = {
        url,
        cmcId,
        symbol,
        iconBase64
    };
    return coinInfo;
}

export default {
    find
};