import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { logUserInfo } from '../../log-user-info.ts';

type StartProps = {
	message: string;
};

export function start(bot: Bot, { message }: StartProps) {
	bot.command('start', async (ctx: Context) => {
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
