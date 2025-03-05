export function generateGeminiUserInfo(user: string, username: string, userId: number): string {
	return `{USER: ${user}, USERNAME: @${username}, USER_ID: ${userId}}\n`;
}
