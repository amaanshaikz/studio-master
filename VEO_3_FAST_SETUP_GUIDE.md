# 🎬 Veo 3 Fast Setup Guide

## **Overview**

Veo 3 Fast is Google's latest AI video generation model available through Vertex AI. This guide will help you set up proper access and integrate it into your application.

## **Prerequisites**

- Google Cloud Project with billing enabled
- Vertex AI API enabled
- Proper authentication credentials
- Veo 3 Fast access (may require special approval)

## **Step 1: Google Cloud Project Setup**

### **1.1 Create/Select Project**
```bash
# List existing projects
gcloud projects list

# Create new project (if needed)
gcloud projects create your-project-id --name="Your Project Name"

# Set project
gcloud config set project your-project-id
```

### **1.2 Enable Billing**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Navigate to Billing
- Link a billing account to your project
- **Important**: Veo 3 Fast requires active billing

### **1.3 Enable Required APIs**
```bash
# Enable Vertex AI API
gcloud services enable aiplatform.googleapis.com

# Enable Compute Engine API (required for Vertex AI)
gcloud services enable compute.googleapis.com

# Enable Storage API (for video storage)
gcloud services enable storage.googleapis.com
```

## **Step 2: Authentication Setup**

### **2.1 Service Account Creation**
```bash
# Create service account
gcloud iam service-accounts create veo-video-generator \
    --display-name="Veo Video Generator" \
    --description="Service account for Veo 3 Fast video generation"

# Get project ID
PROJECT_ID=$(gcloud config get-value project)

# Grant necessary roles
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:veo-video-generator@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"

gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:veo-video-generator@$PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/storage.admin"
```

### **2.2 Create and Download Key**
```bash
# Create service account key
gcloud iam service-accounts keys create veo-key.json \
    --iam-account=veo-video-generator@$PROJECT_ID.iam.gserviceaccount.com

# Set environment variable
export GOOGLE_APPLICATION_CREDENTIALS="path/to/veo-key.json"
```

## **Step 3: Veo 3 Fast Access Request**

### **3.1 Request Access**
Veo 3 Fast may require special access approval:

1. Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai)
2. Navigate to "Model Garden" or "Generative AI Studio"
3. Look for "Veo 3 Fast" or "Video Generation"
4. Request access if not immediately available
5. Fill out the access request form
6. Wait for approval (can take 1-7 days)

### **3.2 Alternative: Use Gemini 2.0 Flash with Video**
If Veo 3 Fast is not available, you can use Gemini 2.0 Flash with video capabilities:

```bash
# Check available models
gcloud ai models list --region=us-central1
```

## **Step 4: Environment Configuration**

### **4.1 Update Environment Variables**
```env
# Google Cloud Configuration
GCP_PROJECT_ID=your-project-id
GCP_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=path/to/veo-key.json

# Optional: Custom bucket for video storage
GCS_BUCKET_NAME=your-video-bucket
```

### **4.2 Install Required Dependencies**
```bash
# Install Google Cloud AI Platform
npm install @google-cloud/aiplatform

# Install additional video processing libraries
npm install @google-cloud/storage
```

## **Step 5: Code Implementation**

### **5.1 Update Vertex AI Configuration**
```typescript
// src/ai/vertex-ai.ts
import { VertexAI } from '@google-cloud/vertexai';

const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID!,
  location: process.env.GCP_LOCATION!,
  // Use service account key if not using default credentials
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
```

### **5.2 Implement Veo 3 Fast Integration**
```typescript
export async function generateVideoWithVeo(prompt: string): Promise<string> {
  try {
    console.log('Using Veo 3 Fast for video generation...');
    
    // Use the video generation model
    const model = vertexAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp", // or "veo-3-fast" when available
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    });

    // Create video generation request
    const request = {
      contents: [{
        role: "user",
        parts: [{
          text: prompt,
          // Video generation parameters
          videoConfig: {
            duration: 10, // 8-10 seconds
            aspectRatio: "9:16", // Vertical format
            quality: "high",
            style: "cinematic"
          }
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    };

    const response = await model.generateContent(request);
    
    // Extract video URL or generation ID
    const result = response.response.candidates[0].content.parts[0];
    
    if (result.videoUrl) {
      return result.videoUrl;
    } else if (result.text) {
      // Parse video URL from text response
      const videoUrlMatch = result.text.match(/https:\/\/[^\s]+\.mp4/);
      if (videoUrlMatch) {
        return videoUrlMatch[0];
      }
    }
    
    throw new Error('No video URL found in response');
    
  } catch (error) {
    console.error('Veo 3 Fast video generation failed:', error);
    throw error;
  }
}
```

