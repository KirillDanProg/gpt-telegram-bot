import {Telegraf, session} from 'telegraf'
import config from 'config'
import {message} from 'telegraf/filters'
import {INITIAL_SESSION} from "./consts.js";
import {onTextMessageReply} from "./messageReplies/onText.js";
import {onVoiceMessageReply} from "./messageReplies/onVoice.js";


const bot = new Telegraf(config.get('TELEGRAM_API_KEY'))

bot.use(session())

bot.command(['new', 'start'], async (ctx) => {
    ctx.session = INITIAL_SESSION
    ctx.session.imageSession = []
    ctx.session.awaitingInput = false
    await ctx.reply('Жду запросик...')
})

bot.command('generate', async (ctx) => {
    await ctx.reply('Please enter the text for image generation:');
    ctx.session.awaitingInput = true
});

// bot.on(message('text'), onGenerateImageReply)

bot.on(message('voice'), onVoiceMessageReply)

bot.on(message('text'), onTextMessageReply)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
