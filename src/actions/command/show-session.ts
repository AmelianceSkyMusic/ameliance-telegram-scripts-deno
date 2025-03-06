import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type ShowSessionProps = {
	command?: string;
	access: HasAccess;
	session: string;
};

export function showSession<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { command, access, session }: ShowSessionProps) {
	bot.command(command || `show${session.trim().toLocaleLowerCase()}session`, async (ctx: C) => {
		if (!session) return;

		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command ${command || `show${session.trim().toLocaleLowerCase()}session`}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const sessionPath = `ctx.session.${session}`;
			const chatId = ctx?.chat?.id ? String(ctx.chat.id) : null;
			let message = 'Check console';
			let consoleMessage: string | null = null;
			let chatMessage = 'Check console';
			if (!(session in ctx.session)) {
				message = `👉Session ${sessionPath} does not exist`;
			} else {
				const currentSession = ctx.session[session];
				let sessionData = [];
				if (currentSession.type === 'list' && currentSession.size === 0) {
					message = `👉Session ${sessionPath} is empty array []`;
				} else if (currentSession.type === 'map' && currentSession.size === 0) {
					message = `👉Session ${sessionPath} is empty object {}`;
				} else if (currentSession.type === 'list') {
					sessionData = currentSession.data;
					consoleMessage = !consoleMessage && sessionData.length > 0
						? `👉Session ${sessionPath}!: ${JSON.stringify(sessionData, null, 2)}`
						: message;
					console.log(consoleMessage);
				} else if (currentSession.type === 'map') {
					if (chatId && currentSession.has(chatId)) {
						sessionData = currentSession.get(chatId)?.data || [];
						consoleMessage = sessionData.length > 0
							? `👉Session ${sessionPath} with key ${chatId}!: ${
								JSON.stringify(
									sessionData,
									null,
									2,
								)
							}`
							: message;
						console.log(consoleMessage);
					} else {
						message = `👉Session ${sessionPath} is empty object {} with empty key [${chatId}]`;
					}
				}

				chatMessage = sessionData.length > 0
					? `👉Session ${sessionPath} is ok, check in console!`
					: message;
			}

			if (!consoleMessage) console.log(message);

			await ctx.reply(chatMessage, {
				parse_mode: 'HTML',
			});
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
