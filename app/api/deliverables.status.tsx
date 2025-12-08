import type { LoaderFunctionArgs } from 'react-router'
import { getDeliverableWithSteps } from '~/services/deliverable.server'
import { auth } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user?.id) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const url = new URL(request.url)
		const deliverableId = url.searchParams.get('id')

		if (!deliverableId) {
			return Response.json(
				{ error: 'Deliverable ID is required' },
				{ status: 400 },
			)
		}

		// Get deliverable with workflow steps
		const deliverable = await getDeliverableWithSteps(deliverableId)

		if (!deliverable) {
			return Response.json({ error: 'Deliverable not found' }, { status: 404 })
		}

		if (deliverable.userId !== session.user.id) {
			return Response.json({ error: 'Unauthorized' }, { status: 403 })
		}

		return Response.json({
			success: true,
			deliverable,
		})
	} catch (error) {
		console.error('Error fetching deliverable status:', error)
		return Response.json(
			{ error: 'Failed to fetch deliverable status' },
			{ status: 500 },
		)
	}
}
