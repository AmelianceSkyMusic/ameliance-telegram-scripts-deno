import { Context, Message } from '../deps.deno.ts';

export function prepareEditMessageText(ctx: Context, message: Message) {
	const chatId = message.chat.id;
	const messageId = message.message_id;
	return async (text: string) => await ctx.api.editMessageText(chatId, messageId, text);
}
