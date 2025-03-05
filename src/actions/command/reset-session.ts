import { Bot, Context } from '../../../deps.deno.ts';
import { getUserInfo } from '../../get-user-info.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type ResetProps<T> = {
	command?: string;
	access: HasAccess;
	session: string;
	resetData: T | null;
};

export function resetSession<T>(bot: Bot, { command, access, session, resetData }: ResetProps<T>) {
	if (!session) return;

	bot.command(
		command || `reset${session.trim().toLocaleLowerCase()}session`,
		async (ctx: Context) => {
			try {
				const hasAccessToRunCommand = hasAccess({ ctx, ...access });
				logUserInfo(ctx, {
					message: `command  ${command || `reset${session.trim().toLocaleLowerCase()}session`}`,
					accessMessage: hasAccessToRunCommand,
				});
				if (!hasAccessToRunCommand) return;

				const chatId = ctx.chat.id;
				const sessionPath = `ctx.session.${session}`;
				let message = 'Check console';
				if (!(session in ctx.session)) {
					message = `👉Session ${sessionPath} does not exist`;
				} else {
					const currentSession = ctx.session[session];
					if (currentSession.type === 'list') {
						currentSession.data = resetData;
						message = `👉Session ${sessionPath} was reset: ${currentSession.data}`;
					} else if (currentSession.type === 'map') {
						currentSession.get(chatId).data = resetData;
						message =
							`👉Session ${sessionPath} with key [${chatId}] was reset: ${currentSession.data}`;
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
