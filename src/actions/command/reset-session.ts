import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type ResetProps = {
	command?: string;
	access: HasAccess;
	session: string;
	resetData: Content[] | null;
};

export function resetSession<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { command, access, session, resetData }: ResetProps) {
	if (!session) return;
	bot.command(command || `reset${session.trim().toLocaleLowerCase()}session`, async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command  ${command || `reset${session.trim().toLocaleLowerCase()}session`}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const chatId = ctx?.chat?.id ? String(ctx.chat.id) : null;
			const sessionPath = `ctx.session.${session}`;
			let message = 'Check console';
			if (!(session in ctx.session)) {
				message = `👉Session ${sessionPath} does not exist`;
			} else {
				const currentSession = ctx.session[session];
				if (currentSession.type === 'list') {
					currentSession.data = resetData as Content[];
					message = `👉Session ${sessionPath} was reset: ${currentSession.data}`;
				} else if (currentSession.type === 'map' && chatId) {
					const sessionData = currentSession.get(chatId);
					if (sessionData) {
						sessionData.data = resetData as Content[];
						message =
							`👉Session ${sessionPath} with key [${chatId}] was reset: ${sessionData.data}`;
					} else {
						message = `👉Session ${sessionPath} with key [${chatId}] does not exist`;
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
