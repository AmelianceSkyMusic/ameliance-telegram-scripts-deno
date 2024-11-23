import { GoogleGenerativeAI } from 'npm:@google/generative-ai';
import { config } from '../deps.deno.ts';

const { GOOGLE_GEMINI_API } = config();

export async function sendPromptGemini(prompt: string) {
	if (!GOOGLE_GEMINI_API) throw new Error('GOOGLE_GEMINI_API is missing!');

	const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API);
	const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
	const result = await model.generateContent(prompt);
	const response = await result.response;
	const text = response.text();
	return text;
}
