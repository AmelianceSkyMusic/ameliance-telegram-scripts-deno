import { Bot, Context } from '../../../deps.deno.ts';
import { autoRemovableMessage } from '../../auto-removable-message.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { prepareGeminiAnswerToTelegramHtml } from '../../prepare-gemini-answer-to-telegram-html.ts';
import { removeMessageById } from '../../remove-message-by-id.ts';
import { replyHTML } from '../../reply-html.ts';
import { sendMessageHTML } from '../../send-message-html.ts';
import { sendPromptGemini } from '../../send-prompt-gemini.ts';

type AiCommandProps = {
	access: HasAccess;
	command: string;
	clearCommandInChat?: boolean;
	promptCreator: (ctx: Context) => string | undefined | null;
	replyTo?: 'current' | 'origin';
	isReply?: boolean;
	replayNotification?: string;
};

export function aiCommand(
	bot: Bot,
	{
		access,
		command,
		clearCommandInChat = true,
		promptCreator,
		replyTo = 'current',
		isReply = true,
		replayNotification = `Команда /${command} працює тільки як відповідь на повідомлення!`,
	}: AiCommandProps,
) {
	bot.command(command, async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command ai-command/${command}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const messageThreadId = ctx.msg.message_thread_id;
			const messageId = ctx.msg.message_id;
			if (clearCommandInChat) await removeMessageById({ ctx, messageId, ms: 0 });

			const replyToMessage = ctx.msg.reply_to_message;

			if (isReply && !replyToMessage) {
				await autoRemovableMessage({
					ctx,
					text: replayNotification,
					mention: true,
				});
			}

			const prompt = promptCreator(ctx);
			if (!prompt) return console.log('empty prompt');
			const geminiResponse = await sendPromptGemini(prompt);
			const preparedMessage = prepareGeminiAnswerToTelegramHtml(geminiResponse);

			if (!replyToMessage) {
				await sendMessageHTML(ctx, preparedMessage, '');
			} else {
				const repliedMessageId = replyToMessage.message_id;

				if (replyTo === 'origin') {
					await replyHTML(ctx, preparedMessage, '', messageThreadId);
				} else if (replyTo === 'current') {
					await replyHTML(ctx, preparedMessage, '', repliedMessageId);
				}
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
