'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Video, 
  Sparkles, 
  ArrowRight,
  Loader2
} from 'lucide-react';

interface PersonalizationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (role: string) => void;
}

export default function PersonalizationOverlay({ 
  isOpen, 
  onClose, 
  onComplete 
}: PersonalizationOverlayProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose either Creator or Individual to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Update user role in database
      const response = await fetch('/api/user/role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update role');
      }

      toast({
        title: "Role selected successfully!",
        description: `Welcome to CreateX AI as a ${selectedRole}!`,
      });

      // Call the completion handler
      onComplete(selectedRole);

    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to save your selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary to-accent">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Choose Your Personalization
            </CardTitle>
            <p className="text-gray-400 text-sm">
              Select your role to personalize your CreateX AI experience
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <RadioGroup 
              value={selectedRole} 
              onValueChange={setSelectedRole}
              className="space-y-4"
            >
              {/* Creator Option */}
              <div className="relative">
                <RadioGroupItem 
                  value="creator" 
                  id="creator" 
                  className="peer sr-only"
                />
                <Label 
                  htmlFor="creator" 
                  className="flex items-center space-x-4 p-4 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/10"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 rounded-lg bg-blue-900/50 border border-blue-700/50">
                      <Video className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">Creator</div>
                      <div className="text-sm text-gray-400">
                        Content creators, influencers, and social media professionals
                      </div>
                    </div>
                  </div>
                </Label>
              </div>

              {/* Individual Option */}
              <div className="relative">
                <RadioGroupItem 
                  value="individual" 
                  id="individual" 
                  className="peer sr-only"
                />
                <Label 
                  htmlFor="individual" 
                  className="flex items-center space-x-4 p-4 border-2 border-gray-700 rounded-lg cursor-pointer hover:border-primary/50 transition-colors peer-checked:border-primary peer-checked:bg-primary/10"
                >
                  <div className="flex items-center space-x-3 flex-1">
                    <div className="p-2 rounded-lg bg-green-900/50 border border-green-700/50">
                      <User className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="text-left">
                      <div className="font-semibold text-white">Individual</div>
                      <div className="text-sm text-gray-400">
                        Personal users, professionals, and general productivity
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            </RadioGroup>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSubmit}
                disabled={!selectedRole || isLoading}
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
