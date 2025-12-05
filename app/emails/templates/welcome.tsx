import { Section, Text } from '@react-email/components'
import { EmailButton } from '../components/button'
import { EmailFooter } from '../components/footer'
import { EmailHeader } from '../components/header'
import { EmailLayout } from '../components/layout'
import type { WelcomeEmailProps } from '../types'

export function WelcomeEmailTemplate({
	name,
	email: _email,
	companyName = 'Max',
	dashboardUrl,
	supportEmail,
}: WelcomeEmailProps) {
	const preview = `Welcome to ${companyName}! Your account is ready.`

	return (
		<EmailLayout preview={preview} companyName={companyName}>
			<EmailHeader
				companyName={companyName}
				title={`Welcome to ${companyName}!`}
				subtitle="Your account is now active and ready to use"
			/>

			<Section className="mb-8">
				<Text className="text-gray-700 text-base leading-relaxed mb-4">
					Hi {name},
				</Text>
				<Text className="text-gray-700 text-base leading-relaxed mb-4">
					Welcome to {companyName}! 🎉 Your email address has been verified and
					your account is now active.
				</Text>
				<Text className="text-gray-700 text-base leading-relaxed mb-6">
					You can now start exploring all the features and benefits that{' '}
					{companyName} has to offer.
				</Text>

				{dashboardUrl && (
					<Section className="text-center mb-6">
						<EmailButton href={dashboardUrl}>Go to Dashboard</EmailButton>
					</Section>
				)}

				<Section className="bg-gray-50 rounded-lg p-6 mb-6">
					<Text className="text-gray-800 font-semibold text-base mb-3">
						What's Next?
					</Text>
					<Text className="text-gray-700 text-sm leading-relaxed mb-2">
						• Complete your profile setup
					</Text>
					<Text className="text-gray-700 text-sm leading-relaxed mb-2">
						• Explore our features and tools
					</Text>
					<Text className="text-gray-700 text-sm leading-relaxed mb-2">
						• Join our community and connect with others
					</Text>
					<Text className="text-gray-700 text-sm leading-relaxed">
						• Check out our getting started guide
					</Text>
				</Section>

				<Text className="text-gray-600 text-sm leading-relaxed">
					If you have any questions or need help getting started, don't hesitate
					to reach out to our support team.
				</Text>
			</Section>

			<EmailFooter companyName={companyName} supportEmail={supportEmail} />
		</EmailLayout>
	)
}

export const welcomeEmailSubject = (props: WelcomeEmailProps) =>
	`Welcome to ${props.companyName || 'Max'}! Your account is ready.`
