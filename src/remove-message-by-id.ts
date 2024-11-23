import { handleAppError } from './handle-app-error.ts';

import { Context } from '../deps.deno.ts';

interface RemoveMessageById {
	ctx: Context;
	messageId: number;
	ms?: number;
}

export async function removeMessageById({
	ctx,
	messageId,
	ms = 3600,
}: RemoveMessageById): Promise<boolean> {
	return new Promise((resolve) => {
		setTimeout(async () => {
			try {
				const chatId = ctx.chat?.id;
				if (!chatId) throw new Error("Can't find chat");
				await ctx.api.deleteMessage(chatId, messageId);
				resolve(true);
			} catch (error) {
				handleAppError(ctx, error);
				resolve(false);
			}
		}, ms);
	});
}
