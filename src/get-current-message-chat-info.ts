import { Context } from '../deps.deno.ts';

export function getCurrentMessageChatInfo(ctx: Context) {
	const chat = ctx.msg?.chat;
	if (chat?.type !== 'private') return `${chat?.title} (${chat?.id})`;
	return '[private]';
}
