import {
	Body,
	Container,
	Head,
	Html,
	Preview,
	Section,
	Tailwind,
} from '@react-email/components'
import type { ReactNode } from 'react'

interface EmailLayoutProps {
	preview: string
	children: ReactNode
	companyName?: string
}

export function EmailLayout({
	preview,
	children,
	companyName = 'Max',
}: EmailLayoutProps) {
	return (
		<Html>
			<Head />
			<Preview>{preview}</Preview>
			<Tailwind>
				<Body className="bg-gray-50 font-sans">
					<Container className="mx-auto py-8 px-4 max-w-2xl">
						<Section className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
							{children}
						</Section>
						<Section className="mt-8 text-center">
							<p className="text-gray-500 text-sm">
								© {new Date().getFullYear()} {companyName}. All rights reserved.
							</p>
						</Section>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	)
}
