import type { ActionFunctionArgs } from 'react-router'
import { createDeliverable } from '~/services/deliverable.server'
import { initializeWorkflow } from '~/services/workflow.server'
import { auth } from '~/lib/auth.server'

export async function action({ request }: ActionFunctionArgs) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user?.id) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const formData = await request.formData()
		const name = formData.get('name') as string
		const description = formData.get('description') as string

		if (!name || !description) {
			return Response.json(
				{ error: 'Name and description are required' },
				{ status: 400 },
			)
		}

		// Create the deliverable
		const deliverable = await createDeliverable({
			userId: session.user.id,
			name,
			description,
			status: 'draft',
		})

		// Initialize workflow steps
		const workflowSteps = await initializeWorkflow(deliverable.id)

		return Response.json({
			success: true,
			deliverable,
			workflowSteps,
		})
	} catch (error) {
		console.error('Error creating deliverable:', error)
		return Response.json(
			{ error: 'Failed to create deliverable' },
			{ status: 500 },
		)
	}
}
