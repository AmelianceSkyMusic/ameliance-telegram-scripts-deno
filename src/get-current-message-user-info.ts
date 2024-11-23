import { Context } from '../deps.deno.ts';

export function getCurrentMessageUserInfo(ctx: Context) {
	const firstName = ctx.from?.first_name || '';
	const lastName = ctx.from?.last_name ? ` ${ctx.from?.last_name}` : '';
	const username = ctx.from?.username || '';
	const userId = ctx.from?.id || '';
	const user = username ? ` (@${username} | ${userId})` : ` (${userId})`;
	const userInfo = ctx.from ? `${firstName}${lastName}${user}` : '[no-user]';
	return userInfo;
}
