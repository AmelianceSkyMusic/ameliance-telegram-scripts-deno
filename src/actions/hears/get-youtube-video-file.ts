import { Bot, Context } from '../../../deps.deno.ts';
import { getLinksFromMessage } from '../../get-links-from-message.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { replyWith } from '../../reply-with/index.ts';

type GetYoutubeVideoFileProps = {
	hear?: RegExp | RegExp[];
	access: HasAccess;
};

export function getYoutubeVideoFile(bot: Bot, { hear, access }: GetYoutubeVideoFileProps) {
	bot.hears(
		hear || [
			/https?:\/\/.*youtu\.?be.*\s(?:глянь|диви|подиви|подиві|переглянь|відос|відео|video|watch|look|see)+/i,
			/(?:глянь|диви|подиви|подиві|переглянь|відос|відео|video|watch|look|see)+.*\shttps?:\/\/.*youtu.?be/i,
		],
		async (ctx: Context) => {
			try {
				const hasAccessToRunCommand = hasAccess({ ctx, ...access });
				logUserInfo(ctx, {
					message: 'hears get-youtube-video-file',
					accessMessage: hasAccessToRunCommand,
				});
				if (!hasAccessToRunCommand) return;

				const urls = getLinksFromMessage(ctx.msg);

				if (urls) {
					const url = urls[0];
					await replyWith.youtubeVideo(ctx, url);
				}
			} catch (error) {
				handleAppError(ctx, error);
			}
		},
	);
}
