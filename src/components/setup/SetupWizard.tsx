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
  Video, 
  TrendingUp, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle,
  Loader2
} from 'lucide-react';
import CreatorProfileStep from './CreatorProfileStep';
import ContentStyleStep from './ContentStyleStep';
import GrowthMonetizationStep from './GrowthMonetizationStep';
import { CreatorData } from '@/types/creator';

const SetupWizard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [creatorData, setCreatorData] = useState<CreatorData>({});
  const [tempData, setTempData] = useState<CreatorData>({});
  const [isEditMode, setIsEditMode] = useState(false);

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  // Load existing creator data
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      loadCreatorData();
    }
  }, [session, status]);

  const loadCreatorData = async () => {
    try {
      console.log('Loading creator data for user:', session?.user?.id);
      const response = await fetch('/api/user/creators/setup');
      
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded creator data:', data);
        
        if (data.id) {
          setCreatorData(data);
          setTempData(data);
          // Check if we're in edit mode (setup is complete)
          if (data.is_setup_complete) {
            setIsEditMode(true);
          }
          // If setup is complete, we still allow editing by staying on setup page
          if (data.current_step) {
            setCurrentStep(data.current_step);
          }
        } else {
          // New user, initialize with user_id
          setCreatorData({ user_id: session?.user?.id });
          setTempData({ user_id: session?.user?.id });
        }
      } else {
        const errorData = await response.json();
        console.error('Failed to load creator data:', errorData);
        toast({
          title: "Error",
          description: "Failed to load your profile data. Please refresh the page.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error loading creator data:', error);
      toast({
        title: "Error",
        description: "Failed to load your profile data. Please refresh the page.",
        variant: "destructive",
      });
    }
  };

  const saveStep = async (step: number, isComplete = false) => {
    setIsSaving(true);
    try {
      console.log('Saving step:', step, 'isComplete:', isComplete, 'data:', tempData);
      
      const response = await fetch('/api/user/creators/setup', {
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
        console.log('Save result:', result);
        
        setCreatorData(result.creator);
        setTempData(result.creator);
        
        if (isComplete) {
          toast({
            title: "Setup Complete!",
            description: "Your creator profile has been saved successfully.",
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
        console.error('Save error:', errorData);
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

  const updateTempData = (field: keyof CreatorData, value: any) => {
    setTempData(prev => ({ ...prev, [field]: value }));
  };

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Creator Profile & Brand";
      case 2:
        return "Content Style & Creative Direction";
      case 3:
        return "Growth, Monetization & AI Personalization";
      default:
        return "";
    }
  };

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <User className="w-6 h-6 text-white" />;
      case 2:
        return <Video className="w-6 h-6 text-white" />;
      case 3:
        return <TrendingUp className="w-6 h-6 text-white" />;
      default:
        return <User className="w-6 h-6 text-white" />;
    }
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
        <div className="w-full max-w-4xl">
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
                  <Video className="w-6 h-6 text-white" />
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep >= 3 ? 'bg-blue-500' : 'bg-gray-600'
                }`}>
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
              
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {isEditMode ? "Edit Creator Profile" : "Creator Profile Setup"}
                </CardTitle>
                <p className="text-muted-foreground mt-2">
                  {isEditMode ? "Update your creator profile information" : `Step ${currentStep} of ${totalSteps}: ${getStepTitle(currentStep)}`}
                </p>
              </div>
              
              <Progress value={progress} className="w-full" />
            </CardHeader>
            
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <CreatorProfileStep 
                  data={tempData} 
                  updateData={updateTempData} 
                />
              )}
              
              {currentStep === 2 && (
                <ContentStyleStep 
                  data={tempData} 
                  updateData={updateTempData} 
                />
              )}
              
              {currentStep === 3 && (
                <GrowthMonetizationStep 
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
