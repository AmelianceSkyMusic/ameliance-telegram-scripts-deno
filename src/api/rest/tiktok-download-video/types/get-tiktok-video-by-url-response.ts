export interface GetTiktokVideoByUrlResponse {
	code: number;
	msg: string;
	processed_time: number;
	data: Data;
}

export interface Data {
	aweme_id: string;
	id: string;
	region: string;
	title: string;
	cover: string;
	origin_cover: string;
	duration: number;
	play: string;
	wmplay: string;
	hdplay: string;
	size: number;
	wm_size: number;
	hd_size: number;
	music: string;
	music_info: MusicInfo;
	play_count: number;
	digg_count: number;
	comment_count: number;
	share_count: number;
	download_count: number;
	collect_count: number;
	create_time: number;
	anchors: unknown;
	anchors_extras: string;
	is_ad: boolean;
	commerce_info: CommerceInfo;
	commercial_video_info: string;
	author: Author;
}

export interface MusicInfo {
	id: string;
	title: string;
	play: string;
	cover: string;
	author: string;
	original: boolean;
	duration: number;
	album: string;
}

export interface CommerceInfo {
	adv_promotable: boolean;
	auction_ad_invited: boolean;
	branded_content_type: number;
	with_comment_filter_words: boolean;
}

export interface Author {
	id: string;
	unique_id: string;
	nickname: string;
	avatar: string;
}
