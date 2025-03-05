import { aFetch } from 'npm:ameliance-fetch';

const APP_NAME = Deno.env.get('APP_NAME');

if (!APP_NAME) throw new Error('APP_NAME is not set');

//TODO: update as object with set methods (setAppName, setDefaultHeaders, setBaseUrl)
export const afetch = aFetch('', { errorTitle: APP_NAME });
