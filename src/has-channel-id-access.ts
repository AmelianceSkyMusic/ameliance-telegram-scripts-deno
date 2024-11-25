import { Context } from '../deps.deno.ts';

export function hasChannelIdAccess(ctx: Context, channelIdWithAccess?: string[] | null) {
	if (!channelIdWithAccess) return null;
	const currentChannels = String(ctx.msg?.chat.id);
	const hasAccessMatch = channelIdWithAccess.includes(currentChannels);
	return hasAccessMatch;
}
