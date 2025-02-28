import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type ResetProps = {
	access: HasAccess;
	sessionName: string;
	initPrompt: string | null;
};

export function resetSession(bot: Bot, { access, sessionName, initPrompt }: ResetProps) {
	if (!sessionName) return;

	bot.command(`reset${sessionName.trim().toLocaleLowerCase()}session`, async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'command reset-common-history',
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const sessionPath = `ctx.session.${sessionName}`;
			let message = 'Check console';
			if (!(sessionName in ctx.session)) {
				message = `Session ${sessionPath} does not exist`;
			} else {
				ctx.session[sessionName] = initPrompt
					? [{ role: 'user', parts: [{ text: initPrompt }] }]
					: [];
				message = `Session ${sessionPath} was reset with prompt`;
			}

			console.log(message);

			await ctx.reply(message);
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
