import { hasChannelIdAccess } from './has-channel-id-access.ts';
import { hasChatIdAccess } from './has-chat-id-access.ts';
import { hasUserIdAccess } from './has-user-id-access.ts';
import { hasUsernameAccess } from './has-username-access.ts';
import { logUserInfo } from './log-user-info.ts';

import { Context } from '../deps.deno.ts';

type HasNoAccess = {
	ctx: Context;
	chatIdWithAccess?: (string | number)[] | null;
	channelIdWithAccess?: (string | number)[] | null;
	userIdWithAccess?: (string | number)[] | null;
	usernameWithAccess?: (string | number)[] | null;
	checkChatId?: boolean;
	checkChannelId?: boolean;
	checkUserId?: boolean;
	checkUsername?: boolean;
};

export function hasNoAccess({
	ctx,
	chatIdWithAccess,
	channelIdWithAccess,
	userIdWithAccess,
	usernameWithAccess,
	checkChatId = true,
	checkChannelId = true,
	checkUserId = true,
	checkUsername = true,
}: HasNoAccess) {
	const hasCurrentChatIdAccess = checkChatId ? hasChatIdAccess(ctx, chatIdWithAccess) : true;
	const hasCurrentChannelIdAccess = checkChannelId
		? hasChannelIdAccess(ctx, channelIdWithAccess)
		: true;
	const hasCurrentUserIdAccess = checkUserId ? hasUserIdAccess(ctx, userIdWithAccess) : true;
	const hasCurrentUsernameAccess = checkUsername
		? hasUsernameAccess(ctx, usernameWithAccess)
		: true;

	if (
		hasCurrentChatIdAccess ||
		hasCurrentChannelIdAccess ||
		hasCurrentUserIdAccess ||
		hasCurrentUsernameAccess
	) {
		return false;
	}

	logUserInfo(ctx, `has no access`);
	return true;
}
