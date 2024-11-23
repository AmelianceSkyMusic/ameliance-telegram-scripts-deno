import { config, Context } from '../deps.deno.ts';

const { USER_IDS_WITH_ACCESS } = config();

export function hasUserIdAccess(ctx: Context, userIdWithAccess?: (string | number)[] | null) {
	const userIds = String(USER_IDS_WITH_ACCESS);
	const accessUserIds = userIdWithAccess || userIds.split(',');
	const currentUserId = String(ctx.msg?.from?.id);
	const hasAccessMatch = accessUserIds.includes(currentUserId);
	return hasAccessMatch;
}