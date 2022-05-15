import TelegramBot from 'node-telegram-bot-api';
import { Product } from '../db/mongodb.js';

let botInstance = null;

export function getBotInstance() {
    
    if (!botInstance) {
        createBotInstance();
    }

    return botInstance;
}

function createBotInstance() {
    const token = TOKEN;
    const bot = new TelegramBot(token, { polling: true });
    botInstance = bot;

    bot.onText(/\/start/, (msg) => {
        bot.sendMessage(msg.chat.id, `Benvenuto ${msg.chat.first_name || 'anon'}, aggiungi un prodotto con il comando /add`);
    });

    bot.onText(/\/add/, async (msg) => {
        const [commmand, productIdUrl, threshold] = msg.text.split(" ");
        const chatId = msg.chat.id;
        let url = null;

        if (!productIdUrl || !threshold) {
            bot.sendMessage(chatId, "Sono necessari due parametri, ciascuno dei quali separato da uno spazio");
            return;
        }

        try {
            url = new URL(productIdUrl);
        } catch (error) {
            bot.sendMessage(chatId, "L'url non è valido");
            return;
        }

        const code = url.pathname.match(/\/dp\/([0-9A-Z]+)/)[1];

        let product = null;

        const exists = await Product.findOne({ code });

        if (exists) {
            product = exists;
            bot.sendMessage(chatId, `Il prodotto è già tracciato con questo prezzo: ${product.threshold}. Verrai notificato appena il prodotto scenderà sotto la soglia mostrata.`);
        } else {
            product = new Product();
            bot.sendMessage(chatId, `Successo! Prodotto aggiunto alla lista. Verrai notificato appena il prezzo scende sotto la soglia da te specificata`);
        }

        product.chatIds = [...product.chatIds, chatId];
        product.code = code;
        product.threshold = product.thresold;
        product.save();
    });
}

getBotInstance(); 