process.env.NTBA_FIX_319 = 1

const TelegramApi = require('node-telegram-bot-api')



const token = '2045807538:AAH5bnOdR08eGGJvZOTrW4J8PCDnec2CooU'

const bot = new TelegramApi(token, { polling: true })

const run = () => {
    bot.on('message', async (msg) => {
        const chatId = msg.chat.id
        const command = msg.text
    
        if(command === '/info'){
            await bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name} ${msg.chat.last_name}!`)
            return
        }
    
        await bot.sendMessage(chatId, 'Я тебя не понимаю!')
        return
    })
}

run()