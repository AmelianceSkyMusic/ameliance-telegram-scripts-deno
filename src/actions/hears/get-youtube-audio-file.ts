import { Bot, Context } from '../../../deps.deno.ts';
import { REGEXP } from '../../constants/regexp.ts';
import { getLinksFromMessage } from '../../get-links-from-message.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { replyWith } from '../../reply-with/index.ts';

type GetYoutubeAudioFileProps = {
	hear?: RegExp | RegExp[];
	access: HasAccess;
};

export function getYoutubeAudioFile(bot: Bot, { hear, access }: GetYoutubeAudioFileProps) {
	bot.hears(hear || /https?:\/\/.*youtu.?be/i, async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'hears get-youtube-audio-file',
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const urls = getLinksFromMessage(ctx.msg);
			const text = ctx.msg.text || '';
			const times = text.match(REGEXP.timeCode);
			const start = times?.[0] || '';
			const end = times?.[1] || '';

			if (urls) {
				const url = urls[0];
				await replyWith.youtubeAudio(ctx, url, start, end);
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
