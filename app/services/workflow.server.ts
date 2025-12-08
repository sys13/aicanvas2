import { eq } from 'drizzle-orm'
import { db } from '~/utils/db.server'
import { workflowStep } from '../../database/schema'
import type { WorkflowStep, NewWorkflowStep } from '../../database/schema'
import { updateDeliverableStatus } from './deliverable.server'
import { generateWithOpenAI } from './openai.server'

type StepType = 'ask' | 'gather' | 'reason' | 'produce' | 'revise'

export async function createWorkflowStep(
	data: NewWorkflowStep,
): Promise<WorkflowStep> {
	const [newStep] = await db.insert(workflowStep).values(data).returning()
	return newStep
}

export async function getWorkflowStepsByDeliverableId(
	deliverableId: string,
): Promise<WorkflowStep[]> {
	return await db.query.workflowStep.findMany({
		where: { deliverableId },
		orderBy: (workflowStep, { asc }) => [asc(workflowStep.createdAt)],
	})
}

export async function updateWorkflowStepProgress(
	id: string,
	progressPercentage: number,
	status: 'pending' | 'in_progress' | 'completed' | 'failed',
	output?: string,
): Promise<WorkflowStep> {
	const [updated] = await db
		.update(workflowStep)
		.set({
			progressPercentage,
			status,
			output,
			updatedAt: new Date(),
		})
		.where(eq(workflowStep.id, id))
		.returning()
	return updated
}

export async function initializeWorkflow(
	deliverableId: string,
): Promise<WorkflowStep[]> {
	const steps: StepType[] = ['ask', 'gather', 'reason', 'produce', 'revise']
	const createdSteps: WorkflowStep[] = []

	for (const stepType of steps) {
		const step = await createWorkflowStep({
			deliverableId,
			stepType,
			status: 'pending',
			progressPercentage: 0,
		})
		createdSteps.push(step)
	}

	return createdSteps
}

export async function executeWorkflowStep(
	stepId: string,
	deliverable: { name: string; description: string },
	previousOutput?: string,
): Promise<string> {
	const step = await db.query.workflowStep.findFirst({
		where: { id: stepId },
	})

	if (!step) {
		throw new Error('Workflow step not found')
	}

	// Update step to in_progress
	await updateWorkflowStepProgress(stepId, 0, 'in_progress')

	try {
		// Generate prompt based on step type
		const prompt = generateStepPrompt(
			step.stepType,
			deliverable,
			previousOutput,
		)

		// Call OpenAI to execute the step
		const output = await generateWithOpenAI(prompt)

		// Update step to completed
		await updateWorkflowStepProgress(stepId, 100, 'completed', output)

		return output
	} catch (error) {
		// Update step to failed
		await updateWorkflowStepProgress(stepId, 0, 'failed')
		throw error
	}
}

function generateStepPrompt(
	stepType: StepType,
	deliverable: { name: string; description: string },
	previousOutput?: string,
): string {
	const context = previousOutput
		? `\n\nPrevious step output:\n${previousOutput}`
		: ''

	switch (stepType) {
		case 'ask':
			return `You are helping to create a deliverable: "${deliverable.name}".
Description: ${deliverable.description}

Your task is to ask clarifying questions to better understand the requirements for this deliverable. Generate 3-5 thoughtful questions that would help refine the deliverable requirements.${context}`

		case 'gather':
			return `You are helping to create a deliverable: "${deliverable.name}".
Description: ${deliverable.description}

Your task is to gather relevant information, resources, and requirements needed to produce this deliverable. List key resources, data points, and information that would be needed.${context}`

		case 'reason':
			return `You are helping to create a deliverable: "${deliverable.name}".
Description: ${deliverable.description}

Your task is to reason about the approach and structure for this deliverable. Outline the logical steps, considerations, and approach for creating it.${context}`

		case 'produce':
			return `You are helping to create a deliverable: "${deliverable.name}".
Description: ${deliverable.description}

Your task is to produce the actual content for this deliverable. Create a comprehensive output based on all previous steps.${context}`

		case 'revise':
			return `You are helping to create a deliverable: "${deliverable.name}".
Description: ${deliverable.description}

Your task is to review and revise the produced deliverable. Identify improvements, corrections, and enhancements to make the deliverable better.${context}`

		default:
			throw new Error(`Unknown step type: ${stepType}`)
	}
}

export async function executeFullWorkflow(
	deliverableId: string,
): Promise<void> {
	// Get the deliverable
	const deliverableData = await db.query.deliverable.findFirst({
		where: { id: deliverableId },
	})

	if (!deliverableData) {
		throw new Error('Deliverable not found')
	}

	// Update deliverable status to in_progress
	await updateDeliverableStatus(deliverableId, 'in_progress')

	try {
		// Get all workflow steps
		const steps = await getWorkflowStepsByDeliverableId(deliverableId)

		let previousOutput: string | undefined

		// Execute each step sequentially
		for (const step of steps) {
			previousOutput = await executeWorkflowStep(
				step.id,
				{
					name: deliverableData.name,
					description: deliverableData.description,
				},
				previousOutput,
			)
		}

		// Update deliverable status to completed
		await updateDeliverableStatus(deliverableId, 'completed')
	} catch (error) {
		// Update deliverable status to failed
		await updateDeliverableStatus(deliverableId, 'failed')
		throw error
	}
}
