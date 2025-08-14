'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { CreatorData, PLATFORMS, NICHES, TARGET_AUDIENCES, TONE_STYLES, COUNTRIES, LANGUAGES } from '@/types/creator';

interface Props {
  data: CreatorData;
  updateData: (field: keyof CreatorData, value: any) => void;
}

const CreatorProfileStep = ({ data, updateData }: Props) => {
  const [otherPlatform, setOtherPlatform] = useState('');
  const [otherNiche, setOtherNiche] = useState('');
  const [otherTargetAudience, setOtherTargetAudience] = useState('');

  const handlePlatformChange = (platform: string, checked: boolean) => {
    const currentPlatforms = data.platforms || [];
    if (checked) {
      updateData('platforms', [...currentPlatforms, platform]);
    } else {
      updateData('platforms', currentPlatforms.filter(p => p !== platform));
    }
  };

  const handleTargetAudienceChange = (audience: string, checked: boolean) => {
    const currentAudiences = data.target_audience || [];
    if (checked) {
      updateData('target_audience', [...currentAudiences, audience]);
    } else {
      updateData('target_audience', currentAudiences.filter(a => a !== audience));
    }
  };

  const addOtherPlatform = () => {
    if (otherPlatform.trim()) {
      const currentPlatforms = data.platforms || [];
      updateData('platforms', [...currentPlatforms, otherPlatform.trim()]);
      setOtherPlatform('');
    }
  };

  const removePlatform = (platform: string) => {
    const currentPlatforms = data.platforms || [];
    updateData('platforms', currentPlatforms.filter(p => p !== platform));
  };

  const addOtherNiche = () => {
    if (otherNiche.trim()) {
      // Store the custom niche in primary_niche field
      updateData('primary_niche', otherNiche.trim());
      // Clear the other_niche field since we're using primary_niche
      updateData('other_niche', '');
      setOtherNiche('');
    }
  };

  const addOtherTargetAudience = () => {
    if (otherTargetAudience.trim()) {
      const currentAudiences = data.target_audience || [];
      updateData('target_audience', [...currentAudiences, otherTargetAudience.trim()]);
      setOtherTargetAudience('');
    }
  };

  const removeTargetAudience = (audience: string) => {
    const currentAudiences = data.target_audience || [];
    updateData('target_audience', currentAudiences.filter(a => a !== audience));
  };

  // Check if the current primary_niche is a custom niche (not in the predefined list)
  const isCustomNiche = data.primary_niche && !NICHES.includes(data.primary_niche);

  return (
    <div className="space-y-8">
      {/* Question 1: Name, age, location, primary language */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">1. Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name *</Label>
            <Input
              id="full_name"
              value={data.full_name || ''}
              onChange={(e) => updateData('full_name', e.target.value)}
              placeholder="Enter your full name"
              className="bg-background/50 border-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              type="number"
              value={data.age || ''}
              onChange={(e) => updateData('age', parseInt(e.target.value) || undefined)}
              placeholder="Your age"
              className="bg-background/50 border-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select value={data.location || ''} onValueChange={(value) => updateData('location', value)}>
              <SelectTrigger className="bg-background/50 border-2">
                <SelectValue placeholder="Select your country" />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((country) => (
                  <SelectItem key={country} value={country}>
                    {country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="primary_language">Primary Language</Label>
            <Select value={data.primary_language || ''} onValueChange={(value) => updateData('primary_language', value)}>
              <SelectTrigger className="bg-background/50 border-2">
                <SelectValue placeholder="Select your primary language" />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((language) => (
                  <SelectItem key={language} value={language}>
                    {language}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question 2: Platforms */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">2. Content Platforms</h3>
        <div className="space-y-4">
          <Label>Which platforms do you create content for?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {PLATFORMS.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <Checkbox
                  id={`platform-${platform}`}
                  checked={data.platforms?.includes(platform) || false}
                  onCheckedChange={(checked) => handlePlatformChange(platform, checked as boolean)}
                />
                <Label htmlFor={`platform-${platform}`} className="text-sm">
                  {platform}
                </Label>
              </div>
            ))}
          </div>
          
          {data.platforms?.includes('Other') && (
            <div className="flex gap-2">
              <Input
                value={otherPlatform}
                onChange={(e) => setOtherPlatform(e.target.value)}
                placeholder="Specify other platform"
                className="bg-background/50 border-2"
                onKeyPress={(e) => e.key === 'Enter' && addOtherPlatform()}
              />
              <button
                onClick={addOtherPlatform}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          )}
          
          {data.platforms && data.platforms.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.platforms.map((platform) => (
                <Badge key={platform} variant="secondary" className="flex items-center gap-1">
                  {platform}
                  <button
                    onClick={() => removePlatform(platform)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label>Which platform is your main focus?</Label>
          <RadioGroup value={data.main_focus_platform || ''} onValueChange={(value) => updateData('main_focus_platform', value)}>
            {data.platforms?.map((platform) => (
              <div key={platform} className="flex items-center space-x-2">
                <RadioGroupItem value={platform} id={`main-${platform}`} />
                <Label htmlFor={`main-${platform}`}>{platform}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      {/* Question 3: Niche, sub-niche, target audience */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">3. Content Niche & Audience</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primary_niche">Primary Niche</Label>
            <Select 
              value={isCustomNiche ? 'Other' : (data.primary_niche || '')} 
              onValueChange={(value) => {
                if (value === 'Other') {
                  // If selecting "Other", clear the current niche to show input field
                  updateData('primary_niche', '');
                  updateData('other_niche', '');
                } else {
                  // If selecting a predefined niche, update primary_niche and clear other_niche
                  updateData('primary_niche', value);
                  updateData('other_niche', '');
                }
              }}
            >
              <SelectTrigger className="bg-background/50 border-2">
                <SelectValue placeholder="Select your primary niche" />
              </SelectTrigger>
              <SelectContent>
                {NICHES.map((niche) => (
                  <SelectItem key={niche} value={niche}>
                    {niche}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {/* Show custom niche if it exists */}
            {isCustomNiche && (
              <div className="mt-2">
                <Badge variant="outline" className="flex items-center gap-1 w-fit">
                  Custom Niche: {data.primary_niche}
                  <button
                    onClick={() => {
                      updateData('primary_niche', '');
                      updateData('other_niche', '');
                    }}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sub_niche">Sub-niche</Label>
            <Input
              id="sub_niche"
              value={data.sub_niche || ''}
              onChange={(e) => updateData('sub_niche', e.target.value)}
              placeholder="e.g., Yoga, Crypto trading, Vegan cooking"
              className="bg-background/50 border-2"
            />
          </div>
        </div>

        {/* Show input field for custom niche when "Other" is selected or when adding a new custom niche */}
        {(data.primary_niche === '' || data.primary_niche === 'Other') && !isCustomNiche && (
          <div className="flex gap-2">
            <Input
              value={otherNiche}
              onChange={(e) => setOtherNiche(e.target.value)}
              placeholder="Specify your niche"
              className="bg-background/50 border-2"
              onKeyPress={(e) => e.key === 'Enter' && addOtherNiche()}
            />
            <button
              onClick={addOtherNiche}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Add
            </button>
          </div>
        )}

        <div className="space-y-4">
          <Label>Target Audience</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {TARGET_AUDIENCES.map((audience) => (
              <div key={audience} className="flex items-center space-x-2">
                <Checkbox
                  id={`audience-${audience}`}
                  checked={data.target_audience?.includes(audience) || false}
                  onCheckedChange={(checked) => handleTargetAudienceChange(audience, checked as boolean)}
                />
                <Label htmlFor={`audience-${audience}`} className="text-sm">
                  {audience}
                </Label>
              </div>
            ))}
          </div>
          
          {data.target_audience?.includes('Other') && (
            <div className="flex gap-2">
              <Input
                value={otherTargetAudience}
                onChange={(e) => setOtherTargetAudience(e.target.value)}
                placeholder="Specify other audience"
                className="bg-background/50 border-2"
                onKeyPress={(e) => e.key === 'Enter' && addOtherTargetAudience()}
              />
              <button
                onClick={addOtherTargetAudience}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          )}
          
          {data.target_audience && data.target_audience.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.target_audience.map((audience) => (
                <Badge key={audience} variant="secondary" className="flex items-center gap-1">
                  {audience}
                  <button
                    onClick={() => removeTargetAudience(audience)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Question 4: Personal brand and tone */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">4. Personal Brand & Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="brand_words">Brand Words (3-5 words)</Label>
            <Input
              id="brand_words"
              value={data.brand_words || ''}
              onChange={(e) => updateData('brand_words', e.target.value)}
              placeholder="e.g., Authentic, Inspiring, Educational"
              className="bg-background/50 border-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tone_style">Tone/Style</Label>
            <Select value={data.tone_style || ''} onValueChange={(value) => updateData('tone_style', value)}>
              <SelectTrigger className="bg-background/50 border-2">
                <SelectValue placeholder="Select your tone/style" />
              </SelectTrigger>
              <SelectContent>
                {TONE_STYLES.map((tone) => (
                  <SelectItem key={tone} value={tone}>
                    {tone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question 5: Followers and views */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">5. Current Reach</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="total_followers">Total Followers/Subscribers</Label>
            <Input
              id="total_followers"
              type="number"
              value={data.total_followers || ''}
              onChange={(e) => updateData('total_followers', parseInt(e.target.value) || undefined)}
              placeholder="e.g., 1000"
              className="bg-background/50 border-2"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="average_views">Average Views per Post/Video</Label>
            <Input
              id="average_views"
              type="number"
              value={data.average_views || ''}
              onChange={(e) => updateData('average_views', parseInt(e.target.value) || undefined)}
              placeholder="e.g., 500"
              className="bg-background/50 border-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfileStep;
