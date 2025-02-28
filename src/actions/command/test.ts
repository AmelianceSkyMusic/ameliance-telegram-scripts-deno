import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type TestProps = {
	access: HasAccess;
	message?: string;
};

export function test(bot: Bot, { access, message = 'test' }: TestProps) {
	bot.command('test', async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, { message: 'command test', accessMessage: hasAccessToRunCommand });
			if (!hasAccessToRunCommand) return;

			await ctx.reply(message);
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
