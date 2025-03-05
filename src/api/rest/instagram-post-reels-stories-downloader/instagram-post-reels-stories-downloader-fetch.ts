import { aFetch } from 'npm:ameliance-fetch';

const APP_NAME = Deno.env.get('APP_NAME');
const RAPID_API_KEY = Deno.env.get('RAPID_API_KEY');

const url = 'https://instagram-post-reels-stories-downloader.p.rapidapi.com/instagram/';
const headers = {
	'X-RapidAPI-Host': 'instagram-post-reels-stories-downloader.p.rapidapi.com',
	'X-RapidAPI-Key': RAPID_API_KEY || '',
};

export const instagramPostReelsStoriesDownloaderFetch = aFetch(url, {
	errorTitle: `${APP_NAME} | instagramPostReelsStoriesDownloaderFetch`,
	headersInit: headers,
});
