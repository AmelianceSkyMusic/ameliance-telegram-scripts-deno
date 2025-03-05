export function generateGeminiTextContent(text: string) {
	return {
		role: 'user',
		parts: [
			{
				text,
			},
		],
	};
}
