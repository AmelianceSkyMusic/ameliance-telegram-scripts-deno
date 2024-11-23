import { handleAppError } from './handle-app-error.ts';
import { sendMessage } from './send-message.ts';

import { Context } from '../deps.deno.ts';

export async function sendMessageHTML(
	ctx: Context,
	text: string,
	mode?: 'mention' | '',
	params: Record<string, string> = {},
) {
	try {
		const message = await sendMessage(ctx, text, mode, {
			parse_mode: 'HTML',
			...params,
		});
		return message;
	} catch (error) {
		handleAppError(ctx, error);
	}
}
