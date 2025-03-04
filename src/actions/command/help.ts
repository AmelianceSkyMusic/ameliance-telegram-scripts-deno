import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { removeMessageById } from '../../remove-message-by-id.ts';
import { replyHTML } from '../../reply-html.ts';
import { sendMessageHTML } from '../../send-message-html.ts';

type HelpProps = {
	command?: string;
	access: HasAccess;
	commands: string;
};

export function help(bot: Bot, { command, access, commands }: HelpProps) {
	bot.command(command || 'help', async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command  ${command || 'help'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const messageId = ctx.msg.message_id;
			await removeMessageById({ ctx, messageId });

			const replyToMessage = ctx.msg.reply_to_message;

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
