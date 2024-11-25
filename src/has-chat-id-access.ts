import { Context } from '../deps.deno.ts';

export function hasChatIdAccess(ctx: Context, chatIdWithAccess?: string[] | null) {
	if (!chatIdWithAccess) return null;
	const currentChat = String(ctx.message?.chat.id || ctx.editedMessage?.chat.id);
	const hasAccessMatch = chatIdWithAccess.includes(currentChat);
	return hasAccessMatch;
}
