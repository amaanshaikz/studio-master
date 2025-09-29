# Google Cloud Run Deployment Guide

This guide will help you deploy your Next.js application to Google Cloud Run using GitHub Actions and Docker.

## Prerequisites

1. **Google Cloud Project** with billing enabled
2. **GitHub Repository** with your code
3. **Google Cloud Service Account** with required permissions

## Setup Steps

### 1. Enable Required APIs

```bash
# Enable required Google Cloud APIs
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable containerregistry.googleapis.com
gcloud services enable iam.googleapis.com
```

### 2. Create Service Account

```bash
# Create service account
gcloud iam service-accounts create github-actions \
    --display-name="GitHub Actions" \
    --description="Service account for GitHub Actions deployment"

# Grant required permissions
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/run.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"

gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:github-actions@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/iam.serviceAccountUser"
```

### 3. Create and Download Service Account Key

```bash
# Create service account key
gcloud iam service-accounts keys create github-actions-key.json \
    --iam-account=github-actions@PROJECT_ID.iam.gserviceaccount.com
```

### 4. Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. **GCP_PROJECT_ID**: Your Google Cloud Project ID
2. **GCP_SA_KEY**: Contents of the `github-actions-key.json` file

### 5. Environment Variables

The build process uses dummy environment variables to prevent build failures. Set real environment variables in Cloud Run:

```bash
# Deploy with environment variables
gcloud run deploy nextjs-app \
    --image gcr.io/PROJECT_ID/nextjs-app:latest \
    --region us-central1 \
    --platform managed \
    --allow-unauthenticated \
    --port 8080 \
    --memory 1Gi \
    --cpu 1 \
    --min-instances 0 \
    --max-instances 10 \
    --set-env-vars="NODE_ENV=production,NEXTAUTH_SECRET=your-secret,NEXTAUTH_URL=https://your-domain.com,DATABASE_URL=your-database-url,SUPABASE_URL=your-supabase-url,SUPABASE_ANON_KEY=your-supabase-key"
```

#### Build-Time Environment Variables:
The Dockerfile includes dummy environment variables during build to prevent failures:
- `NEXTAUTH_SECRET=dummy-secret-for-build`
- `DATABASE_URL=dummy-database-url`
- `SUPABASE_URL=dummy-supabase-url`
- And other required variables...

These are replaced with real values at runtime in Cloud Run.

## Docker Configuration

### Dockerfile Features:
- ✅ **Multi-stage build** for optimized image size
- ✅ **Node.js 20 Alpine** for security and performance
- ✅ **Non-root user** for security
- ✅ **Port 8080** for Cloud Run compatibility
- ✅ **Standalone output** for minimal dependencies

### Build Optimization:
- ✅ **Layer caching** for faster builds
- ✅ **Production dependencies only**
- ✅ **Minimal attack surface**
- ✅ **Optimized for Cloud Run**

## GitHub Actions Workflow

The workflow automatically:
1. **Builds** the Docker image
2. **Pushes** to Google Container Registry
3. **Deploys** to Cloud Run
4. **Configures** auto-scaling and security

### Trigger Events:
- **Push to main**: Automatic deployment
- **Pull requests**: Build and test (no deployment)

## Cloud Run Configuration

### Performance Settings:
- **Memory**: 1Gi (adjustable based on needs)
- **CPU**: 1 vCPU
- **Concurrency**: 100 requests per instance
- **Timeout**: 300 seconds
- **Min instances**: 0 (cost optimization)
- **Max instances**: 10 (scalability)

### Health Checks:
- **Liveness probe**: Checks if container is running
- **Readiness probe**: Checks if container is ready to serve traffic
- **Startup time**: 30 seconds initial delay

## Monitoring and Logs

### View Logs:
```bash
# View recent logs
gcloud logs read --service=nextjs-app --region=us-central1 --limit=50

# Follow logs in real-time
gcloud logs tail --service=nextjs-app --region=us-central1
```

### Monitor Performance:
```bash
# View service details
gcloud run services describe nextjs-app --region=us-central1

# View revisions
gcloud run revisions list --service=nextjs-app --region=us-central1
```

## Custom Domain Setup

```bash
# Map custom domain
gcloud run domain-mappings create \
    --service nextjs-app \
    --domain your-domain.com \
    --region us-central1
```

## Cost Optimization

### Resource Optimization:
- **Min instances**: 0 (no idle costs)
- **Memory**: Start with 1Gi, adjust based on usage
- **CPU**: Use 1 CPU unless you need more
- **Concurrency**: Higher values = fewer instances needed

### Monitoring Costs:
```bash
# View current usage
gcloud billing budgets list

# Set up budget alerts
gcloud billing budgets create \
    --billing-account=BILLING_ACCOUNT_ID \
    --display-name="Cloud Run Budget" \
    --budget-amount=100USD
```

## Security Best Practices

1. **Service Account**: Use least privilege access
2. **Environment Variables**: Store secrets securely
3. **HTTPS Only**: Cloud Run enforces HTTPS
4. **Non-root User**: Container runs as non-root
5. **Image Scanning**: Enable vulnerability scanning

## Troubleshooting

### Common Issues:

1. **Build Fails**: Check GitHub Actions logs
2. **Deployment Fails**: Verify service account permissions
3. **App Crashes**: Check Cloud Run logs
4. **Memory Issues**: Increase memory allocation
5. **Timeout Issues**: Increase timeout settings

### Debug Commands:

```bash
# Check service status
gcloud run services describe nextjs-app --region=us-central1

# View build logs
gcloud builds list --limit=5

# Test deployment locally
docker run -p 8080:8080 gcr.io/PROJECT_ID/nextjs-app:latest
```

## Next Steps

1. **Set up monitoring** with Cloud Monitoring
2. **Configure alerts** for errors and performance
3. **Set up CI/CD** for multiple environments
4. **Implement database** connections
5. **Add custom domain** and SSL certificates

## Support

- **Google Cloud Documentation**: https://cloud.google.com/run/docs
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Docker Best Practices**: https://docs.docker.com/develop/dev-best-practices/
