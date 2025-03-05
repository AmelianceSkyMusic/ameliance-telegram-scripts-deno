import { aFetch } from 'npm:ameliance-fetch';

const APP_NAME = Deno.env.get('APP_NAME');
const RAPID_API_KEY = Deno.env.get('RAPID_API_KEY');

if (!APP_NAME) console.error('APP_NAME is not set');
if (!RAPID_API_KEY) console.error('RAPID_API_KEY is not set');

const url = 'https://youtube-mp36.p.rapidapi.com/dl';
const headers = {
	'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com',
	'X-RapidAPI-Key': RAPID_API_KEY || '',
};

export const youtubeMp3Fetch = aFetch(url, {
	errorTitle: `${APP_NAME} | youtubeMp3Fetch`,
	headersInit: headers,
});
