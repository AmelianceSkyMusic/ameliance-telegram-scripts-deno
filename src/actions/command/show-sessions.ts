import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type ShowSessionsProps = {
	command?: string;
	access: HasAccess;
	sessions: string[];
};

export function showSessions(bot: Bot, { command, access, sessions }: ShowSessionsProps) {
	bot.command(command || `showsessions`, async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command  ${command || 'show-sessions'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			if (sessions.length !== 0) {
				for (const session of sessions) {
					const sessionPath = `ctx.session.${session}`;
					let message = 'Check console';
					let consoleMessage: string | null = null;
					let chatMessage = 'Check console';

					if (!(session in ctx.session)) {
						message = `Session ${sessionPath} does not exist`;
					} else {
						const currentSession = ctx.session[session];
						let sessionData = [];

						if (currentSession.type === 'list' && currentSession.size === 0) {
							message = `Session ${sessionPath} is empty array []`;
						} else if (currentSession.type === 'map' && currentSession.size === 0) {
							message = `Session ${sessionPath} is empty object {}`;
						} else if (currentSession.type === 'list') {
							sessionData = currentSession.data;
							consoleMessage = !consoleMessage && sessionData.length > 0
								? `Session ${sessionPath}!: ${JSON.stringify(sessionData, null, 2)}`
								: message;
							console.log(consoleMessage);
						} else if (currentSession.type === 'map') {
							for (const key of currentSession.keys) {
								sessionData = currentSession.get(key).data;
								consoleMessage = sessionData.length > 0
									? `Session ${sessionPath} with key ${key}!: ${
										JSON.stringify(
											sessionData,
											null,
											2,
										)
									}`
									: message;
								console.log(consoleMessage);
							}
						}

						chatMessage = sessionData.length > 0
							? `Session ${sessionPath} is ok, check in console!`
							: message;
					}

					if (!consoleMessage) console.log(message);

					await ctx.reply(chatMessage, {
						parse_mode: 'HTML',
					});
				}
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
