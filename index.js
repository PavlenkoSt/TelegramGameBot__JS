process.env.NTBA_FIX_319 = 1
const TelegramApi = require('node-telegram-bot-api')
const gameOptions = require('./options')
const mongoose = require('mongoose')
const ChatInfo = require('./ChatInfoSchema')


const token = '2045807538:AAH5bnOdR08eGGJvZOTrW4J8PCDnec2CooU'

const bot = new TelegramApi(token, { polling: true })

const chats = {}


const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Сейчас я загадаю число от 0 до 9, а тебе нужно будет его отгадать.')
    const randomNum = Math.floor(Math.random() * 10)
    chats[chatId] = randomNum
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions.keyboard)
}

const run = async () => {

    try{
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.ysuxx.mongodb.net/telegram-game-bot?retryWrites=true&w=majority', {
            useNewUrlParser: true,
            // useCreateIndex: true,
            useUnifiedTopology: true
        })
        console.log('Подключено к бд')
    }catch(e){
        console.log('Не подключено к бд!')
    }


    bot.setMyCommands([
        { command: '/start', description: 'Начальное приветсвие' },
        { command: '/info', description: 'Игровая статистка' },
        { command: '/game', description: 'Начать игру' },
        { command: '/reset', description: 'Сбросить статистику' }
    ])

    bot.on('message', async (msg) => {
        const chatId = msg.chat.id
        const command = msg.text

        if(command === '/start'){
            const isExist = await ChatInfo.findOne({ chatId })

            if(isExist){
                await ChatInfo.deleteOne(isExist)
            }

            await ChatInfo.create({ chatId, right: 0, wrong: 0 })
            await bot.sendMessage(chatId, 'Приветствую, меня зовут Игробот! Чем могу помочь?')
            return 
        }
    
        if(command === '/info'){
            const chatInfo = await ChatInfo.findOne({ chatId })
            await bot.sendMessage(chatId, `Тебя зовут ${msg.chat.first_name} ${msg.chat.last_name}! Удачно отгадано: ${chatInfo.right}, не отгадано: ${chatInfo.wrong}!`)
            return
        }

        if(command === '/game'){
            return startGame(chatId)
        }

        if(command === '/reset'){
            await ChatInfo.updateOne({ chatId }, { right: 0, wrong: 0 })
            await bot.sendMessage(chatId, 'Статистика успешно сброшена!')
            return
        }
    
        await bot.sendMessage(chatId, 'Я тебя не понимаю!')
        return
    })

    bot.on('callback_query', async (callback_data) => {

        const data = callback_data.data
        const chatId = callback_data.message.chat.id

        if(data === '/again'){
            return startGame(chatId)
        }

        const botNumber = chats[chatId]
        
        const chatInfo = await ChatInfo.findOne({ chatId })

        if(+data === botNumber){
            await ChatInfo.updateOne(chatInfo, { right: chatInfo.right + 1 })
            await bot.sendMessage(chatId, `Правильно! Это ${botNumber}!`, gameOptions.again)
            return 
        }

        await ChatInfo.updateOne(chatInfo, { wrong: chatInfo.wrong + 1 })
        await bot.sendMessage(chatId, `Упс, не правильно! Я загадал число ${botNumber}!`, gameOptions.again)
        return 
    })
}

run()