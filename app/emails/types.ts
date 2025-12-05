import type { ReactElement } from 'react'

export interface EmailTemplate {
	name: string
	// biome-ignore lint/suspicious/noExplicitAny: template props vary between templates
	subject: (props: any) => string
	// biome-ignore lint/suspicious/noExplicitAny: template props vary between templates
	component: (props: any) => ReactElement
	description?: string
}

export interface EmailProps {
	to: string
	subject: string
	react?: ReactElement
	html?: string
	text?: string
}

export interface VerifyEmailProps {
	name?: string
	email: string
	verificationUrl: string
	companyName?: string
	supportEmail?: string
}

export interface PasswordResetProps {
	name?: string
	email: string
	resetUrl: string
	companyName?: string
	supportEmail?: string
}

export interface WelcomeEmailProps {
	name: string
	email: string
	companyName?: string
	dashboardUrl?: string
	supportEmail?: string
}

export interface NewsletterConfirmationProps {
	email: string
	confirmationUrl: string
	companyName?: string
	unsubscribeUrl?: string
}
