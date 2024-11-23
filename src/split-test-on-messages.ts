export function splitTextOnMessages(
	text: string,
	divider = '\n',
	maxLength: number = 4096,
) {
	const sentences = text.split('\n');
	if (sentences.length <= 0) return null;

	let i = 0;
	let resultArray = [] as string[];
	sentences.forEach((sentence) => {
		if (sentence) {
			const prevSentenceLength = resultArray.length > 0
				? (resultArray[i] + divider + sentence).length
				: null;

			if (prevSentenceLength) {
				if (prevSentenceLength > maxLength) {
					i++;
					//TODO: fix duplicated code
					if (sentence.length > maxLength) {
						const splittedMessage = splitTextOnMessages(sentence, ' ');
						if (splittedMessage) {
							resultArray = [...resultArray, ...splittedMessage];
							i = i + splittedMessage?.length;
						}
					}
					resultArray[i] = sentence;
				} else {
					resultArray[i] = resultArray[i] + divider + sentence;
				}
			} else {
				if (sentence.length > maxLength) {
					const splittedMessage = splitTextOnMessages(sentence, ' ');
					if (splittedMessage) {
						resultArray = [...resultArray, ...splittedMessage];
						i = i + splittedMessage?.length;
					}
				}
				resultArray[i] = sentence;
			}
		} else {
			resultArray[i] = resultArray[i] + divider;
		}
	});

	return resultArray;
}
