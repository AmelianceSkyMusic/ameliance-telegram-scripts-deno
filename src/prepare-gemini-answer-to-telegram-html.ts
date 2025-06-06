export function prepareGeminiAnswerToTelegramHtml(message: string) {
	return (
		message
			//* Escape special HTML characters (prevents issues with <, >, & in the text)
			.replace(/[<>&]/g, (char) => {
				switch (char) {
					case '<':
						return '&lt;';
					case '>':
						return '&gt;';
					case '&':
						return '&amp;';
					default:
						return char;
				}
			})
			//* Bold text
			.replace(/\*\*(.*?)\*\*/g, (_, boldText) => `<b>${boldText}</b>`)
			//* Lists
			.replace(/^\* (.+)$/gm, (_, listItem) => `• ${listItem.trim()}`)
			//* Italic text
			.replace(
				/(^|[^*])\*(.*?)\*(?!\*)/g,
				(_, prefix, italicText) => `${prefix}<i>${italicText}</i>`,
			)
			//* Code blocks
			.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, language, code) => {
				const langAttr = language ? ` language="${language}"` : '';
				return `<pre${langAttr}>${code.trim()}</pre>`;
			})
			//* Inline code
			.replace(/`([^`\n]+)`/g, (_, code) => `<code>${code}</code>`)
			//* Fix for handling newlines inside <b> tags
			.replaceAll('</b>\n', '</b>')
	);
}
