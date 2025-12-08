import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

export async function generateWithOpenAI(prompt: string): Promise<string> {
	const apiKey = process.env.OPENAI_API_KEY

	if (!apiKey) {
		throw new Error('OPENAI_API_KEY is not configured')
	}

	const { text } = await generateText({
		model: openai('gpt-4o-mini'),
		prompt,
	})

	return text
}
