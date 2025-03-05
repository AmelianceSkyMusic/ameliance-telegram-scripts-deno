export function prepareGeminiAnswerToTelegramHtml(message: string) {
	return (
		message
			//* Bold text
			.replace(/\*\*(.*?)\*\*/g, (_, boldText) => `<b>${boldText}</b>`)
			.replace(/\*\*(.*?)\*\*/g, (_, boldText) => `<b>${boldText}</b>`)
			//* Italic text
			.replace(
				/(^|[^*])\*(.*?)\*(?!\*)/g,
				(_, prefix, italicText) => `${prefix}<i>${italicText}</i>`,
			)
			//* Lists
			.replace(/^\* (.+)$/gm, (_, listItem) => `• ${listItem.trim()}`)
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
