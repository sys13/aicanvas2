import { Section, Text } from '@react-email/components'
import { EmailButton } from '../components/button'
import { EmailFooter } from '../components/footer'
import { EmailHeader } from '../components/header'
import { EmailLayout } from '../components/layout'
import type { PasswordResetProps } from '../types'

export function PasswordResetTemplate({
	name,
	email,
	resetUrl,
	companyName = 'Max',
	supportEmail,
}: PasswordResetProps) {
	const preview = `Reset your ${companyName} password`

	return (
		<EmailLayout preview={preview} companyName={companyName}>
			<EmailHeader
				companyName={companyName}
				title="Reset Your Password"
				subtitle="We received a request to reset your password"
			/>

			<Section className="mb-8">
				<Text className="text-gray-700 text-base leading-relaxed mb-4">
					{name ? `Hi ${name}` : 'Hello'},
				</Text>
				<Text className="text-gray-700 text-base leading-relaxed mb-4">
					We received a request to reset the password for your {companyName}{' '}
					account ({email}).
				</Text>
				<Text className="text-gray-700 text-base leading-relaxed mb-6">
					Click the button below to choose a new password:
				</Text>

				<Section className="text-center mb-6">
					<EmailButton href={resetUrl}>Reset Password</EmailButton>
				</Section>

				<Text className="text-gray-600 text-sm leading-relaxed mb-4">
					This password reset link will expire in 1 hour for security reasons.
				</Text>

				<Text className="text-gray-600 text-sm leading-relaxed mb-4">
					If you didn't request a password reset, you can safely ignore this
					email. Your password will remain unchanged.
				</Text>

				<Text className="text-gray-600 text-sm leading-relaxed">
					For security reasons, this link can only be used once. If you need to
					reset your password again, please request a new reset link.
				</Text>
			</Section>

			<EmailFooter companyName={companyName} supportEmail={supportEmail} />
		</EmailLayout>
	)
}

export const passwordResetSubject = (props: PasswordResetProps) =>
	`Reset your ${props.companyName || 'Max'} password`
