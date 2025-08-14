# Vertex AI Integration for CreateX AI

## Overview

This implementation adds Vertex AI support to the CreateX AI system, allowing developers to choose between Gemini API and Vertex AI during development while keeping Gemini API locked as the production backend.

## Features

- ✅ **Environment-based switching**: Automatic backend selection based on `NODE_ENV`
- ✅ **Development flexibility**: Toggle between Vertex AI and Gemini API via `.env`
- ✅ **Production safety**: Gemini API locked as production backend
- ✅ **Graceful fallback**: Automatic fallback to Gemini API if Vertex AI fails
- ✅ **Identical output format**: No breaking changes to existing functionality
- ✅ **Comprehensive logging**: Clear indication of which backend is being used

## Environment Variables

### Required for Vertex AI
```env
# Google Cloud Project settings
GCP_PROJECT_ID=your-gcp-project-id
GCP_LOCATION=us-central1  # or your preferred region
```

### Development Backend Selection
```env
# Development environment only
DEV_AI_BACKEND=vertex  # Use Vertex AI
# DEV_AI_BACKEND=gemini  # Use Gemini API (default)
```

### Example .env.local
```env
# Production (always uses Gemini API)
NODE_ENV=production

# Development with Vertex AI
NODE_ENV=development
DEV_AI_BACKEND=vertex
GCP_PROJECT_ID=my-createx-project
GCP_LOCATION=us-central1

# Development with Gemini API (default)
NODE_ENV=development
# DEV_AI_BACKEND=gemini  # Optional, this is the default
```

## Backend Selection Logic

### Production Environment (`NODE_ENV=production`)
- **Always uses Gemini API**
- No fallback to Vertex AI
- Logs: `"Using Gemini API (production)"`

### Development Environment (`NODE_ENV=development`)

#### When `DEV_AI_BACKEND=vertex`:
1. **Check Vertex AI configuration**
   - If `GCP_PROJECT_ID` and `GCP_LOCATION` are set → Use Vertex AI
   - If not configured → Fall back to Gemini API
2. **Try Vertex AI generation**
   - If successful → Return Vertex AI response
   - If fails → Automatically fall back to Gemini API
3. **Logs**:
   - `"Using Vertex AI (development)"` - When Vertex AI is used
   - `"Vertex AI not configured, using Gemini API"` - When not configured
   - `"Using Gemini API (fallback)"` - When Vertex AI fails

#### When `DEV_AI_BACKEND=gemini` or not set:
- **Always uses Gemini API**
- Logs: `"Using Gemini API (development)"`

## Implementation Details

### Files Modified/Created

#### 1. `src/ai/vertex-ai.ts` (New)
```typescript
import { VertexAI } from '@google-cloud/vertexai';

// Initialize Vertex AI
const vertexAI = new VertexAI({
  project: process.env.GCP_PROJECT_ID,
  location: process.env.GCP_LOCATION
});

export async function generateWithVertex(promptText: string): Promise<string> {
  // Generate content using Gemini 2.0 Flash
}

export function isVertexAIConfigured(): boolean {
  // Check if required environment variables are set
}
```

#### 2. `src/ai/flows/generate-chat-response.ts` (Modified)
- Added `generateResponseWithBackend()` function
- Added `createPromptText()` function for Vertex AI
- Integrated environment-based switching logic
- Maintained identical output format

#### 3. `package.json` (Modified)
- Added `@google-cloud/vertexai` dependency

### Key Functions

#### `generateResponseWithBackend()`
- Determines which backend to use based on environment
- Handles Vertex AI configuration checks
- Implements graceful fallback logic
- Maintains identical output format

#### `createPromptText()`
- Converts Genkit prompt structure to plain text for Vertex AI
- Handles conversation history, document content, and creator profile
- Ensures prompt consistency between backends

#### `generateWithVertex()`
- Direct Vertex AI integration using Gemini 2.0 Flash
- Error handling and logging
- Returns raw text response

## Setup Instructions

### 1. Install Dependencies
```bash
npm install @google-cloud/vertexai
```

