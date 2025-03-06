import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { getLinksFromMessage } from '../../get-links-from-message.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { replyWith } from '../../reply-with/index.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type GetInstagramPostFileProps = {
	hear?: RegExp | RegExp[];
	access: HasAccess;
};

export function getInstagramPostFile<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { hear, access }: GetInstagramPostFileProps) {
	bot.hears(hear || /https?:\/\/.*instagram.*\/p\//i, async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'hears get-instagram-post-file',
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const urls = getLinksFromMessage(ctx.msg);

			if (urls) {
				const url = urls[0];
				await replyWith.instagramFile(ctx, url);
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
