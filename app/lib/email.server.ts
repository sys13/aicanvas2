import { render } from '@react-email/components'
import mconfig from 'mconfig'
import nodemailer from 'nodemailer'
import type { ReactElement } from 'react'
import { z } from 'zod'

const emailErrorSchema = z.union([
	z.object({
		name: z.string(),
		message: z.string(),
		statusCode: z.number(),
	}),
	z.object({
		name: z.literal('UnknownError'),
		message: z.literal('Unknown Error'),
		statusCode: z.literal(500),
		cause: z.any(),
	}),
])
type EmailError = z.infer<typeof emailErrorSchema>

const _emailSuccessSchema = z.object({
	id: z.string(),
})

// Create Nodemailer transporter
function createTransporter() {
	if (process.env.MOCKS) {
		// In mocks mode, use a test transporter that doesn't actually send emails
		return nodemailer.createTransport({
			streamTransport: true,
			newline: 'unix',
			buffer: true,
		})
	}

	// Production SMTP configuration
	// biome-ignore lint/suspicious/noExplicitAny: nodemailer config is dynamic and environment dependent
	const config: any = {
		host: process.env.SMTP_HOST || 'localhost',
		port: Number(process.env.SMTP_PORT) || 587,
		secure: process.env.SMTP_SECURE === 'true',
	}

	if (process.env.SMTP_USER && process.env.SMTP_PASS) {
		config.auth = {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		}
	}

	return nodemailer.createTransport(config)
}

export async function sendEmail({
	react,
	...options
}: {
	to: string
	subject: string
} & (
	| { html: string; text: string; react?: never }
	| { react: ReactElement; html?: never; text?: never }
)) {
	const from =
		process.env.FROM_EMAIL ??
		`info@${('domainName' in mconfig && mconfig.domainName) ?? 'example.com'}`

	const email = {
		from,
		...options,
		...(react ? await renderReactEmail(react) : null),
	}

	// In development without SMTP config and not in mocks mode, just log
	if (!process.env.SMTP_HOST && !process.env.MOCKS) {
		console.error(`SMTP_HOST not set and we're not in mocks mode.`)
		console.error(
			`To send emails, set SMTP_HOST and other SMTP environment variables.`,
		)
		console.error(`Would have sent the following email:`, JSON.stringify(email))
		return {
			status: 'success',
			data: { id: 'logged' },
		} as const
	}

	try {
		const transporter = createTransporter()

		// In mocks mode, log the email to console
		if (process.env.MOCKS) {
			console.info(
				'📧 Nodemailer mocked email contents:',
				JSON.stringify(email, null, 2),
			)

			// Also write to fixtures for testing
			try {
				const { writeEmail: writeEmailFixture } = await import(
					'../../mocks/utils'
				)
				await writeEmailFixture(email)
			} catch (error) {
				console.warn('Could not write email fixture:', error)
			}
		}

		// biome-ignore lint/suspicious/noExplicitAny: unneeded
		const info = await (transporter as any).sendMail(email)

		// For stream transport (mocks), the result will be different
		if (process.env.MOCKS && info.message) {
			console.info('📧 Mock email "sent" successfully')
		}

		return {
			status: 'success',
			data: { id: info.messageId || `mock-${Date.now()}` },
		} as const
	} catch (error) {
		console.error('Failed to send email:', error)

		const emailError: EmailError = {
			name: 'EmailSendError',
			message:
				error instanceof Error ? error.message : 'Unknown error occurred',
			statusCode: 500,
		}

		return {
			status: 'error',
			error: emailError,
		} as const
	}
}

async function renderReactEmail(react: ReactElement) {
	const [html, text] = await Promise.all([
		render(react),
		render(react, { plainText: true }),
	])
	return { html, text }
}
