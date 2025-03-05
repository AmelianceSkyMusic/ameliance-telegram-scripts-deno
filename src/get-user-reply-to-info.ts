import { Context } from '../deps.deno.ts';
import { getHTMLData } from './get-html-data.ts';
import { getLinksFromMessage } from './get-links-from-message.ts';
import { getTextFromHTML } from './get-text-form-html.ts';

export function getUserReplyToInfo(ctx: Context) {
	const context = ctx.msg.reply_to_message;
	if (!context) return null;
	return {
		context,
		isBot: context?.from?.is_bot,
		lastName: context.from?.last_name,
		username: context.from?.is_bot ? 'bot' : context.from?.username,
		fullName: [context.from?.first_name, context.from?.last_name].join(' ').trim(),
		userId: context.from?.id,
		message: context.text,
		messageId: context.message_id,
		chatType: context.chat.type,
		date: context.date,
		async getTextFromUrl() {
			let textFromUrlInReplyMessage: string | null = null;
			if (Boolean(context)) {
				const urlEntitiesFromReplyMessage = getLinksFromMessage(context);

				if (urlEntitiesFromReplyMessage && urlEntitiesFromReplyMessage?.length > 0) {
					const url = urlEntitiesFromReplyMessage[0];
					const dataFromHTML = await getHTMLData(ctx, url);
					if (dataFromHTML) {
						textFromUrlInReplyMessage = getTextFromHTML(dataFromHTML);
					}
				}
			}
			return textFromUrlInReplyMessage;
		},
	};
}
