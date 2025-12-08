import { createId } from '@paralleldrive/cuid2'
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const timestamps = {
	createdAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
}

export const id = text()
	.primaryKey()
	.$defaultFn(() => createId())

export const user = sqliteTable('user', {
	id: text().primaryKey(),
	name: text().notNull(),
	email: text().notNull().unique(),
	emailVerified: integer({ mode: 'boolean' })
		.$defaultFn(() => false)
		.notNull(),
	image: text(),
	role: text().$type<'user' | 'admin'>().notNull().default('user'),
	suspended: integer({ mode: 'boolean' })
		.$defaultFn(() => false)
		.notNull(),
	createdAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
})

export const session = sqliteTable('session', {
	id: text().primaryKey(),
	expiresAt: integer({ mode: 'timestamp' }).notNull(),
	token: text().notNull().unique(),
	createdAt: integer({ mode: 'timestamp' }).notNull(),
	updatedAt: integer({ mode: 'timestamp' }).notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
})

export const account = sqliteTable('account', {
	id: text().primaryKey(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: integer({ mode: 'timestamp' }),
	refreshTokenExpiresAt: integer({ mode: 'timestamp' }),
	scope: text(),
	password: text(),
	createdAt: integer({ mode: 'timestamp' }).notNull(),
	updatedAt: integer({ mode: 'timestamp' }).notNull(),
})

export const verification = sqliteTable('verification', {
	id: text().primaryKey(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: integer({ mode: 'timestamp' }).notNull(),
	createdAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date()),
	updatedAt: integer({ mode: 'timestamp' }).$defaultFn(() => new Date()),
})

export const organization = sqliteTable('organization', {
	id: text()
		.primaryKey()
		.$defaultFn(() => createId()),
	name: text().notNull(),
	slug: text().unique(),
	logo: text(),
	metadata: text(), // JSON string for additional data
	createdAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
})

export type Organization = typeof organization.$inferSelect
export type NewOrganization = typeof organization.$inferInsert

export const member = sqliteTable('member', {
	id: text()
		.primaryKey()
		.$defaultFn(() => createId()),
	organizationId: text()
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	role: text().$type<'owner' | 'admin' | 'member'>().notNull(),
	createdAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
})

export type Member = typeof member.$inferSelect
export type NewMember = typeof member.$inferInsert

export const invitation = sqliteTable('invitation', {
	id: text()
		.primaryKey()
		.$defaultFn(() => createId()),
	organizationId: text()
		.notNull()
		.references(() => organization.id, { onDelete: 'cascade' }),
	email: text().notNull(),
	role: text().$type<'admin' | 'member'>().notNull(),
	status: text()
		.$type<'pending' | 'accepted' | 'rejected' | 'canceled'>()
		.notNull(),
	expiresAt: integer({ mode: 'timestamp' }).notNull(),
	inviterId: text()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	createdAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
	updatedAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
})

export type Invitation = typeof invitation.$inferSelect
export type NewInvitation = typeof invitation.$inferInsert

export const passkey = sqliteTable('passkey', {
	id: text().primaryKey(),
	name: text(),
	publicKey: text().notNull(),
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	credentialID: text().notNull().unique(),
	counter: integer().notNull(),
	deviceType: text().$type<'singleDevice' | 'multiDevice'>().notNull(),
	backedUp: integer({ mode: 'boolean' }).notNull(),
	transports: text(),
	aaguid: text(),
	createdAt: integer({ mode: 'timestamp' })
		.$defaultFn(() => new Date())
		.notNull(),
})

export type Passkey = typeof passkey.$inferSelect
export type NewPasskey = typeof passkey.$inferInsert

// Deliverable tables for Core Deliverable Engine MVP
export const deliverable = sqliteTable('deliverable', {
	id,
	userId: text()
		.notNull()
		.references(() => user.id, { onDelete: 'cascade' }),
	name: text().notNull(),
	description: text().notNull(),
	status: text()
		.$type<'draft' | 'in_progress' | 'completed' | 'failed'>()
		.notNull()
		.default('draft'),
	...timestamps,
})

export type Deliverable = typeof deliverable.$inferSelect
export type NewDeliverable = typeof deliverable.$inferInsert

export const workflowStep = sqliteTable('workflow_step', {
	id,
	deliverableId: text()
		.notNull()
		.references(() => deliverable.id, { onDelete: 'cascade' }),
	stepType: text()
		.$type<'ask' | 'gather' | 'reason' | 'produce' | 'revise'>()
		.notNull(),
	status: text()
		.$type<'pending' | 'in_progress' | 'completed' | 'failed'>()
		.notNull()
		.default('pending'),
	input: text(), // JSON string for step input data
	output: text(), // JSON string for step output data
	progressPercentage: integer().notNull().default(0),
	...timestamps,
})

export type WorkflowStep = typeof workflowStep.$inferSelect
export type NewWorkflowStep = typeof workflowStep.$inferInsert

export const template = sqliteTable('template', {
	id,
	name: text().notNull(),
	content: text().notNull(),
	category: text().notNull(),
	...timestamps,
})

export type Template = typeof template.$inferSelect
export type NewTemplate = typeof template.$inferInsert
