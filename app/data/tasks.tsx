/**
 * Tasks Configuration File
 *
 * Define your tasks here to display them in the task management UI.
 * This file can be used alongside or instead of GitHub Issues integration.
 *
 * Tasks defined here will be displayed in a Kanban-style board with columns for:
 * - To Do: Tasks that haven't been started yet
 * - In Progress: Tasks currently being worked on
 * - Done: Completed tasks
 * - Blocked: Tasks that are blocked by dependencies or issues
 *
 * ## Task Properties
 *
 * Each task supports the following properties:
 * - id (required): Unique identifier for the task
 * - title (required): Task title/name
 * - description (optional): Detailed description of the task
 * - status (optional): 'todo', 'in-progress', 'done', or 'blocked' (default: 'todo')
 * - priority (optional): 'low', 'medium', or 'high' (default: 'medium')
 * - assignee (optional): Person or team assigned to the task
 * - dueDate (optional): Target completion date
 * - tags (optional): Array of tags for categorization
 *
 * ## Example Usage
 *
 * ```typescript
 * {
 *   id: 'task-1',
 *   title: 'Implement feature X',
 *   description: 'Add new feature with Y functionality',
 *   status: 'in-progress',
 *   priority: 'high',
 *   assignee: 'Developer',
 *   dueDate: '2024-02-01',
 *   tags: ['feature', 'frontend'],
 * }
 * ```
 *
 * See TASKS_README.md for more detailed documentation.
 */

export const tasks = [
	{
		id: 'task-1',
		title: 'Set up project structure',
		description:
			'Initialize the project with proper folder structure and dependencies',
		status: 'done',
		priority: 'high',
		assignee: 'Developer',
		dueDate: '2024-01-15',
		tags: ['setup', 'infrastructure'],
	},
	{
		id: 'task-2',
		title: 'Implement authentication',
		description: 'Add user authentication with email and password',
		status: 'done',
		priority: 'high',
		assignee: 'Developer',
		dueDate: '2024-01-20',
		tags: ['auth', 'security'],
	},
	{
		id: 'task-3',
		title: 'Create task management UI',
		description: 'Build the UI for viewing and managing tasks',
		status: 'in-progress',
		priority: 'high',
		assignee: 'Developer',
		dueDate: '2024-01-25',
		tags: ['ui', 'tasks'],
	},
	{
		id: 'task-4',
		title: 'Add GitHub Issues integration',
		description: 'Connect to GitHub API to sync with repository issues',
		status: 'todo',
		priority: 'medium',
		assignee: 'Developer',
		dueDate: '2024-02-01',
		tags: ['integration', 'github'],
	},
	{
		id: 'task-5',
		title: 'Write documentation',
		description: 'Document the task management features and configuration',
		status: 'todo',
		priority: 'low',
		assignee: 'Developer',
		dueDate: '2024-02-10',
		tags: ['documentation'],
	},
	{
		id: 'task-6',
		title: 'Set up CI/CD pipeline',
		description: 'Configure automated testing and deployment',
		status: 'todo',
		priority: 'medium',
		assignee: 'DevOps',
		dueDate: '2024-02-05',
		tags: ['devops', 'automation'],
	},
] as const

export default tasks
