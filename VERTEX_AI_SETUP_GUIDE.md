# Vertex AI Setup Guide for CreateX AI

## Current Status

The video upload and analysis functionality is **partially working** but has some issues:

✅ **Working:**
- Video upload interface (drag & drop, file selection)
- Video analysis API endpoint
- Fallback mock data when Vertex AI fails
- Chatbox integration with video analysis results
- Score display and UI components

❌ **Issues:**
- Vertex AI integration is failing due to authentication
- Video analysis falls back to mock data instead of real AI analysis
- No actual video content analysis is happening

## Video Upload Flow

1. **User uploads video** → File is validated and stored
2. **Analysis request** → API sends video metadata to Vertex AI
3. **AI Analysis** → Vertex AI analyzes content and returns scores
4. **Results display** → Scores shown in UI, summary in chatbox
5. **Chat integration** → Users can ask questions about their video

## Current Implementation

### Video Upload Component (`VideoUploadBox.tsx`)
- ✅ Drag & drop functionality
- ✅ File validation (video types only)
- ✅ File size display
- ✅ Remove file option
- ✅ Analyze button (enabled when file selected)

### Video Analysis API (`/api/analyzeVideo`)
- ✅ File upload handling
- ✅ Vertex AI integration attempt
- ✅ Fallback to mock data
- ✅ JSON response with scores and metadata

### Chatbox Integration (`CreateXChatbox.tsx`)
- ✅ Displays video analysis results
- ✅ Shows optimization suggestions
- ✅ Context-aware chat (includes video analysis)
- ✅ Better placeholder text and status indicators

## Vertex AI Authentication Issues

### Problem
The application is configured with:
- `GCP_PROJECT_ID=createxai`
- `GCP_LOCATION=us-central1`
- `DEV_AI_BACKEND=vertexai`

But Vertex AI calls are failing due to authentication.

### Required Setup

#### Option 1: Service Account Key (Recommended for Production)
1. Create a service account in Google Cloud Console
2. Download the JSON key file
3. Set environment variable:
   ```bash
   export GOOGLE_APPLICATION_CREDENTIALS="/path/to/service-account-key.json"
   ```

#### Option 2: Application Default Credentials (Recommended for Development)
1. Install Google Cloud CLI:
   ```bash
   # macOS
   brew install google-cloud-sdk
   
   # Or download from: https://cloud.google.com/sdk/docs/install
   ```

2. Authenticate:
   ```bash
   gcloud auth login
   gcloud config set project createxai
   gcloud auth application-default login
   ```

#### Option 3: Use Gemini API Instead (Simpler Alternative)
1. Get API key from: https://makersuite.google.com/app/apikey
2. Set environment variable:
   ```bash
   export GOOGLE_AI_API_KEY="your_api_key_here"
   ```

3. Update code to use Gemini API instead of Vertex AI

## Testing the Current Implementation

### Test Video Upload
1. Go to `/engagement-predictor`
2. Upload any video file
3. Click "Predict & Optimize"
4. Check browser console for errors
5. Verify scores are displayed
6. Check chatbox for analysis summary

### Test API Directly
```bash
# Create test video
echo "test" > test.mp4

# Test API
curl -X POST -F "file=@test.mp4" http://localhost:9002/api/analyzeVideo
```

### Expected Response
```json
{
  "scores": {
    "viralityScore": 62,
    "relatability": 68,
    "nicheAlignment": 55,
    "visualAppeal": 72,
    "averageViewRange": "2k–6k views",
    "engagementPercent": 4.1,
    "aestheticsScore": 70
  },
  "summary": "Short talking-head reel with a quick hook...",
  "suggestions": "- Tighten the first 2 seconds...",
  "metadata": {
    "usedVertexAI": false,
    "fileName": "test.mp4",
    "fileSize": 5,
    "fileType": "video/mp4"
  }
}
```

## Next Steps

### Immediate (Fix Authentication)
1. Set up Google Cloud authentication
2. Test Vertex AI integration
3. Verify real video analysis works

### Future Enhancements
1. **Real Video Analysis**: Extract audio, analyze content, detect objects
2. **Transcript Generation**: Convert speech to text for better analysis
3. **Content Classification**: Identify video type, mood, target audience
4. **Trend Analysis**: Compare with current social media trends
5. **A/B Testing**: Suggest multiple optimization strategies

## Troubleshooting

### Common Issues

#### "Vertex AI not configured"
- Check environment variables
- Verify Google Cloud project exists
- Ensure location is correct

#### "Authentication failed"
- Check service account permissions
- Verify API is enabled in Google Cloud
- Check billing is set up

#### "Model not found"
- Verify Gemini 2.0 Flash is available in your region
- Check model name spelling

### Debug Commands
```bash
# Check environment
echo $GCP_PROJECT_ID
echo $GCP_LOCATION
echo $GOOGLE_APPLICATION_CREDENTIALS

# Test Google Cloud access
gcloud auth list
gcloud config list

# Check Vertex AI API
gcloud services list --enabled | grep aiplatform
```

## Conclusion

The video upload and analysis system is **functionally complete** but needs proper Vertex AI authentication to provide real AI-powered analysis. The fallback system ensures the application remains usable while authentication issues are resolved.

Once Vertex AI is properly configured, users will get:
- Real content analysis based on video metadata
- Personalized optimization suggestions
- AI-powered engagement predictions
- Context-aware chat assistance
