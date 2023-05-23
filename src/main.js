import {Telegraf, session} from 'telegraf'
import config from 'config'
import {message} from 'telegraf/filters'
import {INITIAL_SESSION} from "./consts.js";
import {onTextMessageReply} from "./messageReplies/onText.js";
import {onVoiceMessageReply} from "./messageReplies/onVoice.js";
import axios from 'axios'
import {openai} from "./openai.js";


const bot = new Telegraf(config.get('TELEGRAM_API_KEY'))

bot.use(session())

bot.command(['new', 'start'], async (ctx) => {
    ctx.session = INITIAL_SESSION
    await ctx.reply('Жду запросик...')
})

bot.command('generate', async (ctx) => {
    await ctx.reply('Please enter the text for image generation:');
    ctx.session.awaitingInput = true
});

bot.on('text', async (ctx) => {
    if (ctx.message.from.id === ctx.message.from.id) {
        const text = ctx.message.text;
        ctx.session.awaitingInput = false;
        try {
            const response = await openai.createImage(text);
            const imageUrl = response.data.data[0].url;
            await ctx.replyWithPhoto(imageUrl);
        } catch (error) {
            console.error('Error generating image:', error);
            ctx.reply('Failed to generate image. Please try again later.');
        }
    }
})

bot.on(message('voice'), onVoiceMessageReply)

bot.on(message('text'), onTextMessageReply)

bot.launch()

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))
