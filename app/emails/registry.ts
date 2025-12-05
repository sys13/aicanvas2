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
import type { EmailTemplate } from './types'

// Default email templates registry
const defaultTemplates: Record<string, EmailTemplate> = {
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

// Registry for custom/override templates
const customTemplates: Record<string, EmailTemplate> = {}

/**
 * Email Template Registry
 *
 * Provides a centralized way to manage and override email templates.
 * Custom templates will override default templates with the same name.
 */
// biome-ignore lint/complexity/noStaticOnlyClass: intentionally a static-only registry
export class EmailRegistry {
	/**
	 * Register a custom email template or override an existing one
	 */
	static register(template: EmailTemplate): void {
		customTemplates[template.name] = template
	}

	/**
	 * Get an email template by name
	 * Custom templates take precedence over default templates
	 */
	static get(name: string): EmailTemplate | undefined {
		return customTemplates[name] || defaultTemplates[name]
	}

	/**
	 * Get all available email templates
	 */
	static getAll(): Record<string, EmailTemplate> {
		return { ...defaultTemplates, ...customTemplates }
	}

	/**
	 * Check if a template exists
	 */
	static has(name: string): boolean {
		return !!(customTemplates[name] || defaultTemplates[name])
	}

	/**
	 * Remove a custom template (reverts to default if exists)
	 */
	static remove(name: string): boolean {
		if (customTemplates[name]) {
			delete customTemplates[name]
			return true
		}
		return false
	}

	/**
	 * Get template names
	 */
	static getTemplateNames(): string[] {
		const allTemplates = EmailRegistry.getAll()
		return Object.keys(allTemplates)
	}
}

// Convenience functions for common templates
export const getVerifyEmailTemplate = () => {
	const t = EmailRegistry.get('verify-email')
	if (!t) throw new Error("Email template 'verify-email' not found")
	return t
}
export const getPasswordResetTemplate = () => {
	const t = EmailRegistry.get('password-reset')
	if (!t) throw new Error("Email template 'password-reset' not found")
	return t
}
export const getWelcomeEmailTemplate = () => {
	const t = EmailRegistry.get('welcome')
	if (!t) throw new Error("Email template 'welcome' not found")
	return t
}
export const getNewsletterConfirmationTemplate = () => {
	const t = EmailRegistry.get('newsletter-confirmation')
	if (!t) throw new Error("Email template 'newsletter-confirmation' not found")
	return t
}

// Export individual templates for direct use
export {
	VerifyEmailTemplate,
	PasswordResetTemplate,
	WelcomeEmailTemplate,
	NewsletterConfirmationTemplate,
}

// Export template subjects for direct use
export {
	verifyEmailSubject,
	passwordResetSubject,
	welcomeEmailSubject,
	newsletterConfirmationSubject,
}
