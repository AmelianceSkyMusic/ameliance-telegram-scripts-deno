import { Context, InputFile } from '../../deps.deno.ts';
import { api } from '../api/index.ts';
import { getIdFromYoutubeUrl } from '../get-id-from-youtube-url.ts';
import { handleAppError } from '../handle-app-error.ts';

export async function replyWithYoutubeVideo(ctx: Context, url: string) {
	const videoID = getIdFromYoutubeUrl(url);
	const resp = await api.ytApi.getVideoByUrl(videoID);
	if (resp.ok) {
		const targetUrl = resp.data.formats[0].url;
		const thumbnail = resp.data.thumbnail[0];
		const title = resp.data.title;
		const channelTitle = resp.data.channelTitle;

		try {
			await ctx.replyWithVideo(new InputFile(new URL(targetUrl)), {
				caption: `${channelTitle} - ${title}`,
				thumbnail: new InputFile(new URL(thumbnail.url)), //TODO: doesn't work
				width: thumbnail.width,
				height: thumbnail.height,
			});
		} catch (error) {
			handleAppError(ctx, error);
		}
	}
}
