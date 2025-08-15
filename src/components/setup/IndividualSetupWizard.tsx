'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Brain, 
  Briefcase, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Loader2
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
  career_study_goals?: string;
  career_study_goals_notes?: string;
  tools_used?: string[];
  work_challenges?: string;
  ai_support_preference?: string[];
}

const IndividualSetupWizard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({});
  const [tempData, setTempData] = useState<ProfileData>({});
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
    setIsLoading(true);
    try {
      const response = await fetch('/api/user/profile/setup');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
        setTempData(data);
        if (data.is_setup_complete) {
          setIsEditMode(true);
        }
      } else if (response.status === 404) {
        // No profile exists yet, start fresh
        setProfileData({});
        setTempData({});
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
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
            description: "Your individual profile has been saved successfully.",
          });
          router.push('/profile');
        } else {
          toast({
            title: "Progress Saved",
            description: "Your progress has been saved.",
          });
        }
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save your progress. Please try again.",
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

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1: return 'Basic Information';
      case 2: return 'Personal Insights';
      case 3: return 'Professional Profile';
      default: return 'Step';
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1: return <User className="w-5 h-5" />;
      case 2: return <Brain className="w-5 h-5" />;
      case 3: return <Briefcase className="w-5 h-5" />;
      default: return <User className="w-5 h-5" />;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInformationStep
            data={tempData}
            updateData={updateTempData}
          />
        );
      case 2:
        return (
          <PersonalInsightsStep
            data={tempData}
            updateData={updateTempData}
          />
        );
      case 3:
        return (
          <ProfessionalProfileStep
            data={tempData}
            updateData={updateTempData}
          />
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-green-600 to-green-400">
                <User className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">
                {isEditMode ? 'Edit Individual Profile' : 'Individual Profile Setup'}
              </h1>
            </div>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {isEditMode 
                ? 'Update your personal and professional information'
                : 'Let\'s personalize your CreateX AI experience for individual use'
              }
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Step {currentStep} of {totalSteps}
              </span>
              <span className="text-sm text-gray-400">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step Indicator */}
          <div className="flex justify-center mb-8">
            <div className="flex space-x-4">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    step === currentStep
                      ? 'bg-primary text-white'
                      : step < currentStep
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-800 text-gray-400'
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    getStepIcon(step)
                  )}
                  <span className="text-sm font-medium">{getStepTitle(step)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
            <CardHeader className="border-b border-gray-800">
              <CardTitle className="flex items-center gap-3 text-xl text-white">
                {getStepIcon(currentStep)}
                {getStepTitle(currentStep)}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              {renderCurrentStep()}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="border-gray-700 text-gray-300 hover:bg-gray-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>

            <div className="flex gap-3">
              {currentStep < totalSteps && (
                <Button
                  variant="outline"
                  onClick={handleSkip}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Skip for now
                </Button>
              )}
              
              <Button
                onClick={handleNext}
                disabled={isSaving}
                className="bg-gradient-to-r from-green-600 to-green-400 hover:from-green-600/90 hover:to-green-400/90"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : currentStep === totalSteps ? (
                  <>
                    Complete Setup
                    <CheckCircle className="w-4 h-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next Step
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndividualSetupWizard;
