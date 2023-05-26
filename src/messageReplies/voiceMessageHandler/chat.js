import {openai} from "../../openai.js";

export const generateChatReply = async (ctx, text) => {
    ctx.session.messages.push({role: openai.roles.USER, content: text})

    const response = await openai.chat(ctx.session.messages)

    ctx.session.messages.push(
        {
            role: openai.roles.ASSISTANT,
            content: response.content
        })

    await ctx.reply(response.content)
}
