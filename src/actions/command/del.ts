import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { autoRemovableMessage } from '../../auto-removable-message.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { removeMessageById } from '../../remove-message-by-id.ts';
import { sendMessageHTML } from '../../send-message-html.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type DelProps = {
	command?: string;
	access: HasAccess;
};

export function del<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { command, access }: DelProps) {
	bot.command(command || 'del', async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command  ${command || 'del'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const messageId = ctx?.msg?.message_id;
			if (messageId) await removeMessageById({ ctx, messageId });

			const isBot = ctx.msg?.reply_to_message?.from?.is_bot;
			if (!isBot) {
				await sendMessageHTML(
					ctx,
					`e ні, повідомлення живих людей мені видаляти заборонено!`,
					'mention',
				);
				return;
			}

			const replyToMessage = ctx.msg.reply_to_message;
			if (!replyToMessage) {
				await autoRemovableMessage({
					ctx,
					text: `Команда /del працює тільки як відповідь на повідомлення!`,
					mention: true,
				});
				return;
			}
			const repliedMessageId = replyToMessage.message_id;
			await removeMessageById({ ctx, messageId: repliedMessageId });
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
