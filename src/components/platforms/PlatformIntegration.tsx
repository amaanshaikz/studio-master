'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Instagram, 
  Linkedin, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  User,
  Image as ImageIcon,
  MessageSquare,
  Heart,
  Eye,
  TrendingUp,
  Calendar,
  Hash,
  FileText
} from 'lucide-react';

interface PlatformData {
  connected: boolean;
  username?: string;
  fullName?: string;
  bio?: string;
  profilePicture?: string;
  followers?: number;
  following?: number;
  posts?: number;
  media?: any[];
  insights?: any;
  lastSync?: string;
}

interface InstagramData extends PlatformData {
  reels?: any[];
  captions?: string[];
  hashtags?: string[];
  comments?: any[];
  likes?: any[];
}

interface LinkedInData extends PlatformData {
  about?: string;
  headline?: string;
  location?: string;
  industry?: string;
  connections?: number;
}

export default function PlatformIntegration() {
  const { toast } = useToast();
  const [instagramData, setInstagramData] = useState<InstagramData>({ connected: false });
  const [linkedinData, setLinkedinData] = useState<LinkedInData>({ connected: false });
  const [isLoading, setIsLoading] = useState(false);

  // Instagram OAuth URL
  const INSTAGRAM_CLIENT_ID = process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID;
  const INSTAGRAM_REDIRECT_URI = `${window.location.origin}/api/auth/callback/instagram`;

  // LinkedIn OAuth URL
  const LINKEDIN_CLIENT_ID = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const LINKEDIN_REDIRECT_URI = `${window.location.origin}/api/auth/callback/linkedin`;

  const connectInstagram = () => {
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

  const disconnectPlatform = async (platform: 'instagram' | 'linkedin') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/platforms/${platform}/disconnect`, {
        method: 'POST',
      });

      if (response.ok) {
        if (platform === 'instagram') {
          setInstagramData({ connected: false });
        } else {
          setLinkedinData({ connected: false });
        }
        
        toast({
          title: `${platform.charAt(0).toUpperCase() + platform.slice(1)} Disconnected`,
          description: `Successfully disconnected from ${platform}`,
        });
      } else {
        throw new Error('Failed to disconnect');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to disconnect from ${platform}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const refreshPlatformData = async (platform: 'instagram' | 'linkedin') => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/platforms/${platform}/refresh`, {
        method: 'POST',
      });

      if (response.ok) {
        const data = await response.json();
        if (platform === 'instagram') {
          setInstagramData(data);
        } else {
          setLinkedinData(data);
        }
        
        toast({
          title: "Data Refreshed",
          description: `Successfully refreshed ${platform} data`,
        });
      } else {
        throw new Error('Failed to refresh data');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to refresh ${platform} data`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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

  const renderInstagramData = () => {
    if (!instagramData.connected) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {instagramData.profilePicture && (
            <img 
              src={instagramData.profilePicture} 
              alt="Profile" 
              className="w-16 h-16 rounded-full border-2 border-pink-600/30"
            />
          )}
          <div>
            <h3 className="font-semibold text-white">{instagramData.fullName}</h3>
            <p className="text-sm text-gray-400">@{instagramData.username}</p>
            {instagramData.bio && (
              <p className="text-sm mt-1 text-gray-300">{instagramData.bio}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-xl font-bold text-pink-400">{instagramData.followers || 0}</div>
            <div className="text-xs text-gray-400">Followers</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-xl font-bold text-blue-400">{instagramData.following || 0}</div>
            <div className="text-xs text-gray-400">Following</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-xl font-bold text-purple-400">{instagramData.posts || 0}</div>
            <div className="text-xs text-gray-400">Posts</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-xl font-bold text-green-400">{instagramData.reels?.length || 0}</div>
            <div className="text-xs text-gray-400">Reels</div>
          </div>
        </div>

        {instagramData.media && instagramData.media.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 text-white">Recent Media</h4>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
              {instagramData.media.slice(0, 6).map((media: any, index: number) => (
                <div key={index} className="aspect-square bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
                  {media.media_type === 'IMAGE' && media.media_url && (
                    <img 
                      src={media.media_url} 
                      alt={`Media ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {instagramData.lastSync && (
          <p className="text-xs text-gray-500">
            Last synced: {new Date(instagramData.lastSync).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  };

  const renderLinkedInData = () => {
    if (!linkedinData.connected) return null;

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {linkedinData.profilePicture && (
            <img 
              src={linkedinData.profilePicture} 
              alt="Profile" 
              className="w-16 h-16 rounded-full border-2 border-blue-600/30"
            />
          )}
          <div>
            <h3 className="font-semibold text-white">{linkedinData.fullName}</h3>
            {linkedinData.headline && (
              <p className="text-sm text-gray-400">{linkedinData.headline}</p>
            )}
            {linkedinData.location && (
              <p className="text-xs text-gray-500">{linkedinData.location}</p>
            )}
          </div>
        </div>

        {linkedinData.about && (
          <div>
            <h4 className="font-medium mb-2 text-white">About</h4>
            <p className="text-sm text-gray-300">{linkedinData.about}</p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-xl font-bold text-blue-400">{linkedinData.connections || 0}</div>
            <div className="text-xs text-gray-400">Connections</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-xl font-bold text-green-400">{linkedinData.followers || 0}</div>
            <div className="text-xs text-gray-400">Followers</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg border border-gray-700">
            <div className="text-xl font-bold text-purple-400">{linkedinData.posts || 0}</div>
            <div className="text-xs text-gray-400">Posts</div>
          </div>
        </div>

        {linkedinData.lastSync && (
          <p className="text-xs text-gray-500">
            Last synced: {new Date(linkedinData.lastSync).toLocaleDateString()}
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="flex items-center gap-3 text-lg text-white">
          <div className="p-2 rounded-lg bg-blue-900/50 border border-blue-700/50">
            <ExternalLink className="w-5 h-5 text-blue-400" />
          </div>
          Platform Integration
        </CardTitle>
        <CardDescription className="text-gray-400">
          Connect your social media accounts to access your data and insights
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        {/* Instagram Integration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-pink-600/20 to-purple-600/20 rounded-lg border border-pink-600/30">
                <Instagram className="w-5 h-5 text-pink-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">Instagram</h3>
                <p className="text-sm text-gray-400">
                  Connect to access your posts, reels, and insights
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {instagramData.connected ? (
                <>
                  <Badge variant="outline" className="text-green-400 border-green-600 bg-green-900/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshPlatformData('instagram')}
                    disabled={isLoading}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectPlatform('instagram')}
                    disabled={isLoading}
                    className="border-red-600/50 text-red-400 hover:bg-red-900/20"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={connectInstagram} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 border-0"
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Connect Instagram
                </Button>
              )}
            </div>
          </div>
          
          {instagramData.connected && (
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              {renderInstagramData()}
            </div>
          )}
        </div>

        <div className="border-t border-gray-700 my-6"></div>

        {/* LinkedIn Integration */}
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg border border-gray-700">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-600/20 to-blue-700/20 rounded-lg border border-blue-600/30">
                <Linkedin className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-medium text-white">LinkedIn</h3>
                <p className="text-sm text-gray-400">
                  Connect to access your profile and network data
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {linkedinData.connected ? (
                <>
                  <Badge variant="outline" className="text-green-400 border-green-600 bg-green-900/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => refreshPlatformData('linkedin')}
                    disabled={isLoading}
                    className="border-gray-600 text-gray-300 hover:bg-gray-700/50"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => disconnectPlatform('linkedin')}
                    disabled={isLoading}
                    className="border-red-600/50 text-red-400 hover:bg-red-900/20"
                  >
                    <XCircle className="w-4 h-4" />
                  </Button>
                </>
              ) : (
                <Button 
                  onClick={connectLinkedIn} 
                  disabled={isLoading}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 border-0"
                >
                  <Linkedin className="w-4 h-4 mr-2" />
                  Connect LinkedIn
                </Button>
              )}
            </div>
          </div>
          
          {linkedinData.connected && (
            <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-700">
              {renderLinkedInData()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 