# Email Templates

A comprehensive email templating system for the Max application, built with React Email components.

## Features

- 🎨 **Beautiful, responsive email designs** - Modern templates that look great on all devices
- 🔧 **Easy customization** - Override any template with your own design
- 🚀 **Type-safe** - Full TypeScript support with proper typing
- 📱 **Preview system** - See how emails look during development
- 🧪 **Testable** - Comprehensive test coverage for all templates
- 📦 **Modular** - Reusable components for building new templates

## Directory Structure

```sh
app/emails/
├── README.md                 # This file
├── index.ts                  # Main exports
├── types.ts                  # TypeScript type definitions
├── registry.ts               # Template registry system
├── send.ts                   # Helper functions for sending emails
├── preview.tsx               # Email preview system
├── components/               # Reusable email components
│   ├── layout.tsx           # Base email layout
│   ├── button.tsx           # Email buttons and links
│   ├── header.tsx           # Email header component
│   └── footer.tsx           # Email footer component
└── templates/               # Email templates
    ├── verify-email.tsx     # Email verification template
    ├── password-reset.tsx   # Password reset template
    ├── welcome.tsx          # Welcome email template
    └── newsletter-confirmation.tsx # Newsletter confirmation
```

## Available Templates

### 1. Email Verification (`verify-email`)

Used when users sign up and need to verify their email address.

**Props:**

- `name?` - User's name (optional)
- `email` - User's email address
- `verificationUrl` - URL to verify email
- `companyName?` - Company name (defaults to "Max")
- `supportEmail?` - Support email address

### 2. Password Reset (`password-reset`)

Sent when users request a password reset.

**Props:**

- `name?` - User's name (optional)
- `email` - User's email address
- `resetUrl` - URL to reset password
- `companyName?` - Company name (defaults to "Max")
- `supportEmail?` - Support email address

### 3. Welcome Email (`welcome`)

Sent after users successfully verify their email.

**Props:**

- `name` - User's name (required)
- `email` - User's email address
- `companyName?` - Company name (defaults to "Max")
- `dashboardUrl?` - URL to dashboard
- `supportEmail?` - Support email address

### 4. Newsletter Confirmation (`newsletter-confirmation`)

Sent when users subscribe to the newsletter.

**Props:**

- `email` - Subscriber's email address
- `confirmationUrl` - URL to confirm subscription
- `companyName?` - Company name (defaults to "Max")
- `unsubscribeUrl?` - URL to unsubscribe

## Usage

### Basic Usage

```typescript
import { sendVerificationEmail } from "~/emails/send";

// Send a verification email
await sendVerificationEmail(
  "user@example.com",
  "https://example.com/verify?token=abc123",
  {
    name: "John Doe",
    companyName: "My Company",
    supportEmail: "support@mycompany.com",
  }
);
```

### Using the Template Registry

```typescript
import { sendTemplateEmail } from "~/emails/send";

// Send any template by name
await sendTemplateEmail("verify-email", "user@example.com", {
  name: "John Doe",
  email: "user@example.com",
  verificationUrl: "https://example.com/verify?token=abc123",
  companyName: "My Company",
});
```

### Registering Custom Templates

```typescript
import { EmailRegistry } from "~/emails/registry";
import { MyCustomTemplate } from "./my-custom-template";

// Register a custom template
EmailRegistry.register({
  name: "my-custom-email",
  subject: (props) => `Custom Email for ${props.name}`,
  component: MyCustomTemplate,
  description: "My custom email template",
});

// Now you can use it
await sendTemplateEmail("my-custom-email", "user@example.com", {
  name: "John Doe",
});
```

### Overriding Default Templates

```typescript
import { EmailRegistry } from "~/emails/registry";
import { MyVerifyEmailTemplate } from "./my-verify-email";

// Override the default verify-email template
EmailRegistry.register({
  name: "verify-email", // Same name as default
  subject: (props) => `Please verify your email for ${props.companyName}`,
  component: MyVerifyEmailTemplate,
  description: "Custom verification email template",
});
```

## Email Preview System

For development, you can preview all email templates at:
`/dev/email-preview`

This route is only available in development mode (or when `ALLOW_EMAIL_PREVIEW=true`).

Features:

- Preview all templates with sample data
- View HTML and text versions side by side
- See email subjects and metadata
- Switch between different templates

## Creating Custom Templates

### 1. Create Template Component

```typescript
// app/emails/templates/my-template.tsx
import { EmailLayout } from "../components/layout";
import { EmailHeader } from "../components/header";
import { EmailButton } from "../components/button";

interface MyTemplateProps {
  name: string;
  actionUrl: string;
  companyName?: string;
}

export function MyTemplate({ name, actionUrl, companyName }: MyTemplateProps) {
  return (
    <EmailLayout
      preview={`Action required for ${name}`}
      companyName={companyName}
    >
      <EmailHeader
        title="Action Required"
        subtitle={`Hi ${name}, please take action`}
        companyName={companyName}
      />

      <EmailButton href={actionUrl}>Take Action</EmailButton>
    </EmailLayout>
  );
}

export const myTemplateSubject = (props: MyTemplateProps) =>
  `Action required - ${props.companyName || "Max"}`;
```

### 2. Register Template

```typescript
// Register in your app initialization
import { EmailRegistry } from "~/emails/registry";
import { MyTemplate, myTemplateSubject } from "./templates/my-template";

EmailRegistry.register({
  name: "my-action-email",
  subject: myTemplateSubject,
  component: MyTemplate,
  description: "Custom action email template",
});
```

### 3. Use Template

```typescript
import { sendTemplateEmail } from "~/emails/send";

await sendTemplateEmail("my-action-email", "user@example.com", {
  name: "John Doe",
  actionUrl: "https://example.com/action",
  companyName: "My Company",
});
```

## Components

### EmailLayout

Base layout component that provides consistent styling and structure.

### EmailHeader

Header component with optional logo, title, and subtitle.

### EmailButton

Styled button component with primary and secondary variants.

### EmailFooter

Footer component with support links, social media, and unsubscribe options.

## Testing

The email system includes comprehensive tests. Run them with:

```bash
pnpm test:run app/emails/registry.test.ts
```

## Environment Variables

- `NODE_ENV` - Controls preview route availability
- `ALLOW_EMAIL_PREVIEW` - Explicitly allow preview route in production
- `MOCKS` - Enable mock email sending for development

## Best Practices

1. **Always test templates** - Use the preview system to see how emails look
2. **Keep templates simple** - Email clients have limited CSS support
3. **Use semantic HTML** - Ensure good accessibility and client compatibility
4. **Test across clients** - Different email clients render differently
5. **Include text versions** - React Email automatically generates these
6. **Use consistent branding** - Leverage the base components for consistency

## Migration from Old System

The old email system used simple HTML strings. To migrate:

1. **Update imports** - Use new email functions from `~/emails/send`
2. **Replace sendEmail calls** - Use template-specific functions
3. **Test thoroughly** - Verify emails render correctly
4. **Update tests** - Use new testing patterns

Example migration:

```typescript
// Old way
await sendEmail({
  to: user.email,
  subject: "Verify your email",
  html: `<p>Click here: <a href="${url}">${url}</a></p>`,
});

// New way
await sendVerificationEmail(user.email, url, {
  name: user.name,
  companyName: "Max",
});
```
