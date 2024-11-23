import { config, Context } from '../deps.deno.ts';

const { CHAT_IDS_WITH_ACCESS } = config();

export function hasChatIdAccess(ctx: Context, chatIdWithAccess?: (string | number)[] | null) {
	const chats = String(CHAT_IDS_WITH_ACCESS);
	const accessChats = chatIdWithAccess || chats.split(',');
	const currentChat = String(ctx.message?.chat.id || ctx.editedMessage?.chat.id);
	const hasAccessMatch = accessChats.includes(currentChat);
	return hasAccessMatch;
}