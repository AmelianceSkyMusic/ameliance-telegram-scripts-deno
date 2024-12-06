import { getCurrentTimeWithOffset, getRandomNumber } from 'npm:ameliance-scripts';

const APP_NAME = Deno.env.get('APP_NAME');

import { Context } from '../deps.deno.ts';

const oneMinInMs = 1000 * 60;

export async function runWithRandomInterval(
	ctx: Context,
	callback: () => Promise<void>,
	min: number,
	max: number,
) {
	await callback();

	const randomInterval = getRandomNumber(min, max) * oneMinInMs;
	await ctx.reply(
		`<blockquote><b>ℹ️INFO: ${APP_NAME}</b></blockquote>\n<code>Next post will be sent at: ${getCurrentTimeWithOffset(
			randomInterval,
		)}\nPost delay: ${randomInterval / oneMinInMs} minutes</code>`,
		{ parse_mode: 'HTML' },
	);

	setTimeout(() => {
		runWithRandomInterval(ctx, callback, min, max);
	}, randomInterval);

	return randomInterval;
}
