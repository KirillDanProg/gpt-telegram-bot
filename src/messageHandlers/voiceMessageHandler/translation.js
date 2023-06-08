import {openai} from "../../openai.js";

export const generateTranslationReply = async(ctx, mp3Path) => {
    try {
        const translationText = await openai.translation(mp3Path)
        const requestText = await openai.transcription(mp3Path)
        ctx.reply(`Запрос: ${requestText}\nПеревод: ${translationText}`)
    } catch (e) {
        ctx.reply(`Что-то пошло не так: ${e.message}`)
    }

}
