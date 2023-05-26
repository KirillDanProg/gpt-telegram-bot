import {openai} from "../../openai.js";

export const generateTranslationReply = async(ctx, mp3Path) => {
    const translationText = await openai.translation(mp3Path)
    const requestText = await openai.transcription(mp3Path)
    ctx.reply(`Запрос: ${requestText}\nПеревод: ${translationText}`)
}
