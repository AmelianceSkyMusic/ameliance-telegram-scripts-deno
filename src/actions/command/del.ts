import { Bot, Context } from '../../../deps.deno.ts';
import { autoRemovableMessage } from '../../auto-removable-message.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { removeMessageById } from '../../remove-message-by-id.ts';
import { sendMessageHTML } from '../../send-message-html.ts';

type DelProps = {
	access: HasAccess;
};

export function del(bot: Bot, { access }: DelProps) {
	bot.command('del', async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, { message: 'command del', accessMessage: hasAccessToRunCommand });
			if (!hasAccessToRunCommand) return;

			const messageId = ctx.msg.message_id;
			await removeMessageById({ ctx, messageId });

			const isBot = ctx.msg.reply_to_message?.from?.is_bot;
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
