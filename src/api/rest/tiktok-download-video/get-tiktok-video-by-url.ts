import { tiktokDownloadVideoFetch } from './tiktok-download-video-fetch.ts';
import { GetTiktokVideoByUrlResponse } from './types/get-tiktok-video-by-url-response.ts';

export type GetTiktokVideoByUrlRequest = string;

export async function getTiktokVideoByUrl(url: GetTiktokVideoByUrlRequest) {
	return await tiktokDownloadVideoFetch.get<GetTiktokVideoByUrlResponse>('', {
		url,
		hd: 1,
	});
}
