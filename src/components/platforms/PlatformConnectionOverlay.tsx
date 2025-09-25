'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  Instagram, 
  Linkedin, 
  Sparkles,
  Lock,
  Unlock,
  BrainCircuit,
  ArrowRight,
  CheckCircle,
  X
} from 'lucide-react';

interface PlatformData {
  connected: boolean;
  username?: string;
  fullName?: string;
  lastSync?: string;
}

export default function PlatformConnectionOverlay({ 
  onClose,
  onInstagramConnect
}: { 
  onClose: () => void;
  onInstagramConnect?: () => void;
}) {
  const { toast } = useToast();
  const [instagramData, setInstagramData] = useState<PlatformData>({ connected: false });
  const [linkedinData, setLinkedinData] = useState<PlatformData>({ connected: false });
  const [isLoading, setIsLoading] = useState(false);

  // Instagram OAuth URL
  const INSTAGRAM_CLIENT_ID = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
  const INSTAGRAM_REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/instagram` : '';

  // LinkedIn OAuth URL
  const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const LINKEDIN_REDIRECT_URI = typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback/linkedin` : '';

  const connectInstagram = () => {
    // If demo callback is provided, use it
    if (onInstagramConnect) {
      onInstagramConnect();
      return;
    }

    // TEMPORARY: Redirect to connect Instagram page instead of OAuth
    window.location.href = '/connect-instagram';

    // COMMENTED OUT: Original OAuth flow - uncomment when needed
    /*
    if (!INSTAGRAM_CLIENT_ID) {
      toast({
        title: "Configuration Error",
        description: "Instagram Client ID not configured",
        variant: "destructive",
      });
      return;
    }

    const instagramAuthUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(INSTAGRAM_REDIRECT_URI)}&scope=user_profile,user_media&response_type=code`;
    
    window.location.href = instagramAuthUrl;
    */
  };

  const connectLinkedIn = () => {
    if (!LINKEDIN_CLIENT_ID) {
      toast({
        title: "Configuration Error",
        description: "LinkedIn Client ID not configured",
        variant: "destructive",
      });
      return;
    }

    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(LINKEDIN_REDIRECT_URI)}&scope=r_liteprofile%20r_emailaddress%20w_member_social`;
    
    window.location.href = linkedinAuthUrl;
  };

  const loadPlatformData = async () => {
    try {
      // Load Instagram data
      const instagramResponse = await fetch('/api/platforms/instagram');
      if (instagramResponse.ok) {
        const instagramData = await instagramResponse.json();
        setInstagramData(instagramData);
      }

      // Load LinkedIn data
      const linkedinResponse = await fetch('/api/platforms/linkedin');
      if (linkedinResponse.ok) {
        const linkedinData = await linkedinResponse.json();
        setLinkedinData(linkedinData);
      }
    } catch (error) {
      console.error('Error loading platform data:', error);
    }
  };

  useEffect(() => {
    loadPlatformData();
  }, []);

  const totalConnected = (instagramData.connected ? 1 : 0) + (linkedinData.connected ? 1 : 0);
  const isFullyUnlocked = totalConnected >= 2;

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="w-full max-w-md mx-4">
        <Card className="shadow-2xl border-0 bg-black/90 backdrop-blur-md text-white border border-gray-800/50">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30">
                {isFullyUnlocked ? (
                  <Unlock className="h-7 w-7 text-primary" />
                ) : (
                  <Lock className="h-7 w-7 text-primary" />
                )}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Unlock Personalized AI Content Copilot
            </CardTitle>
            <CardDescription className="text-gray-300 mt-3 text-sm leading-relaxed">
              {isFullyUnlocked 
                ? 'Your AI copilot now has access to your social media data for personalized content creation.'
                : 'Connect your social media accounts to enable personalized AI content creation based on your actual posts, style, and audience.'
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-5">
          {/* Platform Connections */}
          <div className="space-y-4">
            {/* Instagram */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-pink-500/10 to-purple-600/10 rounded-xl border border-pink-500/20 hover:border-pink-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl shadow-lg">
                  <Instagram className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">Instagram</h3>
                  <p className="text-xs text-gray-300">
                    {instagramData.connected 
                      ? `@${instagramData.username}` 
                      : 'Connect your posts, reels & insights'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {instagramData.connected ? (
                  <Badge variant="outline" className="text-green-400 border-green-400 text-xs bg-green-400/10">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Button onClick={connectInstagram} disabled={isLoading} size="sm" className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-xs">
                    <Instagram className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </div>

            {/* LinkedIn */}
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl border border-blue-500/20 hover:border-blue-500/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-lg">
                  <Linkedin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">LinkedIn</h3>
                  <p className="text-xs text-gray-300">
                    {linkedinData.connected 
                      ? linkedinData.fullName 
                      : 'Connect your profile & network data'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {linkedinData.connected ? (
                  <Badge variant="outline" className="text-green-400 border-green-400 text-xs bg-green-400/10">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Button onClick={connectLinkedIn} disabled={isLoading} size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs">
                    <Linkedin className="w-3 h-3 mr-1" />
                    Connect
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="text-center pt-3">
            <div className="flex items-center justify-center gap-3 mb-3">
              <span className="text-sm text-gray-300">Progress:</span>
              <span className="text-sm font-semibold text-white">
                {totalConnected}/2 platforms connected
              </span>
            </div>
            <div className="w-full bg-gray-800/50 rounded-full h-2 border border-gray-700/50">
              <div 
                className="bg-gradient-to-r from-primary to-accent h-2 rounded-full transition-all duration-500 shadow-lg"
                style={{ width: `${(totalConnected / 2) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="text-gray-400 hover:text-white text-sm hover:bg-gray-800/50"
            >
              <X className="w-4 h-4 mr-2" />
              Skip for now
            </Button>
            
            {isFullyUnlocked ? (
              <Button 
                onClick={onClose}
                className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-sm shadow-lg"
              >
                Start Creating
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="text-sm text-gray-400">
                Connect both platforms to unlock full potential
              </div>
            )}
          </div>
        </CardContent>
        </Card>
      </div>
    </div>
  );
} 