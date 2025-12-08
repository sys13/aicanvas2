import { eq } from 'drizzle-orm'
import { db } from '~/utils/db.server'
import { template } from '../../database/schema'
import type { Template, NewTemplate } from '../../database/schema'

export async function createTemplate(data: NewTemplate): Promise<Template> {
	const [newTemplate] = await db.insert(template).values(data).returning()
	return newTemplate
}

export async function getTemplateById(id: string): Promise<Template | undefined> {
	return await db.query.template.findFirst({
		where: eq(template.id, id),
	})
}

export async function getAllTemplates(): Promise<Template[]> {
	return await db.query.template.findMany({
		orderBy: (template, { desc }) => [desc(template.createdAt)],
	})
}

export async function getTemplatesByCategory(category: string): Promise<Template[]> {
	return await db.query.template.findMany({
		where: eq(template.category, category),
		orderBy: (template, { desc }) => [desc(template.createdAt)],
	})
}

export async function updateTemplate(
	id: string,
	data: Partial<Pick<Template, 'name' | 'content' | 'category'>>,
): Promise<Template> {
	const [updated] = await db
		.update(template)
		.set({ ...data, updatedAt: new Date() })
		.where(eq(template.id, id))
		.returning()
	return updated
}

export async function deleteTemplate(id: string): Promise<void> {
	await db.delete(template).where(eq(template.id, id))
}
