import {INITIAL_SESSION, SESSION_MODE} from "../consts.js";
import {code} from "telegraf/format";
import {openai} from "../openai.js";
import {generateImageOnText} from "./voiceMessageHandler/generateImage.js";

export const onTextMessageReply = async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    if (ctx.session.mode === SESSION_MODE.IMAGE_GEN) {
        generateImageOnText(ctx)
    } else {
        try {
            await ctx.reply(code('Принято. Ждем...'))

            ctx.session.messages.push({
                role: openai.roles.USER,
                content: ctx.message.text
            })

            const response = await openai.chat(ctx.session.messages)

            ctx.session.messages.push({
                role: openai.roles.ASSISTANT,
                content: response.content
            })

            await ctx.reply(response.content)
        } catch (e) {
            console.log('Error while voice message', e.message)
        }
    }
}
