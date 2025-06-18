# Email Templates

This directory contains all email templates used by the application. Templates are written in EJS (Embedded JavaScript) format and are compiled and sent using the email service.

## Template Structure

- `base.ejs` - Base template that all other templates extend
- `new-lead-admin.ejs` - Notification sent to admin when a new lead is created
- `welcome-lead.ejs` - Welcome email sent to new leads
- `document-request.ejs` - Email requesting additional documents from a lead
- `status-update.ejs` - Template for application status updates
- `loan-officer-assignment.ejs` - Notification sent to loan officers when assigned a new lead
- `password-reset.ejs` - Password reset email

## Adding a New Template

1. Create a new `.ejs` file in this directory
2. Extend the base template using: `<% include('emails/base', { title: 'Email Title' }); %>`
3. Add your content between the base template includes
4. Register the template in `emailService.js` if it's a new template type

## Template Variables

### Common Variables (Available in all templates)

- `companyName` - The company name from environment variables
- `companyAddress` - Company address
- `companyPhone` - Company phone number
- `companyEmail` - Company support email
- `appUrl` - Base URL for the application
- `adminUrl` - Base URL for the admin panel
- `currentYear` - Current year for copyright
- `subject` - Email subject

### Template-Specific Variables

#### new-lead-admin.ejs
- `lead` - The lead object with all properties
- `leadUrl` - URL to view the lead in the admin panel

#### welcome-lead.ejs
- `lead` - The lead object

#### document-request.ejs
- `lead` - The lead object
- `documents` - Array of document requests
- `deadline` - Document submission deadline
- `uploadUrl` - URL for document upload

#### status-update.ejs
- `lead` - The lead object
- `status` - New status (pre-approved, approved, etc.)
- `message` - Optional status update message

#### loan-officer-assignment.ejs
- `lead` - The lead object
- `loanOfficer` - Assigned loan officer details
- `leadUrl` - URL to view the lead in the admin panel

#### password-reset.ejs
- `resetUrl` - Password reset URL with token
- `expirationHours` - Number of hours until the link expires

## Styling

- Use inline styles for maximum email client compatibility
- The base template includes a responsive design that works on mobile devices
- Use the predefined color variables for consistency:
  - Primary blue: `#3182ce`
  - Success green: `#38a169`
  - Warning orange: `#dd6b20`
  - Danger red: `#e53e3e`
  - Gray: `#718096`
  - Light gray: `#f8fafc`

## Testing

To test email templates:

1. Set `NODE_ENV=development` in your `.env` file
2. Send a test email using the email service
3. Check the console for a preview URL (using ethereal.email in development)
4. The preview URL will show you how the email will look in various email clients

## Production

In production, make sure to:

1. Set up proper SMTP credentials in your environment variables
2. Update the `from` address to a verified domain
3. Test all email templates before going live
4. Set up email tracking and delivery monitoring

## Best Practices

- Keep email width under 600px
- Use web-safe fonts (Arial, Helvetica, sans-serif)
- Include alt text for images
- Use a single column layout for better mobile compatibility
- Keep the main call-to-action above the fold
- Test in multiple email clients before sending to users
