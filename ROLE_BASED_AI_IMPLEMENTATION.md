# Role-Based AI Implementation

## 🎯 Overview

This implementation adds dynamic role-based AI behavior to the `generateChatResponse` function. The AI now adapts its system prompt and context based on the user's role stored in the database:

- **Creator Role**: Uses content creation-focused prompts with creator profile data
- **Individual Role**: Uses life/productivity-focused prompts with individual profile data

## 🔧 Implementation Details

### 1. **Role Detection & Context Fetching**

#### **User Role Fetching**
```typescript
// src/ai/flows/generate-chat-response.ts
async function getUserRole(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();
  
  return data?.role || null;
}
```

#### **Role-Based Context Selection**
```typescript
// In generateChatResponseFlow
if (userRole === 'individual') {
  // For individuals, fetch profile context from user_profiles table
  if (!input.individualProfile) {
    const individualContext = await buildUserProfileContext(userId);
    if (individualContext) {
      enriched = {
        ...enriched,
        individualProfile: individualContext,
      };
    }
  }
} else {
  // For creators (or no role), fetch creator profile context
  if (!input.creatorProfile) {
    const creatorContext = await buildCreatorProfileContext();
    if (creatorContext && creatorContext !== "Creator profile unavailable.") {
      enriched = {
        ...enriched,
        creatorProfile: creatorContext,
      };
    }
  }
}
```

### 2. **Role-Based Prompt Definitions**

#### **Creator Prompt (Existing)**
- **Purpose**: Content creation and social media strategy
- **Focus**: Platform optimization, content ideas, monetization
- **Data Source**: `creators` table
- **Behavior**: Creative strategist + platform algorithm expert

#### **Individual Prompt (New)**
- **Purpose**: Personal life and productivity support
- **Focus**: Life optimization, productivity, personal development
- **Data Source**: `user_profiles` table
- **Behavior**: Trusted life coach and productivity expert

### 3. **Dynamic Prompt Selection**

```typescript
async function generateResponseWithBackend(enrichedInput: GenerateChatResponseInput, userRole?: string): Promise<GenerateChatResponseOutput> {
  if (userRole === 'individual') {
    console.log('Using Individual prompt');
    const {output} = await generateIndividualChatResponsePrompt(enrichedInput);
    return output!;
  } else {
    // Default to creator prompt (for 'creator' role or no role)
    console.log('Using Creator prompt');
    const {output} = await generateChatResponsePrompt(enrichedInput);
    return output!;
  }
}
```

## 📊 Data Flow

### **Creator Users**
```
User Query → Fetch Role ('creator') → Fetch Creator Profile → Creator Prompt → Content-Focused Response
```

### **Individual Users**
```
User Query → Fetch Role ('individual') → Fetch Individual Profile → Individual Prompt → Life/Productivity Response
```

### **Users with No Role**
```
User Query → Fetch Role (null) → Fetch Creator Profile → Creator Prompt → Content-Focused Response (default)
```

## 📋 Input Schema

### **GenerateChatResponseInput**
```typescript
const GenerateChatResponseInputSchema = z.object({
  query: z.string().describe('The user\'s query or message.'),
  history: z.array(HistoryItemSchema).optional().describe('The previous conversation history.'),
  documentContent: z.string().optional().describe('The content of an attached document to be used as context.'),
  creatorProfile: z.string().optional().describe('The creator profile context for content creators.'),
  individualProfile: z.string().optional().describe('The individual profile context for personal users.'),
});
```

## 🗄️ Database Schema

### **Users Table**
```sql
-- Role field for user type
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT NULL;
```

### **Creator Profiles**
```sql
-- creators table (existing)
-- Stores content creator specific data
-- Used when user.role = 'creator'
```

### **Individual Profiles**
```sql
-- user_profiles table (existing)
-- Stores individual user data
-- Used when user.role = 'individual'
```

## 🎭 Prompt Differences

### **Creator Prompt Characteristics**
- **Identity**: "Personalized AI Content Copilot"
- **Expertise**: Creative strategist + platform algorithm expert
- **Focus Areas**:
  - Content ideas and scripts
  - Platform optimization
  - Monetization strategies
  - Brand alignment
  - Audience engagement
- **Output Style**: Production-ready content with hooks, hashtags, CTAs
- **Tone**: Professional, strategic, ROI-focused

