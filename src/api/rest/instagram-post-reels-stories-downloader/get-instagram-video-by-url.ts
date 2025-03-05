import { instagramPostReelsStoriesDownloaderFetch } from './instagram-post-reels-stories-downloader-fetch.ts';
import { GetInstagramVideoByUrlResponse } from './types/get-instagram-video-by-url-response.ts';

export type GetInstagramVideoByUrlRequest = string;

export async function getInstagramVideoByUrl(url: GetInstagramVideoByUrlRequest) {
	return await instagramPostReelsStoriesDownloaderFetch.get<GetInstagramVideoByUrlResponse>('', {
		url,
	});
}
