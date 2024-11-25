import { hasChannelIdAccess } from './has-channel-id-access.ts';
import { hasChatIdAccess } from './has-chat-id-access.ts';
import { hasUserIdAccess } from './has-user-id-access.ts';
import { hasUsernameAccess } from './has-username-access.ts';

import { Context } from '../deps.deno.ts';
import { isOwnerAccess } from './is-owner-access.ts';
import { hasAccessInBotChat } from './has-access-in-bot-chat.ts';

type HasAccess = {
	ctx: Context;
	all?: boolean;
	chatIdWithAccess?: string[] | null;
	channelIdWithAccess?: string[] | null;
	userIdWithAccess?: string[] | null;
	usernameWithAccess?: string[] | null;
	accessInBotChat?: boolean;
	ownerHasFullAccess?: boolean;
	onlyOwnerAccess?: boolean;
};

export function hasAccess({
	ctx,
	all,
	chatIdWithAccess,
	channelIdWithAccess,
	userIdWithAccess,
	usernameWithAccess,
	accessInBotChat = true,
	ownerHasFullAccess = true,
	onlyOwnerAccess = false,
}: HasAccess) {
	if (onlyOwnerAccess) {
		const hasOwnerAccess = ownerHasFullAccess ? isOwnerAccess(ctx) : false;
		return hasOwnerAccess;
	}

	if (all) return true;

	const hasAccessInChat = accessInBotChat ? hasAccessInBotChat(ctx) : false;
	if (hasAccessInChat) return true;

	const hasOwnerAccess = ownerHasFullAccess ? isOwnerAccess(ctx) : false;
	if (hasOwnerAccess) return true;

	const hasCurrentChatIdAccess =
		chatIdWithAccess && chatIdWithAccess?.length > 0
			? hasChatIdAccess(ctx, chatIdWithAccess)
			: false;

	const hasCurrentChannelIdAccess =
		channelIdWithAccess && channelIdWithAccess?.length > 0
			? hasChannelIdAccess(ctx, channelIdWithAccess)
			: false;

	const hasCurrentUserIdAccess =
		userIdWithAccess && userIdWithAccess?.length > 0
			? hasUserIdAccess(ctx, userIdWithAccess)
			: false;

	const hasCurrentUsernameAccess =
		usernameWithAccess && usernameWithAccess.length > 0
			? hasUsernameAccess(ctx, usernameWithAccess)
			: false;

	if (
		hasCurrentChatIdAccess ||
		hasCurrentChannelIdAccess ||
		hasCurrentUserIdAccess ||
		hasCurrentUsernameAccess
	) {
		return true;
	}

	return false;
}
