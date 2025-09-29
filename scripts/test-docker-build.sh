#!/bin/bash

# Test script for Docker build
echo "🐳 Testing Docker Build for Google Cloud Run"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    echo "   You can download Docker Desktop from: https://docs.docker.com/desktop/install/mac-install/"
    exit 1
fi

echo "✅ Docker is running"

# Set build-time environment variables
echo "🔧 Setting up environment variables for build..."
export NEXTAUTH_SECRET="dummy-secret-for-build"
export NEXTAUTH_URL="http://localhost:3000"
export DATABASE_URL="dummy-database-url"
export SUPABASE_URL="dummy-supabase-url"
export SUPABASE_ANON_KEY="dummy-supabase-key"
export GOOGLE_CLIENT_ID="dummy-google-client-id"
export GOOGLE_CLIENT_SECRET="dummy-google-client-secret"
export INSTAGRAM_CLIENT_ID="dummy-instagram-client-id"
export INSTAGRAM_CLIENT_SECRET="dummy-instagram-client-secret"
export LINKEDIN_CLIENT_ID="dummy-linkedin-client-id"
export LINKEDIN_CLIENT_SECRET="dummy-linkedin-client-secret"

echo "🏗️  Building Docker image..."
docker build -t nextjs-app:latest .

if [ $? -eq 0 ]; then
    echo "✅ Docker build successful!"
    
    echo "📊 Image information:"
    docker images nextjs-app:latest
    
    echo ""
    echo "🚀 To test the container locally:"
    echo "   docker run -p 8080:8080 nextjs-app:latest"
    echo ""
    echo "🌐 Then visit: http://localhost:8080"
    echo ""
    echo "🛑 To stop the container:"
    echo "   docker stop \$(docker ps -q --filter ancestor=nextjs-app:latest)"
    
    echo ""
    echo "📦 To push to Google Container Registry:"
    echo "   docker tag nextjs-app:latest gcr.io/PROJECT_ID/nextjs-app:latest"
    echo "   docker push gcr.io/PROJECT_ID/nextjs-app:latest"
    
else
    echo "❌ Docker build failed!"
    echo "Check the error messages above for details."
    exit 1
fi
