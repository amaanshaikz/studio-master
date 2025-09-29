#!/bin/bash

# Verify setup without Docker
echo "🔍 Verifying Google Cloud Run Setup"
echo "===================================="

# Check if required files exist
echo "📁 Checking required files..."

files=(
    "Dockerfile"
    ".dockerignore"
    ".github/workflows/deploy.yml"
    "cloud-run.yaml"
    "DEPLOYMENT_GUIDE.md"
    "scripts/build-docker.sh"
    "scripts/test-docker-build.sh"
)

missing_files=()

for file in "${files[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ $file (missing)"
        missing_files+=("$file")
    fi
done

echo ""

# Check Dockerfile content
echo "🐳 Checking Dockerfile configuration..."

if grep -q "FROM node:20-alpine" Dockerfile; then
    echo "✅ Using Node.js 20 Alpine"
else
    echo "❌ Node.js version not optimized"
fi

if grep -q "EXPOSE 8080" Dockerfile; then
    echo "✅ Port 8080 configured for Cloud Run"
else
    echo "❌ Port not configured for Cloud Run"
fi

if grep -q "USER nextjs" Dockerfile; then
    echo "✅ Non-root user configured"
else
    echo "❌ Security: Non-root user not configured"
fi

if grep -q "dummy-secret-for-build" Dockerfile; then
    echo "✅ Dummy environment variables for build"
else
    echo "❌ Build environment variables not configured"
fi

echo ""

# Check GitHub Actions workflow
echo "🚀 Checking GitHub Actions workflow..."

if grep -q "google-github-actions/auth" .github/workflows/deploy.yml; then
    echo "✅ Google Cloud authentication configured"
else
    echo "❌ Google Cloud authentication not configured"
fi

if grep -q "gcr.io" .github/workflows/deploy.yml; then
    echo "✅ Container Registry push configured"
else
    echo "❌ Container Registry not configured"
fi

if grep -q "deploy-cloudrun" .github/workflows/deploy.yml; then
    echo "✅ Cloud Run deployment configured"
else
    echo "❌ Cloud Run deployment not configured"
fi

echo ""

# Check Next.js configuration
echo "⚙️  Checking Next.js configuration..."

if grep -q "output: 'standalone'" next.config.ts; then
    echo "✅ Standalone output configured"
else
    echo "❌ Standalone output not configured"
fi

if grep -q "serverExternalPackages" next.config.ts; then
    echo "✅ External packages configured"
else
    echo "❌ External packages not configured"
fi

echo ""

# Summary
echo "📊 Setup Summary"
echo "================"

if [ ${#missing_files[@]} -eq 0 ]; then
    echo "✅ All required files present"
else
    echo "❌ Missing files: ${missing_files[*]}"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. Install Docker Desktop: https://docs.docker.com/desktop/install/mac-install/"
echo "2. Run: ./scripts/test-docker-build.sh"
echo "3. Set up Google Cloud project and service account"
echo "4. Configure GitHub secrets (GCP_PROJECT_ID, GCP_SA_KEY)"
echo "5. Push to main branch to trigger deployment"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - DOCKER_SETUP_GUIDE.md"
echo "   - DEPLOYMENT_GUIDE.md"
