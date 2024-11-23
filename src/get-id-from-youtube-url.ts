export function getIdFromYoutubeUrl(url: string) {
	const regex = /(youtu.*be.*)\/(watch\?.*v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm;
	const id = regex.exec(url)?.[3];
	if (id) return id;
	throw new Error('The supplied URL is not a valid youtube URL');
}
