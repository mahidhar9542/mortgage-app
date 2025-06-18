# Quick Close Mortgage Application

A modern mortgage application with secure authentication and loan management features.

## Features

- 🔐 Secure authentication with email/password
- ✉️ Password reset via email
- 👥 Role-based access control
- 📱 Responsive design
- 🚀 Built with Next.js, TypeScript, and Tailwind CSS
- 🔄 Real-time updates
- 📧 Email notifications

## Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# MongoDB
MONGODB_URI=mongodb://127.0.0.1:27017/mortgage-app

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Email Configuration
EMAIL_FROM=noreply@quickclosemortgage.com

# SMTP Configuration (for production)
# SMTP_HOST=smtp.your-email-provider.com
# SMTP_PORT=587
# SMTP_SECURE=false # true for 465, false for other ports
# SMTP_USER=your-email@example.com
# SMTP_PASSWORD=your-email-password
```

For development, you can use [Ethereal Email](https://ethereal.email/) for testing email functionality. No configuration is needed for development - emails will be captured by ethereal.email and you can view them in their web interface.

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- MongoDB (local or cloud instance)

### Quick Start

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd quick-close-mortgage-flow
   ```

2. Run the setup script (Linux/macOS):
   ```bash
   ./setup.sh
   ```
   
   Or on Windows (using Git Bash or WSL):
   ```bash
   bash setup.sh
   ```

3. The setup script will:
   - Check for Node.js and npm
   - Install dependencies
   - Create a `.env.local` file with default configuration
   - Verify MongoDB connection (if installed)

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Manual Setup

If you prefer to set up manually:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory (copy from `.env.example` and update values)

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Authentication

The application includes the following authentication features:

- **Sign Up**: Create a new account with email and password
- **Sign In**: Log in with your credentials
- **Forgot Password**: Request a password reset link
- **Reset Password**: Set a new password using a secure token
- **Protected Routes**: Certain routes require authentication
- **Role-Based Access**: Different user roles have different permissions

## Development

### Available Scripts

- `npm run dev` - Start the development server with hot reload
- `npm run build` - Build the application for production
- `npm start` - Start the production server
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier
- `npm test` - Run tests (coming soon)

### Testing Email in Development

During development, you can test the email functionality using [Ethereal Email](https://ethereal.email/). The application is pre-configured to use Ethereal in development mode.

1. Start the development server
2. Trigger an email (e.g., password reset)
3. Check your Ethereal inbox at [https://ethereal.email/messages](https://ethereal.email/messages)
   - Username and password will be logged in the console when the server starts

### Database

The application uses MongoDB as the database. You can use:

- Local MongoDB instance (default)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
- Any other MongoDB-compatible database

Update the `MONGODB_URI` in your `.env.local` file to point to your database.

## Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-docs) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/3b334be0-8f8d-4240-a3b7-4ebc1bb8a375) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/3b334be0-8f8d-4240-a3b7-4ebc1bb8a375) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
