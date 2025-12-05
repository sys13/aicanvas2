'use client'
import { type LibraryBindings, LibraryProvider } from 'maxstack-core'
import React from 'react'
import { useNavigate } from 'react-router'
import { authClient } from '~/lib/auth-client'

export function LibraryBindingsBridge(props: React.PropsWithChildren) {
	const { data: session } = authClient.useSession()
	const navigate = useNavigate()

	// All DI values are plain values/functions created _inside render_.
	const value = React.useMemo<LibraryBindings>(
		() => ({
			user: session?.user
				? { id: session.user.id, email: session.user.email }
				: null,
			signIn: async () => {
				// Navigate to sign in page
				navigate('/login')
			},
			signOut: async () => {
				await authClient.signOut()
			},
			navigate: (to: string) => navigate(to),
			hasFlag: () => false, // Simple implementation for now
			authClient: authClient, // Provide the auth client for auth pages
		}),
		[session, navigate],
	)

	return <LibraryProvider value={value}>{props.children}</LibraryProvider>
}