### 2. Google Cloud Setup
1. **Create a Google Cloud Project** (if you don't have one)
2. **Enable Vertex AI API**:
   ```bash
   gcloud services enable aiplatform.googleapis.com
   ```
3. **Set up authentication**:
   ```bash
   # Option A: Service Account (recommended for production)
   gcloud auth activate-service-account --key-file=path/to/service-account.json
   
   # Option B: Application Default Credentials (for development)
   gcloud auth application-default login
   ```

### 3. Environment Configuration
```bash
# Copy your project ID and location
echo "GCP_PROJECT_ID=your-project-id" >> .env.local
echo "GCP_LOCATION=us-central1" >> .env.local

# For development with Vertex AI
echo "DEV_AI_BACKEND=vertex" >> .env.local
```

### 4. Test the Integration
```bash
# Start development server
npm run dev

# Check console logs for backend selection
# You should see: "Using Vertex AI (development)" or "Using Gemini API (development)"
```

## Usage Examples

### Development with Vertex AI
```bash
# .env.local
NODE_ENV=development
DEV_AI_BACKEND=vertex
GCP_PROJECT_ID=my-createx-project
GCP_LOCATION=us-central1
```

### Development with Gemini API
```bash
# .env.local
NODE_ENV=development
DEV_AI_BACKEND=gemini
# or omit DEV_AI_BACKEND entirely
```

### Production (Always Gemini API)
```bash
# .env.local
NODE_ENV=production
# DEV_AI_BACKEND is ignored in production
```

## Error Handling

### Vertex AI Configuration Errors
- **Missing environment variables**: Automatically falls back to Gemini API
- **Authentication errors**: Logs error and falls back to Gemini API
- **API errors**: Logs error and falls back to Gemini API

### Fallback Behavior
- **Development**: Vertex AI failures → Gemini API
- **Production**: Gemini API failures → Return error (no fallback)

### Error Logging
```javascript
// Vertex AI configuration missing
console.log('Vertex AI not configured, using Gemini API');

// Vertex AI generation failed
console.error('Vertex AI failed, falling back to Gemini API:', error);
console.log('Using Gemini API (fallback)');
```

## Performance Considerations

### Response Time
- **Vertex AI**: Generally faster for complex prompts
- **Gemini API**: Consistent performance, good for simple queries
- **Fallback**: Minimal overhead when switching backends

### Cost Optimization
- **Development**: Use Vertex AI for testing, Gemini API for cost control
- **Production**: Gemini API provides predictable costs
- **Monitoring**: Track usage patterns to optimize backend selection

## Troubleshooting

### Common Issues

#### 1. "Vertex AI not configured"
**Cause**: Missing `GCP_PROJECT_ID` or `GCP_LOCATION`
**Solution**: Set environment variables in `.env.local`

#### 2. "Vertex AI failed, falling back to Gemini API"
**Cause**: Authentication or API issues
**Solutions**:
- Check Google Cloud authentication: `gcloud auth list`
- Verify API is enabled: `gcloud services list --enabled | grep aiplatform`
- Check project permissions

#### 3. "Using Gemini API (fallback)"
**Cause**: Vertex AI configuration or generation failure
**Solution**: Check console logs for specific error details

### Debug Steps

1. **Check environment variables**:
   ```bash
   echo $GCP_PROJECT_ID
   echo $GCP_LOCATION
   echo $DEV_AI_BACKEND
   ```

2. **Verify Google Cloud setup**:
   ```bash
   gcloud config get-value project
   gcloud auth list
   ```

3. **Test Vertex AI directly**:
   ```javascript
   import { generateWithVertex } from '@/ai/vertex-ai';
   const result = await generateWithVertex('Hello, world!');
   console.log(result);
   ```

## Security Considerations

### Environment Variables
- **Never commit `.env.local`** to version control
- **Use different projects** for development and production
- **Rotate service account keys** regularly

### API Access
- **Limit service account permissions** to Vertex AI only
- **Use IAM roles** with minimal required permissions
- **Monitor API usage** for unexpected activity

## Future Enhancements

### Planned Features
1. **Response comparison**: Side-by-side comparison of Vertex AI vs Gemini API
2. **Performance metrics**: Track response times and success rates
3. **Cost tracking**: Monitor API usage costs
4. **A/B testing**: Automatically test both backends for quality

### Potential Improvements
1. **Caching**: Cache responses to reduce API calls
2. **Load balancing**: Distribute requests between backends
3. **Quality scoring**: Automatically select best backend based on response quality
4. **Custom models**: Support for fine-tuned models on Vertex AI

## Support

For issues with:
- **Vertex AI integration**: Check this documentation and Google Cloud logs
- **Gemini API**: Check existing CreateX AI documentation
- **Environment setup**: Verify `.env.local` configuration
- **Authentication**: Check Google Cloud authentication status

## Changelog

### v1.0.0 (Current)
- ✅ Initial Vertex AI integration
- ✅ Environment-based backend switching
- ✅ Graceful fallback to Gemini API
- ✅ Comprehensive error handling and logging
- ✅ Identical output format maintenance
