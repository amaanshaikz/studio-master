# 🗄️ Database Schema Documentation

## **Creators Table Structure**

The `creators` table stores detailed Instagram creator intelligence data with individual columns for each data category, enabling efficient querying and analysis.

### **Table: `creators`**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `id` | UUID | Primary key | `550e8400-e29b-41d4-a716-446655440000` |
| `instagram_url` | TEXT | Instagram profile URL | `https://www.instagram.com/username` |
| `created_at` | TIMESTAMP | Record creation time | `2024-01-15 10:30:00+00` |
| `updated_at` | TIMESTAMP | Last update time | `2024-01-15 10:30:00+00` |

### **Creator Profile Overview**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `username` | TEXT | Instagram username | `@johndoe` |
| `full_name` | TEXT | Display name | `John Doe` |
| `bio` | TEXT | Profile bio | `Content creator | Travel enthusiast` |
| `follower_count` | INTEGER | Number of followers | `125000` |
| `post_count` | INTEGER | Number of posts | `342` |
| `account_type` | TEXT | Account type | `Personal` or `Business` |
| `location` | TEXT | Profile location | `New York, NY` |
| `language` | TEXT | Primary language | `English` |

### **Creator Niche**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `primary_niche` | TEXT | Main content niche | `Fashion` |
| `sub_niches` | TEXT[] | Array of sub-niches | `["Streetwear", "Sustainable Fashion"]` |

### **Brand Style**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `visual_aesthetics` | TEXT | Visual style description | `Minimalist, clean, high contrast` |
| `tone_of_voice` | TEXT | Communication style | `Professional yet approachable` |
| `recurring_motifs` | TEXT[] | Recurring visual elements | `["Sunset shots", "Coffee cups"]` |

### **Content Making Style**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `storytelling_patterns` | TEXT | Storytelling approach | `Before/after transformations` |
| `editing_techniques` | TEXT | Editing style | `Warm tones, high saturation` |
| `performance_elements` | TEXT | Performance aspects | `Direct eye contact, confident poses` |

### **Content Format and Context**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `format_type` | TEXT[] | Content formats used | `["Reels", "Stories", "Posts"]` |
| `typical_context` | TEXT | Common content context | `Lifestyle, daily routines` |

### **Engagement Analysis**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `overall_rate_reported` | TEXT | Overall engagement rate | `3.2%` |
| `engagement_analysis_summary` | TEXT | Engagement analysis | `Above average for niche` |

### **Views and Likes Analysis**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `average_views_status` | TEXT | Views performance | `High performing` |
| `average_likes_proxy` | TEXT | Likes performance | `Consistent engagement` |
| `data_limitation_note` | TEXT | Data limitations | `Limited historical data` |

### **Viral Content Impact**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `viral_post_description` | TEXT | Description of viral post | `"My morning routine"` |
| `viral_likes` | INTEGER | Likes on viral post | `50000` |
| `viral_comments` | INTEGER | Comments on viral post | `2500` |
| `viral_impact_summary` | TEXT | Impact analysis | `Generated 20k new followers` |

### **Target Audience Profile**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `demographic_hypothesis` | TEXT | Target demographics | `Females 18-35, urban areas` |
| `target_interests` | TEXT[] | Target interests | `["Fashion", "Beauty", "Lifestyle"]` |

### **Actual Audience Profile**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `inferred_demographics` | TEXT | Actual demographics | `Females 22-28, college-educated` |
| `audience_evidence` | TEXT | Evidence for demographics | `Comment analysis, engagement patterns` |

### **Audience Comparison**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `alignment_level` | TEXT | Target vs actual alignment | `High alignment` |
| `audience_summary` | TEXT | Comparison summary | `Slightly younger than target` |

### **Complex Data (JSONB)**

| Column | Type | Description | Example |
|--------|------|-------------|---------|
| `key_content_themes` | JSONB | Array of content themes | `[{"theme": "Sustainability", "description": "Eco-friendly lifestyle"}]` |
| `representative_content_examples` | JSONB | Example content | `[{"content_type": "Reel", "title": "Morning routine", "theme": "Lifestyle"}]` |
| `key_hashtags` | JSONB | Important hashtags | `[{"hashtag": "#sustainablefashion", "category": "Niche"}]` |

