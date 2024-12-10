import { Context, Other, RawApi } from '../deps.deno.ts';
import { generateUserFullNameTag } from './generate-user-full-name-tag.ts';
import { handleAppError } from './handle-app-error.ts';

export type Params = Other<RawApi, 'sendMessage', 'text' | 'chat_id'> & {
	mention?: boolean;
};

export async function sendMessagesToChats(
	ctx: Context,
	userIds: (number | string)[],
	text: string,
	params?: Params,
) {
	const preparedUserIds = userIds.filter((id) => String(id).trim().length > 0);
	try {
		if (!preparedUserIds || preparedUserIds.length === 0) {
			throw new Error('User ids not found');
		}

		const { mention = false, ...restParams } = params || {};
		const messageText = mention ? `${generateUserFullNameTag(ctx)}, ${text}` : text;

		return await Promise.all(
			userIds.map((id) => ctx.api.sendMessage(id, messageText, restParams)),
		);
	} catch (error) {
		await handleAppError(ctx, error);
	}
}
