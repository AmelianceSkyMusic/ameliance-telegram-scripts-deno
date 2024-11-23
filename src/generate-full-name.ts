import { joinWith } from 'npm:ameliance-scripts';

export function generateFullName(
	userFirstName: string = '',
	userLastName: string = '',
): string {
	if (!userFirstName && !userLastName) return '';
	const fullName = joinWith(' ', [userFirstName, userLastName]);
	return fullName.trim();
}
