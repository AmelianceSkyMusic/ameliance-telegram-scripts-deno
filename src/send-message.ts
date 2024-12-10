import { generateUserFullNameTag } from './generate-user-full-name-tag.ts';
import { handleAppError } from './handle-app-error.ts';

import { Context } from '../deps.deno.ts';

export async function sendMessage(
	ctx: Context,
	text: string,
	mode?: 'mention' | '',
	params: Record<string, string> = {},
) {
	const newText = mode === 'mention' ? `${generateUserFullNameTag(ctx)}, ${text}` : text;
	try {
		const chatId = ctx.chat?.id;
		if (!chatId) throw new Error("Can't find chat");

		const message = await ctx.api.sendMessage(chatId, newText, params);
		if (message) return message;
		throw new Error("Can't find message");
	} catch (error) {
		await handleAppError(ctx, error);
	}
}
