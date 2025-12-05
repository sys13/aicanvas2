import { render } from '@react-email/components'
import {
	NewsletterConfirmationTemplate,
	newsletterConfirmationSubject,
} from './templates/newsletter-confirmation'
import {
	PasswordResetTemplate,
	passwordResetSubject,
} from './templates/password-reset'
import {
	VerifyEmailTemplate,
	verifyEmailSubject,
} from './templates/verify-email'
import { WelcomeEmailTemplate, welcomeEmailSubject } from './templates/welcome'

/**
 * Email Preview System
 *
 * Provides utilities for previewing email templates during development
 */

export interface EmailPreviewData {
	name: string
	description?: string
	html: string
	text: string
	subject: string
	// biome-ignore lint/suspicious/noExplicitAny: sample data shape varies per template
	sampleData: any
}

// Direct template mapping to avoid registry dependencies
const templates = {
	'verify-email': {
		name: 'verify-email',
		subject: verifyEmailSubject,
		component: VerifyEmailTemplate,
		description: 'Email verification template for new user accounts',
	},
	'password-reset': {
		name: 'password-reset',
		subject: passwordResetSubject,
		component: PasswordResetTemplate,
		description: 'Password reset template for existing users',
	},
	welcome: {
		name: 'welcome',
		subject: welcomeEmailSubject,
		component: WelcomeEmailTemplate,
		description: 'Welcome email template for verified users',
	},
	'newsletter-confirmation': {
		name: 'newsletter-confirmation',
		subject: newsletterConfirmationSubject,
		component: NewsletterConfirmationTemplate,
		description: 'Newsletter subscription confirmation template',
	},
}

/**
 * Generate preview data for all email templates
 */
export async function generateEmailPreviews(): Promise<EmailPreviewData[]> {
	const previews: EmailPreviewData[] = []

	for (const [name, template] of Object.entries(templates)) {
		const sampleData = getSampleData(name)
		const subject = template.subject(sampleData)
		const component = template.component(sampleData)

		const [html, text] = await Promise.all([
			render(component),
			render(component, { plainText: true }),
		])

		previews.push({
			name,
			description: template.description,
			html,
			text,
			subject,
			sampleData,
		})
	}

	return previews
}

/**
 * Generate preview data for a specific email template
 */
export async function generateEmailPreview(
	templateName: string,
): Promise<EmailPreviewData | null> {
	const template = templates[templateName as keyof typeof templates]
	if (!template) {
		return null
	}

	const sampleData = getSampleData(templateName)
	const subject = template.subject(sampleData)
	const component = template.component(sampleData)

	const [html, text] = await Promise.all([
		render(component),
		render(component, { plainText: true }),
	])

	return {
		name: templateName,
		description: template.description,
		html,
		text,
		subject,
		sampleData,
	}
}

/**
 * Get sample data for email templates
 */
// biome-ignore lint/suspicious/noExplicitAny: sample data shape varies per template
function getSampleData(templateName: string): any {
	const baseSampleData = {
		companyName: 'Max',
		supportEmail: 'support@example.com',
	}

	switch (templateName) {
		case 'verify-email':
			return {
				...baseSampleData,
				name: 'John Doe',
				email: 'john.doe@example.com',
				verificationUrl: 'https://example.com/verify-email?token=sample-token',
			}

		case 'password-reset':
			return {
				...baseSampleData,
				name: 'Jane Smith',
				email: 'jane.smith@example.com',
				resetUrl: 'https://example.com/reset-password?token=sample-token',
			}

		case 'welcome':
			return {
				...baseSampleData,
				name: 'Alex Johnson',
				email: 'alex.johnson@example.com',
				dashboardUrl: 'https://example.com/dashboard',
			}

		case 'newsletter-confirmation':
			return {
				...baseSampleData,
				email: 'subscriber@example.com',
				confirmationUrl:
					'https://example.com/confirm-newsletter?token=sample-token',
				unsubscribeUrl: 'https://example.com/unsubscribe?token=sample-token',
			}

		default:
			return baseSampleData
	}
}
