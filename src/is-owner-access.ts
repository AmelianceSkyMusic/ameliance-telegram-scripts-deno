import { Context } from '../deps.deno.ts';

const OWNER_IDS = Deno.env.get('OWNER_IDS');

export function isOwnerAccess(ctx: Context) {
	const currentUserId = String(ctx.msg?.from?.id);
	const hasAccessMatch = String(OWNER_IDS)
		.split(',')
		.map((id) => id.trim())
		.includes(currentUserId);
	return hasAccessMatch;
}
