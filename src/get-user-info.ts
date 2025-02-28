import { Context } from '../deps.deno.ts';

export function getUserInfo(ctx: Context) {
	return {
		firstName: ctx.from?.first_name,
		lastName: ctx.from?.last_name,
		fullName: ctx.from?.username,
		username: ctx.from?.username,
		fullname: [ctx.from?.first_name, ctx.from?.last_name].join(' ').trim(),
		userId: ctx.from?.id,
	};
}
