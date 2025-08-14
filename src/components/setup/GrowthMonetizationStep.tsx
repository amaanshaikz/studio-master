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
import { CreatorData, INCOME_STREAMS, AI_HELP_PREFERENCES } from '@/types/creator';

interface Props {
  data: CreatorData;
  updateData: (field: keyof CreatorData, value: any) => void;
}

const GrowthMonetizationStep = ({ data, updateData }: Props) => {
  const [otherIncomeStream, setOtherIncomeStream] = useState('');
  const [otherAiHelp, setOtherAiHelp] = useState('');

  const handleIncomeStreamChange = (stream: string, checked: boolean) => {
    const currentStreams = data.income_streams || [];
    if (checked) {
      updateData('income_streams', [...currentStreams, stream]);
    } else {
      updateData('income_streams', currentStreams.filter(s => s !== stream));
    }
  };

  const handleAiHelpChange = (help: string, checked: boolean) => {
    const currentHelp = data.ai_help_preferences || [];
    if (checked) {
      updateData('ai_help_preferences', [...currentHelp, help]);
    } else {
      updateData('ai_help_preferences', currentHelp.filter(h => h !== help));
    }
  };

  const addOtherIncomeStream = () => {
    if (otherIncomeStream.trim()) {
      const currentStreams = data.income_streams || [];
      updateData('income_streams', [...currentStreams, otherIncomeStream.trim()]);
      setOtherIncomeStream('');
    }
  };

  const removeIncomeStream = (stream: string) => {
    const currentStreams = data.income_streams || [];
    updateData('income_streams', currentStreams.filter(s => s !== stream));
  };

  const addOtherAiHelp = () => {
    if (otherAiHelp.trim()) {
      const currentHelp = data.ai_help_preferences || [];
      updateData('ai_help_preferences', [...currentHelp, otherAiHelp.trim()]);
      setOtherAiHelp('');
    }
  };

  const removeAiHelp = (help: string) => {
    const currentHelp = data.ai_help_preferences || [];
    updateData('ai_help_preferences', currentHelp.filter(h => h !== help));
  };

  return (
    <div className="space-y-8">
      {/* Question 11: Strengths and weaknesses */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">11. Creator Strengths & Weaknesses</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="strengths">Your Biggest Strengths as a Creator</Label>
            <Textarea
              id="strengths"
              value={data.strengths || ''}
              onChange={(e) => updateData('strengths', e.target.value)}
              placeholder="What are you naturally good at? (e.g., storytelling, editing, connecting with audience)"
              className="bg-background/50 border-2 min-h-[120px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weaknesses">Areas You Want to Improve</Label>
            <Textarea
              id="weaknesses"
              value={data.weaknesses || ''}
              onChange={(e) => updateData('weaknesses', e.target.value)}
              placeholder="What skills or areas do you struggle with? (e.g., consistency, technical skills, confidence)"
              className="bg-background/50 border-2 min-h-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Question 12: Income streams and brand restrictions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">12. Monetization & Brand Preferences</h3>
        <div className="space-y-4">
          <Label>What income streams do you have or want from content?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {INCOME_STREAMS.map((stream) => (
              <div key={stream} className="flex items-center space-x-2">
                <Checkbox
                  id={`income-${stream}`}
                  checked={data.income_streams?.includes(stream) || false}
                  onCheckedChange={(checked) => handleIncomeStreamChange(stream, checked as boolean)}
                />
                <Label htmlFor={`income-${stream}`} className="text-sm">
                  {stream}
                </Label>
              </div>
            ))}
          </div>
          
          {data.income_streams?.includes('Other') && (
            <div className="flex gap-2">
              <Input
                value={otherIncomeStream}
                onChange={(e) => setOtherIncomeStream(e.target.value)}
                placeholder="Specify other income stream"
                className="bg-background/50 border-2"
                onKeyPress={(e) => e.key === 'Enter' && addOtherIncomeStream()}
              />
              <button
                onClick={addOtherIncomeStream}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          )}
          
          {data.income_streams && data.income_streams.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.income_streams.map((stream) => (
                <Badge key={stream} variant="secondary" className="flex items-center gap-1">
                  {stream}
                  <button
                    onClick={() => removeIncomeStream(stream)}
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
          <Label htmlFor="brand_types_to_avoid">Any brand types you want to avoid?</Label>
          <Textarea
            id="brand_types_to_avoid"
            value={data.brand_types_to_avoid || ''}
            onChange={(e) => updateData('brand_types_to_avoid', e.target.value)}
            placeholder="e.g., gambling, alcohol, fast food, or any specific industries you don't want to work with"
            className="bg-background/50 border-2 min-h-[100px]"
          />
        </div>
      </div>

      {/* Question 13: AI help preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">13. AI Assistance Preferences</h3>
        <div className="space-y-4">
          <Label>How do you want the AI to help you?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {AI_HELP_PREFERENCES.map((help) => (
              <div key={help} className="flex items-center space-x-2">
                <Checkbox
                  id={`ai-help-${help}`}
                  checked={data.ai_help_preferences?.includes(help) || false}
                  onCheckedChange={(checked) => handleAiHelpChange(help, checked as boolean)}
                />
                <Label htmlFor={`ai-help-${help}`} className="text-sm">
                  {help}
                </Label>
              </div>
            ))}
          </div>
          
          {data.ai_help_preferences?.includes('Other') && (
            <div className="flex gap-2">
              <Input
                value={otherAiHelp}
                onChange={(e) => setOtherAiHelp(e.target.value)}
                placeholder="Specify other AI help"
                className="bg-background/50 border-2"
                onKeyPress={(e) => e.key === 'Enter' && addOtherAiHelp()}
              />
              <button
                onClick={addOtherAiHelp}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          )}
          
          {data.ai_help_preferences && data.ai_help_preferences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.ai_help_preferences.map((help) => (
                <Badge key={help} variant="secondary" className="flex items-center gap-1">
                  {help}
                  <button
                    onClick={() => removeAiHelp(help)}
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

      {/* Question 14: Niche focus and style preferences */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">14. Content Strategy Preferences</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Niche Focus Preference</Label>
              <RadioGroup value={data.niche_focus || ''} onValueChange={(value) => updateData('niche_focus', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Strictly niche" id="niche-strict" />
                  <Label htmlFor="niche-strict">Strictly niche</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Niche + Related trends" id="niche-related" />
                  <Label htmlFor="niche-related">Niche + Related trends</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Open to all trending topics" id="niche-open" />
                  <Label htmlFor="niche-open">Open to all trending topics</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Content Style Preference</Label>
              <RadioGroup value={data.content_style || ''} onValueChange={(value) => updateData('content_style', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Conservative" id="style-conservative" />
                  <Label htmlFor="style-conservative">Conservative</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Balanced" id="style-balanced" />
                  <Label htmlFor="style-balanced">Balanced</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Experimental" id="style-experimental" />
                  <Label htmlFor="style-experimental">Experimental</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
      </div>

      {/* Question 15: Non-negotiable rules */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">15. Content Boundaries</h3>
        <div className="space-y-2">
          <Label htmlFor="non_negotiable_rules">Any non-negotiable rules or restrictions for your brand/content?</Label>
          <Textarea
            id="non_negotiable_rules"
            value={data.non_negotiable_rules || ''}
            onChange={(e) => updateData('non_negotiable_rules', e.target.value)}
            placeholder="e.g., topics to avoid, language style, visual style, political views, religious content, etc."
            className="bg-background/50 border-2 min-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
};

export default GrowthMonetizationStep;

