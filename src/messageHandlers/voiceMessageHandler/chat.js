import {openai} from "../../openai.js";

export const generateChatReply = async (ctx, text) => {
    try {
        const chatId = ctx.chat.id
        ctx.session.get(chatId).messages.push({role: openai.roles.USER, content: text})

        const response = await openai.chat(ctx.session.get(chatId).messages)

        ctx.session.get(chatId).messages.push(
            {
                role: openai.roles.ASSISTANT,
                content: response.content
            })

        await ctx.reply(response.content)
    } catch (e) {
        ctx.reply(`Что-то пошло не так: ${e.message}`)
    }
}
