import { Section, Text } from '@react-email/components'
import { EmailButton } from '../components/button'
import { EmailFooter } from '../components/footer'
import { EmailHeader } from '../components/header'
import { EmailLayout } from '../components/layout'
import type { NewsletterConfirmationProps } from '../types'

export function NewsletterConfirmationTemplate({
	email: _email,
	confirmationUrl,
	companyName = 'Max',
	unsubscribeUrl,
}: NewsletterConfirmationProps) {
	const preview = `Confirm your ${companyName} newsletter subscription`

	return (
		<EmailLayout preview={preview} companyName={companyName}>
			<EmailHeader
				companyName={companyName}
				title="Confirm Your Subscription"
				subtitle="You're one step away from staying updated"
			/>

			<Section className="mb-8">
				<Text className="text-gray-700 text-base leading-relaxed mb-4">
					Hello,
				</Text>
				<Text className="text-gray-700 text-base leading-relaxed mb-4">
					Thanks for subscribing to the {companyName} newsletter! We're excited
					to keep you updated with our latest news, features, and insights.
				</Text>
				<Text className="text-gray-700 text-base leading-relaxed mb-6">
					To complete your subscription and start receiving our newsletter,
					please click the confirmation button below:
				</Text>

				<Section className="text-center mb-6">
					<EmailButton href={confirmationUrl}>Confirm Subscription</EmailButton>
				</Section>

				<Section className="bg-blue-50 rounded-lg p-6 mb-6">
					<Text className="text-blue-800 font-semibold text-base mb-3">
						What to Expect
					</Text>
					<Text className="text-blue-700 text-sm leading-relaxed mb-2">
						📰 Weekly updates on new features and improvements
					</Text>
					<Text className="text-blue-700 text-sm leading-relaxed mb-2">
						💡 Tips and best practices from our team
					</Text>
					<Text className="text-blue-700 text-sm leading-relaxed mb-2">
						🎉 Exclusive content and early access to new features
					</Text>
					<Text className="text-blue-700 text-sm leading-relaxed">
						📊 Industry insights and trends
					</Text>
				</Section>

				<Text className="text-gray-600 text-sm leading-relaxed mb-4">
					This confirmation link will expire in 24 hours.
				</Text>

				<Text className="text-gray-600 text-sm leading-relaxed">
					If you didn't subscribe to our newsletter, you can safely ignore this
					email.
				</Text>
			</Section>

			<EmailFooter
				companyName={companyName}
				supportEmail="newsletter@example.com"
				unsubscribeUrl={unsubscribeUrl}
			/>
		</EmailLayout>
	)
}

export const newsletterConfirmationSubject = (
	props: NewsletterConfirmationProps,
) => `Confirm your ${props.companyName || 'Max'} newsletter subscription`
