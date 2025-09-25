'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Instagram, 
  User, 
  Sparkles, 
  ArrowRight,
  Loader2,
  Crown,
  Zap
} from 'lucide-react';

interface CreatorSetupOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (setupType: string) => void;
}

export default function CreatorSetupOverlay({ 
  isOpen, 
  onClose, 
  onComplete 
}: CreatorSetupOverlayProps) {
  const [selectedSetup, setSelectedSetup] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    console.log('handleSubmit called with selectedSetup:', selectedSetup);
    
    if (!selectedSetup) {
      toast({
        title: "Please select a setup option",
        description: "Choose how you'd like to personalize your creator experience.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting redirect process...');
    setIsLoading(true);

    try {
      if (selectedSetup === 'instagram') {
        // Redirect to Instagram connection flow
        console.log('Redirecting to Instagram connection...');
        router.push('/connect-instagram');
        // Fallback redirect in case router.push doesn't work
        setTimeout(() => {
          window.location.href = '/connect-instagram';
        }, 100);
      } else if (selectedSetup === 'manual') {
        // Redirect to manual setup
        console.log('Redirecting to manual setup...');
        router.push('/setup');
        // Fallback redirect in case router.push doesn't work
        setTimeout(() => {
          window.location.href = '/setup';
        }, 100);
      }

    } catch (error) {
      console.error('Error in setup flow:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary to-accent">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Choose Your Setup Method
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Select how you'd like to personalize your creator experience
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup 
              value={selectedSetup} 
              onValueChange={setSelectedSetup}
              className="space-y-4"
            >
              {/* Instagram Connection Option - Pro Feature */}
              <div className="relative">
                <RadioGroupItem 
                  value="instagram" 
                  id="instagram" 
                  className="peer sr-only"
                />
                <Label 
                  htmlFor="instagram" 
                  className="relative flex items-center space-x-4 p-4 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/10 group"
                >
                  {/* Glowing outline effect */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-lg blur-sm opacity-20 group-hover:opacity-30 transition-opacity"></div>
                  <div className="relative flex items-center space-x-3 flex-1">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500/20 to-purple-600/20 border border-pink-500/30">
                      <Instagram className="w-5 h-5 text-pink-400" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Connect to Instagram</span>
                        <div className="flex items-center gap-1">
                          <Crown className="w-3 h-3 text-yellow-400" />
                          <span className="px-2 py-1 text-xs font-medium bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-300 border border-yellow-500/30 rounded-full">
                            Pro Feature
                          </span>
                        </div>
                      </div>
                      <div className="text-sm text-gray-400">
                        Get AI-powered insights from your Instagram profile
                      </div>
                      <div className="flex items-center gap-1 mt-1">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-yellow-300">Instant personalization</span>
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              {/* Manual Setup Option */}
              <div className="relative">
                <RadioGroupItem 
                  value="manual" 
                  id="manual" 
                  className="peer sr-only"
                />
                <Label 
                  htmlFor="manual" 
                  className="flex items-center space-x-4 p-4 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/10"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 rounded-lg bg-blue-900/50 border border-blue-700/50">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Manual Setup</span>
                        <span className="px-2 py-1 text-xs font-medium bg-gray-600/50 text-gray-300 border border-gray-500/50 rounded-full">
                          Free
                        </span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Fill out your creator profile manually
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedSetup || isLoading}
                className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Setting up...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
