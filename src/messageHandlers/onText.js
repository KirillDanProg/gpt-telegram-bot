import {INITIAL_SESSION, SESSION_MODE} from "../consts/consts.js";
import {code} from "telegraf/format";
import {openai} from "../openai.js";
import {generateImage} from "./voiceMessageHandler/generateImage.js";

export const onTextMessageReply = async (ctx) => {
    const chatId = ctx.chat.id

    if (ctx.session.get(chatId).mode === SESSION_MODE.IMAGE_GEN) {
        const text = ctx.message.text
        generateImage(ctx, text)
    } else {
        try {
            await ctx.reply(code('Принято. Ждем...'))

            ctx.session.get(chatId).messages.push({
                role: openai.roles.USER,
                content: ctx.message.text
            })

            console.log(ctx.session.get(chatId).messages)

            const response = await openai.chat(ctx.session.get(chatId).messages)

            ctx.session.get(chatId).messages.push({
                role: openai.roles.ASSISTANT,
                content: response.content
            })

            await ctx.reply(response.content)
        } catch (e) {
            console.log('Error while text message', e.message)
        }
    }
}
