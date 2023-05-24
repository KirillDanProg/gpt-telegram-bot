import {INITIAL_SESSION} from "../consts.js";
import {code} from "telegraf/format";
import {openai} from "../openai.js";
import {generateImageReply} from "./onGenerateImage.js";

export const onTextMessageReply = async (ctx) => {
    ctx.session ??= INITIAL_SESSION
    if (ctx.session.awaitingInput) {
        generateImageReply(ctx)
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
