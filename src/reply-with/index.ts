import { replyWithInstagramFile } from './reply-with-instagram-file.ts';
import { replyWithTiktokVideo } from './reply-with-tiktok-video.ts';
import { replyWithYoutubeAudio } from './reply-with-youtube-audio.ts';
import { replyWithYoutubeVideo } from './reply-with-youtube-video.ts';

export const replyWith = {
	instagramFile: replyWithInstagramFile,
	tiktokVideo: replyWithTiktokVideo,
	youtubeAudio: replyWithYoutubeAudio,
	youtubeVideo: replyWithYoutubeVideo,
};
