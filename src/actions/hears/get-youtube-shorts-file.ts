import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { getLinksFromMessage } from '../../get-links-from-message.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { replyWith } from '../../reply-with/index.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type GetYoutubeShortsFileProps = {
	hear?: RegExp | RegExp[];
	access: HasAccess;
};

export function getYoutubeShortsFile<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { hear, access }: GetYoutubeShortsFileProps) {
	bot.hears(hear || [/https?:\/\/.*youtu.?be.*short/i], async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'hears get-youtube-shorts-file',
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const urls = getLinksFromMessage(ctx.msg);

			if (urls) {
				const url = urls[0];
				await replyWith.youtubeVideo(ctx, url);
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
