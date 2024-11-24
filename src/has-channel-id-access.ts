import { Context } from '../deps.deno.ts';

const CHANNEL_IDS_WITH_ACCESS = Deno.env.get('CHANNEL_IDS_WITH_ACCESS');

export function hasChannelIdAccess(ctx: Context, channelIdWithAccess?: (string | number)[] | null) {
	const channels = String(CHANNEL_IDS_WITH_ACCESS);
	const accessChannels = channelIdWithAccess || channels.split(',');
	const currentChannels = String(ctx.msg?.chat.id);
	const hasAccessMatch = accessChannels.includes(currentChannels);
	return hasAccessMatch;
}
