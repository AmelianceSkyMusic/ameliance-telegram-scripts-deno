export function getTextFromHTML(html: string) {
	const withoutScriptAndStyle = html.replace(
		/<script[^>]*>[\s\S]*?<\/script>/g,
		'',
	);
	const withoutStyle = withoutScriptAndStyle.replace(
		/<style[^>]*>[\s\S]*?<\/style>/g,
		'',
	);
	const withoutTags = withoutStyle.replace(/<[^>]*>/g, '');

	const text = withoutTags.trim().replace(/\s+/g, ' ');

	return text;
}
