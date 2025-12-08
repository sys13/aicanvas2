import type { LoaderFunctionArgs } from 'react-router'
import { useLoaderData, useRevalidator } from 'react-router'
import { useEffect } from 'react'
import { auth } from '~/lib/auth.server'
import { getDeliverableWithSteps } from '~/services/deliverable.server'
import type { WorkflowStep } from '../../database/schema'

export async function loader({ request, params }: LoaderFunctionArgs) {
	const session = await auth.api.getSession({ headers: request.headers })

	if (!session?.user?.id) {
		throw new Response('Unauthorized', { status: 401 })
	}

	const deliverable = await getDeliverableWithSteps(params.id as string)

	if (!deliverable) {
		throw new Response('Not Found', { status: 404 })
	}

	if (deliverable.userId !== session.user.id) {
		throw new Response('Forbidden', { status: 403 })
	}

	return { deliverable }
}

export default function DeliverableDetail() {
	const { deliverable } = useLoaderData<typeof loader>()
	const revalidator = useRevalidator()

	// Auto-refresh when workflow is in progress
	useEffect(() => {
		if (deliverable.status === 'in_progress') {
			const interval = setInterval(() => {
				revalidator.revalidate()
			}, 3000) // Refresh every 3 seconds

			return () => clearInterval(interval)
		}
	}, [deliverable.status, revalidator])

	const statusColors = {
		draft: 'bg-gray-100 text-gray-800',
		in_progress: 'bg-blue-100 text-blue-800',
		completed: 'bg-green-100 text-green-800',
		failed: 'bg-red-100 text-red-800',
	}

	return (
		<div className="container mx-auto px-4 py-8 max-w-4xl">
			<div className="mb-6">
				<a
					href="/deliverables"
					className="text-blue-600 hover:text-blue-700 text-sm mb-2 inline-block"
				>
					← Back to Deliverables
				</a>
				<div className="flex justify-between items-start">
					<div>
						<h1 className="text-3xl font-bold mb-2">{deliverable.name}</h1>
						<p className="text-gray-600">{deliverable.description}</p>
					</div>
					<span
						className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[deliverable.status]}`}
					>
						{deliverable.status.replace('_', ' ')}
					</span>
				</div>
			</div>

			{/* Workflow Progress */}
			<div className="bg-white rounded-lg shadow-md p-6">
				<h2 className="text-xl font-semibold mb-4">Workflow Progress</h2>

				<div className="space-y-6">
					{deliverable.workflowSteps?.map((step: WorkflowStep, index: number) => (
						<WorkflowStepCard
							key={step.id}
							step={step}
							stepNumber={index + 1}
							totalSteps={deliverable.workflowSteps?.length || 0}
						/>
					))}
				</div>
			</div>
		</div>
	)
}

function WorkflowStepCard({
	step,
	stepNumber,
	totalSteps,
}: {
	step: WorkflowStep
	stepNumber: number
	totalSteps: number
}) {
	const statusColors = {
		pending: 'bg-gray-100 text-gray-800 border-gray-300',
		in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
		completed: 'bg-green-100 text-green-800 border-green-300',
		failed: 'bg-red-100 text-red-800 border-red-300',
	}

	const stepIcons = {
		ask: '❓',
		gather: '📚',
		reason: '🧠',
		produce: '✍️',
		revise: '✨',
	}

	return (
		<div
			className={`border-2 rounded-lg p-4 ${statusColors[step.status]}`}
		>
			<div className="flex items-center justify-between mb-2">
				<div className="flex items-center gap-2">
					<span className="text-2xl">{stepIcons[step.stepType]}</span>
					<div>
						<h3 className="font-semibold capitalize">
							Step {stepNumber}/{totalSteps}: {step.stepType}
						</h3>
						<span className="text-xs uppercase font-medium">
							{step.status.replace('_', ' ')}
						</span>
					</div>
				</div>
				{step.status === 'in_progress' && (
					<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-current" />
				)}
			</div>

			{/* Progress Bar */}
			{step.status !== 'pending' && (
				<div className="mt-3 mb-2">
					<div className="w-full bg-gray-200 rounded-full h-2">
						<div
							className="bg-current h-2 rounded-full transition-all duration-300"
							style={{ width: `${step.progressPercentage}%` }}
						/>
					</div>
					<p className="text-xs text-right mt-1">
						{step.progressPercentage}%
					</p>
				</div>
			)}

			{/* Output */}
			{step.output && (
				<div className="mt-3 p-3 bg-white bg-opacity-50 rounded">
					<p className="text-xs font-medium mb-1">Output:</p>
					<p className="text-sm whitespace-pre-wrap">{step.output}</p>
				</div>
			)}
		</div>
	)
}
