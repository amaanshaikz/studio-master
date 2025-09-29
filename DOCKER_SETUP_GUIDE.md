# Docker Setup and Testing Guide

This guide will help you install Docker and test the build locally before deploying to Google Cloud Run.

## Docker Installation

### Option 1: Docker Desktop (Recommended)

1. **Download Docker Desktop:**
   - Visit: https://docs.docker.com/desktop/install/mac-install/
   - Download Docker Desktop for Mac (Apple Silicon or Intel)
   - Install the `.dmg` file

2. **Start Docker Desktop:**
   - Open Docker Desktop from Applications
   - Wait for Docker to start (you'll see the Docker icon in the menu bar)
   - Docker is ready when the icon shows "Docker Desktop is running"

### Option 2: Command Line Installation

```bash
# Install Docker using Homebrew (requires manual password entry)
brew install --cask docker

# Start Docker Desktop
open /Applications/Docker.app
```

## Testing the Build

### 1. Quick Test Script

Once Docker is installed and running, use our test script:

```bash
# Run the comprehensive test script
./scripts/test-docker-build.sh
```

This script will:
- ✅ Check if Docker is running
- ✅ Set up environment variables
- ✅ Build the Docker image
- ✅ Show image information
- ✅ Provide testing instructions

### 2. Manual Testing

If you prefer to run commands manually:

```bash
# 1. Set environment variables
export NEXTAUTH_SECRET="dummy-secret-for-build"
export NEXTAUTH_URL="http://localhost:3000"
export DATABASE_URL="dummy-database-url"
export SUPABASE_URL="dummy-supabase-url"
export SUPABASE_ANON_KEY="dummy-supabase-key"

# 2. Build the image
docker build -t nextjs-app:latest .

# 3. Test the container
docker run -p 8080:8080 nextjs-app:latest

# 4. Visit http://localhost:8080 in your browser
```

### 3. Verify Build Success

After building, you should see:

```bash
# Check image size (should be ~100-200MB)
docker images nextjs-app:latest

# Check image layers
docker history nextjs-app:latest

# Test container startup
docker run --rm -p 8080:8080 nextjs-app:latest
```

## Expected Build Output

A successful build should show:

```
✅ Docker build successful!

📊 Image information:
REPOSITORY    TAG       IMAGE ID       CREATED        SIZE
nextjs-app    latest    abc123def456   2 minutes ago   150MB

🚀 To test the container locally:
   docker run -p 8080:8080 nextjs-app:latest

🌐 Then visit: http://localhost:8080
```

## Troubleshooting

### Common Issues:

1. **"Docker is not running"**
   - Start Docker Desktop from Applications
   - Wait for the Docker icon to show "Docker Desktop is running"

2. **"Permission denied"**
   - Make sure Docker Desktop is running
   - Try running: `docker info` to verify Docker is accessible

3. **"Build failed"**
   - Check the error messages in the build output
   - Ensure all files are present (Dockerfile, package.json, etc.)
   - Verify environment variables are set

4. **"Port already in use"**
   - Change the port: `docker run -p 8081:8080 nextjs-app:latest`
   - Or stop other services using port 8080

### Debug Commands:

```bash
# Check Docker status
docker info

# Check running containers
docker ps

# Check all containers
docker ps -a

# Stop all containers
docker stop $(docker ps -q)

# Remove all containers
docker rm $(docker ps -aq)

# Remove the image
docker rmi nextjs-app:latest
```

## Next Steps

Once the Docker build is successful:

1. **Test locally** - Run the container and verify it works
2. **Push to GitHub** - Commit your changes
3. **Set up Google Cloud** - Follow the DEPLOYMENT_GUIDE.md
4. **Deploy to Cloud Run** - Use the GitHub Actions workflow

## Performance Expectations

- **Build time**: 2-5 minutes (first build), 30-60 seconds (cached)
- **Image size**: ~100-200MB (optimized for Cloud Run)
- **Startup time**: 5-10 seconds (cold start)
- **Memory usage**: ~50-100MB (idle), ~200-500MB (active)

## Security Notes

- ✅ **Non-root user** - Container runs as `nextjs` user
- ✅ **Minimal dependencies** - Only production packages
- ✅ **No secrets in image** - Environment variables at runtime
- ✅ **Alpine Linux** - Minimal attack surface

## Support

- **Docker Documentation**: https://docs.docker.com/
- **Docker Desktop**: https://docs.docker.com/desktop/
- **Google Cloud Run**: https://cloud.google.com/run/docs
