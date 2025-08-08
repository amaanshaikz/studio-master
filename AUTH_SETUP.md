# Authentication Setup Guide

This project uses NextAuth.js with Supabase as the database and storage provider.

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:9002
NEXTAUTH_SECRET=your_nextauth_secret_key_here

# Google OAuth Configuration
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Get your project URL and API keys from the project settings
3. Run the SQL migration in `supabase-migration.sql` to create the required tables
4. The authentication tables will be automatically managed by NextAuth with the Supabase adapter

## Google OAuth Setup

1. Go to the Google Cloud Console (https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to Credentials and create an OAuth 2.0 Client ID
5. Add your domain to the authorized origins
6. Add `http://localhost:9002/api/auth/callback/google` to authorized redirect URIs
7. Copy the Client ID and Client Secret to your `.env.local` file

## Generate NextAuth Secret

Generate a random secret key for NextAuth:

```bash
openssl rand -base64 32
```

## Database Schema

The following tables are created by the migration:

- `users` - User accounts and profiles
- `accounts` - OAuth provider accounts (Google, etc.)
- `sessions` - User sessions
- `verification_tokens` - Email verification tokens
- `password_reset_tokens` - Password reset tokens

## Features

### Enhanced Login Page
- Modern gradient design with glassmorphism effects
- Real-time form validation
- Password visibility toggle
- Loading states and error handling
- Responsive design
- Google OAuth integration

### Enhanced Signup Page
- Full name, email, and password fields
- Password strength indicator
- Password confirmation with visual feedback
- Real-time validation
- Terms of service links
- Google OAuth integration

### Authentication Flow
- NextAuth.js integration with Supabase adapter
- Google OAuth provider
- Credentials provider with bcrypt password hashing
- Protected routes
- Session management
- Automatic redirects

### Account Dashboard
- User profile display
- Account statistics
- Quick action buttons
- Responsive layout

## Usage

1. Set up your environment variables
2. Run the SQL migration in your Supabase project
3. Run the development server: `npm run dev`
4. Visit http://localhost:9002
5. Test the login/signup flow

## Security Features

- Password hashing with bcrypt
- JWT token management
- Protected routes
- Form validation
- CSRF protection via NextAuth
- Row Level Security (RLS) in Supabase
- OAuth 2.0 with Google

## Migration from Supabase Auth

This project has been migrated from Supabase Auth to NextAuth.js with the following changes:

- ✅ Removed all `supabase.auth` calls
- ✅ Added NextAuth.js with Supabase adapter
- ✅ Added Google OAuth provider
- ✅ Updated registration to use bcrypt password hashing
- ✅ Updated login to use credentials provider
- ✅ Updated user profile API to use users table
- ✅ Added custom password reset flow
- ✅ Added Google OAuth buttons to login/signup pages

## ✅ Success Confirmation

The authentication system is now fully functional! Here's what's working:

- **✅ User Registration**: Users can create accounts via `/signup`
- **✅ User Login**: Users can sign in via `/login`
- **✅ Google OAuth**: Users can sign in with Google
- **✅ Password Reset**: Custom password reset flow
- **✅ Session Management**: NextAuth.js handles sessions
- **✅ Database Integration**: Supabase adapter syncs data
- **✅ Protected Routes**: Authentication required for certain pages 