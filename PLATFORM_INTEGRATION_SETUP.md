# Platform Integration Setup Guide

This guide will help you set up Instagram and LinkedIn platform integration for your application.

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Instagram Configuration
NEXT_PUBLIC_INSTAGRAM_CLIENT_ID=your_instagram_client_id
INSTAGRAM_CLIENT_SECRET=your_instagram_client_secret
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token

# LinkedIn Configuration
NEXT_PUBLIC_LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
LINKEDIN_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
LINKEDIN_WEBHOOK_SECRET=your_webhook_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:9002
NEXTAUTH_SECRET=your_nextauth_secret
```

## Instagram Setup

### 1. Create Instagram App

1. Go to [Facebook for Developers](https://developers.facebook.com/)
2. Create a new app or use an existing one
3. Add Instagram Basic Display product to your app
4. Configure Instagram Basic Display settings

### 2. Configure Instagram Basic Display

1. **App Domains**: Add your domain (e.g., `localhost:9002`)
2. **Privacy Policy URL**: Add your privacy policy URL
3. **Terms of Service URL**: Add your terms of service URL
4. **Data Deletion Request URL**: Add your data deletion URL

### 3. Configure Instagram OAuth

1. **Valid OAuth Redirect URIs**: Add `http://localhost:9002/api/auth/callback/instagram`
2. **Deauthorize Callback URL**: Add `http://localhost:9002/api/auth/callback/instagram`
3. **Data Deletion Request URL**: Add `http://localhost:9002/api/auth/callback/instagram`

### 4. Configure Instagram Webhooks

1. **Webhook URL**: `http://localhost:9002/api/webhooks/instagram`
2. **Verify Token**: Use the same value as `INSTAGRAM_WEBHOOK_VERIFY_TOKEN`
3. **Subscribe to**: 
   - `messages`
   - `messaging_postbacks`
   - `messaging_optins`
   - `messaging_referrals`

### 5. Instagram API Permissions

The app requests the following permissions:
- `user_profile`: Access to basic profile information
- `user_media`: Access to user's media

## LinkedIn Setup

### 1. Create LinkedIn App

1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create a new app
3. Configure OAuth 2.0 settings

### 2. Configure LinkedIn OAuth

1. **Authorized Redirect URLs**: Add `http://localhost:9002/api/auth/callback/linkedin`
2. **OAuth 2.0 Scopes**: 
   - `r_liteprofile`: Read basic profile information
   - `r_emailaddress`: Read email address
   - `w_member_social`: Write posts and comments

### 3. Configure LinkedIn Webhooks

1. **Webhook URL**: `http://localhost:9002/api/webhooks/linkedin`
2. **Verify Token**: Use the same value as `LINKEDIN_WEBHOOK_VERIFY_TOKEN`
3. **Subscribe to Events**:
   - `PROFILE_UPDATE`: Profile information changes
   - `CONNECTION_ADDED`: New connections
   - `POST_CREATED`: New posts
   - `ENGAGEMENT`: Likes, comments, shares

## Database Schema (Optional)

If you want to store platform data in a database, create the following tables:

### Instagram Data Table
```sql
CREATE TABLE instagram_connections (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  platform_user_id VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  connected BOOLEAN DEFAULT true,
  last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE instagram_media (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  media_id VARCHAR(255) NOT NULL,
  media_type VARCHAR(50),
  media_url TEXT,
  caption TEXT,
  permalink TEXT,
  like_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### LinkedIn Data Table
```sql
CREATE TABLE linkedin_connections (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  platform_user_id VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  email VARCHAR(255),
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TIMESTAMP,
  connected BOOLEAN DEFAULT true,
  last_sync TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Webhook URLs

### Instagram Webhook
- **URL**: `https://yourdomain.com/api/webhooks/instagram`
- **Method**: POST
- **Events**: Messages, postbacks, opt-ins, referrals

### LinkedIn Webhook
- **URL**: `https://yourdomain.com/api/webhooks/linkedin`
- **Method**: POST
- **Events**: Profile updates, connections, posts, engagement

## Data Access

### Instagram Data Available
- **Profile**: Username, account type
- **Media**: Posts, reels, stories
- **Content**: Captions, hashtags, comments, likes
- **Insights**: Impressions, reach, profile views (business accounts only)

### LinkedIn Data Available
- **Profile**: Name, email, headline, about
- **Network**: Connections, followers
- **Content**: Posts, articles, comments
- **Engagement**: Likes, comments, shares

## Security Considerations

1. **Access Token Storage**: Store tokens securely in your database
2. **Token Refresh**: Implement token refresh logic for expired tokens
3. **Webhook Verification**: Always verify webhook signatures
4. **Rate Limiting**: Respect API rate limits
5. **Data Privacy**: Follow platform privacy policies

## Testing

### Local Development
1. Use ngrok to expose your local server: `ngrok http 9002`
2. Update webhook URLs to use ngrok URL
3. Test OAuth flow and webhook reception

### Production Deployment
1. Update all URLs to use your production domain
2. Configure SSL certificates
3. Set up proper database storage
4. Monitor webhook delivery and errors

## Troubleshooting

### Common Issues

1. **OAuth Redirect URI Mismatch**
   - Ensure redirect URIs match exactly in platform settings
   - Check for trailing slashes or protocol differences

2. **Webhook Verification Fails**
   - Verify webhook tokens match exactly
   - Check webhook URL accessibility
   - Ensure proper HTTP status codes

3. **Access Token Expired**
   - Implement token refresh logic
   - Handle token expiration gracefully
   - Re-authenticate user when needed

4. **API Rate Limits**
   - Implement rate limiting in your application
   - Cache API responses when possible
   - Handle rate limit errors gracefully

### Debug Logs

Check the console logs for:
- OAuth callback processing
- Webhook data reception
- API request/response details
- Error messages and stack traces

## Next Steps

1. **Database Integration**: Replace mock storage with real database
2. **Token Refresh**: Implement automatic token refresh
3. **Error Handling**: Add comprehensive error handling
4. **Analytics**: Track platform usage and engagement
5. **Notifications**: Implement real-time notifications for platform events 