import type { ActionFunctionArgs } from 'react-router'
import { createTemplate } from '~/services/template.server'
import { auth } from '~/lib/auth.server'

export async function action({ request }: ActionFunctionArgs) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user?.id) {
		return Response.json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const formData = await request.formData()
		const name = formData.get('name') as string
		const content = formData.get('content') as string
		const category = formData.get('category') as string

		if (!name || !content || !category) {
			return Response.json(
				{ error: 'Name, content, and category are required' },
				{ status: 400 },
			)
		}

		const template = await createTemplate({
			name,
			content,
			category,
		})

		return Response.json({
			success: true,
			template,
		})
	} catch (error) {
		console.error('Error creating template:', error)
		return Response.json({ error: 'Failed to create template' }, { status: 500 })
	}
}
