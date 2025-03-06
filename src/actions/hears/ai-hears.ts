import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { replyHTML } from '../../reply-html.ts';
import { runGemini } from '../../run-gemini.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type AiHearsProps<C> = {
	access: HasAccess;
	hear: RegExp | RegExp[];
	promptCreator?: (
		ctx: C,
		message: string,
	) => Promise<string | undefined | null> | string | undefined | null;
	initPrompt?: Content;
	session: string | null;
	shouldReply?: boolean;
};

export function aiHears<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(
	bot: B,
	{ access, hear, promptCreator, initPrompt, session, shouldReply = true }: AiHearsProps<C>,
) {
	bot.hears(hear, async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `hears ai-hears/${hear}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			const messageId = ctx?.msg?.message_id;
			const messageText = ctx?.msg?.text || ctx?.msg?.caption;
			if (!messageText) return;

			const preparedAnswer = await runGemini(ctx, {
				session,
				initPrompt,
				message: messageText,
				promptCreator,
			});

			if (!preparedAnswer) return;

			if (shouldReply) {
				await replyHTML(ctx, preparedAnswer, '', messageId);
			} else {
				await replyHTML(ctx, preparedAnswer, '');
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
