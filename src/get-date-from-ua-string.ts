export const MONTH_MAP: Record<string, string> = {
	січня: 'January',
	лютого: 'February',
	березня: 'March',
	квітня: 'April',
	травня: 'May',
	червня: 'June',
	липня: 'July',
	серпня: 'August',
	вересня: 'September',
	жовтня: 'October',
	листопада: 'November',
	грудня: 'December',
};

export function getDateFromUaString(dateString: string) {
	const dateRegex =
		/(?<day>\b(?:[0-2]?\d|3[01])\b)\s*(?<month>[а-яА-ЯіІїЇєЄ]+)\s*(?<year>\b\d{4}\b)/;

	const match = dateString.match(dateRegex);

	if (match?.groups) {
		const { day, month, year } = match.groups;
		const englishMonth = month ? MONTH_MAP[month.toLowerCase()] : '';
		console.log('englishMonth: ', englishMonth);

		return new Date(`${englishMonth} ${day}, ${year}`);
	}
	return null;
}
