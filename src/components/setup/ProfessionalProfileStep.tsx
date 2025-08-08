'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface ProfileData {
  profession?: string;
  career_study_goals?: string[]; // new goals selection
  career_study_goals_notes?: string; // optional free text
  tools_used?: string[];
  work_challenges?: string; // now selected from dropdown options
  ai_support_preference?: string[];
}

interface Props {
  data: ProfileData;
  updateData: (field: keyof ProfileData, value: any) => void;
}

const ProfessionalProfileStep = ({ data, updateData }: Props) => {
  const [newTool, setNewTool] = useState('');

  const professions = [
    'Student',
    'Freelancer',
    'Entrepreneur',
    'Software Developer',
    'Designer',
    'Marketing Professional',
    'Sales Professional',
    'Project Manager',
    'Product Manager',
    'Data Analyst',
    'Content Creator',
    'Consultant',
    'Teacher/Educator',
    'Healthcare Professional',
    'Legal Professional',
    'Finance Professional',
    'Other'
  ];

  const frustratingTasks = [
    'Writing emails or follow-ups',
    'Organizing files or notes',
    'Scheduling meetings or calls',
    'Managing tasks or deadlines',
    'Brainstorming new ideas',
    'Repetitive data entry',
    'Creating presentations',
    'Keeping track of clients or communication',
    'Context switching between tools',
    'Doing research or competitor analysis',
    'Writing reports or summaries'
  ];

  const goalsOptions = [
    'Land a new job or internship',
    'Grow my freelancing or business',
    'Get promoted or level up at work',
    'Finish my degree or a certification',
    'Learn a new skill or tool',
    'Launch a project or startup',
    'Change career paths',
    'Find better work-life balance',
    'Increase my income',
    "I'm still figuring it out",
  ];

  const aiSupportOptions = [
    'Reminders & Scheduling',
    'Idea Generation',
    'Emotional Support',
    'Task Suggestions',
    'Accountability Partner',
    'Insights & Analytics',
    'Content Creation',
    'Problem Solving',
    'Learning & Skill Development',
    'Networking & Connections'
  ];

  const addTool = () => {
    if (newTool.trim() && !data.tools_used?.includes(newTool.trim())) {
      const updatedTools = [...(data.tools_used || []), newTool.trim()];
      updateData('tools_used', updatedTools);
      setNewTool('');
    }
  };

  const removeTool = (tool: string) => {
    const updatedTools = data.tools_used?.filter(t => t !== tool) || [];
    updateData('tools_used', updatedTools);
  };

  const toggleAISupport = (support: string) => {
    const currentSupport = data.ai_support_preference || [];
    const updatedSupport = currentSupport.includes(support)
      ? currentSupport.filter(s => s !== support)
      : [...currentSupport, support];
    updateData('ai_support_preference', updatedSupport);
  };

  const toggleGoal = (goal: string) => {
    const currentGoals = data.career_study_goals || [];
    const updated = currentGoals.includes(goal)
      ? currentGoals.filter(g => g !== goal)
      : [...currentGoals, goal];
    updateData('career_study_goals', updated);
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Professional Profile (Optional)
        </h3>
        <p className="text-sm text-muted-foreground">
          This information helps us personalize your AI assistant experience
        </p>
      </div>

      {/* Profession */}
      <div className="space-y-2">
        <Label htmlFor="profession">Current Role or Profession</Label>
        <Select value={data.profession || ''} onValueChange={(value) => updateData('profession', value)}>
          <SelectTrigger className="bg-background/50 border-2">
            <SelectValue placeholder="Select your profession" />
          </SelectTrigger>
          <SelectContent>
            {professions.map((profession) => (
              <SelectItem key={profession} value={profession}>
                {profession}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Career/Study Goals */}
      <div className="space-y-2">
        <Label>What are you currently working towards in your career or studies?</Label>
        <p className="text-xs text-muted-foreground">You can pick one or more goals, or add your own.</p>
        <div className="flex flex-wrap gap-2 mt-2">
          {goalsOptions.map((goal) => (
            <button
              key={goal}
              type="button"
              onClick={() => toggleGoal(goal)}
              className={`px-3 py-1 rounded-full border text-sm ${
                data.career_study_goals?.includes(goal)
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'bg-background/50 border-border text-foreground'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>
        <Textarea
          value={data.career_study_goals_notes || ''}
          onChange={(e) => updateData('career_study_goals_notes', e.target.value)}
          placeholder="Anything specific you'd like to share? (optional)"
          className="bg-background/50 border-2 min-h-[80px] mt-2"
        />
      </div>

      {/* Tools Used */}
      <div className="space-y-2">
        <Label>Do you use any productivity or workflow tools you'd like me to sync with or assist you on?</Label>
        <p className="text-xs text-muted-foreground">e.g., Notion, Slack, Trello, Figma — optional</p>
        <div className="flex gap-2">
          <Input
            value={newTool}
            onChange={(e) => setNewTool(e.target.value)}
            placeholder="Add a tool or platform"
            className="bg-background/50 border-2"
            onKeyPress={(e) => e.key === 'Enter' && addTool()}
          />
          <button
            onClick={addTool}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Add
          </button>
        </div>
        {data.tools_used && data.tools_used.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {data.tools_used.map((tool) => (
              <Badge key={tool} variant="secondary" className="flex items-center gap-1">
                {tool}
                <button
                  onClick={() => removeTool(tool)}
                  className="ml-1 hover:text-destructive"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Work Challenges */}
      <div className="space-y-2">
        <Label htmlFor="work_challenges">What’s one task or part of your work you find frustrating or time-consuming?</Label>
        <Select value={data.work_challenges || ''} onValueChange={(value) => updateData('work_challenges', value)}>
          <SelectTrigger className="bg-background/50 border-2">
            <SelectValue placeholder="Select a task" />
          </SelectTrigger>
          <SelectContent>
            {frustratingTasks.map((task) => (
              <SelectItem key={task} value={task}>
                {task}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* AI Support Preferences */}
      <div className="space-y-2">
        <Label>Preferred AI Assistant Support</Label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {aiSupportOptions.map((support) => (
            <div key={support} className="flex items-center space-x-2">
              <Checkbox
                id={support}
                checked={data.ai_support_preference?.includes(support) || false}
                onCheckedChange={() => toggleAISupport(support)}
              />
              <Label htmlFor={support} className="text-sm">{support}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfileStep;
