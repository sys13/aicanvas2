import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { organization } from 'better-auth/plugins'
import { sendPasswordResetEmail, sendVerificationEmail } from '~/emails/send'
import { db } from '~/utils/db.server'
import * as schema from '../../database/schema'

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'sqlite',
		schema,
	}),
	emailAndPassword: {
		enabled: true,
		autoSignInAfterVerification: true,
		requireEmailVerification: true,
		sendOnSignUp: true,
		sendResetPassword: async ({ user, url }) => {
			await sendPasswordResetEmail(user.email, url, {
				name: user.name,
				companyName: 'Max',
				supportEmail: 'support@example.com',
			})
		},
	},
	emailVerification: {
		sendVerificationEmail: async ({ user, url }) => {
			await sendVerificationEmail(user.email, url, {
				name: user.name,
				companyName: 'Max',
				supportEmail: 'support@example.com',
			})
		},
	},
	socialProviders: {
		// github: github({
		// 	clientId: process.env.GITHUB_CLIENT_ID || '',
		// 	clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
		// 	enabled: !!(
		// 		process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
		// 	),
		// }),
		// discord: discord({
		// 	clientId: process.env.DISCORD_CLIENT_ID || '',
		// 	clientSecret: process.env.DISCORD_CLIENT_SECRET || '',
		// 	enabled: !!(
		// 		process.env.DISCORD_CLIENT_ID && process.env.DISCORD_CLIENT_SECRET
		// 	),
		// }),
	},
	plugins: [
		organization({
			allowUserToCreateOrganization: true,
			organizationLimit: 5,
			allowUserToChangeName: true,
			allowUserToDeleteOrganization: true,
		}),
		// passkey({
		// 	rpID: process.env.PASSKEY_RP_ID || 'localhost',
		// 	rpName: process.env.PASSKEY_RP_NAME || 'Max',
		// 	origin:
		// 		process.env.NODE_ENV === 'production'
		// 			? process.env.PASSKEY_ORIGIN
		// 			: ['http://localhost:5173', 'http://localhost'],
		// }),
	],
})
