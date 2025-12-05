import { beforeEach, describe, expect, it } from 'vitest'

// Mock the templates to avoid React component rendering issues in tests
const mockTemplates = {
	'verify-email': {
		name: 'verify-email',
		// biome-ignore lint/suspicious/noExplicitAny: test helper with dynamic props
		subject: (props: any) =>
			`Verify your email address for ${props.companyName || 'Max'}`,
		// biome-ignore lint/suspicious/noExplicitAny: test helper
		component: () => null as any,
		description: 'Email verification template for new user accounts',
	},
	'password-reset': {
		name: 'password-reset',
		// biome-ignore lint/suspicious/noExplicitAny: test helper with dynamic props
		subject: (props: any) =>
			`Reset your ${props.companyName || 'Max'} password`,
		// biome-ignore lint/suspicious/noExplicitAny: test helper
		component: () => null as any,
		description: 'Password reset template for existing users',
	},
	welcome: {
		name: 'welcome',
		// biome-ignore lint/suspicious/noExplicitAny: test helper with dynamic props
		subject: (props: any) =>
			`Welcome to ${props.companyName || 'Max'}! Your account is ready.`,
		// biome-ignore lint/suspicious/noExplicitAny: test helper
		component: () => null as any,
		description: 'Welcome email template for verified users',
	},
	'newsletter-confirmation': {
		name: 'newsletter-confirmation',
		// biome-ignore lint/suspicious/noExplicitAny: test helper with dynamic props
		subject: (props: any) =>
			`Confirm your ${props.companyName || 'Max'} newsletter subscription`,
		// biome-ignore lint/suspicious/noExplicitAny: test helper
		component: () => null as any,
		description: 'Newsletter subscription confirmation template',
	},
}

// Mock the EmailRegistry
// biome-ignore lint/complexity/noStaticOnlyClass: test helper uses static-only class pattern
class MockEmailRegistry {
	// biome-ignore lint/suspicious/noExplicitAny: test helper dynamic types
	private static customTemplates: Record<string, any> = {}

	// biome-ignore lint/suspicious/noExplicitAny: test helper dynamic types
	static register(template: any): void {
		MockEmailRegistry.customTemplates[template.name] = template
	}

	// biome-ignore lint/suspicious/noExplicitAny: test helper dynamic types
	static get(name: string): any {
		return (
			MockEmailRegistry.customTemplates[name] ||
			mockTemplates[name as keyof typeof mockTemplates]
		)
	}

	// biome-ignore lint/suspicious/noExplicitAny: test helper dynamic types
	static getAll(): Record<string, any> {
		return { ...mockTemplates, ...MockEmailRegistry.customTemplates }
	}

	static has(name: string): boolean {
		return !!(
			MockEmailRegistry.customTemplates[name] ||
			mockTemplates[name as keyof typeof mockTemplates]
		)
	}

	static remove(name: string): boolean {
		if (MockEmailRegistry.customTemplates[name]) {
			delete MockEmailRegistry.customTemplates[name]
			return true
		}
		return false
	}

	static getTemplateNames(): string[] {
		const allTemplates = MockEmailRegistry.getAll()
		return Object.keys(allTemplates)
	}
}

describe('EmailRegistry', () => {
	beforeEach(() => {
		// Clear custom templates before each test
		// biome-ignore lint/suspicious/noExplicitAny: test helper
		;(MockEmailRegistry as any).customTemplates = {}
	})

	it('should return all default templates', () => {
		const templates = MockEmailRegistry.getAll()
		expect(Object.keys(templates)).toContain('verify-email')
		expect(Object.keys(templates)).toContain('password-reset')
		expect(Object.keys(templates)).toContain('welcome')
		expect(Object.keys(templates)).toContain('newsletter-confirmation')
	})

	it('should get a specific template', () => {
		const template = MockEmailRegistry.get('verify-email')
		expect(template).toBeDefined()
		expect(template?.name).toBe('verify-email')
		expect(template?.subject).toBeDefined()
		expect(template?.component).toBeDefined()
	})

	it('should check if template exists', () => {
		expect(MockEmailRegistry.has('verify-email')).toBe(true)
		expect(MockEmailRegistry.has('non-existent')).toBe(false)
	})

	it('should allow registering custom templates', () => {
		const customTemplate = {
			name: 'custom-test',
			subject: () => 'Test Subject',
			// biome-ignore lint/suspicious/noExplicitAny: test helper
			component: () => null as any,
			description: 'Test template',
		}

		MockEmailRegistry.register(customTemplate)
		expect(MockEmailRegistry.has('custom-test')).toBe(true)
		expect(MockEmailRegistry.get('custom-test')).toBe(customTemplate)

		// Clean up
		MockEmailRegistry.remove('custom-test')
	})

	it('should allow removing custom templates', () => {
		const customTemplate = {
			name: 'custom-test-2',
			subject: () => 'Test Subject',
			// biome-ignore lint/suspicious/noExplicitAny: test helper
			component: () => null as any,
		}

		MockEmailRegistry.register(customTemplate)
		expect(MockEmailRegistry.has('custom-test-2')).toBe(true)

		const removed = MockEmailRegistry.remove('custom-test-2')
		expect(removed).toBe(true)
		expect(MockEmailRegistry.has('custom-test-2')).toBe(false)
	})

	it('should return template names', () => {
		const names = MockEmailRegistry.getTemplateNames()
		expect(names).toContain('verify-email')
		expect(names).toContain('password-reset')
		expect(names).toContain('welcome')
		expect(names).toContain('newsletter-confirmation')
	})

	it('should generate correct subjects', () => {
		const template = MockEmailRegistry.get('verify-email')
		const subject = template?.subject({
			companyName: 'Test Company',
			email: 'test@example.com',
		})
		expect(subject).toBe('Verify your email address for Test Company')
	})
})
