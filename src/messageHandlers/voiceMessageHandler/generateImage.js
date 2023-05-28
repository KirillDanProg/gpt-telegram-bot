import {openai} from "../../openai.js";

export const generateImage = async (ctx, text) => {
    const chatId = ctx.chat.id
    ctx.session.get(chatId).imageSession.push(text)
    try {
        const response = await openai.createImage(ctx.session.get(chatId).imageSession.join(','));
        const imageUrl = response.data.data[0].url;
        ctx.replyWithPhoto(imageUrl);
    } catch (error) {
        console.error('Error generating image:', error);
        ctx.reply('Failed to generate image. Please try again later.');
    }
}
