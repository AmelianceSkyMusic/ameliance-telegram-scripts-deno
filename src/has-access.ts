import { hasChannelIdAccess } from './has-channel-id-access.ts';
import { hasChatIdAccess } from './has-chat-id-access.ts';
import { hasUserIdAccess } from './has-user-id-access.ts';
import { hasUsernameAccess } from './has-username-access.ts';

import { Context } from '../deps.deno.ts';
import { isOwnerAccess } from './is-owner-access.ts';
import { isCurrentChatWithBot } from './is-current-chat-with-bot.ts';

type HasAccess = {
	ctx: Context;
	exclusiveAccess?: 'all' | 'private' | 'owner';
	accessInBotChat?: boolean;
	ownerHasFullAccess?: boolean;
	//* IDs of chats where the bot has access
	chatIdWithAccess?: string[] | null;
	//* IDs of channels where the bot has access
	channelIdWithAccess?: string[] | null;
	//* IDs of users who have access to the bot
	userIdWithAccess?: string[] | null;
	//* Usernames of users who have access to the bot
	usernameWithAccess?: string[] | null;
};

export function hasAccess({
	ctx,
	exclusiveAccess,
	accessInBotChat = false,
	ownerHasFullAccess = true,

	chatIdWithAccess,
	channelIdWithAccess,
	userIdWithAccess,
	usernameWithAccess,
}: HasAccess) {
	switch (exclusiveAccess) {
		case 'all':
			return 'as exclusive all';
		case 'private':
			return isCurrentChatWithBot(ctx) ? 'as exclusive private' : null;
		case 'owner':
			return isOwnerAccess(ctx) ? 'as exclusive owner' : null;
	}

	const hasAllAccessInChatWithBot = accessInBotChat ? isCurrentChatWithBot(ctx) : false;
	if (hasAllAccessInChatWithBot) return 'in bot chat';

	const hasOwnerAccess = ownerHasFullAccess ? isOwnerAccess(ctx) : false;
	if (hasOwnerAccess) return 'as owner';

	const hasCurrentChatIdAccess =
		chatIdWithAccess && chatIdWithAccess?.length > 0
			? hasChatIdAccess(ctx, chatIdWithAccess)
			: false;
	if (hasCurrentChatIdAccess) return 'in current chatId';

	const hasCurrentChannelIdAccess =
		channelIdWithAccess && channelIdWithAccess?.length > 0
			? hasChannelIdAccess(ctx, channelIdWithAccess)
			: false;
	if (hasCurrentChannelIdAccess) return 'in current channelId';

	const hasCurrentUserIdAccess =
		userIdWithAccess && userIdWithAccess?.length > 0
			? hasUserIdAccess(ctx, userIdWithAccess)
			: false;
	if (hasCurrentUserIdAccess) return 'as userId';

	const hasCurrentUsernameAccess =
		usernameWithAccess && usernameWithAccess.length > 0
			? hasUsernameAccess(ctx, usernameWithAccess)
			: false;
	if (hasCurrentUsernameAccess) return 'as username';

	return null;
}
