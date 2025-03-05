export const REGEXP = {
	timeCode: /\d{1,2}:\d{2}(?::\d{2})/g,

	//* Get tag <a> with data-audio-id === dataAudioId
	holychordsDownloadLink: (dataAudioId: string) =>
		new RegExp(`<a\\s[^>]*?data-audio-id\\s*=\\s*["'](${dataAudioId})["'][^>]*?>`, 'gi'),
	// holychordsDownloadLink: /<a\s+(?:[^>]*?\s+)?href=(["'])(.*?)\1[^>]*>/g,
	// holychordsDownloadLink:
	// 	/<a\b(?=[^>]*?href\s*=\s*(["'])(?<href>.*?)\1)(?=[^>]*?download\b).*?>/gis,
	holychordsMusicText: /<pre[^>]*id="music_text"[^>]*>(.*?)<\/pre>/s,
	holychordsSongArtist: /<h5[^>]*>(.*?)<\/h5>/s,
	holychordsSongTitle: /<h2[^>]*>(.*?)<\/h2>/,
};
