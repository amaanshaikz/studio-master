# 🚀 Platform Integration Setup Guide

This guide will help you set up fully functional Instagram Graph API and LinkedIn API integrations with proper webhook handling and secure token management.

## 📋 Prerequisites

- ✅ Next.js application running on port 9002
- ✅ Supabase project configured
- ✅ Database migration completed
- ✅ Environment variables set up

## 🔧 Environment Variables

Ensure your `.env.local` file contains all required variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Instagram Configuration
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
INSTAGRAM_WEBHOOK_SECRET=your_webhook_secret

# LinkedIn Configuration
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
LINKEDIN_WEBHOOK_SECRET=your_webhook_secret

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:9002
```

## 📊 Database Schema

The following tables have been created in your Supabase database:

### Core Tables
- `platform_connections` - Stores OAuth connections and tokens
- `webhook_events` - Stores incoming webhook events
- `instagram_data` - Instagram-specific user data
- `linkedin_data` - LinkedIn-specific user data
- `instagram_media` - Instagram posts and media
- `linkedin_posts` - LinkedIn posts and content

### Security Features
- ✅ Row Level Security (RLS) enabled
- ✅ Token encryption using AES-256-CBC
- ✅ Secure webhook signature verification
- ✅ Automatic token validation and refresh

## 🔗 Instagram Graph API Setup

### 1. Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app or use existing app
3. Add **Instagram Basic Display** product
4. Configure OAuth settings

### 2. Configure Instagram Basic Display

1. In your Facebook app dashboard:
   - Go to **Instagram Basic Display** > **Basic Display**
   - Add your domain to **Valid OAuth Redirect URIs**:
     ```
     http://localhost:9002/api/auth/callback/instagram
     https://yourdomain.com/api/auth/callback/instagram
     ```
   - Set **Deauthorize Callback URL**:
     ```
     http://localhost:9002/api/platforms/instagram/disconnect
     https://yourdomain.com/api/platforms/instagram/disconnect
     ```
   - Set **Data Deletion Request URL**:
     ```
     http://localhost:9002/api/platforms/instagram/disconnect
     https://yourdomain.com/api/platforms/instagram/disconnect
     ```

### 3. Configure Webhooks (Optional)

1. Go to **Instagram Basic Display** > **Webhooks**
2. Add webhook URL:
   ```
   https://yourdomain.com/api/webhooks/instagram
   ```
3. Subscribe to events:
   - `messages`
   - `mentions`
   - `comments`

### 4. Set Environment Variables

```env
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
INSTAGRAM_WEBHOOK_SECRET=your_webhook_secret
```

## 🔗 LinkedIn API Setup

### 1. Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Configure OAuth 2.0 settings

### 2. Configure OAuth 2.0

1. In your LinkedIn app dashboard:
   - Go to **Auth** tab
   - Add **Authorized redirect URLs**:
     ```
     http://localhost:9002/api/auth/callback/linkedin
     https://yourdomain.com/api/auth/callback/linkedin
     ```
   - Request these scopes:
     - `r_liteprofile` (Read basic profile)
     - `r_emailaddress` (Read email address)
     - `w_member_social` (Write posts)

### 3. Configure Webhooks (Optional)

1. Go to **Webhooks** tab
2. Add webhook URL:
   ```
   https://yourdomain.com/api/webhooks/linkedin
   ```
3. Subscribe to events:
   - `PROFILE_UPDATE`
   - `CONNECTION_ADDED`
   - `POST_CREATED`
   - `ENGAGEMENT`

### 4. Set Environment Variables

```env
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_WEBHOOK_VERIFY_TOKEN=your_custom_verify_token
LINKEDIN_WEBHOOK_SECRET=your_webhook_secret
```

## 🧪 Testing Your Integration

### 1. Run the Test Suite

```bash
node test-platform-integrations.js
```

This will test:
- ✅ Server health and authentication
- ✅ API endpoints
- ✅ Webhook verification
- ✅ OAuth callback handling
- ✅ Environment variable configuration

### 2. Manual Testing

1. **OAuth Flow Test**:
   - Visit your app and try connecting Instagram/LinkedIn
   - Verify tokens are stored encrypted in database
   - Check that profile data is fetched correctly

2. **API Endpoint Test**:
   ```bash
   # Test Instagram API (requires authentication)
   curl -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
        http://localhost:9002/api/platforms/instagram
   
   # Test LinkedIn API (requires authentication)
   curl -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
        http://localhost:9002/api/platforms/linkedin
   ```

3. **Webhook Test**:
   ```bash
   # Test Instagram webhook verification
   curl "http://localhost:9002/api/webhooks/instagram?hub.mode=subscribe&hub.verify_token=YOUR_TOKEN&hub.challenge=test"
   
   # Test LinkedIn webhook verification
   curl "http://localhost:9002/api/webhooks/linkedin?challenge=test&token=YOUR_TOKEN"
   ```

## 🔒 Security Features

### Token Encryption
- All access tokens are encrypted using AES-256-CBC
- Encryption key is stored in environment variables
- Tokens are automatically decrypted when needed

### Webhook Security
- Signature verification for Instagram webhooks
- HMAC-SHA256 verification for LinkedIn webhooks
- Verification tokens prevent unauthorized access

### Database Security
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Service role has access for webhook processing

## 📈 Monitoring and Debugging

### 1. Check Database Tables

```sql
-- Check platform connections
SELECT * FROM platform_connections WHERE is_active = true;

