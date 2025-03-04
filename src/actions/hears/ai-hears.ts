import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { prepareGeminiAnswerToTelegramHtml } from '../../prepare-gemini-answer-to-telegram-html.ts';
import { replyHTML } from '../../reply-html.ts';
import { sendPromptGeminiWithHistory } from '../../send-prompt-gemini-with-history.ts';
import { Content } from 'npm:@google/generative-ai';

type AiHearsProps = {
	access: HasAccess;
	hear: RegExp | RegExp[];
	promptCreator: (ctx: Context, message: string) => string | undefined | null;
	initPrompt?: Content;
	session: string | undefined;
	shouldReply?: boolean;
};

export function aiHears(
	bot: Bot,
	{ access, hear, promptCreator, initPrompt, session, shouldReply = true }: AiHearsProps,
) {
	bot.hears(hear, async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `hears ai-hears/${hear}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			//* Define session if exists or set temp empty array
			let currentSession = session ? ctx.session[session] : [];

			//* If session is map, get session data by chatId
			if (currentSession.type === 'map') {
				const chatId = ctx.chat.id;
				currentSession = currentSession.get(chatId);
			}

			//* If session is empty, set initPrompt
			if (session && currentSession.size === 0 && initPrompt) currentSession.add(initPrompt);

			const messageId = ctx.msg.message_id;
			const messageText = ctx.msg.text || ctx.msg.caption;
			if (!messageText) return;

			const prompt = promptCreator(ctx, messageText);
			if (!prompt) return console.log('empty prompt');
			const { answer: geminiAnswer, history } = await sendPromptGeminiWithHistory(
				prompt,
				currentSession.data,
			);
			//* Write history back to session
			currentSession.data = history;
			const preparedAnswer = prepareGeminiAnswerToTelegramHtml(geminiAnswer);

			if (shouldReply) {
				await replyHTML(ctx, preparedAnswer, '', messageId);
			} else {
				await replyHTML(ctx, preparedAnswer, '');
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
