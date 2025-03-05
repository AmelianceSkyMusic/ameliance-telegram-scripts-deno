import { GetVideoByUrlResponse } from './types/get-video-by-url-response.ts';
import { ytApiFetch } from './yt-api-fetch.ts';

export type GetVideoByUrlRequest = string;

export async function getVideoByUrl(id: GetVideoByUrlRequest) {
	return await ytApiFetch.get<GetVideoByUrlResponse>('', { id });
}
