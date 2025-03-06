import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type StartProps = {
	message: string;
};

export function start<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { message }: StartProps) {
	bot.command('start', async (ctx: C) => {
		try {
			logUserInfo(ctx, { message: 'command start' });

			await ctx.reply(message, {
				parse_mode: 'HTML',
			});
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
