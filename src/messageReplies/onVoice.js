import {INITIAL_SESSION} from "../consts.js";
import {code} from "telegraf/format";
import {ogg} from "../ogg.js";
import {openai} from "../openai.js";
import {generateImageOnVoice, generateImageReply} from "./onGenerateImage.js";

export const onVoiceMessageReply = async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    try {
        await ctx.reply(code('Принято. Ждем...'))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        const oggPath = await ogg.create(link.href, userId)
        const mp3Path = await ogg.toMp3(oggPath, userId)

        const text = await openai.transcription(mp3Path)

        if (ctx.session.awaitingInput) {
            generateImageOnVoice(ctx, text)
        } else {
            ctx.session.messages.push({role: openai.roles.USER, content: text})

            const response = await openai.chat(ctx.session.messages)

            ctx.session.messages.push(
                {
                    role: openai.roles.ASSISTANT,
                    content: response.content
                })

            await ctx.reply(response.content)
        }

    } catch (e) {
        ctx.reply(`Что-то пошло не так: ${e.message}`)
        console.log('Error while voice message', e.message)
    }
}
