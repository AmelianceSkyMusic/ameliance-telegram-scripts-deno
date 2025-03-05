export function checkIsTrigger(
	trigger: RegExp | RegExp[] | string | string[],
	message: string,
	shouldRemoveTrigger: boolean = false,
) {
	//* Transforming different triggers variants into an array of regular expressions
	const triggerRegexp = Array.isArray(trigger)
		? trigger.map((t: string | RegExp) => (t instanceof RegExp ? t : new RegExp(`^(${t})`, 'i')))
		: [trigger instanceof RegExp ? trigger : new RegExp(`^(${trigger})`, 'i')];

	let text = message;

	//* Checking coincidence with any trigger
	const isTextStartsWithTrigger = triggerRegexp.some((regexp) => regexp.test(text));

	if (shouldRemoveTrigger && isTextStartsWithTrigger) {
		//* Find the first matting trigger and delete it
		const matchedTrigger = triggerRegexp.find((regexp) => regexp.test(text));
		if (matchedTrigger) text = text.replace(matchedTrigger, '').trim();
	}

	return isTextStartsWithTrigger ? text : null;
}
