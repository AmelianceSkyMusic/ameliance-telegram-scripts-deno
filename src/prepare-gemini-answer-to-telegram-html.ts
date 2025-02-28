export function prepareGeminiAnswerToTelegramHtml(message: string) {
	return (
		message
			// Bold text
			.replace(/\*\*(.*?)\*\*/g, (_, boldText) => `<b>${boldText}</b>`)
			// Italic text
			.replace(
				/(^|[^*])\*(.*?)\*(?!\*)/g,
				(_, prefix, italicText) => `${prefix}<i>${italicText}</i>`,
			)
			// Lists
			.replace(/^\* (.+)$/gm, (_, listItem) => `• ${listItem.trim()}`)
			// Code blocks
			.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, language, code) => {
				const langAttr = language ? ` language="${language}"` : '';
				return `<pre${langAttr}>${code.trim()}</pre>`;
			})
			// Inline code
			.replace(/`([^`\n]+)`/g, (_, code) => `<code>${code}</code>`)
			.replaceAll('</b>\n', '</b>')
	);
}
