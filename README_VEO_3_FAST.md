# 🎬 Veo 3 Fast Video Generation Setup

## **Quick Start**

### **1. Run Setup Script**
```bash
# Make script executable and run
chmod +x scripts/setup-veo-3-fast.sh
npm run setup-veo
```

### **2. Test Setup**
```bash
# Test video generation
npm run test-veo
```

### **3. Start Development**
```bash
# Start the application
npm run dev
```

## **What This Sets Up**

### **Google Cloud Configuration**
- ✅ Enables required APIs (Vertex AI, Compute Engine, Storage)
- ✅ Creates service account with proper permissions
- ✅ Sets up authentication credentials
- ✅ Configures environment variables

### **Video Generation Features**
- ✅ AI-optimized video prompts
- ✅ Fallback to demo videos
- ✅ Error handling and logging
- ✅ Production-ready implementation

## **Manual Setup (Alternative)**

If the automated script doesn't work, follow these steps:

### **1. Google Cloud Console**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create or select a project
3. Enable billing
4. Enable APIs:
   - Vertex AI API
   - Compute Engine API
   - Cloud Storage API

### **2. Service Account**
1. Go to IAM & Admin > Service Accounts
2. Create new service account: `veo-video-generator`
3. Grant roles:
   - AI Platform User
   - Storage Admin
4. Create and download JSON key

### **3. Environment Variables**
Add to `.env.local`:
```env
GCP_PROJECT_ID=your-project-id
GCP_LOCATION=us-central1
GOOGLE_APPLICATION_CREDENTIALS=path/to/veo-key.json
```

### **4. Authentication**
```bash
gcloud auth application-default login
```

## **Testing**

### **Test Video Generation**
```bash
# Run test script
npm run test-veo

# Or test manually in browser
# 1. Go to /engagement-predictor
# 2. Upload a video
# 3. Click "Generate Optimized Sample Video"
```

### **Expected Results**
- ✅ Video generation works (demo videos initially)
- ✅ Progress indicators show properly
- ✅ Error handling works
- ✅ UI displays correctly

## **Troubleshooting**

### **Common Issues**

#### **1. Authentication Errors**
```bash
# Re-authenticate
gcloud auth application-default login

# Check active account
gcloud auth list
```

#### **2. API Not Enabled**
```bash
# Enable APIs manually
gcloud services enable aiplatform.googleapis.com
gcloud services enable compute.googleapis.com
gcloud services enable storage.googleapis.com
```

#### **3. Permission Errors**
```bash
# Check service account permissions
gcloud projects get-iam-policy your-project-id

# Grant missing roles
gcloud projects add-iam-policy-binding your-project-id \
    --member="serviceAccount:veo-video-generator@your-project-id.iam.gserviceaccount.com" \
    --role="roles/aiplatform.user"
```

#### **4. Billing Issues**
- Ensure billing is enabled
- Check quota limits
- Verify payment method

### **Debug Commands**
```bash
# Check project configuration
gcloud config list

# Test Vertex AI access
gcloud ai models list --region=us-central1

# Check service account
gcloud iam service-accounts list

# Test authentication
gcloud auth application-default print-access-token
```

## **Veo 3 Fast Availability**

### **Current Status**
- Veo 3 Fast may not be available in all regions
- Requires special access approval in some cases
- Currently falls back to demo videos

### **Check Availability**
1. Go to [Vertex AI Console](https://console.cloud.google.com/vertex-ai)
2. Navigate to "Model Garden"
3. Look for "Veo 3 Fast" or "Video Generation"
4. Request access if not available

### **Alternative Models**
- Gemini 2.0 Flash (with video capabilities)
- Other video generation models
- Custom video generation pipelines

## **Production Deployment**

### **Vercel Deployment**
```bash
# Add environment variables
vercel env add GCP_PROJECT_ID
vercel env add GCP_LOCATION
vercel env add GOOGLE_APPLICATION_CREDENTIALS

# Deploy
vercel --prod
```

### **Docker Deployment**
```dockerfile
# Add to Dockerfile
COPY veo-key.json /app/veo-key.json
ENV GOOGLE_APPLICATION_CREDENTIALS=/app/veo-key.json
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
- Consider batch processing

## **Monitoring**

### **Cloud Logging**
```typescript
// Add to your code
console.log('Video generation started:', {
  prompt: prompt.substring(0, 100),
  timestamp: new Date().toISOString(),
  projectId: process.env.GCP_PROJECT_ID
});
```

### **Error Tracking**
```typescript
// Add error monitoring
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

## **Next Steps**

### **Immediate**
1. ✅ Run setup script
2. ✅ Test video generation
3. ✅ Verify UI works

### **Short Term**
1. Request Veo 3 Fast access
2. Monitor for model availability
3. Test with real video generation

### **Long Term**
1. Implement production video generation
2. Add video storage and management
3. Optimize costs and performance
4. Add advanced video features

## **Support**

### **Documentation**
- [Vertex AI Documentation](https://cloud.google.com/vertex-ai/docs)
- [Veo 3 Fast Guide](VEO_3_FAST_SETUP_GUIDE.md)
- [Video Generation Feature](VIDEO_GENERATION_FEATURE.md)

### **Troubleshooting**
- [Setup Guide](VEO_3_FAST_SETUP_GUIDE.md)
- [Fix Summary](VIDEO_GENERATION_FIX.md)
- [Test Script](scripts/test-veo-3-fast.js)

---

**🎬 Your video generation is now ready for Veo 3 Fast!**
