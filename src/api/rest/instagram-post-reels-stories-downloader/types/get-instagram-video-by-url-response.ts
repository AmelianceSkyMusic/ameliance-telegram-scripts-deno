export interface GetInstagramVideoByUrlResponse {
	status: boolean;
	time: number;
	result: Result[];
}

export interface Result {
	url: string;
	type: string;
	size: unknown;
	thumb: string;
}
