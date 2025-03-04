import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { prepareGeminiAnswerToTelegramHtml } from '../../prepare-gemini-answer-to-telegram-html.ts';
import { replyHTML } from '../../reply-html.ts';
import { sendPromptGemini } from '../../send-prompt-gemini.ts';

type TestAIProps = {
	command?: string;
	access: HasAccess;
	prompt: string;
};

export function testAi(bot: Bot, { command, access, prompt }: TestAIProps) {
	bot.command(command || 'testai', async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command ${command || 'test-ai'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const geminiResponse = await sendPromptGemini(prompt);

			const preparedMessage = prepareGeminiAnswerToTelegramHtml(geminiResponse);

			await replyHTML(ctx, preparedMessage, '', ctx.msg.messageId);
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