### **Individual Prompt Characteristics**
- **Identity**: "Personalized AI Life Copilot"
- **Expertise**: Trusted life coach and productivity expert
- **Focus Areas**:
  - Productivity and time management
  - Personal development
  - Life optimization
  - Problem-solving
  - Learning and skill development
- **Output Style**: Actionable advice with specific steps and time estimates
- **Tone**: Supportive, encouraging, well-being-focused

## 🔄 Dynamic Adaptation

### **Role Switching**
When a user changes their role in the database:
1. **Immediate Effect**: Next AI interaction uses the new role's prompt
2. **Context Switching**: Automatically fetches appropriate profile data
3. **No Code Changes**: Fully dynamic based on database state

### **Profile Data**
- **Creator Role**: Uses `buildCreatorProfileContext()` → `creators` table
- **Individual Role**: Uses `buildUserProfileContext()` → `user_profiles` table
- **Fallback**: Graceful handling when profiles are incomplete

## 🧪 Testing

### **Test Script**
```bash
node test-role-based-ai.js
```

### **Test Coverage**
1. ✅ **User Role Fetching**: Verifies role retrieval from database
2. ✅ **Profile Context**: Tests both creator and individual profile fetching
3. ✅ **Role Switching**: Simulates role changes and verifies behavior
4. ✅ **Database Schema**: Confirms required tables and columns exist
5. ✅ **Error Handling**: Tests graceful fallbacks

### **Manual Testing**
1. **Creator User**: Ask for content ideas → Should get content-focused responses
2. **Individual User**: Ask for productivity advice → Should get life/productivity responses
3. **Role Switch**: Change user role → Verify AI behavior changes immediately

## 📝 Example Interactions

### **Creator User Query**
```
User: "Give me 5 Instagram Reel ideas for this week"
AI Response: [Content-focused with hooks, hashtags, production details]
```

### **Individual User Query**
```
User: "Help me improve my productivity"
AI Response: [Life/productivity-focused with actionable steps, time management advice]
```

### **Same Query, Different Roles**
```
Creator: "Help me with my goals"
→ Content creation goals, audience growth, monetization strategies

Individual: "Help me with my goals"
→ Personal development, career advancement, life balance
```

## 🚀 Benefits

### **Personalized Experience**
- ✅ **Role-Specific Expertise**: AI adapts to user's primary use case
- ✅ **Relevant Context**: Uses appropriate profile data for personalization
- ✅ **Tailored Responses**: Different output styles and focus areas

### **Scalable Architecture**
- ✅ **Dynamic Switching**: No code changes needed for role updates
- ✅ **Extensible**: Easy to add new roles in the future
- ✅ **Consistent Interface**: Same API, different behavior

### **User Experience**
- ✅ **Immediate Adaptation**: Role changes take effect instantly
- ✅ **Contextual Responses**: AI understands user's primary needs
- ✅ **Professional Focus**: Specialized expertise for each role type

## 🔮 Future Enhancements

### **Potential New Roles**
- **Business**: Business strategy, marketing, operations
- **Student**: Academic support, study strategies, career planning
- **Professional**: Industry-specific advice, skill development

### **Enhanced Personalization**
- **Hybrid Roles**: Users with multiple role aspects
- **Dynamic Prompts**: AI that learns and adapts over time
- **Context Awareness**: Seasonal or situational prompt adjustments

## 📋 Implementation Checklist

### ✅ **Completed**
- [x] Role-based prompt definitions
- [x] Dynamic context fetching
- [x] User role detection
- [x] Prompt selection logic
- [x] Error handling and fallbacks
- [x] Testing framework
- [x] Documentation

### 🔄 **In Progress**
- [ ] Manual testing with real users
- [ ] Performance optimization
- [ ] User feedback collection

### 📋 **Future**
- [ ] Additional role types
- [ ] Enhanced personalization
- [ ] A/B testing framework

## 🎉 Summary

The role-based AI implementation successfully provides:

1. **Dynamic Behavior**: AI adapts based on user role
2. **Specialized Expertise**: Different prompts for different use cases
3. **Seamless Switching**: Role changes take effect immediately
4. **Robust Architecture**: Scalable and maintainable design
5. **Comprehensive Testing**: Verified functionality and error handling

The system now provides a truly personalized AI experience that understands whether the user is a content creator or an individual seeking life/productivity support, delivering appropriate expertise and responses for each context.
