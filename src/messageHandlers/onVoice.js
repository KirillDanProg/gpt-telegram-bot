import {INITIAL_SESSION, SESSION_MODE} from "../consts/consts.js";
import {code} from "telegraf/format";
import {openai} from "../openai.js";
import {generateChatReply} from "./voiceMessageHandler/chat.js";
import {generateTranslationReply} from "./voiceMessageHandler/translation.js";
import {oggConverter} from "../utils/oggConverter.js";
import {generateImage} from "./voiceMessageHandler/generateImage.js";

export const onVoiceMessageReply = async (ctx) => {
    try {
        await ctx.reply(code('Принято. Ждем...'))
        const link = await ctx.telegram.getFileLink(ctx.message.voice.file_id)
        const userId = String(ctx.message.from.id)
        const chatId = ctx.chat.id
        const oggPath = await oggConverter.create(link.href, userId)
        const mp3Path = await oggConverter.toMp3(oggPath, userId)
        const text = await openai.transcription(mp3Path)
        const sessionMode = ctx.session.get(chatId).mode
        switch (sessionMode) {
            case SESSION_MODE.IMAGE_GEN:
                await generateImage(ctx, text)
                break
            case SESSION_MODE.TRANSLATION:
                await generateTranslationReply(ctx, mp3Path)
                break
            default:
                await generateChatReply(ctx, text)
        }
    } catch (e) {
        ctx.reply(`Что-то пошло не так: ${e.message}`)
        console.log('Error while voice message', e.message)
    }
}
