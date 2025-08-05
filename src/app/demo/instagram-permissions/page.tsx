'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, CheckCircle, AlertCircle, Shield, Eye, Users, Heart, MessageCircle, Share2, Image, Video, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InstagramPermissionsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleGrantPermissions = () => {
    setIsLoading(true);
    
    // Simulate permission granting process
    setTimeout(() => {
      setIsLoading(false);
      router.push('/demo/instagram-syncing');
    }, 1500);
  };

  const handleBack = () => {
    router.push('/demo/instagram-login');
  };

  const permissions = [
    {
      icon: Eye,
      title: 'Profile Information',
      description: 'Access to your username, full name, and profile picture',
      required: true,
      color: 'text-blue-500'
    },
    {
      icon: Image,
      title: 'Media Access',
      description: 'View your photos and videos to analyze content style',
      required: true,
      color: 'text-pink-500'
    },
    {
      icon: Users,
      title: 'Followers & Following',
      description: 'Access to your follower count and following list',
      required: false,
      color: 'text-green-500'
    },
    {
      icon: Heart,
      title: 'Likes & Comments',
      description: 'View likes and comments on your posts for engagement analysis',
      required: false,
      color: 'text-red-500'
    },
    {
      icon: FileText,
      title: 'Captions & Hashtags',
      description: 'Read your post captions and hashtags for content analysis',
      required: true,
      color: 'text-purple-500'
    },
    {
      icon: Share2,
      title: 'Insights & Analytics',
      description: 'Access to post performance data and audience insights',
      required: false,
      color: 'text-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-white text-black">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
              <Instagram className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-black">
            Grant Permissions
          </CardTitle>
          <p className="text-gray-600 text-sm">
            CreateX AI needs access to your Instagram data to provide personalized content suggestions
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* User Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">DU</span>
              </div>
              <div>
                <h3 className="font-semibold text-black">demo_user</h3>
                <p className="text-sm text-gray-600">Demo User • 1,234 followers</p>
              </div>
            </div>
          </div>

          {/* Permissions List */}
          <div className="space-y-4">
            <h4 className="font-semibold text-black">Requested Permissions:</h4>
            <div className="space-y-3">
              {permissions.map((permission, index) => {
                const Icon = permission.icon;
                return (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`p-2 rounded-lg bg-gray-100 ${permission.color}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h5 className="font-medium text-black">{permission.title}</h5>
                        {permission.required && (
                          <Badge variant="outline" className="text-xs text-red-600 border-red-600">
                            Required
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{permission.description}</p>
                    </div>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h5 className="font-semibold text-blue-900">Security & Privacy</h5>
                <p className="text-sm text-blue-700 mt-1">
                  Your data is encrypted and secure. We only access the information needed to provide personalized content suggestions. 
                  You can revoke access at any time in your Instagram settings.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1 border-gray-300 text-black hover:bg-gray-50"
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button
              onClick={handleGrantPermissions}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Granting...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4" />
                  <span>Grant Permissions</span>
                </div>
              )}
            </Button>
          </div>

          {/* Demo Info */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-yellow-600 border-yellow-600 text-xs">
                Demo Mode
              </Badge>
            </div>
            <p className="text-xs text-yellow-700">
              This is a mock permissions screen. In a real scenario, this would be Instagram's OAuth consent screen.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 