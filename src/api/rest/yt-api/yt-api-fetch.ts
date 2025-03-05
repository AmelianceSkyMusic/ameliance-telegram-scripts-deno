import { aFetch } from 'npm:ameliance-fetch';

const APP_NAME = Deno.env.get('APP_NAME');
const RAPID_API_KEY = Deno.env.get('RAPID_API_KEY');

if (!APP_NAME) console.error('APP_NAME is not defined');
if (!RAPID_API_KEY) console.error('RAPID_API_KEY is not defined');

const url = 'https://yt-api.p.rapidapi.com/dl';
const headers = {
	'X-RapidAPI-Host': 'yt-api.p.rapidapi.com',
	'X-RapidAPI-Key': RAPID_API_KEY || '',
};

export const ytApiFetch = aFetch(url, {
	errorTitle: `${APP_NAME} | ytApiFetch`,
	headersInit: headers,
});
