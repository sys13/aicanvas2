import { Heading, Img, Section } from '@react-email/components'

interface EmailHeaderProps {
	companyName?: string
	logo?: string
	title: string
	subtitle?: string
}

export function EmailHeader({
	companyName = 'Max',
	logo,
	title,
	subtitle,
}: EmailHeaderProps) {
	return (
		<Section className="text-center mb-8">
			{logo && (
				<Img
					src={logo}
					alt={companyName}
					className="mx-auto mb-4"
					width="120"
					height="40"
				/>
			)}
			<Heading className="text-2xl font-bold text-gray-900 mb-2">
				{title}
			</Heading>
			{subtitle && (
				<p className="text-gray-600 text-lg leading-relaxed">{subtitle}</p>
			)}
		</Section>
	)
}
