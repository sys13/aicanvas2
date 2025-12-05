#!/usr/bin/env tsx

import { drizzle } from 'drizzle-orm/libsql'
import { relations } from '../database/relations'
import * as schema from '../database/schema'

// Initialize database connection
const db = drizzle({
	schema,
	relations,
	// biome-ignore lint/style/noNonNullAssertion: has a default value
	connection: { url: process.env.DB_FILE_NAME! },
	casing: 'snake_case',
})

/**
 * Clear all data from the database in the correct order to avoid foreign key constraints
 */
async function clearDatabase(): Promise<void> {
	console.log('🗑️ Clearing all database tables...')

	try {
		// Delete in reverse dependency order to avoid foreign key constraints
		await db.delete(schema.verification)
		await db.delete(schema.account)
		await db.delete(schema.session)
		await db.delete(schema.user)

		console.log('✅ Database cleared successfully')
	} catch (error) {
		console.error('❌ Error clearing database:', error)
		throw error
	}
}

/**
 * Reset the database to a clean state
 */
async function resetDatabase(): Promise<void> {
	console.log('🔄 Resetting database...')

	try {
		await clearDatabase()
		console.log('✅ Database reset completed successfully!')
		console.log('')
		console.log('💡 To populate with seed data, run:')
		console.log('   pnpm run db:seed')
	} catch (error) {
		console.error('❌ Error during database reset:', error)
		process.exit(1)
	}
}

// Run the reset script
if (import.meta.url === `file://${process.argv[1]}`) {
	resetDatabase()
		.then(() => process.exit(0))
		.catch((error) => {
			console.error('Fatal error:', error)
			process.exit(1)
		})
}

export { clearDatabase, resetDatabase }
