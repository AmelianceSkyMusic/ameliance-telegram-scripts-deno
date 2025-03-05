import { Context, InputFile } from '../../deps.deno.ts';
import { api } from '../api/index.ts';
import { handleAppError } from '../handle-app-error.ts';

export async function replyWithInstagramFile(ctx: Context, url: string) {
	const resp = await api.instagramPostReelsStoriesDownloader.getInstagramVideoByUrl(url);
	if (resp.ok) {
		const video = resp.data.result.filter((item) => item.type.includes('video'))[0];
		const image = resp.data.result.filter((item) => item.type.includes('image'))[0];

		try {
			if (video) await ctx.replyWithVideo(new InputFile(new URL(video.url)));
			else if (image) {
				await ctx.replyWithPhoto(new InputFile(new URL(image.url)));
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	}
}
