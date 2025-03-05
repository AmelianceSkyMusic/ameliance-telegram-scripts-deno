export interface GetMp3FromVideoByIdResponse {
	msg: string;
	code: number;
	status: string;
	error?: string;
	link?: string;
	title?: string;
	filesize?: number;
	progress?: number;
	duration?: number;
}
