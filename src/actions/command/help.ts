import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { removeMessageById } from '../../remove-message-by-id.ts';
import { replyHTML } from '../../reply-html.ts';
import { sendMessageHTML } from '../../send-message-html.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type HelpProps = {
	command?: string;
	access: HasAccess;
	commands: string;
};

export function help<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { command, access, commands }: HelpProps) {
	bot.command(command || 'help', async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command  ${command || 'help'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const messageId = ctx?.msg?.message_id;
			if (messageId) await removeMessageById({ ctx, messageId });

			const replyToMessage = ctx?.msg?.reply_to_message;

			if (replyToMessage) {
				const repliedMessageId = replyToMessage.message_id;

				await replyHTML(ctx, commands, '', repliedMessageId);
			} else {
				await sendMessageHTML(ctx, commands);
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
