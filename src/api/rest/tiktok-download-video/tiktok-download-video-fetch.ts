import { aFetch } from 'npm:ameliance-fetch';

const APP_NAME = Deno.env.get('APP_NAME');
const RAPID_API_KEY = Deno.env.get('RAPID_API_KEY');

const url = 'https://tiktok-download-video1.p.rapidapi.com/getVideo';
const headers = {
	'X-RapidAPI-Host': 'tiktok-download-video1.p.rapidapi.com',
	'X-RapidAPI-Key': RAPID_API_KEY || '',
};

export const tiktokDownloadVideoFetch = aFetch(url, {
	errorTitle: `${APP_NAME} | tiktokDownloadVideoFetch`,
	headersInit: headers,
});
