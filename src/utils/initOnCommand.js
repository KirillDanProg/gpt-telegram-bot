export const initOnCommand = (ctx, data) => {
    const chatId = ctx.chat.id
    ctx.reply(data.message);
    ctx.session.get(chatId).mode = data.mode
}
