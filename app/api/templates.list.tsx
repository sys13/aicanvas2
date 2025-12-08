import type { LoaderFunctionArgs } from 'react-router'
import { json } from 'react-router'
import { getAllTemplates, getTemplatesByCategory } from '~/services/template.server'
import { getSession } from '~/lib/auth.server'

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await getSession(request)

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const url = new URL(request.url)
		const category = url.searchParams.get('category')

		const templates = category
			? await getTemplatesByCategory(category)
			: await getAllTemplates()

		return json({
			success: true,
			templates,
		})
	} catch (error) {
		console.error('Error fetching templates:', error)
		return json({ error: 'Failed to fetch templates' }, { status: 500 })
	}
}
