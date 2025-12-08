import type { LoaderFunctionArgs } from 'react-router'
import { useLoaderData, Form, useNavigation } from 'react-router'
import { auth } from '~/lib/auth.server'
import { getDeliverablesByUserId } from '~/services/deliverable.server'
import type { Deliverable } from '../../database/schema'

export async function loader({ request }: LoaderFunctionArgs) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user?.id) {
		throw new Response('Unauthorized', { status: 401 })
	}

	const deliverables = await getDeliverablesByUserId(session.user.id)

	return { deliverables }
}

export default function Deliverables() {
	const { deliverables } = useLoaderData<typeof loader>()
	const navigation = useNavigation()
	const isCreating = navigation.state === 'submitting'

	return (
		<div className="container mx-auto px-4 py-8 max-w-6xl">
			<div className="mb-8">
				<h1 className="text-3xl font-bold mb-2">Deliverables</h1>
				<p className="text-gray-600">
					Create and manage your AI-powered deliverables
				</p>
			</div>

			{/* Create New Deliverable Form */}
			<div className="bg-white rounded-lg shadow-md p-6 mb-8">
				<h2 className="text-xl font-semibold mb-4">Create New Deliverable</h2>
				<Form method="post" action="/api/deliverables/create">
					<div className="space-y-4">
						<div>
							<label htmlFor="name" className="block text-sm font-medium mb-1">
								Name
							</label>
							<input
								id="name"
								name="name"
								type="text"
								required
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="e.g., Marketing Campaign Plan"
							/>
						</div>
						<div>
							<label
								htmlFor="description"
								className="block text-sm font-medium mb-1"
							>
								Description
							</label>
							<textarea
								id="description"
								name="description"
								required
								rows={4}
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
								placeholder="Describe what you want to create..."
							/>
						</div>
						<button
							type="submit"
							disabled={isCreating}
							className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isCreating ? 'Creating...' : 'Create Deliverable'}
						</button>
					</div>
				</Form>
			</div>

			{/* Deliverables List */}
			<div className="space-y-4">
				<h2 className="text-xl font-semibold">Your Deliverables</h2>
				{deliverables.length === 0 ? (
					<div className="bg-gray-50 rounded-lg p-8 text-center">
						<p className="text-gray-600">
							No deliverables yet. Create your first one above!
						</p>
					</div>
				) : (
					<div className="grid gap-4">
						{deliverables.map((deliverable: Deliverable) => (
							<DeliverableCard key={deliverable.id} deliverable={deliverable} />
						))}
					</div>
				)}
			</div>
		</div>
	)
}

function DeliverableCard({ deliverable }: { deliverable: Deliverable }) {
	const statusColors = {
		draft: 'bg-gray-100 text-gray-800',
		in_progress: 'bg-blue-100 text-blue-800',
		completed: 'bg-green-100 text-green-800',
		failed: 'bg-red-100 text-red-800',
	}

	return (
		<div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
			<div className="flex justify-between items-start mb-4">
				<div>
					<h3 className="text-lg font-semibold mb-1">{deliverable.name}</h3>
					<p className="text-gray-600 text-sm">{deliverable.description}</p>
				</div>
				<span
					className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[deliverable.status]}`}
				>
					{deliverable.status.replace('_', ' ')}
				</span>
			</div>
			<div className="flex gap-2">
				<a
					href={`/deliverables/${deliverable.id}`}
					className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
				>
					View Details
				</a>
				{deliverable.status === 'draft' && (
					<Form method="post" action="/api/deliverables/execute">
						<input type="hidden" name="deliverableId" value={deliverable.id} />
						<button
							type="submit"
							className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
						>
							Start Workflow
						</button>
					</Form>
				)}
			</div>
		</div>
	)
}
