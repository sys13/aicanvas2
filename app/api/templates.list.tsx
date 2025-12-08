import type { LoaderFunctionArgs } from 'react-router'
import { getAllTemplates, getTemplatesByCategory } from '~/services/template.server'
import { auth } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user?.id) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const url = new URL(request.url)
		const category = url.searchParams.get('category')

		const templates = category
			? await getTemplatesByCategory(category)
			: await getAllTemplates()

		return Response.json({
			success: true,
			templates,
		})
	} catch (error) {
		console.error('Error fetching templates:', error)
		return Response.json({ error: 'Failed to fetch templates' }, { status: 500 })
	}
}