## **Step 6: Testing**

### **6.1 Test Authentication**
```bash
# Test authentication
gcloud auth application-default print-access-token

# Test Vertex AI access
gcloud ai models list --region=us-central1
```

### **6.2 Test Video Generation**
```typescript
// Test script
import { generateVideoWithVeo } from './src/ai/vertex-ai';

async function testVideoGeneration() {
  try {
    const prompt = "Create a 10-second vertical video of a sunset over mountains with cinematic quality";
    const videoUrl = await generateVideoWithVeo(prompt);
    console.log('Generated video URL:', videoUrl);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testVideoGeneration();
```

## **Step 7: Production Deployment**

### **7.1 Vercel Deployment**
```bash
# Add environment variables to Vercel
vercel env add GCP_PROJECT_ID
vercel env add GCP_LOCATION
vercel env add GOOGLE_APPLICATION_CREDENTIALS
```

### **7.2 Docker Deployment**
```dockerfile
# Add to Dockerfile
COPY veo-key.json /app/veo-key.json
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/veo-key.json
```

## **Troubleshooting**

### **Common Issues**

#### **1. Authentication Errors**
```bash
# Re-authenticate
gcloud auth application-default login

# Check service account permissions
gcloud projects get-iam-policy your-project-id
```

#### **2. API Not Enabled**
```bash
# Enable required APIs
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
```

#### **3. Billing Issues**
- Ensure billing is enabled
- Check quota limits
- Verify payment method

#### **4. Model Access**
- Veo 3 Fast may not be available in all regions
- Try different regions: us-central1, us-east1, europe-west1
- Check for access restrictions

### **Debug Commands**
```bash
# Check project configuration
gcloud config list

# Test API access
gcloud ai models list --region=us-central1

# Check service account
gcloud iam service-accounts list

# Test authentication
gcloud auth list
```

## **Cost Considerations**

### **Veo 3 Fast Pricing**
- **Input**: $0.10 per second of video
- **Output**: $0.20 per second of video
- **Storage**: Additional costs for video storage

### **Cost Optimization**
- Use shorter video durations (8-10 seconds)
- Implement caching for repeated requests
- Monitor usage and set up billing alerts
- Consider batch processing for multiple videos

## **Security Best Practices**

### **1. Service Account Security**
- Use least privilege principle
- Rotate keys regularly
- Store keys securely (not in code)

### **2. API Security**
- Implement rate limiting
- Add request validation
- Use HTTPS only
- Monitor API usage

### **3. Video Storage**
- Use private buckets
- Implement access controls
- Set up lifecycle policies
- Monitor storage costs

## **Monitoring and Logging**

### **1. Cloud Logging**
```typescript
// Add logging to video generation
console.log('Video generation started:', {
  prompt: prompt.substring(0, 100),
  timestamp: new Date().toISOString(),
  projectId: process.env.GCP_PROJECT_ID
});
```

### **2. Error Monitoring**
```typescript
// Add error tracking
try {
  const videoUrl = await generateVideoWithVeo(prompt);
  // Log success
} catch (error) {
  // Log error details
  console.error('Video generation error:', {
    error: error.message,
    stack: error.stack,
    prompt: prompt.substring(0, 100)
  });
}
```

## **Next Steps**

1. **Complete Setup**: Follow all steps above
2. **Test Integration**: Run test scripts
3. **Update Code**: Implement actual Veo 3 Fast calls
4. **Deploy**: Update production environment
5. **Monitor**: Set up logging and monitoring

---

**🎬 Once setup is complete, your video generation will use real AI-generated content instead of demo videos!**
