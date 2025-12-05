import { Button, Link } from '@react-email/components'
import type { ReactNode } from 'react'

interface EmailButtonProps {
	href: string
	children: ReactNode
	variant?: 'primary' | 'secondary'
}

export function EmailButton({
	href,
	children,
	variant = 'primary',
}: EmailButtonProps) {
	const baseStyles =
		'inline-block px-6 py-3 rounded-lg font-semibold text-center text-decoration-none transition-colors'

	const variants = {
		primary:
			'bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-600',
		secondary:
			'bg-gray-100 text-gray-900 hover:bg-gray-200 border-2 border-gray-300',
	}

	return (
		<Button href={href} className={`${baseStyles} ${variants[variant]}`}>
			{children}
		</Button>
	)
}

interface EmailLinkProps {
	href: string
	children: ReactNode
	className?: string
}

export function EmailLink({ href, children, className = '' }: EmailLinkProps) {
	return (
		<Link
			href={href}
			className={`text-blue-600 hover:text-blue-700 underline ${className}`}
		>
			{children}
		</Link>
	)
}
