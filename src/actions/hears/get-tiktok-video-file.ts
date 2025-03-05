import { Bot, Context } from '../../../deps.deno.ts';
import { getLinksFromMessage } from '../../get-links-from-message.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { replyWith } from '../../reply-with/index.ts';

type GetTiktokVideoFileProps = {
	hear?: RegExp | RegExp[];
	access: HasAccess;
};

export function getTiktokVideoFile(bot: Bot, { hear, access }: GetTiktokVideoFileProps) {
	bot.hears(hear || /https?:\/\/.*tiktok/i, async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'hears get-tiktok-video-file',
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const urls = getLinksFromMessage(ctx.msg);

			if (urls) {
				const url = urls[0];
				await replyWith.tiktokVideo(ctx, url);
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
