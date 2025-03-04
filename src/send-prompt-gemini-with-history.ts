import {
	Content,
	GoogleGenerativeAI,
	HarmBlockThreshold,
	HarmCategory,
} from 'npm:@google/generative-ai';

const GOOGLE_GEMINI_API = Deno.env.get('GOOGLE_GEMINI_API');

const genAI = new GoogleGenerativeAI(GOOGLE_GEMINI_API);

// model: 'gemini-2.0-pro-exp-02-05',
const model = genAI.getGenerativeModel({
	model: 'gemini-2.0-flash',
});

const generationConfig = {
	temperature: 1,
	topP: 0.95,
	topK: 64,
	maxOutputTokens: 8192,
	responseMimeType: 'text/plain',
};

export async function sendPromptGeminiWithHistory(prompt: string, history: Content[] = []) {
	const tempHistory = [...history];
	if (!GOOGLE_GEMINI_API) throw new Error('GOOGLE_GEMINI_API is missing!');

	const chatSession = model.startChat({
		generationConfig,
		history: tempHistory,
	});
	const result = await chatSession.sendMessage(prompt);
	const response = await result.response;
	const answer = response.text();
	return {
		answer,
		history: tempHistory,
	};
}
