'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Brain, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Loader2,
  X
} from 'lucide-react';
import BasicInformationStep from './BasicInformationStep';
import PersonalInsightsStep from './PersonalInsightsStep';
import ProfessionalProfileStep from './ProfessionalProfileStep';

interface ProfileData {
  // Basic Information
  full_name?: string;
  nickname?: string;
  age?: number;
  pronouns?: string;
  location?: string;
  timezone?: string;
  languages?: string[];
  communication_style?: string;
  
  // Personal Insights
  focus_improvement?: string;
  motivation?: string;
  personality_type?: string;
  productive_time?: string;
  productivity_systems?: string[];
  ai_boundaries?: string;
  
  // Professional Profile
  profession?: string;
  career_study_goals?: string[];
  career_study_goals_notes?: string;
  tools_used?: string[];
  work_challenges?: string;
  ai_support_preference?: string[];
}

const SetupWizard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [tempData, setTempData] = useState<ProfileData>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Load existing profile data
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      loadProfileData();
    }
  }, [session, status]);

  const loadProfileData = async () => {
    try {
      const response = await fetch('/api/user/profile/setup');
      if (response.ok) {
        const data = await response.json();
        if (data.id) {
          setProfileData(data);
          setTempData(data);
          // Check if we're in edit mode (setup is complete)
          if (data.is_setup_complete) {
            setIsEditMode(true);
          }
          // If setup is complete, we still allow editing by staying on setup page
          if (data.current_step) {
            setCurrentStep(data.current_step);
          }
        }
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  };

  const saveStep = async (step: number, isComplete = false) => {
    setIsSaving(true);
    try {
      const response = await fetch('/api/user/profile/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          step,
          data: tempData,
          isComplete,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setProfileData(result.profile);
        setTempData(result.profile);
        
        if (isComplete) {
          toast({
            title: "Setup Complete!",
            description: "Your profile has been saved successfully.",
          });
          router.push('/profile');
        } else {
          toast({
            title: "Progress Saved",
            description: "Your progress has been saved.",
          });
        }
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    if (currentStep === totalSteps) {
      await saveStep(currentStep, true);
    } else {
      await saveStep(currentStep);
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await saveStep(currentStep, true);
  };

  const updateTempData = (field: keyof ProfileData, value: any) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* Stars Background */}
      <div className="stars-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-2xl">
          <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= 1 ? 'bg-green-500' : 'bg-gray-600'
                }`}>
                  <User className="w-6 h-6 text-white" />
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= 2 ? 'bg-yellow-500' : 'bg-gray-600'
                }`}>
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {isEditMode ? "Edit Profile" : "Setup Profile"}
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  {isEditMode ? "Update your profile information" : `Step ${currentStep} of ${totalSteps}`}
                </p>
              </div>
              
              <Progress value={progress} className="w-full" />
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <BasicInformationStep 
                  data={tempData} 
                  updateData={updateTempData} 
                />
              )}
              
              {currentStep === 2 && (
                <PersonalInsightsStep 
                  data={tempData} 
                  updateData={updateTempData} 
                />
              )}
              
              {currentStep === 3 && (
                <ProfessionalProfileStep 
                  data={tempData} 
                  updateData={updateTempData} 
                />
              )}
              
              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSaving}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
                
                <div className="flex gap-2">
                  {currentStep === 3 && (
                    <Button
                      variant="outline"
                      onClick={handleSkip}
                      disabled={isSaving}
                    >
                      Skip
                    </Button>
                  )}
                  
                  <Button
                    onClick={handleNext}
                    disabled={isSaving}
                    className="flex items-center gap-2 bg-gradient-to-r from-primary to-accent"
                  >
                    {isSaving ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : currentStep === totalSteps ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <ArrowRight className="w-4 h-4" />
                    )}
                    {isSaving ? 'Saving...' : currentStep === totalSteps ? (isEditMode ? 'Save Changes' : 'Complete Setup') : 'Next'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SetupWizard;
