import { Content } from 'npm:@google/generative-ai';
import { Context } from '../deps.deno.ts';
import { sendPromptGeminiWithHistory } from './send-prompt-gemini-with-history.ts';
import { prepareGeminiAnswerToTelegramHtml } from './prepare-gemini-answer-to-telegram-html.ts';
import { logUserInfo } from './log-user-info.ts';

type RunGeminiProps = {
	session: string | null;
	initPrompt: Content;
	message: string;
	promptCreator?: (ctx: Context, message: string) => Promise<string | undefined | null>;
};

export async function runGemini(
	ctx: Context,
	{ session, initPrompt, message, promptCreator }: RunGeminiProps,
) {
	//* Define session if exists or set temp empty array
	let currentSession = session ? ctx.session[session] : [];

	//* If session is map, get session data by chatId
	if (currentSession.type === 'map') {
		const chatId = ctx.chat.id;
		currentSession = currentSession.get(chatId);
	}

	//* If session is empty, set initPrompt
	if (session && currentSession.size === 0 && initPrompt) currentSession.add(initPrompt);

	const prompt = promptCreator ? await promptCreator(ctx, message) : message;
	if (!prompt) return console.error('[runGemini]: Empty prompt');

	logUserInfo(ctx, { message: prompt, shouldSendMessageInChat: false });

	const { answer: geminiAnswer, history } = await sendPromptGeminiWithHistory(
		prompt,
		currentSession.data,
	);
	console.log('[runGemini]: Gemini answer before prepare: ', geminiAnswer);
	//* Write history back to session
	currentSession.data = history;
	const preparedAnswer = prepareGeminiAnswerToTelegramHtml(geminiAnswer);
	return preparedAnswer;
}
