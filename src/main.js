import {Telegraf, session} from 'telegraf'
// import config from 'config'
import {message} from 'telegraf/filters'
import {INITIAL_SESSION, SESSION_MODE} from "./consts.js";
import {onTextMessageReply} from "./messageReplies/onText.js";
import {onVoiceMessageReply} from "./messageReplies/onVoice.js";
import * as dotenv from 'dotenv'

dotenv.config()

const bot = new Telegraf(process.env.TELEGRAM_API_KEY)

bot.use(session())

bot.command(['new', 'start'], async (ctx) => {
    ctx.session = INITIAL_SESSION
    ctx.session.imageSession = []
    ctx.session.mode = SESSION_MODE.DEFAULT
    // ctx.session.awaitingInput = false
    // ctx.session.translateMode = false
    await ctx.reply('Жду запросик...')
})

bot.command('generate', async (ctx) => {
    await ctx.reply('Введите текс для генерации картинки');
    ctx.session.mode = SESSION_MODE.IMAGE_GEN
});

bot.command('translate', async (ctx) => {
    await ctx.reply('Для перевода запиши аудио сообщение');
    ctx.session.mode = SESSION_MODE.TRANSLATION
});
// bot.on(message('text'), onGenerateImageReply)

bot.on(message('voice'), onVoiceMessageReply)

bot.on(message('text'), onTextMessageReply)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