## **Indexes**

### **Standard Indexes**
- `idx_creators_instagram_url` - Instagram URL lookups
- `idx_creators_created_at` - Time-based sorting
- `idx_creators_username` - Username searches
- `idx_creators_primary_niche` - Niche filtering
- `idx_creators_follower_count` - Follower count sorting
- `idx_creators_account_type` - Account type filtering
- `idx_creators_location` - Location-based queries
- `idx_creators_language` - Language filtering

### **GIN Indexes (Array Columns)**
- `idx_creators_sub_niches` - Sub-niche searches
- `idx_creators_recurring_motifs` - Motif searches
- `idx_creators_format_type` - Content format filtering
- `idx_creators_target_interests` - Interest-based queries

### **GIN Indexes (JSONB Columns)**
- `idx_creators_key_content_themes` - Theme searches
- `idx_creators_representative_content` - Content example searches
- `idx_creators_key_hashtags` - Hashtag searches

## **Query Examples**

### **Basic Queries**

```sql
-- Find creators by niche
SELECT username, full_name, follower_count 
FROM creators 
WHERE primary_niche = 'Fashion';

-- Find high-engagement creators
SELECT username, overall_rate_reported, viral_likes
FROM creators 
WHERE follower_count > 100000 
ORDER BY viral_likes DESC;

-- Search by sub-niches
SELECT username, sub_niches
FROM creators 
WHERE 'Sustainable Fashion' = ANY(sub_niches);
```

### **Advanced Queries**

```sql
-- Find creators with specific content themes
SELECT username, key_content_themes
FROM creators 
WHERE key_content_themes @> '[{"theme": "Sustainability"}]';

-- Find creators by location and follower range
SELECT username, location, follower_count
FROM creators 
WHERE location ILIKE '%New York%' 
AND follower_count BETWEEN 50000 AND 200000;

-- Find creators with high viral content
SELECT username, viral_post_description, viral_likes
FROM creators 
WHERE viral_likes > 10000
ORDER BY viral_likes DESC;
```

### **Analytics Queries**

```sql
-- Average engagement by niche
SELECT primary_niche, 
       AVG(CAST(overall_rate_reported AS FLOAT)) as avg_engagement
FROM creators 
WHERE overall_rate_reported IS NOT NULL
GROUP BY primary_niche
ORDER BY avg_engagement DESC;

-- Top performing creators by location
SELECT location, 
       COUNT(*) as creator_count,
       AVG(follower_count) as avg_followers
FROM creators 
WHERE location IS NOT NULL
GROUP BY location
ORDER BY avg_followers DESC
LIMIT 10;

-- Content format distribution
SELECT format_type, COUNT(*) as usage_count
FROM creators 
WHERE format_type IS NOT NULL
GROUP BY format_type
ORDER BY usage_count DESC;
```

## **Data Validation**

### **Required Fields**
- `instagram_url` (NOT NULL)
- `id` (auto-generated)

### **Data Types**
- All text fields can be NULL
- Numeric fields (follower_count, post_count, etc.) can be NULL
- Array fields can be NULL or empty arrays
- JSONB fields can be NULL or empty objects

### **Constraints**
- `instagram_url` must be unique
- `follower_count` and `post_count` must be non-negative
- `viral_likes` and `viral_comments` must be non-negative

## **Performance Considerations**

### **Query Optimization**
- Use indexes for filtering and sorting
- GIN indexes for array and JSONB searches
- Consider partitioning for large datasets

### **Storage Optimization**
- TEXT fields for variable-length strings
- INTEGER for numeric values
- TEXT[] for simple arrays
- JSONB for complex nested data

### **Maintenance**
- Regular VACUUM and ANALYZE
- Monitor index usage
- Consider archiving old data

## **Migration Notes**

### **From JSONB to Individual Columns**
The migration from a single JSONB column to individual columns provides:
- Better query performance
- Easier data validation
- More efficient indexing
- Simplified application logic

### **Backward Compatibility**
- Old JSONB data can be migrated using the mapping functions
- New data is stored in individual columns
- Both formats can coexist during transition
