import { Context } from '../deps.deno.ts';

const USERNAMES_WITH_ACCESS = Deno.env.get('USERNAMES_WITH_ACCESS');

export function hasUsernameAccess(ctx: Context, usernameWithAccess?: (string | number)[] | null) {
	const users = String(USERNAMES_WITH_ACCESS);
	const accessUsernames = usernameWithAccess || users.toLocaleLowerCase().split(',');
	const username = String(ctx.msg?.from?.username).toLocaleLowerCase();
	const hasAccessMatch = accessUsernames.includes(username);
	return hasAccessMatch;
}
