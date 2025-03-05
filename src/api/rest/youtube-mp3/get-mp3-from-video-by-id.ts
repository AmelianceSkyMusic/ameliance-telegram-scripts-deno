import { GetMp3FromVideoByIdResponse } from './types/get-mp3-from-video-by-id-response.ts';
import { youtubeMp3Fetch } from './youtube-mp3-fetch.ts';

export type GetVideoByIdRequest = {
	id: string;
	start: string;
	end: string;
	cut: string;
};

export async function getMp3FromVideoById({ id, start, end, cut }: GetVideoByIdRequest) {
	return await youtubeMp3Fetch.get<GetMp3FromVideoByIdResponse>('', {
		id,
		sStart: start,
		sEnd: end,
		cut: cut,
	});
}
