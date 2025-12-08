import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

// Validate API key at module load time
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
	console.warn('Warning: OPENAI_API_KEY is not configured')
}

export async function generateWithOpenAI(prompt: string): Promise<string> {
	if (!OPENAI_API_KEY) {
		throw new Error('OPENAI_API_KEY is not configured')
	}

	const { text } = await generateText({
		model: openai('gpt-4o-mini'),
		prompt,
	})

	return text
}
