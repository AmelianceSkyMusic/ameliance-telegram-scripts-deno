import { Context } from '../deps.deno.ts';
import { getHTMLData } from './get-html-data.ts';
import { getLinksFromMessage } from './get-links-from-message.ts';
import { getTextFromHTML } from './get-text-form-html.ts';

export function getUserInfo(ctx: Context) {
	const context = ctx.msg;
	return {
		context,
		userId: String(context?.from?.id || ''),
		username: context?.from?.username || '',
		firstName: context?.from?.first_name || '',
		lastName: context?.from?.last_name || '',
		fullName: [context?.from?.first_name, context?.from?.last_name].join(' ').trim() || '',
		message: context?.text || context?.caption || '',
		messageId: context?.message_id,
		chatType: context?.chat.type,
		date: context?.date,
		async getTextFromUrl() {
			let textFromUrlInCurrentMessage = '';
			const currentTextHTMLUrls = getLinksFromMessage(context);

			if (currentTextHTMLUrls && currentTextHTMLUrls.length > 0) {
				const url = currentTextHTMLUrls[0];
				const dataFromHTML = await getHTMLData(ctx, url);
				if (dataFromHTML) {
					textFromUrlInCurrentMessage = getTextFromHTML(dataFromHTML);
				}
			}
			return textFromUrlInCurrentMessage;
		},
	};
}
