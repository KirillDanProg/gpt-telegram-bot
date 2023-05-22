import {Telegraf, session} from 'telegraf'
import config from 'config'
import {message} from 'telegraf/filters'
import {INITIAL_SESSION} from "./consts.js";
import {onTextMessageReply} from "./messageReplies/onText.js";
import {onVoiceMessageReply} from "./messageReplies/onVoice.js";

const bot = new Telegraf(config.get('TELEGRAM_API_KEY'))

bot.use(session())

bot.command('new', async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('Жду запросик...')
})
bot.command('start', async (ctx) => {
    ctx.session = INITIAL_SESSION
    // const keyboardMarkup = {
    //     reply_markup: {
    //         keyboard: [['Command 1'], ['Command 2']],
    //         resize_keyboard: true,
    //         one_time_keyboard: true
    //     }
    // };
    await ctx.reply('Жду запросик...')
})

bot.on(message('voice'), onVoiceMessageReply)

bot.on(message('text'), onTextMessageReply)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
