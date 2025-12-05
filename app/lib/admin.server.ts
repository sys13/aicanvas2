import { redirect } from 'react-router'
import { db } from '~/utils/db.server'
import { auth } from './auth.server'

/**
 * Require admin role for a route
 * Returns the authenticated user if they are an admin
 * Throws a redirect to /login if not authenticated
 * Throws a redirect to / if authenticated but not an admin
 */
export async function requireAdmin(request: Request) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user) {
		throw redirect('/auth/signin')
	}

	// Get user with role
	const userWithRole = await db.query.user.findFirst({
		where: { id: session.user.id },
	})

	if (!userWithRole) {
		throw redirect('/auth/signin')
	}

	if (userWithRole.role !== 'admin') {
		throw redirect('/')
	}

	return userWithRole
}

/**
 * Check if current user is an admin
 * Returns the user if they are an admin, null otherwise
 */
export async function isAdmin(request: Request) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user) {
		return null
	}

	const userWithRole = await db.query.user.findFirst({
		where: { id: session.user.id },
	})

	if (!userWithRole || userWithRole.role !== 'admin') {
		return null
	}

	return userWithRole
}
