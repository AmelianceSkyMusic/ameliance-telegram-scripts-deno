import { Context } from '../deps.deno.ts';

const BOT_USERNAME = Deno.env.get('BOT_USERNAME');
const BOT_ID = Deno.env.get('BOT_ID');

export function isCurrentChatWithBot(ctx: Context) {
	const currentMeUsername = String(ctx.me.username);
	const currentMeId = String(ctx.me.id);

	return (
		currentMeUsername === String(BOT_USERNAME).trim() || currentMeId === String(BOT_ID).trim()
	);
}
