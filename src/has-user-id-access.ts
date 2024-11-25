import { Context } from '../deps.deno.ts';

export function hasUserIdAccess(ctx: Context, userIdWithAccess?: string[] | null) {
	if (!userIdWithAccess) return null;
	const currentUserId = String(ctx.msg?.from?.id);
	const hasAccessMatch = userIdWithAccess.includes(currentUserId);
	return hasAccessMatch;
}
