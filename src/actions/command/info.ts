import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { removeMessageById } from '../../remove-message-by-id.ts';
import { getCurrentMessageUserInfo } from '../../get-current-message-user-info.ts';
import { HasAccess } from '../../has-access.ts';

type InfoProps = {
	command?: string;
	access: HasAccess;
};

export function info(bot: Bot, { command, access }: InfoProps) {
	bot.command(command || 'info', async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command  ${command || 'info'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const messageId = ctx.msg.message_id;
			await removeMessageById({ ctx, messageId });

			const userInfo = getCurrentMessageUserInfo(ctx);
			const currentChat = String(ctx.message?.chat.id);
			const currentChannel = String(ctx.channelPost?.chat.id);
			const text = `
userInfo: ${userInfo}
chatId: ${currentChat}
channelId: ${currentChannel}
			`;
			console.log(text);
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
