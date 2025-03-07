import { Context } from '../deps.deno.ts';
import { ErrorHandler, errorHandler, joinWith, ReturnErrorHandler } from 'npm:ameliance-scripts';
export type HandleAppError = ErrorHandler;

const APP_NAME = Deno.env.get('APP_NAME');
const LOG_CHAT_ID = Deno.env.get('LOG_CHAT_ID');

export async function handleAppError(
	ctx: Context,
	error: unknown,
	status?: number,
): Promise<ReturnErrorHandler | undefined> {
	if (!APP_NAME) console.log('APP_NAME is not set');
	if (!LOG_CHAT_ID) console.log('LOG_CHAT_ID is not set');
	if (!APP_NAME || !LOG_CHAT_ID) return;

	const returnedError = errorHandler({
		error,
		status,
		title: APP_NAME,
		wrapperCount: 1,
	});

	String(LOG_CHAT_ID)
		? await ctx.api.sendMessage(
			String(LOG_CHAT_ID),
			`<blockquote><b>❗️ERROR: ${APP_NAME} > ${
				joinWith(
					' | ',
					returnedError.code || '',
					returnedError.message,
				)
			}</b></blockquote>\n<code>${new Error().stack}</code>\n@amelianceskymusic`,
			{ parse_mode: 'HTML' },
			// eslint-disable-next-line no-mixed-spaces-and-tabs
		)
		: null;

	return returnedError;
}
