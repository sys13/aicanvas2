import { Section, Text } from '@react-email/components'
import { EmailButton } from '../components/button'
import { EmailFooter } from '../components/footer'
import { EmailHeader } from '../components/header'
import { EmailLayout } from '../components/layout'
import type { VerifyEmailProps } from '../types'

export function VerifyEmailTemplate({
	name,
	email: _email,
	verificationUrl,
	companyName = 'Max',
	supportEmail,
}: VerifyEmailProps) {
	const preview = `Verify your email address for ${companyName}`

	return (
		<EmailLayout preview={preview} companyName={companyName}>
			<EmailHeader
				companyName={companyName}
				title="Welcome to Max!"
				subtitle="Please verify your email address to get started"
			/>

			<Section className="mb-8">
				<Text className="text-gray-700 text-base leading-relaxed mb-4">
					{name ? `Hi ${name}` : 'Hello'},
				</Text>
				<Text className="text-gray-700 text-base leading-relaxed mb-4">
					Thanks for signing up for {companyName}! We're excited to have you on
					board.
				</Text>
				<Text className="text-gray-700 text-base leading-relaxed mb-6">
					To complete your registration and secure your account, please verify
					your email address by clicking the button below:
				</Text>

				<Section className="text-center mb-6">
					<EmailButton href={verificationUrl}>Verify Email Address</EmailButton>
				</Section>

				<Text className="text-gray-600 text-sm leading-relaxed mb-4">
					This verification link will expire in 24 hours for security reasons.
				</Text>

				<Text className="text-gray-600 text-sm leading-relaxed">
					If you didn't create an account with {companyName}, you can safely
					ignore this email.
				</Text>
			</Section>

			<EmailFooter companyName={companyName} supportEmail={supportEmail} />
		</EmailLayout>
	)
}

export const verifyEmailSubject = (props: VerifyEmailProps) =>
	`Verify your email address for ${props.companyName || 'Max'}`
