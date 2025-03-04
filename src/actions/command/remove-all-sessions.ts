import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type RemoveAllSessionsProps = {
	command?: string;
	access: HasAccess;
};

export function removeAllSessions(bot: Bot, { command, access }: RemoveAllSessionsProps) {
	bot.command(command || `removeallsessions`, async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command ${command || 'removeallsessions'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const ctxSession = ctx.session;
			for (const session in ctxSession) {
				ctxSession[session] = undefined;
				const sessionPath = `ctx.session.${session}`;
				const message = `Session ${sessionPath} was removed:\n${sessionPath} = ${
					ctxSession[session]
				}`;

				console.log(message);

				await ctx.reply(message, {
					parse_mode: 'HTML',
				});
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
