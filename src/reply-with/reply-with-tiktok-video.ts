import { Context, InputFile } from '../../deps.deno.ts';
import { api } from '../api/index.ts';
import { handleAppError } from '../handle-app-error.ts';

export async function replyWithTiktokVideo(ctx: Context, url: string) {
	const resp = await api.tiktokDownloadVideo.getTiktokVideoByUrl(url);
	if (resp.ok) {
		const targetUrl = resp.data.data.play;
		const thumbnail = resp.data.data.cover;
		const title = resp.data.data.title;

		try {
			await ctx.replyWithVideo(new InputFile(new URL(targetUrl)), {
				caption: title,
				thumbnail: new InputFile(new URL(thumbnail)),
			});
		} catch (error) {
			handleAppError(ctx, error);
		}
	}
}
