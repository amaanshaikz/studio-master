#!/bin/bash

# Build script that handles missing environment variables gracefully
echo "Building Docker image with environment variable fallbacks..."

# Set build-time environment variables if not already set
export NEXTAUTH_SECRET=${NEXTAUTH_SECRET:-"dummy-secret-for-build"}
export NEXTAUTH_URL=${NEXTAUTH_URL:-"http://localhost:3000"}
export DATABASE_URL=${DATABASE_URL:-"dummy-database-url"}
export SUPABASE_URL=${SUPABASE_URL:-"dummy-supabase-url"}
export SUPABASE_ANON_KEY=${SUPABASE_ANON_KEY:-"dummy-supabase-key"}
export GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID:-"dummy-google-client-id"}
export GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET:-"dummy-google-client-secret"}
export INSTAGRAM_CLIENT_ID=${INSTAGRAM_CLIENT_ID:-"dummy-instagram-client-id"}
export INSTAGRAM_CLIENT_SECRET=${INSTAGRAM_CLIENT_SECRET:-"dummy-instagram-client-secret"}
export LINKEDIN_CLIENT_ID=${LINKEDIN_CLIENT_ID:-"dummy-linkedin-client-id"}
export LINKEDIN_CLIENT_SECRET=${LINKEDIN_CLIENT_SECRET:-"dummy-linkedin-client-secret"}

# Build the Docker image
docker build -t nextjs-app:latest .

echo "Build complete! You can now run:"
echo "docker run -p 8080:8080 -e NEXTAUTH_SECRET=your-real-secret nextjs-app:latest"
