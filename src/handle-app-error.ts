import { ErrorHandler, errorHandler, ReturnErrorHandler } from 'npm:ameliance-scripts';

export type HandleAppError = ErrorHandler;

import { config, Context } from '../deps.deno.ts';

const { APP_NAME, LOG_CHAT_ID } = config();

export function handleAppError(ctx: Context, error: unknown, status?: number): ReturnErrorHandler {
	const returnedError = errorHandler({
		error,
		status,
		title: APP_NAME,
		errorDepth: 1,
		wrapperCount: 1,
	});

	String(LOG_CHAT_ID)
		? ctx.api.sendMessage(
				String(LOG_CHAT_ID),
				`<blockquote><b>❗️ERROR: ${APP_NAME} > ${returnedError.code} | ${
					returnedError.message
				}</b></blockquote>\n<code>${new Error().stack
					?.split('\n')
					.map((line) => `   ${line.trim()}`)
					.splice(1, 1)
					.join('\n')}</code>\n@amelianceskymusic`,
				{ parse_mode: 'HTML' },
				// eslint-disable-next-line no-mixed-spaces-and-tabs
		  )
		: null;

	return returnedError;
}
