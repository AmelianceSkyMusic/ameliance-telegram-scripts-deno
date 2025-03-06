export function generateGeminiUserInfo(user: string, username: string, userId: string): string {
	return `{USER: ${user}, USERNAME: @${username}, USER_ID: ${userId}}\n`;
}
