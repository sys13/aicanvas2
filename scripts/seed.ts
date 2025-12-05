// #!/usr/bin/env tsx

// import { eq } from 'drizzle-orm'
// import { drizzle } from 'drizzle-orm/libsql'
// import { auth } from '../app/lib/auth.server'
// import {
// 	createDefaultDocumentation,
// 	createUsers,
// 	createDemoUser as factoryCreateDemoUser,
// 	setupFaker,
// 	type Database,
// } from '../database/factories'
// import { clearPlugins, registerPlugin, seedPlugins } from '../database/plugins'
// import { blogPlugin } from '../database/plugins/blog'
// import { saasMarketingPlugin } from '../database/plugins/saas-marketing'
// import { relations } from '../database/relations'
// import * as schema from '../database/schema'
// import { clearDatabase } from './reset-db'

// // Register available plugins
// registerPlugin(blogPlugin)
// registerPlugin(saasMarketingPlugin)

// // Configure which plugins to enable (can be controlled via environment variables)
// const ENABLED_PLUGINS = process.env.ENABLED_PLUGINS?.split(',') || []

// // Initialize database connection
// const db = drizzle({
// 	schema,
// 	relations,
// 	// biome-ignore lint/style/noNonNullAssertion: has a default value
// 	connection: { url: process.env.DB_FILE_NAME! },
// 	casing: 'snake_case',
// }) as Database

// /**
//  * Create or update demo user using Better Auth first, fallback to factory
//  */
// async function createDemoUser(): Promise<{
// 	id: string
// 	name: string
// 	email: string
// 	emailVerified: boolean
// 	image: string | null
// 	createdAt: Date
// 	updatedAt: Date
// }> {
// 	console.log('🔐 Creating demo user account with password...')

// 	// Check if demo user already exists
// 	const existingUsers = await db
// 		.select()
// 		.from(schema.user)
// 		.where(eq(schema.user.email, 'demo@demo.com'))
// 		.limit(1)

// 	if (existingUsers.length > 0) {
// 		console.log('Demo user already exists, skipping creation')
// 		return existingUsers[0]
// 	}

// 	try {
// 		const result = await auth.api.signUpEmail({
// 			body: {
// 				email: 'demo@demo.com',
// 				password: 'demo1234',
// 				name: 'Demo User',
// 			},
// 		})

// 		const demoUser = {
// 			id: result.user.id,
// 			name: result.user.name,
// 			email: result.user.email,
// 			emailVerified: result.user.emailVerified,
// 			image: result.user.image || null,
// 			createdAt: new Date(result.user.createdAt),
// 			updatedAt: new Date(result.user.updatedAt),
// 		}

// 		console.log('✅ Demo user created successfully via Better Auth')
// 		return demoUser
// 	} catch (_error) {
// 		console.warn(
// 			'⚠️ Failed to create demo user via Better Auth, creating fallback user',
// 		)

// 		// Use factory to create fallback demo user
// 		const createdUser = await factoryCreateDemoUser(db)
// 		console.log('✅ Fallback demo user created successfully')
// 		return createdUser
// 	}
// }

// /**
//  * Create sample organizations with members
//  */
// async function createOrganizations(
// 	users: Array<{ id: string; name: string; email: string }>,
// ): Promise<void> {
// 	console.log('🏢 Creating sample organizations...')

// 	const orgNames = [
// 		{ name: 'Acme Corp', slug: 'acme-corp' },
// 		{ name: 'TechStart Inc', slug: 'techstart' },
// 		{ name: 'Creative Studios', slug: 'creative-studios' },
// 	]

// 	for (const orgData of orgNames) {
// 		// Create organization
// 		const [org] = await db
// 			.insert(schema.organization)
// 			.values({
// 				name: orgData.name,
// 				slug: orgData.slug,
// 				metadata: JSON.stringify({ industry: 'Technology' }),
// 			})
// 			.returning()

// 		// Add random members to organization
// 		const memberCount = Math.floor(Math.random() * 5) + 2 // 2-6 members
// 		const selectedUsers = users.slice(0, memberCount)

// 		for (let i = 0; i < selectedUsers.length; i++) {
// 			const user = selectedUsers[i]
// 			const role = i === 0 ? 'owner' : i === 1 ? 'admin' : 'member'

// 			await db.insert(schema.member).values({
// 				organizationId: org.id,
// 				userId: user.id,
// 				role,
// 			})
// 		}

// 		console.log(
// 			`  ✓ Created "${orgData.name}" with ${selectedUsers.length} members`,
// 		)
// 	}
// }

// async function main() {
// 	console.log('🌱 Starting database seeding...')

// 	try {
// 		// Set a consistent seed for reproducible results
// 		setupFaker(12345)

// 		await clearDatabase()

// 		// Clear plugin data if any plugins are enabled
// 		if (ENABLED_PLUGINS.length > 0) {
// 			await clearPlugins(db, ENABLED_PLUGINS)
// 		}

// 		console.log('📊 Generating seed data...')

// 		// Create demo user first
// 		const demoUser = await createDemoUser()

// 		// Generate additional random users using factories
// 		console.log('👥 Creating additional users...')
// 		const users = await createUsers(db, 24)

// 		// Add demo user to users list for reporting
// 		const allUsers = [demoUser, ...users]

// 		// Generate Documentation Data using factories
// 		console.log('📚 Creating documentation structure...')
// 		const { sections, pages } = await createDefaultDocumentation(db)

// 		// Create sample organizations
// 		await createOrganizations(allUsers)

// 		// Seed plugins if any are enabled
// 		if (ENABLED_PLUGINS.length > 0) {
// 			console.log(`🔌 Seeding enabled plugins: ${ENABLED_PLUGINS.join(', ')}`)
// 			await seedPlugins(db, ENABLED_PLUGINS)
// 		}

// 		console.log('✅ Database seeding completed successfully!')
// 		console.log('📈 Generated:')
// 		console.log(`  - ${allUsers.length} users (including demo user)`)
// 		console.log(`  - 3 organizations with members`)
// 		console.log(`  - ${sections.length} documentation sections`)
// 		console.log(`  - ${pages.length} documentation pages`)
// 		if (ENABLED_PLUGINS.length > 0) {
// 			console.log(`  - ${ENABLED_PLUGINS.length} feature plugins seeded`)
// 		}
// 		console.log('')
// 		console.log('🎯 Demo User Credentials:')
// 		console.log('   Email: demo@demo.com')
// 		console.log('   Password: demo1234')
// 		if (ENABLED_PLUGINS.length > 0) {
// 			console.log('')
// 			console.log('🔌 Enabled Plugins:')
// 			for (const plugin of ENABLED_PLUGINS) {
// 				console.log(`   - ${plugin}`)
// 			}
// 		}
// 	} catch (error) {
// 		console.error('❌ Error during seeding:', error)
// 		process.exit(1)
// 	}
// }

// // Run the seed script
// if (import.meta.url === `file://${process.argv[1]}`) {
// 	main()
// 		.then(() => process.exit(0))
// 		.catch((error) => {
// 			console.error('Fatal error:', error)
// 			process.exit(1)
// 		})
// }

// export { main as seedDatabase }
