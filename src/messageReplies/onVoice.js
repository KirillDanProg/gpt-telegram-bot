import {INITIAL_SESSION, SESSION_MODE} from "../consts.js";
import {code} from "telegraf/format";
import {ogg} from "../ogg.js";
import {openai} from "../openai.js";
import {generateImageOnVoice} from "./voiceMessageHandler/generateImage.js";
import {generateChatReply} from "./voiceMessageHandler/chat.js";
import {generateTranslationReply} from "./voiceMessageHandler/translation.js";

export const onVoiceMessageReply = async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    try {
        await ctx.reply(code('Принято. Ждем...'))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        const oggPath = await ogg.create(link.href, userId)
        const mp3Path = await ogg.toMp3(oggPath, userId)

        switch (ctx.session.mode) {
            case SESSION_MODE.IMAGE_GEN:
                const imageText = await openai.transcription(mp3Path)
                generateImageOnVoice(ctx, imageText)
                break
            case SESSION_MODE.TRANSLATION:
                generateTranslationReply(ctx, mp3Path)
                break
            default:
                const text = await openai.transcription(mp3Path)
                generateChatReply(ctx, text)
        }
    } catch (e) {
        ctx.reply(`Что-то пошло не так: ${e.message}`)
        console.log('Error while voice message', e.message)
    }
}
