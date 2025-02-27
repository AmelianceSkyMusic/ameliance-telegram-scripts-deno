import { GoogleGenerativeAI } from 'npm:@google/generative-ai';

const GOOGLE_GEMINI_API = Deno.env.get('GOOGLE_GEMINI_API');

export async function sendPromptGemini(prompt: string) {
	if (!GOOGLE_GEMINI_API) throw new Error('GOOGLE_GEMINI_API is missing!');
	try {
		const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API);
		const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const text = response.text();
		return text;
	} catch (error) {
		console.error('Gemini API Error:', error);
		if (error instanceof Error) throw new Error(`Failed to generate content: ${error.message}`);
	}
}
