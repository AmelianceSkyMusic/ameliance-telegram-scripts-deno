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

type MessageProps = {
	access: HasAccess;
	session: string | null;
	initPrompt: Content;
	promptCreator?: (ctx: Context, message: string) => Promise<string | undefined | null>;
	trigger?: RegExp | RegExp[] | string | string[];
	shouldRemoveTrigger?: boolean;
	randomRun?: {
		min?: number;
		max: number;
		match: number;
	};
};

export function message(
	bot: Bot,
	{
		access,
		session,
		initPrompt,
		promptCreator,
		randomRun,
		trigger,
		shouldRemoveTrigger,
	}: MessageProps,
) {
	bot.on('message', async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, { message: 'on message', accessMessage: hasAccessToRunCommand });
			if (!hasAccessToRunCommand) return;

			let message = ctx.msg.text;

			//* Check if the message starts with a trigger and replace original message
			const isTrigger = trigger ? checkIsTrigger(trigger, message, shouldRemoveTrigger) : null;
			message = isTrigger || message;

			const shouldRandomRun = randomRun
				? getRandomNumber(randomRun?.min || 1, randomRun?.max) === randomRun?.match
				: null;

			const isBotChat = isCurrentChatWithBot(ctx);
			const reply = getUserReplyToInfo(ctx);

			if (
				isBotChat ||
				(reply && reply?.isBot && !reply?.isThisBot && !isBotChat) ||
				shouldRandomRun ||
				isTrigger
			) {
				const preparedAnswer = await runGemini(ctx, {
					session,
					initPrompt,
					message,
					promptCreator,
				});

				if (!preparedAnswer) return;

				const messageId = ctx.msg.message_id;
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
