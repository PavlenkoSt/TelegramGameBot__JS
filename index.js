const TelegramApi = require('node-telegram-bot-api')

const token = '2045807538:AAH5bnOdR08eGGJvZOTrW4J8PCDnec2CooU'

const bot = new TelegramApi(token, { polling: true })

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, 'Привет, Друг!');
});