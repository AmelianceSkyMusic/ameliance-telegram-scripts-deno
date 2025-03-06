import { Content } from 'npm:@google/generative-ai';
import { Context } from '../deps.deno.ts';
import { logUserInfo } from './log-user-info.ts';
import { prepareGeminiAnswerToTelegramHtml } from './prepare-gemini-answer-to-telegram-html.ts';
import { sendPromptGeminiWithHistory } from './send-prompt-gemini-with-history.ts';
import { ListSession } from './session/create-list-session.ts';
import { MapSession } from './session/create-map-session.ts';

type RunGeminiProps<C> = {
	session: string | null;
	initPrompt?: Content;
	message: string;
	promptCreator?: (
		ctx: C,
		message: string,
	) => Promise<string | undefined | null> | string | undefined | null;
};

export async function runGemini<
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(ctx: C, { session, initPrompt, message, promptCreator }: RunGeminiProps<C>) {
	//* Define session if exists or set temp empty array
	const currentSession = session ? ctx.session[session] : null;
	let sessionData;

	if (currentSession) {
		if (currentSession.type === 'list') sessionData = currentSession;

		//* If session is map, get session data by chatId
		if (currentSession.type === 'map') {
			const chatId = ctx.chat?.id;
			if (chatId) sessionData = currentSession.get(String(chatId));
		}

		//* If session is empty, set initPrompt
		if (sessionData && sessionData.size === 0 && initPrompt) sessionData.add(initPrompt);
	}

	const prompt = promptCreator ? await promptCreator(ctx, message) : message;
	if (!prompt) {
		return logUserInfo(ctx, { message: 'Empty prompt', shouldSendMessageInChat: false });
	}
	logUserInfo(ctx, { message: prompt, shouldSendMessageInChat: false });

	const { answer: geminiAnswer, history } = await sendPromptGeminiWithHistory(
		prompt,
		sessionData ? sessionData?.data : [],
	);
	// console.log('[runGemini]: Gemini answer before prepare: ', geminiAnswer);
	logUserInfo(ctx, {
		message: `Gemini answer before prepare: ${geminiAnswer}`,
		shouldSendMessageInChat: false,
	});
	//* Write history back to session
	if (sessionData) sessionData.data = history;
	const preparedAnswer = prepareGeminiAnswerToTelegramHtml(geminiAnswer);
	return preparedAnswer;
}
