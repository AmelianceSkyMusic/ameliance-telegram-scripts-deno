import { Content } from 'npm:@google/generative-ai';
import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';
import { ListSession } from '../../session/create-list-session.ts';
import { MapSession } from '../../session/create-map-session.ts';

type RemoveKeyboardProps = {
	command?: string;
	access: HasAccess;
};

export function removeKeyboard<
	B extends Bot<C>,
	C extends Context & {
		session: Record<string, ListSession<Content> | MapSession<Content>>;
	},
>(bot: B, { command, access }: RemoveKeyboardProps) {
	bot.command(command || 'removekeyboard', async (ctx: C) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: `command  ${command || 'remove-keyboard'}`,
				accessMessage: hasAccessToRunCommand,
			});
			if (!hasAccessToRunCommand) return;

			await ctx.reply('Keyboard removed!', {
				reply_markup: { remove_keyboard: true },
			});
		} catch (error) {
			handleAppError(ctx, error);
		}
	});
}
