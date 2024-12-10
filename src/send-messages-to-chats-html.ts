import { handleAppError } from './handle-app-error.ts';
import { Params, sendMessagesToChats } from './send-messages-to-chats.ts';

import { Context } from '../deps.deno.ts';

export async function sendMessagesToChatsHTML(
	ctx: Context,
	userIds: (number | string)[],
	text: string,
	params?: Params,
) {
	try {
		const messages = await sendMessagesToChats(ctx, userIds, text, {
			parse_mode: 'HTML',
			...params,
		});
		return messages;
	} catch (error) {
		await handleAppError(ctx, error);
	}
}
