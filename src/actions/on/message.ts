import { Content } from 'npm:@google/generative-ai';
import { getRandomNumber } from 'npm:ameliance-scripts';
import { Bot, Context } from '../../../deps.deno.ts';
import { getUserReplyToInfo } from '../../get-user-reply-to-info.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { isCurrentChatWithBot } from '../../is-current-chat-with-bot.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { replyHTML } from '../../reply-html.ts';
import { runGemini } from '../../run-gemini.ts';
import { checkIsTrigger } from '../../check-is-trigger.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type ContextWithSession = Context & {
	session: Record<string, ListSession<Content> | MapSession<Content>>;
};

type OnMessage = (
	ctx: Context & {
		session: Record<string, ListSession<Content | unknown> | MapSession<Content | unknown>>;
	},
	message: string,
) => void;

type OnMessagePromise = (
	ctx: Context & {
		session: Record<string, ListSession<Content | unknown> | MapSession<Content | unknown>>;
	},
	message: string,
) => Promise<void>;

type MessageProps = {
	access: HasAccess;
	session: string | null;
	initPrompt: Content;
	promptCreator?: (ctx: ContextWithSession, message: string) => Promise<string | undefined | null>;
	trigger?: RegExp | RegExp[] | string | string[];
	shouldRemoveTrigger?: boolean;
	randomRun?: {
		min?: number;
		max: number;
		match: number;
	};
	onMessage?: OnMessage | OnMessagePromise | (OnMessage | OnMessagePromise)[];
};

export function message<B extends Bot<C>, C extends ContextWithSession>(
	bot: B,
	{
		access,
		session,
		initPrompt,
		promptCreator,
		randomRun,
		trigger,
		shouldRemoveTrigger,
		onMessage,
	}: MessageProps,
) {
	bot.on('message', async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, { message: 'on message', accessMessage: hasAccessToRunCommand });
			if (!hasAccessToRunCommand) return;

			let message = ctx?.msg?.text || ctx?.msg?.caption || '';

			if (onMessage) {
				if (Array.isArray(onMessage)) {
					for (const callback of onMessage) {
						await callback(ctx, message);
					}
				} else {
					await onMessage(ctx, message);
				}
			}

			//* Check if the message starts with a trigger and replace original message
			const isTrigger = trigger ? checkIsTrigger(trigger, message, shouldRemoveTrigger) : null;
			message = isTrigger || message;

			const shouldRandomRun = randomRun
				? getRandomNumber(randomRun?.min || 1, randomRun?.max) === randomRun?.match
				: null;

			const isBotChat = isCurrentChatWithBot(ctx);
			const reply = getUserReplyToInfo(ctx);
			const isReplyToThisBot = reply && reply?.isBot && reply?.isThisBot;

			if (isBotChat || isReplyToThisBot || shouldRandomRun || isTrigger) {
				const preparedAnswer = await runGemini(ctx, {
					session,
					initPrompt,
					message,
					promptCreator,
				});

				if (!preparedAnswer) return;

				const messageId = ctx?.msg?.message_id;
				if (isBotChat) {
					await ctx.reply(preparedAnswer, {
						parse_mode: 'HTML',
					});
				} else {
					await replyHTML(ctx, preparedAnswer, '', messageId);
				}
			}
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
