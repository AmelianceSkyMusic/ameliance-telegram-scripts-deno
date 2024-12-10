import { Context } from '../deps.deno.ts';
import { generateUserFullNameTag } from './generate-user-full-name-tag.ts';
import { handleAppError } from './handle-app-error.ts';
import { removeMessageById } from './remove-message-by-id.ts';
import { replyHTML } from './reply-html.ts';
import { sendMessageHTML } from './send-message-html.ts';

interface AutoRemovableMessage {
	ctx: Context;
	text: string;
	reply?: boolean;
	mention?: boolean;
	ms?: number;
}

export async function autoRemovableMessage({
	ctx,
	text,
	reply = false,
	mention = false,
	ms = 3600,
}: AutoRemovableMessage) {
	const messageId = ctx.msg?.message_id;

	const messageUserTag = mention ? `${generateUserFullNameTag(ctx)}, ` : '';

	let sendMessage = null;
	try {
		if (reply) {
			await replyHTML(ctx, text, 'mention', messageId);
		} else {
			sendMessage = await sendMessageHTML(ctx, `${messageUserTag}${text}`);
		}

		if (sendMessage) {
			await removeMessageById({ ctx, messageId: sendMessage.message_id, ms });
		}
	} catch (error) {
		await handleAppError(ctx, error);
	}
}
