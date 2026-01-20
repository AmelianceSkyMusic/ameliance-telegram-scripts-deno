import { Context, InputFile } from '../../deps.deno.ts';
import { api } from '../api/index.ts';
import { getIdFromYoutubeUrl } from '../get-id-from-youtube-url.ts';
import { handleAppError } from '../handle-app-error.ts';

export async function replyWithYoutubeVideo(ctx: Context, url: string) {
	const videoID = getIdFromYoutubeUrl(url);
	const resp = await api.ytApi.getVideoByUrl(videoID);
	if (resp.ok) {
		const targetUrl = resp.data.formats[0].url;
		const thumbnails = resp.data.thumbnail;
		const title = resp.data.title;
		const channelTitle = resp.data.channelTitle;
		const videoWidth = resp.data.formats[0].width;
		const videoHeight = resp.data.formats[0].height;

		try {
			const caption = `${channelTitle} - ${title}`;

			const safeFileName = caption
				.replaceAll(/[\\/:*?"<>|\n\r\t]/g, ' ')
				.replaceAll(/\s+/g, ' ')
				.trim()
				.slice(0, 120);

			const res = await fetch(targetUrl);
			const buf = new Uint8Array(await res.arrayBuffer());

			let thumbFile: InputFile | undefined;
			try {
				const smallestThumb = thumbnails?.length
					? thumbnails.toSorted((a, b) => a.width * a.height - b.width * b.height)[0]
					: undefined;

				if (smallestThumb?.url) {
					const thumbRes = await fetch(smallestThumb.url);
					const thumbBuf = new Uint8Array(await thumbRes.arrayBuffer());
					const maxThumbSizeBytes = 200 * 1024;
					thumbFile = thumbBuf.byteLength && thumbBuf.byteLength <= maxThumbSizeBytes
						? new InputFile(thumbBuf, 'thumb.jpg')
						: undefined;
				}
			} catch {
				thumbFile = undefined;
			}

			await ctx.replyWithVideo(new InputFile(buf, `${safeFileName || 'video'}.mp4`), {
				caption,
				...(thumbFile ? { thumbnail: thumbFile } : {}),
				width: videoWidth,
				height: videoHeight,
			});
		} catch (error) {
			handleAppError(ctx, error);
		}
	}
}
