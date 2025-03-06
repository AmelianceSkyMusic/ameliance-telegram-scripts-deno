import { generateGeminiUserCharacteristics } from './generate-gemini-user-characteristics.ts';
import { generateGeminiUserInfo } from './generate-gemini-user-info.ts';

export function getGeminiUserInfo(
	user: string,
	username: string,
	userId: string,
	getCharacteristics: (username: string) => string | undefined,
) {
	return `${generateGeminiUserInfo(user, username, userId)}${
		generateGeminiUserCharacteristics(
			username,
			getCharacteristics,
		)
	}`;
}
