import { z } from 'zod'

export const createProjectSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	status: z.enum(['planning', 'active', 'completed', 'archived']),
	priority: z.enum(['low', 'medium', 'high']),
	dueDate: z.date().optional(),
	budget: z.number().int().optional(),
})

export const updateProjectSchema = createProjectSchema.partial()

export type CreateProject = z.infer<typeof createProjectSchema>
export type UpdateProject = z.infer<typeof updateProjectSchema>
