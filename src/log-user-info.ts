import { getCurrentMessageChatInfo } from './get-current-message-chat-info.ts';
import { getCurrentMessageUserInfo } from './get-current-message-user-info.ts';

import { Context } from '../deps.deno.ts';

const APP_NAME = Deno.env.get('APP_NAME');
const LOG_CHAT_ID = Deno.env.get('LOG_CHAT_ID');

export function logUserInfo(ctx: Context, message?: string) {
	const userInfo = getCurrentMessageUserInfo(ctx);
	const chatInfo = getCurrentMessageChatInfo(ctx);
	const user = `\n  ┌ user: ${userInfo}`;
	const chat = `\n  └ in: ${chatInfo}`;
	const msg = message ? ` ${message}` : '';
	console.log(`> [${new Date().toLocaleString()}]:${msg}${user}${chat}\n`);
	ctx.api.sendMessage(
		String(LOG_CHAT_ID),
		`<blockquote><b>ℹ️INFO: ${APP_NAME}</b></blockquote>\n<code>> [${
			new Date().toLocaleString()
		}]:${msg}${user}${chat}\n</code>`,
		{ parse_mode: 'HTML' },
	);
}
