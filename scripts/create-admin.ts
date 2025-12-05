import { eq } from 'drizzle-orm'
import { db } from '../app/utils/db.server'
import { user } from '../database/schema'

/**
 * Script to create an admin user for testing
 * Usage: pnpm tsx scripts/create-admin.ts email@example.com
 */

async function createAdmin() {
	const email = process.argv[2]

	if (!email) {
		console.error('Error: Email address is required')
		console.log('Usage: pnpm tsx scripts/create-admin.ts email@example.com')
		process.exit(1)
	}

	// Check if user exists
	const existingUser = await db
		.select()
		.from(user)
		.where(eq(user.email, email))
		.limit(1)

	if (!existingUser || existingUser.length === 0) {
		console.error(`Error: User with email ${email} does not exist`)
		console.log('Please create the user first through normal signup')
		process.exit(1)
	}

	const foundUser = existingUser[0]

	// Update user to admin role
	await db
		.update(user)
		.set({
			role: 'admin',
			emailVerified: true, // Also verify email for convenience
		})
		.where(eq(user.id, foundUser.id))

	console.log(`✓ User ${email} (${foundUser.name}) is now an admin`)
	console.log(`  - User ID: ${foundUser.id}`)
	console.log(`  - Email verified: Yes`)
	console.log(`  - Role: admin`)

	process.exit(0)
}

createAdmin().catch((error) => {
	console.error('Error creating admin:', error)
	process.exit(1)
})
