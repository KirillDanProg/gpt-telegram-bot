import {openai} from "../openai.js";

export const generateImageReply = async (ctx) => {
    if (ctx.message.from.id === ctx.message.from.id) {
        const text = ctx.message.text;
        ctx.session.imageSession.push(text)
        try {
            const response = await openai.createImage(ctx.session.imageSession.join(','));
            const imageUrl = response.data.data[0].url;
            ctx.replyWithPhoto(imageUrl);
        } catch (error) {
            console.error('Error generating image:', error);
            ctx.reply('Failed to generate image. Please try again later.');
        }
    }
}

export const generateImageOnVoice = async (ctx, text) => {
    ctx.session.imageSession.push(text)
    try {
        const response = await openai.createImage(ctx.session.imageSession.join(','));
        const imageUrl = response.data.data[0].url;
        ctx.replyWithPhoto(imageUrl);
    } catch (error) {
        console.error('Error generating image:', error);
        ctx.reply('Failed to generate image. Please try again later.');
    }
}
