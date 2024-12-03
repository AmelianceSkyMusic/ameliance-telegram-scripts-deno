import { Context } from '../deps.deno.ts';

export function isCurrentChatWithBot(ctx: Context) {
	return ctx.msg?.chat.type === 'private' ? true : false;
}
