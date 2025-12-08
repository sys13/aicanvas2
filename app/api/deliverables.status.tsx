import type { LoaderFunctionArgs } from 'react-router'
import { json } from 'react-router'
import { getDeliverableWithSteps } from '~/services/deliverable.server'
import { getSession } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request)

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const url = new URL(request.url)
		const deliverableId = url.searchParams.get('id')

		if (!deliverableId) {
			return json({ error: 'Deliverable ID is required' }, { status: 400 })
		}

		// Get deliverable with workflow steps
		const deliverable = await getDeliverableWithSteps(deliverableId)

		if (!deliverable) {
			return json({ error: 'Deliverable not found' }, { status: 404 })
		}

		if (deliverable.userId !== session.user.id) {
			return json({ error: 'Unauthorized' }, { status: 403 })
		}

		return json({
			success: true,
			deliverable,
		})
	} catch (error) {
		console.error('Error fetching deliverable status:', error)
		return json({ error: 'Failed to fetch deliverable status' }, { status: 500 })
	}
}
