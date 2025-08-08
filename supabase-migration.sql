-- Create the users table for NextAuth
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  emailVerified TIMESTAMP WITH TIME ZONE,
  image TEXT,
  password TEXT,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the accounts table for NextAuth OAuth providers
CREATE TABLE IF NOT EXISTS accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  providerAccountId VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type VARCHAR(255),
  scope VARCHAR(255),
  id_token TEXT,
  session_state VARCHAR(255),
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, providerAccountId)
);

-- Create the sessions table for NextAuth
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sessionToken VARCHAR(255) UNIQUE NOT NULL,
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the verification tokens table for NextAuth
CREATE TABLE IF NOT EXISTS verification_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  userId UUID REFERENCES users(id) ON DELETE CASCADE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create the password reset tokens table for custom password reset
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expiresAt TIMESTAMP WITH TIME ZONE NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS accounts_userId_idx ON accounts(userId);
CREATE INDEX IF NOT EXISTS sessions_userId_idx ON sessions(userId);
CREATE INDEX IF NOT EXISTS sessions_sessionToken_idx ON sessions(sessionToken);
CREATE INDEX IF NOT EXISTS verification_tokens_identifier_idx ON verification_tokens(identifier);
CREATE INDEX IF NOT EXISTS verification_tokens_token_idx ON verification_tokens(token);
CREATE INDEX IF NOT EXISTS verification_tokens_userId_idx ON verification_tokens(userId);
CREATE INDEX IF NOT EXISTS password_reset_tokens_userId_idx ON password_reset_tokens(userId);
CREATE INDEX IF NOT EXISTS password_reset_tokens_token_idx ON password_reset_tokens(token);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (basic policies - adjust based on your needs)
-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = 'service_role');

-- Allow service role to access all data (for NextAuth)
CREATE POLICY "Service role can access all users" ON users
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all accounts" ON accounts
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all sessions" ON sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all verification tokens" ON verification_tokens
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role can access all password reset tokens" ON password_reset_tokens
  FOR ALL USING (auth.role() = 'service_role');
