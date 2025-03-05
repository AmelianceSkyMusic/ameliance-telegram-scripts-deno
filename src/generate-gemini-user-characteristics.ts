export function generateGeminiUserCharacteristics(
	username: string,
	getCharacteristics: (username: string) => string | undefined,
) {
	const userCharacteristics = getCharacteristics(username?.toLocaleLowerCase() || '');
	return userCharacteristics ? `{USER_CHARACTERISTICS_TO_CONSIDER: ${userCharacteristics}}\n` : '';
}
