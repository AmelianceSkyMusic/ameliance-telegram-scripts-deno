import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type ClearSessionProps = {
	command?: string;
	access: HasAccess;
	session: string;
};

export function clearSession<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { command, access, session }: ClearSessionProps) {
	bot.command(command || `clear${session.trim().toLocaleLowerCase()}session`, async (ctx: C) => {
		if (!session) return;

		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command  ${command || `clear${session.trim().toLocaleLowerCase()}session`}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const sessionPath = `ctx.session.${session}`;
			let message = 'Check console';
			const chatId = ctx?.chat?.id;
			if (!(session in ctx.session)) {
				message = `👉Session ${sessionPath} does not exist`;
			} else {
				const currentSession = ctx.session[session];
				if (currentSession.type === 'list') {
					if (currentSession.size === 0) {
						message = `👉Session ${sessionPath} is already empty array []`;
					} else {
						currentSession.clear();
						message = `👉Session ${sessionPath} was cleared: ${currentSession.data}`;
					}
				} else if (currentSession.type === 'map') {
					if (currentSession.size === 0) {
						message = `👉Session ${sessionPath} is already empty object {}`;
					} else {
						if (currentSession && chatId) {
							currentSession?.get(String(chatId))?.clear();
							message =
								`👉Session ${sessionPath}  with key [${chatId}] was cleared: ${currentSession}`;
						}
					}
				}
			}

			console.log(message);

			await ctx.reply(message);
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
