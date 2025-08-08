'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ProfileData {
  full_name?: string;
  nickname?: string;
  age?: number;
  pronouns?: string;
  location?: string;
  timezone?: string;
  languages?: string[];
  communication_style?: string;
}

interface Props {
  data: ProfileData;
  updateData: (field: keyof ProfileData, value: any) => void;
}

const BasicInformationStep = ({ data, updateData }: Props) => {
  const [newLanguage, setNewLanguage] = useState('');

  const communicationStyles = [
    'Friendly and casual',
    'Professional and focused',
    'Empathetic and supportive',
    'Direct and to the point'
  ];

  const timezones = [
    'UTC-12:00',
    'UTC-11:00',
    'UTC-10:00',
    'UTC-09:00',
    'UTC-08:00',
    'UTC-07:00',
    'UTC-06:00',
    'UTC-05:00',
    'UTC-04:00',
    'UTC-03:00',
    'UTC-02:00',
    'UTC-01:00',
    'UTC+00:00',
    'UTC+01:00',
    'UTC+02:00',
    'UTC+03:00',
    'UTC+04:00',
    'UTC+05:00',
    'UTC+05:30',
    'UTC+06:00',
    'UTC+07:00',
    'UTC+08:00',
    'UTC+09:00',
    'UTC+10:00',
    'UTC+11:00',
    'UTC+12:00',
  ];

  const addLanguage = () => {
    if (newLanguage.trim() && !data.languages?.includes(newLanguage.trim())) {
      const updatedLanguages = [...(data.languages || []), newLanguage.trim()];
      updateData('languages', updatedLanguages);
      setNewLanguage('');
    }
  };

  const removeLanguage = (language: string) => {
    const updatedLanguages = data.languages?.filter(l => l !== language) || [];
    updateData('languages', updatedLanguages);
  };

  return (
    <div className="space-y-6">
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
          <Label htmlFor="nickname">Nickname</Label>
          <Input
            id="nickname"
            value={data.nickname || ''}
            onChange={(e) => updateData('nickname', e.target.value)}
            placeholder="What should we call you?"
            className="bg-background/50 border-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          <Label htmlFor="pronouns">Pronouns</Label>
          <Input
            id="pronouns"
            value={data.pronouns || ''}
            onChange={(e) => updateData('pronouns', e.target.value)}
            placeholder="e.g., he/him, she/her, they/them"
            className="bg-background/50 border-2"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={data.location || ''}
            onChange={(e) => updateData('location', e.target.value)}
            placeholder="City, Country"
            className="bg-background/50 border-2"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="timezone">Timezone</Label>
          <Select value={data.timezone || ''} onValueChange={(value) => updateData('timezone', value)}>
            <SelectTrigger className="bg-background/50 border-2">
              <SelectValue placeholder="Select your timezone" />
            </SelectTrigger>
            <SelectContent>
              {timezones.map((tz) => (
                <SelectItem key={tz} value={tz}>
                  {tz}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Languages</Label>
        <div className="flex gap-2">
          <Input
            value={newLanguage}
            onChange={(e) => setNewLanguage(e.target.value)}
            placeholder="Add a language"
            className="bg-background/50 border-2"
            onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
          />
          <button
            onClick={addLanguage}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        {data.languages && data.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.languages.map((language) => (
              <Badge key={language} variant="secondary" className="flex items-center gap-1">
                {language}
                <button
                  onClick={() => removeLanguage(language)}
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
        <Label htmlFor="communication_style">How would you like me to communicate with you?</Label>
        <Select value={data.communication_style || ''} onValueChange={(value) => updateData('communication_style', value)}>
          <SelectTrigger className="bg-background/50 border-2">
            <SelectValue placeholder="How do you prefer to communicate?" />
          </SelectTrigger>
          <SelectContent>
            {communicationStyles.map((style) => (
              <SelectItem key={style} value={style}>
                {style}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default BasicInformationStep;
