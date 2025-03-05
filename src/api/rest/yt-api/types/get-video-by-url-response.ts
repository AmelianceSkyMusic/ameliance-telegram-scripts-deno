export interface GetVideoByUrlResponse {
	status: string;
	id: string;
	title: string;
	lengthSeconds: string;
	keywords: string[];
	channelTitle: string;
	channelId: string;
	description: string;
	thumbnail: Thumbnail[];
	allowRatings: boolean;
	viewCount: string;
	isPrivate: boolean;
	isUnpluggedCorpus: boolean;
	isLiveContent: boolean;
	captions: Captions;
	expiresInSeconds: string;
	formats: Format[];
	adaptiveFormats: AdaptiveFormat[];
	pmReg: string;
	isProxied: boolean;
}

export interface Thumbnail {
	url: string;
	width: number;
	height: number;
}

export interface Captions {
	captionTracks: CaptionTrack[];
	translationLanguages: TranslationLanguage[];
}

export interface CaptionTrack {
	baseUrl: string;
	name: string;
	vssId: string;
	languageCode: string;
	isTranslatable: boolean;
}

export interface TranslationLanguage {
	languageCode: string;
	languageName: string;
}

export interface Format {
	itag: number;
	url: string;
	mimeType: string;
	bitrate: number;
	width: number;
	height: number;
	lastModified: string;
	contentLength?: string;
	quality: string;
	fps: number;
	qualityLabel: string;
	projectionType: string;
	averageBitrate?: number;
	audioQuality: string;
	approxDurationMs: string;
	audioSampleRate: string;
	audioChannels: number;
}

export interface AdaptiveFormat {
	itag: number;
	url: string;
	mimeType: string;
	bitrate: number;
	width?: number;
	height?: number;
	initRange: InitRange;
	indexRange: IndexRange;
	lastModified: string;
	contentLength: string;
	quality: string;
	fps?: number;
	qualityLabel?: string;
	projectionType: string;
	averageBitrate: number;
	approxDurationMs: string;
	colorInfo?: ColorInfo;
	highReplication?: boolean;
	audioQuality?: string;
	audioSampleRate?: string;
	audioChannels?: number;
	loudnessDb?: number;
}

export interface InitRange {
	start: string;
	end: string;
}

export interface IndexRange {
	start: string;
	end: string;
}

export interface ColorInfo {
	primaries: string;
	transferCharacteristics: string;
	matrixCoefficients: string;
}
