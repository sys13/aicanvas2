import type { ActionFunctionArgs } from 'react-router'
import { json } from 'react-router'
import { getDeliverableById } from '~/services/deliverable.server'
import { executeFullWorkflow } from '~/services/workflow.server'
import { getSession } from '~/lib/auth.server'

export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request)

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const formData = await request.formData()
		const deliverableId = formData.get('deliverableId') as string

		if (!deliverableId) {
			return json({ error: 'Deliverable ID is required' }, { status: 400 })
		}

		// Verify the deliverable belongs to the user
		const deliverable = await getDeliverableById(deliverableId)

		if (!deliverable) {
			return json({ error: 'Deliverable not found' }, { status: 404 })
		}

		if (deliverable.userId !== session.user.id) {
			return json({ error: 'Unauthorized' }, { status: 403 })
		}

		// Execute the workflow (this will run asynchronously)
		// In a production system, you'd want to use a background job queue
		executeFullWorkflow(deliverableId).catch((error) => {
			console.error('Workflow execution error:', error)
		})

		return json({
			success: true,
			message: 'Workflow execution started',
		})
	} catch (error) {
		console.error('Error starting workflow:', error)
		return json({ error: 'Failed to start workflow execution' }, { status: 500 })
	}
}
