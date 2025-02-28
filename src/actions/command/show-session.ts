import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type ShowSessionProps = {
	access: HasAccess;
	sessionName: string;
};

export function showSession(bot: Bot, { access, sessionName }: ShowSessionProps) {
	bot.command(`show${sessionName.trim().toLocaleLowerCase()}session`, async (ctx: Context) => {
		if (!sessionName) return;

		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'command show-private-session',
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const sessionPath = `ctx.session.${sessionName}`;
			let message = 'Check console';
			if (!(sessionName in ctx.session)) {
				message = `Session ${sessionPath} does not exist`;
			} else if (ctx.session[sessionName].length === 0) {
				message = `Session ${sessionPath} is empty`;
			} else {
				const session = ctx.session[sessionName];

				const sessionMessage = session
					.map((item) => item.parts.map((part) => `—${part.text}`).join('\n'))
					.join('\n\n');

				message =
					`Ось ${sessionName} історія!: <blockquote expandable>${sessionMessage}</blockquote>`;
			}

			console.log(message);

			await ctx.reply(message, {
				parse_mode: 'HTML',
			});
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
