import { Hr, Link, Section, Text } from '@react-email/components'

interface EmailFooterProps {
	companyName?: string
	supportEmail?: string
	unsubscribeUrl?: string
	address?: string
	socialLinks?: Array<{ platform: string; url: string; label: string }>
}

export function EmailFooter({
	companyName: _companyName = 'Max',
	supportEmail,
	unsubscribeUrl,
	address,
	socialLinks = [],
}: EmailFooterProps) {
	return (
		<Section className="mt-8">
			<Hr className="border-gray-200 my-6" />
			<Text className="text-gray-500 text-sm leading-relaxed">
				Need help? Contact us at{' '}
				<Link
					href={`mailto:${supportEmail || 'support@example.com'}`}
					className="text-blue-600 underline"
				>
					{supportEmail || 'support@example.com'}
				</Link>
			</Text>

			{socialLinks.length > 0 && (
				<Section className="mt-4">
					<Text className="text-gray-500 text-sm mb-2">Follow us:</Text>
					<div className="flex gap-4">
						{socialLinks.map((link) => (
							<Link
								key={link.platform}
								href={link.url}
								className="text-blue-600 underline text-sm"
							>
								{link.label}
							</Link>
						))}
					</div>
				</Section>
			)}

			{address && <Text className="text-gray-400 text-xs mt-4">{address}</Text>}

			{unsubscribeUrl && (
				<Text className="text-gray-400 text-xs mt-2">
					<Link href={unsubscribeUrl} className="text-gray-400 underline">
						Unsubscribe from these emails
					</Link>
				</Text>
			)}
		</Section>
	)
}
