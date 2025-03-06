import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { prepareGeminiAnswerToTelegramHtml } from '../../prepare-gemini-answer-to-telegram-html.ts';
import { replyHTML } from '../../reply-html.ts';
import { sendPromptGemini } from '../../send-prompt-gemini.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type TestAIProps = {
	command?: string;
	access: HasAccess;
	prompt: string;
};

export function testAi<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { command, access, prompt }: TestAIProps) {
	bot.command(command || 'testai', async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command ${command || 'test-ai'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const geminiResponse = await sendPromptGemini(prompt);

			const preparedMessage = prepareGeminiAnswerToTelegramHtml(geminiResponse);
			const messageId = ctx?.msg?.message_id;

			if (messageId) await replyHTML(ctx, preparedMessage, '', messageId);
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
