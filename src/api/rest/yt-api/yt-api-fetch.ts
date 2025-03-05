import { aFetch } from 'npm:ameliance-fetch';

const APP_NAME = Deno.env.get('APP_NAME');
const RAPID_API_KEY = Deno.env.get('RAPID_API_KEY');

const url = 'https://yt-api.p.rapidapi.com/dl';
const headers = {
	'X-RapidAPI-Host': 'yt-api.p.rapidapi.com',
	'X-RapidAPI-Key': RAPID_API_KEY || '',
};

export const ytApiFetch = aFetch(url, {
	errorTitle: `${APP_NAME} | ytApiFetch`,
	headersInit: headers,
});
