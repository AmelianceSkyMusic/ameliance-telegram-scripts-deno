import { Context } from '../deps.deno.ts';
import { ErrorHandler, errorHandler, ReturnErrorHandler } from 'npm:ameliance-scripts';
export type HandleAppError = ErrorHandler;

const APP_NAME = Deno.env.get('APP_NAME');
const LOG_CHAT_ID = Deno.env.get('LOG_CHAT_ID');

export async function handleAppError(
	ctx: Context,
	error: unknown,
	status?: number,
): Promise<ReturnErrorHandler> {
	const returnedError = errorHandler({
		error,
		status,
		title: APP_NAME,
		wrapperCount: 1,
	});

	String(LOG_CHAT_ID)
		? await ctx.api.sendMessage(
			String(LOG_CHAT_ID),
			`<blockquote><b>❗️ERROR: ${APP_NAME} > ${returnedError.code} | ${returnedError.message}</b></blockquote>\n<code>${
				new Error().stack
					?.split('\n')
					.map((line) => `   ${line.trim()}`)
					.splice(1, 1)
					.join('\n')
			}</code>\n@amelianceskymusic`,
			{ parse_mode: 'HTML' },
			// eslint-disable-next-line no-mixed-spaces-and-tabs
		)
		: null;

	return returnedError;
}
