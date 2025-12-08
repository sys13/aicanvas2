import type { LoaderFunctionArgs } from 'react-router'
import { getDeliverablesByUserId } from '~/services/deliverable.server'
import { auth } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user?.id) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const deliverables = await getDeliverablesByUserId(session.user.id)

		return Response.json({
			success: true,
			deliverables,
		})
	} catch (error) {
		console.error('Error fetching deliverables:', error)
		return Response.json(
			{ error: 'Failed to fetch deliverables' },
			{ status: 500 },
		)
	}
}
