import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type ClearSessionProps = {
	access: HasAccess;
	sessionName: string;
};

export function clearSession(bot: Bot, { access, sessionName }: ClearSessionProps) {
	bot.command(`clear${sessionName.trim().toLocaleLowerCase()}session`, async (ctx: Context) => {
		if (!sessionName) return;

		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'command clear-common-history',
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const sessionPath = `ctx.session.${sessionName}`;
			let message = 'Check console';
			if (!(sessionName in ctx.session)) {
				message = `Session ${sessionPath} does not exist`;
			} else {
				ctx.session[sessionName] = [];
				message = `Session ${sessionPath} was cleared`;
			}

			console.log(message);

			await ctx.reply(message);
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
