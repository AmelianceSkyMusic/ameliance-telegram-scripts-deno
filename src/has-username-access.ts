import { Context } from '../deps.deno.ts';

export function hasUsernameAccess(ctx: Context, usernameWithAccess?: string[] | null) {
	if (!usernameWithAccess) return null;
	const username = String(ctx.msg?.from?.username).toLocaleLowerCase().trim();
	const hasAccessMatch = usernameWithAccess
		.map((username) => username.toLocaleLowerCase().trim())
		.includes(username);
	return hasAccessMatch;
}
