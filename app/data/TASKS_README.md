# Task Management Feature

The Task Management template provides a Kanban-style board for tracking and organizing your project tasks.

## Features

- **Kanban Board Layout**: Four columns for organizing tasks by status (To Do, In Progress, Done, Blocked)
- **Rich Task Properties**: Support for title, description, status, priority, assignee, due date, and tags
- **Color-Coded Badges**: Visual indicators for priority levels and task status
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type-Safe Configuration**: Strongly typed with Zod schemas for reliability

## Configuration

### Basic Setup

Tasks are defined in `app/data/tasks.tsx`. This file exports an array of task objects:

```typescript
export const tasks = [
  {
    id: 'task-1',
    title: 'Set up project structure',
    description: 'Initialize the project with proper folder structure',
    status: 'done',
    priority: 'high',
    assignee: 'Developer',
    dueDate: '2024-01-15',
    tags: ['setup', 'infrastructure'],
  },
  // ... more tasks
]
```

### Task Properties

Each task supports the following properties:

- **id** (required): Unique identifier for the task
- **title** (required): Task title/name
- **description** (optional): Detailed description of the task
- **status** (optional): Current task status
  - `todo` (default) - Task is in the backlog
  - `in-progress` - Task is actively being worked on
  - `done` - Task is completed
  - `blocked` - Task is blocked by dependencies or issues
- **priority** (optional): Task priority level
  - `low` - Low priority task
  - `medium` (default) - Medium priority task
  - `high` - High priority/critical task
- **assignee** (optional): Person or team assigned to the task
- **dueDate** (optional): Target completion date (string format)
- **tags** (optional): Array of tags for categorization

### Adding to mconfig.tsx

Register the tasks page in your `mconfig.tsx`:

```typescript
import tasks from './app/data/tasks.tsx'

export default {
  // ... other config
  pages: [
    // ... other pages
    {
      name: 'app/tasks',
      data: {
        title: 'Task Management',
        description: 'Track and manage your project tasks',
        tasks: tasks,
      },
      variant: 'default',
      routePath: '/tasks',
    },
  ],
}
```

## Usage

### Viewing Tasks

Navigate to `/tasks` to view your task board. Tasks are automatically organized into columns based on their status.

### Customization

#### Custom Styling

The template uses Tailwind CSS classes. You can customize the appearance by:

1. **Ejecting the template**: Copy the template to your local `app/components/templates/` directory
2. **Modifying classes**: Update Tailwind classes to match your design
3. **Adding custom components**: Enhance with additional UI elements

#### Priority Colors

The default priority colors are:
- **High**: Red background
- **Medium**: Yellow background
- **Low**: Green background

#### Status Colors

The default status colors are:
- **Done**: Green background
- **In Progress**: Blue background
- **Blocked**: Red background
- **To Do**: Gray background

### Integration with Data Sources

#### Local Configuration (Current)

Tasks are defined statically in `app/data/tasks.tsx`. This is great for:
- Simple task management
- Static project planning
- Development and testing

#### Database Integration (Future Enhancement)

You can integrate with the database `task` table:

```typescript
// In a loader function
export async function loader() {
  const tasks = await db.query.task.findMany()
  return { tasks }
}
```

#### GitHub Issues Integration (Future Enhancement)

The template is designed to support GitHub Issues integration:

1. Fetch issues from GitHub API
2. Transform to task format
3. Pass to template via loader data

Example structure:
```typescript
const githubTasks = issues.map(issue => ({
  id: issue.number.toString(),
  title: issue.title,
  description: issue.body,
  status: issue.state === 'closed' ? 'done' : 'todo',
  tags: issue.labels.map(l => l.name),
  // ... other mappings
}))
```

## Examples

### Minimal Task

```typescript
{
  id: 'task-1',
  title: 'Complete feature',
}
```

### Full Task

```typescript
{
  id: 'task-complex',
  title: 'Implement user authentication',
  description: 'Add email/password authentication with JWT tokens',
  status: 'in-progress',
  priority: 'high',
  assignee: 'Backend Team',
  dueDate: '2024-02-15',
  tags: ['auth', 'security', 'backend'],
}
```

### Sprint Planning

```typescript
export const sprintTasks = [
  {
    id: 'sprint-1-task-1',
    title: 'Design database schema',
    status: 'done',
    priority: 'high',
    assignee: 'Alice',
    tags: ['sprint-1', 'database'],
  },
  {
    id: 'sprint-1-task-2',
    title: 'Create API endpoints',
    status: 'in-progress',
    priority: 'high',
    assignee: 'Bob',
    tags: ['sprint-1', 'api'],
  },
  {
    id: 'sprint-1-task-3',
    title: 'Write unit tests',
    status: 'todo',
    priority: 'medium',
    assignee: 'Charlie',
    tags: ['sprint-1', 'testing'],
  },
]
```

## Best Practices

1. **Use descriptive IDs**: Make task IDs meaningful (e.g., `feature-auth-login`)
2. **Keep descriptions concise**: Provide enough detail without overwhelming
3. **Update status regularly**: Move tasks between columns as work progresses
4. **Use tags consistently**: Establish a tagging system for easy filtering
5. **Set realistic due dates**: Help prioritize work effectively
6. **Assign ownership**: Clear assignees improve accountability

## Troubleshooting

### Tasks not displaying

- Check that `tasks.tsx` exports the array correctly
- Verify the import path in `mconfig.tsx`
- Ensure tasks array is passed to the `data.tasks` property

### Route not found

- Run `pnpm gen:routes` to regenerate route files
- Verify the tasks page is in `mconfig.tsx` pages array
- Check that `routePath: '/tasks'` is specified

### Type errors

- Ensure all required properties (id, title) are present
- Check that status values match allowed options
- Verify priority values are 'low', 'medium', or 'high'

## Future Enhancements

Potential improvements to consider:

- [ ] Drag-and-drop task reordering
- [ ] Inline task editing
- [ ] Task filtering and search
- [ ] GitHub Issues synchronization
- [ ] Database persistence
- [ ] Task dependencies visualization
- [ ] Progress tracking and metrics
- [ ] Export to various formats (CSV, JSON)
- [ ] Multiple board views (list, calendar)
- [ ] Team collaboration features

## Related

- [MAXSTACK Templates Documentation](../../README.md)
- [Database Schema](../../database/schema.ts)
- [Zod Validation](https://zod.dev/)
