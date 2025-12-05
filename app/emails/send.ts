import { sendEmail } from '~/lib/email.server'
import { EmailRegistry } from './registry'

/**
 * Send an email using a registered template
 */
export async function sendTemplateEmail(
	templateName: string,
	to: string,
	// biome-ignore lint/suspicious/noExplicitAny: templateProps are passed-through to react email components
	templateProps: any,
	options?: {
		companyName?: string
		supportEmail?: string
		from?: string
	},
) {
	const template = EmailRegistry.get(templateName)
	if (!template) {
		throw new Error(`Email template '${templateName}' not found`)
	}

	const subject = template.subject(templateProps)
	const react = template.component(templateProps)

	return sendEmail({
		to,
		subject,
		react,
		...options,
	})
}

/**
 * Convenience functions for common email types
 */
export async function sendVerificationEmail(
	email: string,
	verificationUrl: string,
	options?: {
		name?: string
		companyName?: string
		supportEmail?: string
	},
) {
	return sendTemplateEmail('verify-email', email, {
		email,
		verificationUrl,
		...options,
	})
}

export async function sendPasswordResetEmail(
	email: string,
	resetUrl: string,
	options?: {
		name?: string
		companyName?: string
		supportEmail?: string
	},
) {
	return sendTemplateEmail('password-reset', email, {
		email,
		resetUrl,
		...options,
	})
}

export async function sendWelcomeEmail(
	email: string,
	name: string,
	options?: {
		companyName?: string
		dashboardUrl?: string
		supportEmail?: string
	},
) {
	return sendTemplateEmail('welcome', email, {
		email,
		name,
		...options,
	})
}

export async function sendNewsletterConfirmationEmail(
	email: string,
	confirmationUrl: string,
	options?: {
		companyName?: string
		unsubscribeUrl?: string
	},
) {
	return sendTemplateEmail('newsletter-confirmation', email, {
		email,
		confirmationUrl,
		...options,
	})
}
