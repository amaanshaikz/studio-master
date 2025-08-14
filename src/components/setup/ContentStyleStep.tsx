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
import { CreatorData, CONTENT_FORMATS, POSTING_SCHEDULES } from '@/types/creator';

interface Props {
  data: CreatorData;
  updateData: (field: keyof CreatorData, value: any) => void;
}

const ContentStyleStep = ({ data, updateData }: Props) => {
  const [otherFormat, setOtherFormat] = useState('');

  const handleContentFormatChange = (format: string, checked: boolean) => {
    const currentFormats = data.content_formats || [];
    if (checked) {
      updateData('content_formats', [...currentFormats, format]);
    } else {
      updateData('content_formats', currentFormats.filter(f => f !== format));
    }
  };

  const addOtherFormat = () => {
    if (otherFormat.trim()) {
      const currentFormats = data.content_formats || [];
      updateData('content_formats', [...currentFormats, otherFormat.trim()]);
      setOtherFormat('');
    }
  };

  const removeFormat = (format: string) => {
    const currentFormats = data.content_formats || [];
    updateData('content_formats', currentFormats.filter(f => f !== format));
  };

  return (
    <div className="space-y-8">
      {/* Question 6: Content formats and length */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">6. Content Formats & Length</h3>
        <div className="space-y-4">
          <Label>What content formats do you focus on?</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CONTENT_FORMATS.map((format) => (
              <div key={format} className="flex items-center space-x-2">
                <Checkbox
                  id={`format-${format}`}
                  checked={data.content_formats?.includes(format) || false}
                  onCheckedChange={(checked) => handleContentFormatChange(format, checked as boolean)}
                />
                <Label htmlFor={`format-${format}`} className="text-sm">
                  {format}
                </Label>
              </div>
            ))}
          </div>
          
          {data.content_formats?.includes('Other') && (
            <div className="flex gap-2">
              <Input
                value={otherFormat}
                onChange={(e) => setOtherFormat(e.target.value)}
                placeholder="Specify other format"
                className="bg-background/50 border-2"
                onKeyPress={(e) => e.key === 'Enter' && addOtherFormat()}
              />
              <button
                onClick={addOtherFormat}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Add
              </button>
            </div>
          )}
          
          {data.content_formats && data.content_formats.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.content_formats.map((format) => (
                <Badge key={format} variant="secondary" className="flex items-center gap-1">
                  {format}
                  <button
                    onClick={() => removeFormat(format)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="typical_length_number">Typical Length</Label>
            <div className="flex gap-2">
              <Input
                id="typical_length_number"
                type="number"
                value={data.typical_length_number || ''}
                onChange={(e) => updateData('typical_length_number', parseInt(e.target.value) || undefined)}
                placeholder="e.g., 60"
                className="bg-background/50 border-2"
              />
              <Select value={data.typical_length_unit || ''} onValueChange={(value) => updateData('typical_length_unit', value)}>
                <SelectTrigger className="bg-background/50 border-2 w-32">
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Question 7: On camera, voiceovers, editing style */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">7. Content Creation Style</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Do you appear on camera?</Label>
              <RadioGroup value={data.on_camera || ''} onValueChange={(value) => updateData('on_camera', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="on-camera-yes" />
                  <Label htmlFor="on-camera-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="on-camera-no" />
                  <Label htmlFor="on-camera-no">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Sometimes" id="on-camera-sometimes" />
                  <Label htmlFor="on-camera-sometimes">Sometimes</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label>Do you use voiceovers?</Label>
              <RadioGroup value={data.use_voiceovers || ''} onValueChange={(value) => updateData('use_voiceovers', value)}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Yes" id="voiceovers-yes" />
                  <Label htmlFor="voiceovers-yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="No" id="voiceovers-no" />
                  <Label htmlFor="voiceovers-no">No</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="editing_music_style">Signature Editing/Music Style</Label>
            <Textarea
              id="editing_music_style"
              value={data.editing_music_style || ''}
              onChange={(e) => updateData('editing_music_style', e.target.value)}
              placeholder="Describe your signature editing style, music preferences, visual effects, etc."
              className="bg-background/50 border-2 min-h-[120px]"
            />
          </div>
        </div>
      </div>

      {/* Question 8: Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">8. Content & Monetization Goals</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="short_term_goals">Short-term Goals (3 months)</Label>
            <Textarea
              id="short_term_goals"
              value={data.short_term_goals || ''}
              onChange={(e) => updateData('short_term_goals', e.target.value)}
              placeholder="What do you want to achieve in the next 3 months?"
              className="bg-background/50 border-2 min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="long_term_goals">Long-term Goals (1-3 years)</Label>
            <Textarea
              id="long_term_goals"
              value={data.long_term_goals || ''}
              onChange={(e) => updateData('long_term_goals', e.target.value)}
              placeholder="What are your long-term content and monetization goals?"
              className="bg-background/50 border-2 min-h-[100px]"
            />
          </div>
        </div>
      </div>

      {/* Question 9: Posting frequency and schedule */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">9. Posting Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="posting_frequency">Posting Frequency</Label>
            <div className="flex gap-2 items-center">
              <Input
                id="posting_frequency"
                type="number"
                value={data.posting_frequency || ''}
                onChange={(e) => updateData('posting_frequency', parseInt(e.target.value) || undefined)}
                placeholder="e.g., 3"
                className="bg-background/50 border-2 w-20"
              />
              <span className="text-sm text-muted-foreground">posts/videos per week</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="posting_schedule">Preferred Posting Schedule</Label>
            <Select value={data.posting_schedule || ''} onValueChange={(value) => updateData('posting_schedule', value)}>
              <SelectTrigger className="bg-background/50 border-2">
                <SelectValue placeholder="Select your posting schedule" />
              </SelectTrigger>
              <SelectContent>
                {POSTING_SCHEDULES.map((schedule) => (
                  <SelectItem key={schedule} value={schedule}>
                    {schedule}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Question 10: Biggest challenge */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-primary">10. Current Challenges</h3>
        <div className="space-y-2">
          <Label htmlFor="biggest_challenge">What's your current biggest bottleneck or challenge in content creation?</Label>
          <Textarea
            id="biggest_challenge"
            value={data.biggest_challenge || ''}
            onChange={(e) => updateData('biggest_challenge', e.target.value)}
            placeholder="Describe your biggest challenge (e.g., time management, equipment, ideas, consistency, etc.)"
            className="bg-background/50 border-2 min-h-[120px]"
          />
        </div>
      </div>
    </div>
  );
};

export default ContentStyleStep;

