process.env.NTBA_FIX_319 = 1
const TelegramApi = require('node-telegram-bot-api')


const token = '2045807538:AAH5bnOdR08eGGJvZOTrW4J8PCDnec2CooU'

const bot = new TelegramApi(token, { polling: true })

const chats = {}

const run = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветсвие' },
        { command: '/info', description: 'Информация' },
        { command: '/game', description: 'Начать игру' }
    ])

    const gameOptions = {
        reply_markup: JSON.stringify({
            inline_keyboard: [
                [{ text: '1', callback_data: '1' }]
            ]
        })
    }

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id
        const command = msg.text

        if(command === '/start'){
            await bot.sendMessage(chatId, 'Приветствую, меня зовут Игробот! Чем могу помочь?')
            return
        }
    
        if(command === '/info'){
            await bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name} ${msg.chat.last_name}!`)
            return
        }

        if(command === '/game'){
            await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а тебе нужно будет его отгадать.')
            const randomNum = Math.floor(Math.random() * 10)
            chats[chatId] = randomNum
            await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
            return
        }
    
        await bot.sendMessage(chatId, 'Я тебя не понимаю!')
        return
    })
}

run()