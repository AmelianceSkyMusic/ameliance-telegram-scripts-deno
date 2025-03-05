import { Buffer } from 'node:buffer';
import { parseBuffer } from 'npm:music-metadata';
import NodeID3 from 'npm:node-id3';
import { Bot, Context, InputFile } from '../../../deps.deno.ts';
import { getLinksFromMessage } from '../../get-links-from-message.ts';
import { getHTMLData } from '../../get-html-data.ts';
import { REGEXP } from '../../constants/regexp.ts';
import { replyWithAudio } from '../../reply-with-audio.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

const holychordsURL = 'https://holychords.pro';
const holychordsTitlePostfix = ' - holychords.pro';

async function prepareLink(url: string) {
	const res = await fetch(url);

	const originalArrayBuffer = await res.arrayBuffer();
	const originalAudioBuffer = Buffer.from(originalArrayBuffer);

	const metadata = await parseBuffer(originalAudioBuffer, {
		mimeType: 'audio/mpeg',
	});

	const newTitle = metadata.common?.title
		? metadata.common.title.replaceAll(holychordsTitlePostfix, '')
		: '';
	const tagsForUpdate = {
		title: newTitle,
		comment: { language: 'ukr', text: 'Красава, Ваван!' },
	};
	const audioBuffer = NodeID3.update(tagsForUpdate, originalAudioBuffer);

	return {
		buffer: audioBuffer,
		artist: metadata.common?.artist ||
			(metadata.common?.artists ? metadata.common.artists.join(', ') : ''),
		title: newTitle,
		picture: metadata.common?.picture?.[0],
	};
}

type GetHolychordsAudioFileProps = {
	hear?: RegExp | RegExp[];
	access: HasAccess;
};

export function getHolychordsAudioFile(bot: Bot, { hear, access }: GetHolychordsAudioFileProps) {
	bot.hears(hear || /https?:\/\/holychords\.pro\//i, async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'hears get-holychords-audio-file',
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const urls = getLinksFromMessage(ctx.msg);
			if (!urls) return;

			const url = urls[0];

			const htmlData = await getHTMLData(ctx, url);
			if (!htmlData) return;

			const matchMusicText = htmlData.match(REGEXP.holychordsMusicText);
			const matchArtist = htmlData.match(REGEXP.holychordsSongArtist);
			const matchTitle = htmlData.match(REGEXP.holychordsSongTitle);

			const dataAudioId = url.split('/').at(-1) || '';

			const matches = htmlData.matchAll(REGEXP.holychordsDownloadLink(dataAudioId));

			let matchDownloadUrl: string | null = null;

			for (const match of matches) {
				const aTag = match[0];

				//* Get data-audio-file
				const audioFileRegex = /data-audio-file\s*=\s*["']([^"']+)["']/i;
				const audioFileMatch = aTag.match(audioFileRegex);

				if (audioFileMatch) {
					matchDownloadUrl = audioFileMatch[1];
				} else {
					matchDownloadUrl = null;
				}
			}

			let artist = '';
			if (matchArtist && matchArtist[1]) artist = matchArtist[1].trim() || '';

			let title = '';
			if (matchTitle && matchTitle[1]) title = matchTitle[1].trim() || '';

			if (matchMusicText && matchMusicText[1]) {
				const songTitle = artist && title ? [artist, title].join(' — ') : title || artist;

				const titleContent = songTitle
					? `<a href="${url}"><b>${songTitle.toLocaleUpperCase()}</b></a>\n`
					: '';

				const content = matchMusicText[1].trim();

				await ctx.reply(`${titleContent}<blockquote expandable>${content}</blockquote>`, {
					parse_mode: 'HTML',
					link_preview_options: {
						is_disabled: true,
					},
				});
			} else {
				console.log('Текст не знайдено');
			}

			if (matchDownloadUrl) {
				const downloadMp3Url = `${holychordsURL}${matchDownloadUrl}`;

				const { buffer, artist, title, picture } = await prepareLink(downloadMp3Url);

				const mp3FileTitle = `${[artist, title].join(' - ')}.mp3`;
				const pictureFile = picture?.data ? new InputFile(picture.data) : undefined;

				await replyWithAudio(ctx, new InputFile(buffer, mp3FileTitle), pictureFile);
			} else {
				console.log('Посилання для завантаження не знайдено');
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
