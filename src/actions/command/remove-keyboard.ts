import { Bot, Context } from '../../../deps.deno.ts';
import { handleAppError } from '../../handle-app-error.ts';
import { HasAccess, hasAccess } from '../../has-access.ts';
import { logUserInfo } from '../../log-user-info.ts';

type RemoveKeyboardProps = {
	access: HasAccess;
};

export function removeKeyboard(bot: Bot, { access }: RemoveKeyboardProps) {
	bot.command('removekeyboard', async (ctx: Context) => {
		try {
			const hasAccessToRunCommand = hasAccess({ ctx, ...access });
			logUserInfo(ctx, {
				message: 'command remove-keyboard',
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