-- Check webhook events
SELECT platform, event_type, created_at, processed 
FROM webhook_events 
ORDER BY created_at DESC 
LIMIT 10;

-- Check Instagram data
SELECT username, account_type, media_count 
FROM instagram_data;

-- Check LinkedIn data
SELECT first_name, last_name, email 
FROM linkedin_data;
```

### 2. Monitor Logs

The application logs detailed information about:
- OAuth flow progress
- API calls and responses
- Webhook events received
- Token refresh attempts
- Error conditions

### 3. Common Issues and Solutions

#### Issue: "Authentication required" errors
**Solution**: Ensure user is logged in and session is valid

#### Issue: "No valid access token available"
**Solution**: Token may be expired, user needs to re-authenticate

#### Issue: Webhook verification fails
**Solution**: Check webhook verify tokens match between app and code

#### Issue: Database connection errors
**Solution**: Verify Supabase credentials and RLS policies

## 🚀 Production Deployment

### 1. Update URLs
Replace `localhost:9002` with your production domain in:
- OAuth redirect URIs
- Webhook URLs
- Environment variables

### 2. Security Checklist
- [ ] Use HTTPS in production
- [ ] Set strong encryption keys
- [ ] Enable webhook signature verification
- [ ] Monitor webhook events
- [ ] Set up error alerting

### 3. Performance Optimization
- [ ] Implement token caching
- [ ] Add rate limiting
- [ ] Set up database indexes
- [ ] Monitor API usage

## 📚 API Reference

### Platform Connection Endpoints

#### GET /api/platforms/instagram
Returns Instagram profile and media data for authenticated user.

#### POST /api/platforms/instagram
Refreshes Instagram data from API.

#### POST /api/platforms/instagram/disconnect
Disconnects Instagram account.

#### GET /api/platforms/linkedin
Returns LinkedIn profile data for authenticated user.

#### POST /api/platforms/linkedin
Refreshes LinkedIn data from API.

#### POST /api/platforms/linkedin/disconnect
Disconnects LinkedIn account.

### Webhook Endpoints

#### GET /api/webhooks/instagram
Verifies Instagram webhook subscription.

#### POST /api/webhooks/instagram
Receives Instagram webhook events.

#### GET /api/webhooks/linkedin
Verifies LinkedIn webhook subscription.

#### POST /api/webhooks/linkedin
Receives LinkedIn webhook events.

### OAuth Callback Endpoints

#### GET /api/auth/callback/instagram
Handles Instagram OAuth callback.

#### GET /api/auth/callback/linkedin
Handles LinkedIn OAuth callback.

## 🎯 Success Criteria

Your integration is fully functional when:

✅ **OAuth Flow**: Users can connect Instagram and LinkedIn accounts  
✅ **Data Storage**: Platform data is stored securely in database  
✅ **API Calls**: Fresh data can be fetched from both platforms  
✅ **Webhooks**: Events are received and processed correctly  
✅ **Token Management**: Tokens are encrypted and refreshed automatically  
✅ **Error Handling**: Graceful fallbacks for API failures  
✅ **Security**: All endpoints are properly authenticated and secured  

## 🆘 Support

If you encounter issues:

1. Check the application logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database migration has been completed
4. Test individual components using the test suite
5. Review the security checklist above

---

**🎉 Congratulations!** Your Instagram Graph API and LinkedIn API integrations are now fully functional with enterprise-grade security and reliability.
