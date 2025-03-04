import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type ClearSessionProps = {
	command?: string;
	access: HasAccess;
	session: string;
};

export function clearSession(bot: Bot, { command, access, session }: ClearSessionProps) {
	bot.command(
		command || `clear${session.trim().toLocaleLowerCase()}session`,
		async (ctx: Context) => {
			if (!session) return;
			const currentSession = ctx.session[session];

			try {
				const hasAccessToRunCommand = hasAccess({ ctx, ...access });
				logUserInfo(ctx, {
					message: `command  ${command || `clear${session.trim().toLocaleLowerCase()}session`}`,
					accessMessage: hasAccessToRunCommand,
				});
				if (!hasAccessToRunCommand) return;

				const sessionPath = `ctx.session.${session}`;
				let message = 'Check console';
				const chatId = ctx.chat.id;
				if (!(session in ctx.session)) {
					message = `Session ${sessionPath} does not exist`;
				} else {
					const currentSession = ctx.session[session];
					if (currentSession.type === 'list') {
						if (currentSession.size === 0) {
							message = `Session ${sessionPath} is already empty array []`;
						} else {
							currentSession.clear();
							message = `Session ${sessionPath} was cleared: ${currentSession.data}`;
						}
					} else if (currentSession.type === 'map') {
						if (currentSession.size === 0) {
							message = `Session ${sessionPath} is already empty object {}`;
						} else {
							currentSession.get(chatId).clear();
							message =
								`Session ${sessionPath}  with key [${ctx.msg.userId}] was cleared: ${currentSession}`;
						}
					}
				}

				console.log(message);

				await ctx.reply(message);
			} catch (error) {
				handleAppError(ctx, error);
			}
		},
	);
}
