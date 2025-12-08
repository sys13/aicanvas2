import type { ActionFunctionArgs } from 'react-router'
import { json } from 'react-router'
import { createDeliverable } from '~/services/deliverable.server'
import { initializeWorkflow } from '~/services/workflow.server'
import { getSession } from '~/lib/auth.server'

export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request)

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const formData = await request.formData()
		const name = formData.get('name') as string
		const description = formData.get('description') as string

		if (!name || !description) {
			return json({ error: 'Name and description are required' }, { status: 400 })
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

		return json({
			success: true,
			deliverable,
			workflowSteps,
		})
	} catch (error) {
		console.error('Error creating deliverable:', error)
		return json({ error: 'Failed to create deliverable' }, { status: 500 })
	}
}
