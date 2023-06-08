import {Telegraf, session} from 'telegraf'
import config from 'config'
import {message} from 'telegraf/filters'
import {SESSION_MODE} from "./consts/consts.js";
import {onTextMessageReply} from "./messageHandlers/onText.js";
import {onVoiceMessageReply} from "./messageHandlers/onVoice.js";
import {initOnCommand} from "./utils/initOnCommand.js";
import dotenv from 'dotenv'

dotenv.config()

const telegramApiKey = process.env.NODE_ENV === "production" ? process.env.TELEGRAM_API_KEY : config.get('TELEGRAM_API_KEY')
const bot = new Telegraf(telegramApiKey)


bot.use(session())

bot.command(['new', 'start'], async (ctx) => {
    const chatId = ctx.chat.id
    ctx.session = new Map()
    if (!ctx.session.has(chatId)) {
        ctx.session.set(chatId, {
            messages: [],
            imageSession: [],
            mode: SESSION_MODE.DEFAULT
        })
    }
    await ctx.reply('Жду запросик 💬')
})

bot.command('generate', async (ctx) => {
    initOnCommand(ctx, {
        message: 'Введите описание картинки 🌄️',
        mode: SESSION_MODE.IMAGE_GEN
    })
});

bot.command('translate', async (ctx) => {
    initOnCommand(ctx, {
        message: 'Запиши аудио сообщение 🔊',
        mode: SESSION_MODE.TRANSLATION
    })
});

bot.on(message('voice'), onVoiceMessageReply)

bot.on(message('text'), onTextMessageReply)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
