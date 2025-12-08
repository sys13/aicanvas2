import type { ActionFunctionArgs } from 'react-router'
import { json } from 'react-router'
import { createTemplate } from '~/services/template.server'
import { getSession } from '~/lib/auth.server'

export async function action({ request }: ActionFunctionArgs) {
	const session = await getSession(request)

	if (!session?.user?.id) {
		return json({ error: 'Unauthorized' }, { status: 401 })
	}

	try {
		const formData = await request.formData()
		const name = formData.get('name') as string
		const content = formData.get('content') as string
		const category = formData.get('category') as string

		if (!name || !content || !category) {
			return json(
				{ error: 'Name, content, and category are required' },
				{ status: 400 },
			)
		}

		const template = await createTemplate({
			name,
			content,
			category,
		})

		return json({
			success: true,
			template,
		})
	} catch (error) {
		console.error('Error creating template:', error)
		return json({ error: 'Failed to create template' }, { status: 500 })
	}
}
