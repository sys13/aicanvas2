import { defineRelations } from 'drizzle-orm'
import * as schema from './schema'

export const relations = defineRelations(schema, (r) => ({
	user: {
		session: r.many.session({
			from: r.user.id,
			to: r.session.userId,
		}),
		account: r.many.account({
			from: r.user.id,
			to: r.account.userId,
		}),
		member: r.many.member({
			from: r.user.id,
			to: r.member.userId,
		}),
		invitation: r.many.invitation({
			from: r.user.id,
			to: r.invitation.inviterId,
		}),
		deliverable: r.many.deliverable({
			from: r.user.id,
			to: r.deliverable.userId,
		}),
	},
	session: {
		user: r.one.user({
			from: r.session.userId,
			to: r.user.id,
		}),
	},
	account: {
		user: r.one.user({
			from: r.account.userId,
			to: r.user.id,
		}),
	},
	organization: {
		members: r.many.member({
			from: r.organization.id,
			to: r.member.organizationId,
		}),
		invitations: r.many.invitation({
			from: r.organization.id,
			to: r.invitation.organizationId,
		}),
	},
	member: {
		organization: r.one.organization({
			from: r.member.organizationId,
			to: r.organization.id,
		}),
		user: r.one.user({
			from: r.member.userId,
			to: r.user.id,
		}),
	},
	invitation: {
		organization: r.one.organization({
			from: r.invitation.organizationId,
			to: r.organization.id,
		}),
		inviter: r.one.user({
			from: r.invitation.inviterId,
			to: r.user.id,
		}),
	},
	deliverable: {
		user: r.one.user({
			from: r.deliverable.userId,
			to: r.user.id,
		}),
		workflowSteps: r.many.workflowStep({
			from: r.deliverable.id,
			to: r.workflowStep.deliverableId,
		}),
	},
	workflowStep: {
		deliverable: r.one.deliverable({
			from: r.workflowStep.deliverableId,
			to: r.deliverable.id,
		}),
	},
}))
