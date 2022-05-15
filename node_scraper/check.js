import { getBotInstance } from './lib/tgBot.js';
import { Product } from './db/mongodb.js';
import { logger } from './lib/logger';
import { shuffle } from './lib/shuffle';
import { sleep } from './lib/sleep';
import { getRandomNumber } from './lib/getRandomNum.js';
import { extractPrice } from './lib/extractPrice.js';
import { shouldNotify } from './lib/shouldNotify.js';
import { saveNotifiedPrices } from './lib/saveNotifiedPrices.js';

async function check() {
    let count = 0;
    const products = await Product.find();
    const productsLength = products.length;

    const shuffledProducts = shuffle(products)
    
    for (const product of shuffledProducts) {
        count += 1;
        await sleep(1000, 2000);

        let price = undefined;
        try {
            const page = await getProductPage(product.code);
            price = extractPrice(page, productsLength, count);
        } catch (error) {
            console.error(error);
            continue;
        }

        if (!shouldNotify(product, price)) continue;

        logger(`Yaaay. Il prezzo è sceso al di sotto del limite`);

        for (const chatId of product.chatIds) {
            try {
                bot.sendMessage(chatId, `Il prezzo è sceso sotto i ${product.threshold}€ ed è attualmente ${price}€. \n https://amazon.it/dp/${product.code}`);
            } catch (error) {
                logger(error);
            }
        };

        saveNotifiedPrices(product, price);
    }
}

function randomizeCheckInterval() {
    let random = getRandomNumber(180000, 600000);// fra 3 e 10 minuti
    setTimeout(() => {
        check();
        randomizeCheckInterval();
    }, random);
    logger(`waiting ${random / 1000 / 60} minutes`);
}


function main() {
    check();
    randomizeCheckInterval();
}

const bot = getBotInstance(); 

main();
