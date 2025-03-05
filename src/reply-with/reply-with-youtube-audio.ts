import { Context } from '../../deps.deno.ts';
import { api } from '../api/index.ts';
import { getIdFromYoutubeUrl } from '../get-id-from-youtube-url.ts';
import { handleAppError } from '../handle-app-error.ts';
import { replyWithAudio } from '../reply-with-audio.ts';

export async function replyWithYoutubeAudio(ctx: Context, url: string, start: string, end: string) {
	try {
		const videoId = getIdFromYoutubeUrl(url);
		const cut = start && end ? '1' : '';
		const respAudio = await api.youtubeMp3.getMp3FromVideoById({
			id: videoId,
			start,
			end,
			cut,
		});

		if (!respAudio.ok) throw new Error("Can't download link");

		if (respAudio.ok) {
			if (respAudio.data.status === 'ok' && respAudio.data.link) {
				const mp3Url = respAudio.data.link;

				await replyWithAudio(ctx, mp3Url);
			}
		}
	} catch (error) {
		handleAppError(ctx, error);
	}
}
