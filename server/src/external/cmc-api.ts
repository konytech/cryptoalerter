import rp from 'request-promise';
import dotenv from 'dotenv';

dotenv.config();

function getLatestQuotes(ids: Array<number>) {
    const requestOptions = {
        method: 'GET',
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        qs: {
            // 1 is BTC
            // 6043 is BYTZ
            'id': ids.join(',')
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.CMC_PRO_API_KEY
        },
        json: true,
        gzip: true
    };
    return rp(requestOptions);
}

export default {
    getLatestQuotes
};

/*
{
    "status": {
        "timestamp": "2021-12-24T12:36:49.890Z",
        "error_code": 0,
        "error_message": null,
        "elapsed": 26,
        "credit_count": 1,
        "notice": null
    },
    "data": {
        "16": {
            "id": 16,
            "name": "WorldCoin",
            "symbol": "WDC",
            "slug": "worldcoin",
            "num_market_pairs": 2,
            "date_added": "2013-05-22T00:00:00.000Z",
            "tags": [
                "mineable",
                "pow",
                "scrypt"
            ],
            "max_supply": null,
            "circulating_supply": 0,
            "total_supply": 265000000,
            "is_active": 1,
            "platform": null,
            "cmc_rank": 7277,
            "is_fiat": 0,
            "last_updated": "2021-12-24T12:36:03.000Z",
            "quote": {
                "USD": {
                    "price": 0.03021370050653997,
                    "volume_24h": 278.13614179,
                    "volume_change_24h": -86.4066,
                    "percent_change_1h": 0.00008762,
                    "percent_change_24h": 4.46256261,
                    "percent_change_7d": 7.73621202,
                    "percent_change_30d": -34.3333317,
                    "percent_change_60d": -64.48471134,
                    "percent_change_90d": 12.16355098,
                    "market_cap": 0,
                    "market_cap_dominance": 0.0002,
                    "fully_diluted_market_cap": 8006630.63,
                    "last_updated": "2021-12-24T12:36:03.000Z"
                }
            }
        },
        "16043": {
            "id": 16043,
            "name": "BYTZ",
            "symbol": "BYTZ",
            "slug": "bytz",
            "num_market_pairs": 3,
            "date_added": "2021-12-14T10:23:08.000Z",
            "tags": [],
            "max_supply": 0,
            "circulating_supply": 0,
            "total_supply": 13843636317,
            "is_active": 1,
            "platform": null,
            "cmc_rank": 4059,
            "is_fiat": 0,
            "last_updated": "2021-12-24T12:35:09.000Z",
            "quote": {
                "USD": {
                    "price": 0.008845841071008286,
                    "volume_24h": 179633.24508539,
                    "volume_change_24h": -28.522,
                    "percent_change_1h": -0.59332535,
                    "percent_change_24h": 6.80746872,
                    "percent_change_7d": 77.31731072,
                    "percent_change_30d": 15.98428333,
                    "percent_change_60d": 15.98428333,
                    "percent_change_90d": 15.98428333,
                    "market_cap": 0,
                    "market_cap_dominance": 0,
                    "fully_diluted_market_cap": 0,
                    "last_updated": "2021-12-24T12:35:09.000Z"
                }
            }
        }
    }
};
*/