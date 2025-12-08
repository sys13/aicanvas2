import { eq } from 'drizzle-orm'
import { db } from '~/utils/db.server'
import { deliverable, workflowStep } from '../../database/schema'
import type { Deliverable, NewDeliverable } from '../../database/schema'

export async function createDeliverable(data: NewDeliverable): Promise<Deliverable> {
	const [newDeliverable] = await db.insert(deliverable).values(data).returning()
	return newDeliverable
}

export async function getDeliverableById(id: string): Promise<Deliverable | undefined> {
	return await db.query.deliverable.findFirst({
		where: eq(deliverable.id, id),
	})
}

export async function getDeliverableWithSteps(id: string) {
	return await db.query.deliverable.findFirst({
		where: eq(deliverable.id, id),
		with: {
			workflowSteps: true,
		},
	})
}

export async function getDeliverablesByUserId(userId: string): Promise<Deliverable[]> {
	return await db.query.deliverable.findMany({
		where: eq(deliverable.userId, userId),
		orderBy: (deliverable, { desc }) => [desc(deliverable.createdAt)],
	})
}

export async function updateDeliverableStatus(
	id: string,
	status: 'draft' | 'in_progress' | 'completed' | 'failed',
): Promise<Deliverable> {
	const [updated] = await db
		.update(deliverable)
		.set({ status, updatedAt: new Date() })
		.where(eq(deliverable.id, id))
		.returning()
	return updated
}

export async function deleteDeliverable(id: string): Promise<void> {
	await db.delete(deliverable).where(eq(deliverable.id, id))
}
