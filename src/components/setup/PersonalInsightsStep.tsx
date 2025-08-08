'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';

interface ProfileData {
  focus_improvement?: string;
  motivation?: string;
  personality_type?: string;
  productive_time?: string;
  productivity_systems?: string[];
  ai_boundaries?: string;
}

interface Props {
  data: ProfileData;
  updateData: (field: keyof ProfileData, value: any) => void;
}

const PersonalInsightsStep = ({ data, updateData }: Props) => {
  const [improvement, setImprovement] = useState(data.focus_improvement || '');

  const motivationOptions = [
    { value: 'recognition', label: 'Recognition' },
    { value: 'purpose', label: 'Purpose' },
    { value: 'progress', label: 'Progress' },
    { value: 'stability', label: 'Stability' }
  ];

  const personalityTypes = [
    { value: 'introvert', label: 'Introvert' },
    { value: 'extrovert', label: 'Extrovert' },
    { value: 'ambivert', label: 'Ambivert' }
  ];

  const productiveTimes = [
    'Morning',
    'Afternoon', 
    'Evening',
    'Night'
  ];

  const productivitySystems = [
    'Pomodoro Technique',
    'Time Blocking',
    'Getting Things Done (GTD)',
    'Bullet Journaling',
    'Kanban Boards',
    'Mind Mapping',
    'Habit Tracking',
    'Goal Setting',
    'Task Batching',
    'Energy Management'
  ];

  const toggleSystem = (system: string) => {
    const currentSystems = data.productivity_systems || [];
    const updatedSystems = currentSystems.includes(system)
      ? currentSystems.filter(s => s !== system)
      : [...currentSystems, system];
    updateData('productivity_systems', updatedSystems);
  };

  const handleImprovementChange = (value: string) => {
    updateData('focus_improvement', value);
    setImprovement(value);
  };

  return (
    <div className="space-y-6">
      {/* Focus Improvement */}
      <div className="space-y-2">
        <Label>What is one area of your life you're currently focused on improving?</Label>
        <Input
          value={improvement}
          onChange={(e) => handleImprovementChange(e.target.value)}
          placeholder="Health, productivity, confidence, learning, etc."
          className="bg-background/50 border-2"
        />
      </div>

      {/* AI Boundaries */}
      <div className="space-y-2">
        <Label>Any specific areas where you’d like the AI to not assist? (Optional)</Label>
        <Input
          value={data.ai_boundaries || ''}
          onChange={(e) => updateData('ai_boundaries', e.target.value)}
          placeholder="e.g., personal relationships, financial advice, medical guidance..."
          className="bg-background/50 border-2"
        />
      </div>

      {/* Motivation */}
      <div className="space-y-2">
        <Label>What motivates you most?</Label>
        <RadioGroup value={data.motivation || ''} onValueChange={(value) => updateData('motivation', value)}>
          {motivationOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Personality Type */}
      <div className="space-y-2">
        <Label>Personality Type</Label>
        <RadioGroup value={data.personality_type || ''} onValueChange={(value) => updateData('personality_type', value)}>
          {personalityTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={type.value} />
              <Label htmlFor={type.value}>{type.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Productive Time */}
      <div className="space-y-2">
        <Label htmlFor="productive_time">Most Productive Time</Label>
        <Select value={data.productive_time || ''} onValueChange={(value) => updateData('productive_time', value)}>
          <SelectTrigger className="bg-background/50 border-2">
            <SelectValue placeholder="When are you most productive?" />
          </SelectTrigger>
          <SelectContent>
            {productiveTimes.map((time) => (
              <SelectItem key={time} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Productivity Systems */}
      <div className="space-y-2">
        <Label>Productivity Systems You Use</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {productivitySystems.map((system) => (
            <div key={system} className="flex items-center space-x-2">
              <Checkbox
                id={system}
                checked={data.productivity_systems?.includes(system) || false}
                onCheckedChange={() => toggleSystem(system)}
              />
              <Label htmlFor={system} className="text-sm">{system}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalInsightsStep;
