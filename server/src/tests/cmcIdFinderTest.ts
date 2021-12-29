import cmcIdFinder from "../external/cmcIdFinder";
import readline from "readline";

// TODO: Replace with Jest?
async function runTests() {
    const testUrls = [
        "https://coinmarketcap.com/currencies/bitcoin/",
        "https://coinmarketcap.com/currencies/binance-coin/",
        "https://coinmarketcap.com/currencies/tether/",
        "https://coinmarketcap.com/currencies/multi-collateral-dai/"
    ];
    testUrls.forEach(async url => {
        const cmcId = await cmcIdFinder.find(url);
        console.log(cmcId);
    });
}

async function run() {
    const readlineInterface = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readlineInterface.question('Select an option:'
        + '\n1- Run tests'
        + '\n2- Enter URL'
        + '\n', async option => {

            if (+option === 1) {
                runTests();
                readlineInterface.close();
            }
            else if (+option === 2) {
                readlineInterface.question('Url? ', async url => {

                    const result = await cmcIdFinder.find(url);
                    console.log(result);

                    readlineInterface.close();
                });
            }
        });
}
run();

// Debug https://coinmarketcap.com/currencies/multi-collateral-dai/