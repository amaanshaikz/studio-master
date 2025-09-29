#!/bin/bash

# Veo 3 Fast Setup Script
# This script helps set up Google Cloud for Veo 3 Fast video generation

set -e

echo "🎬 Setting up Veo 3 Fast for video generation..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    print_error "gcloud CLI is not installed. Please install it first:"
    echo "https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Check if user is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    print_warning "You are not authenticated with gcloud. Please run:"
    echo "gcloud auth login"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    print_error "No project ID set. Please run:"
    echo "gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi

print_status "Using project: $PROJECT_ID"

# Enable required APIs
print_status "Enabling required APIs..."
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable storage.googleapis.com
print_success "APIs enabled successfully"

# Create service account
SERVICE_ACCOUNT_NAME="veo-video-generator"
SERVICE_ACCOUNT_EMAIL="${SERVICE_ACCOUNT_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

print_status "Creating service account: $SERVICE_ACCOUNT_NAME"
gcloud iam service-accounts create $SERVICE_ACCOUNT_NAME \
    --display-name="Veo Video Generator" \
    --description="Service account for Veo 3 Fast video generation" \
    --quiet || print_warning "Service account may already exist"

# Grant necessary roles
print_status "Granting IAM roles..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/aiplatform.user" \
    --quiet

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${SERVICE_ACCOUNT_EMAIL}" \
    --role="roles/storage.admin" \
    --quiet

print_success "IAM roles granted"

# Create service account key
KEY_FILE="veo-key.json"
print_status "Creating service account key..."
gcloud iam service-accounts keys create $KEY_FILE \
    --iam-account=$SERVICE_ACCOUNT_EMAIL \
    --quiet || print_warning "Key file may already exist"

# Set up authentication
print_status "Setting up authentication..."
gcloud auth application-default login

# Create .env.local file
ENV_FILE=".env.local"
print_status "Creating environment configuration..."

# Check if .env.local exists
if [ -f "$ENV_FILE" ]; then
    print_warning ".env.local already exists. Backing up to .env.local.backup"
    cp $ENV_FILE .env.local.backup
fi

# Add Veo 3 Fast configuration to .env.local
cat >> $ENV_FILE << EOF

# Veo 3 Fast Configuration
GCP_PROJECT_ID=$PROJECT_ID
GCP_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=./$KEY_FILE
EOF

print_success "Environment configuration added to $ENV_FILE"

# Test Vertex AI access
print_status "Testing Vertex AI access..."
if gcloud ai models list --region=us-central1 --limit=1 > /dev/null 2>&1; then
    print_success "Vertex AI access confirmed"
else
    print_warning "Vertex AI access test failed. You may need to enable billing or wait for API propagation."
fi

# Check for Veo 3 Fast availability
print_status "Checking for Veo 3 Fast availability..."
if gcloud ai models list --region=us-central1 --filter="displayName:veo" > /dev/null 2>&1; then
    print_success "Veo 3 Fast models found!"
else
    print_warning "Veo 3 Fast models not found. This may require special access approval."
    echo "Please check the Vertex AI console for model availability."
fi

# Create storage bucket for videos (optional)
BUCKET_NAME="${PROJECT_ID}-veo-videos"
print_status "Creating storage bucket for videos..."
gsutil mb gs://$BUCKET_NAME 2>/dev/null || print_warning "Bucket may already exist or creation failed"

# Add bucket to .env.local
echo "GCS_BUCKET_NAME=$BUCKET_NAME" >> $ENV_FILE

print_success "Setup completed!"

echo ""
echo "📋 Next Steps:"
echo "1. Check your .env.local file for the configuration"
echo "2. Install dependencies: npm install"
echo "3. Test the setup: npm run dev"
echo "4. Check Vertex AI console for Veo 3 Fast availability"
echo "5. If Veo 3 Fast is not available, request access through Google Cloud Console"

echo ""
echo "🔧 Manual Steps (if needed):"
echo "1. Go to https://console.cloud.google.com/vertex-ai"
echo "2. Navigate to 'Model Garden' or 'Generative AI Studio'"
echo "3. Look for 'Veo 3 Fast' or 'Video Generation'"
echo "4. Request access if not immediately available"

echo ""
echo "📁 Files created:"
echo "- $KEY_FILE (service account key)"
echo "- $ENV_FILE (environment configuration)"
echo "- .env.local.backup (backup of existing .env.local)"

print_success "Veo 3 Fast setup script completed!"
