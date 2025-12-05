// Sample data for marketing pages
export const marketingData = {
	about: {
		mission:
			'To help teams manage their tasks and projects more efficiently with intuitive, powerful tools.',
		team: [
			{
				avatar: '/images/team/alex.jpg',
				bio: 'Passionate about productivity and team collaboration',
				name: 'Alex Johnson',
				role: 'CEO & Founder',
			},
			{
				avatar: '/images/team/sarah.jpg',
				bio: 'Full-stack developer with expertise in React and Node.js',
				name: 'Sarah Chen',
				role: 'Lead Developer',
			},
		],
	},
	blog: {
		posts: [
			{
				author: 'Alex Johnson',
				publishedAt: '2025-07-14T13:01:24.740Z',
				readingMinutes: 5,
				slug: '5-tips-better-task-management',
				summary:
					'Learn how to organize your tasks more effectively with these proven strategies.',
				tags: ['productivity', 'tips', 'organization'],
				title: '5 Tips for Better Task Management',
			},
		],
	},
	contact: {
		address: '123 Business St, Suite 100, San Francisco, CA 94105',
		email: 'hello@taskly.com',
		phone: '+1 (555) 123-4567',
	},
	features: {
		features: [
			{
				benefits: [
					'Easy task creation',
					'Priority management',
					'Due date tracking',
				],
				description: 'Create, organize, and track tasks with ease',
				icon: '✓',
				name: 'Task Management',
			},
			{
				benefits: [
					'Project templates',
					'Task dependencies',
					'Progress tracking',
				],
				description:
					'Group related tasks into projects for better organization',
				icon: '📋',
				name: 'Project Organization',
			},
		],
	},
	docs: {
		landing: {
			title: 'Documentation',
			description:
				'Find comprehensive guides and documentation to help you start working with our platform as quickly as possible.',
			sections: [
				{
					id: 'getting-started',
					title: 'Getting Started',
					pages: [
						{
							title: 'Installation',
							slug: 'installation',
							excerpt: 'Learn how to install and set up the platform',
						},
						{
							title: 'Quick Start Guide',
							slug: 'quick-start',
							excerpt: 'Get up and running in 5 minutes',
						},
						{
							title: 'Configuration',
							slug: 'configuration',
							excerpt: 'Configure your application settings',
						},
					],
				},
				{
					id: 'core-concepts',
					title: 'Core Concepts',
					pages: [
						{
							title: 'Tasks & Projects',
							slug: 'tasks-projects',
							excerpt: 'Understanding the core building blocks',
						},
						{
							title: 'Teams & Collaboration',
							slug: 'teams-collaboration',
							excerpt: 'Work together effectively with your team',
						},
						{
							title: 'Workflows',
							slug: 'workflows',
							excerpt: 'Automate your processes',
						},
					],
				},
				{
					id: 'guides',
					title: 'Guides',
					pages: [
						{
							title: 'Building Your First Project',
							slug: 'first-project',
							excerpt: 'Step-by-step guide to creating your first project',
						},
						{
							title: 'Managing Team Members',
							slug: 'managing-team',
							excerpt: 'Invite and manage your team members',
						},
						{
							title: 'Customizing Workflows',
							slug: 'custom-workflows',
							excerpt: 'Create custom workflows for your needs',
						},
					],
				},
				{
					id: 'api',
					title: 'API Reference',
					pages: [
						{
							title: 'Authentication',
							slug: 'api-authentication',
							excerpt: 'Authenticate API requests',
						},
						{
							title: 'Tasks API',
							slug: 'api-tasks',
							excerpt: 'Manage tasks via API',
						},
						{
							title: 'Webhooks',
							slug: 'api-webhooks',
							excerpt: 'Receive real-time updates',
						},
					],
				},
			],
			featured: [
				{
					title: 'Quick Start Guide',
					slug: 'quick-start',
				},
				{
					title: 'Building Your First Project',
					slug: 'first-project',
				},
				{
					title: 'API Authentication',
					slug: 'api-authentication',
				},
			],
		},
	},
}
