import { Context, InputFile } from '../deps.deno.ts';
import { handleAppError } from './handle-app-error.ts';

export async function replyWithAudio(
	ctx: Context,
	audio: InputFile | string,
	thumbnail?: InputFile,
) {
	try {
		await ctx.replyWithAudio(audio, { thumbnail });
	} catch (error) {
		handleAppError(ctx, error);
	}
}
