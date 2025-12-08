import type { LoaderFunctionArgs } from 'react-router'
import { json } from 'react-router'
import { getDeliverablesByUserId } from '~/services/deliverable.server'
import { getSession } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request)

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const deliverables = await getDeliverablesByUserId(session.user.id)

		return json({
			success: true,
			deliverables,
		})
	} catch (error) {
		console.error('Error fetching deliverables:', error)
		return json({ error: 'Failed to fetch deliverables' }, { status: 500 })
	}
}
