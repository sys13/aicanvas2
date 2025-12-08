# Core Deliverable Engine - MVP Documentation

## Overview

The Core Deliverable Engine is an AI-powered system that allows users to define deliverables and automatically process them through a multi-step workflow using OpenAI's language models.

## Features

### 1. Deliverable Management
- Create deliverables with a name and description
- View all deliverables in a dashboard
- Track deliverable status (draft, in_progress, completed, failed)
- View detailed workflow execution for each deliverable

### 2. AI-Powered Workflow
The engine processes deliverables through 5 sequential steps:

1. **Ask** - Generate clarifying questions to understand requirements
2. **Gather** - Collect relevant information and resources
3. **Reason** - Outline the approach and structure
4. **Produce** - Create the actual deliverable content
5. **Revise** - Review and improve the produced content

Each step:
- Uses OpenAI GPT-4o-mini for content generation
- Tracks progress percentage (0-100%)
- Stores input and output data
- Maintains status (pending, in_progress, completed, failed)

### 3. Template System
- Store reusable templates in the database
- Organize templates by category
- Retrieve templates for consistent deliverable creation

## Getting Started

### Prerequisites

1. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=your-api-key-here
   ```

2. Run database migrations:
   ```bash
   pnpm run db:push
   ```

### Usage

1. **Navigate to the Deliverables Dashboard**
   - Go to `/deliverables`
   - View all your existing deliverables

2. **Create a New Deliverable**
   - Fill in the name and description
   - Click "Create Deliverable"
   - The system creates the deliverable and initializes workflow steps

3. **Execute the Workflow**
   - Click "Start Workflow" on a draft deliverable
   - The system processes it through all 5 steps
   - Progress updates automatically every 3 seconds

4. **View Results**
   - Click "View Details" on any deliverable
   - See the output from each workflow step
   - Monitor progress in real-time

## Architecture

### Database Schema

#### deliverable
- `id` - Unique identifier
- `userId` - Owner of the deliverable
- `name` - Deliverable name
- `description` - Detailed description
- `status` - Current status (draft, in_progress, completed, failed)
- `createdAt`, `updatedAt` - Timestamps

#### workflow_step
- `id` - Unique identifier
- `deliverableId` - Associated deliverable
- `stepType` - Step type (ask, gather, reason, produce, revise)
- `status` - Step status (pending, in_progress, completed, failed)
- `input` - JSON string for step input data
- `output` - JSON string for step output data
- `progressPercentage` - Completion percentage (0-100)
- `createdAt`, `updatedAt` - Timestamps

#### template
- `id` - Unique identifier
- `name` - Template name
- `content` - Template content
- `category` - Template category
- `createdAt`, `updatedAt` - Timestamps

### API Endpoints

#### Deliverables
- `POST /api/deliverables/create` - Create a new deliverable
- `GET /api/deliverables/list` - List user's deliverables
- `GET /api/deliverables/status?id={id}` - Get deliverable with workflow steps
- `POST /api/deliverables/execute` - Start workflow execution

#### Templates
- `GET /api/templates/list?category={category}` - List templates
- `POST /api/templates/create` - Create a new template

### Services

#### deliverable.server.ts
- CRUD operations for deliverables
- Get deliverables with workflow steps
- Filter by user

#### workflow.server.ts
- Initialize workflow steps
- Execute individual workflow steps
- Execute full workflow
- Update step progress
- Generate AI prompts for each step

#### openai.server.ts
- Interface to OpenAI API
- Generate content using GPT-4o-mini
- Validate API key at startup

#### template.server.ts
- CRUD operations for templates
- Filter by category

## UI Components

### `/deliverables` - Dashboard
- Form to create new deliverables
- List of all user's deliverables
- Status badges
- Action buttons (View Details, Start Workflow)

### `/deliverables/:id` - Detail View
- Deliverable information
- Workflow step progress cards
- Real-time progress updates
- Step outputs
- Visual indicators for step status

## Security

- All routes protected with better-auth authentication
- User authorization checks on data access
- Environment variable validation
- No SQL injection vulnerabilities (using Drizzle ORM)
- Passed CodeQL security analysis with 0 alerts

## Performance Optimizations

- Batch insert for workflow step initialization
- Efficient database queries using Drizzle relations
- API key validated once at module load
- Optimized real-time updates with 3-second polling

## Future Enhancements

1. **Job Queue**: Implement proper background job processing
2. **Step Retry**: Allow retrying failed workflow steps
3. **Workflow Customization**: Let users customize workflow steps
4. **Export**: Export deliverable results in various formats
5. **Template UI**: Full template management interface
6. **Webhook Support**: Notify external systems of workflow completion
7. **Collaborative Editing**: Multiple users working on same deliverable
8. **Version History**: Track changes to deliverables over time

## Troubleshooting

### Workflow Execution Fails

1. **Check OpenAI API Key**
   - Ensure `OPENAI_API_KEY` is set in `.env`
   - Verify the key is valid and has sufficient credits

2. **Check Database**
   - Ensure migrations are up to date
   - Verify workflow steps were created

3. **Check Logs**
   - Look for error messages in console
   - Check network tab for API failures

### Progress Not Updating

1. **Check Network Connection**
   - Ensure stable internet connection
   - Check if API endpoints are reachable

2. **Check Browser**
   - Clear cache and reload
   - Try in incognito mode
   - Check browser console for errors

## Development

### Running Tests
```bash
pnpm run test:run
```

### Type Checking
```bash
pnpm run typecheck
```

### Linting
```bash
pnpm run lint
```

### Database Operations
```bash
# Generate migration
pnpm run db:generate

# Push schema changes
pnpm run db:push

# Open database studio
pnpm run db:studio
```

## Contributing

When contributing to the Deliverable Engine:

1. Follow existing code patterns
2. Use TypeScript strict mode
3. Add appropriate error handling
4. Update this documentation for new features
5. Ensure all tests pass
6. Run security checks before submitting PR

## License

[Your license information here]
