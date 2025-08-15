
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Settings, 
  LogOut, 
  Brain, 
  Sparkles, 
  FileText, 
  Hash, 
  Crown,
  TrendingUp,
  Activity,
  Zap,
  ArrowRight,
  Video,
  RefreshCw
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import PlatformIntegration from '@/components/platforms/PlatformIntegration';
import PersonalizationOverlay from '@/components/auth/PersonalizationOverlay';

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPersonalization, setShowPersonalization] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user?.id) {
        try {
          const response = await fetch('/api/user/profile');
          if (response.ok) {
            const data = await response.json();
            setUserData(data);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    if (status === 'authenticated') {
      fetchUserData();
    }
  }, [session, status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handlePersonalizationComplete = (role: string) => {
    setShowPersonalization(false);
    // Refresh the page to show updated role
    window.location.reload();
  };

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'creator': return 'Creator';
      case 'individual': return 'Individual';
      default: return 'Not Set';
    }
  };

  const getRoleIcon = (role?: string) => {
    switch (role) {
      case 'creator': return <Video className="w-4 h-4" />;
      case 'individual': return <User className="w-4 h-4" />;
      default: return <User className="w-4 h-4" />;
    }
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'creator': return 'bg-blue-900/50 text-blue-400 border-blue-700';
      case 'individual': return 'bg-green-900/50 text-green-400 border-green-700';
      default: return 'bg-gray-900/50 text-gray-400 border-gray-700';
    }
  };

  // Use userData if available, otherwise fall back to session data
  const displayName = userData?.full_name || session?.user?.name || session?.user?.email?.split('@')[0] || 'User';
  const displayEmail = session?.user?.email || '';
  const memberSince = userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Today';

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Minimal Header */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-primary to-accent">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white">
                Account
              </h1>
            </div>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Manage your profile and track your AI content creation journey
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Minimal Profile Card */}
            <div className="lg:col-span-1">
              <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="text-center pb-6">
                  <div className="flex justify-center mb-6">
                    <Avatar className="w-20 h-20 border-2 border-primary/20">
                      <AvatarImage src={session?.user?.image || ''} />
                      <AvatarFallback className="text-xl bg-gradient-to-r from-primary to-accent text-white">
                        {displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <CardTitle className="text-xl text-white">{displayName}</CardTitle>
                  <CardDescription className="text-gray-400 flex items-center justify-center gap-1">
                    <Mail className="w-3 h-3" />
                    {displayEmail}
                  </CardDescription>
                  <div className="flex justify-center mt-4">
                    <Badge variant="secondary" className="bg-green-900/50 text-green-400 border-green-700">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Member since
                      </span>
                      <span className="text-white font-medium">{memberSince}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Activity className="w-3 h-3" />
                        Status
                      </span>
                      <Badge variant="outline" className="text-green-400 border-green-600 bg-green-900/20">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                      <span className="text-gray-400 flex items-center gap-1">
                        {getRoleIcon(userData?.role)}
                        Role
                      </span>
                      <Badge variant="outline" className={getRoleColor(userData?.role)}>
                        {getRoleDisplayName(userData?.role)}
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full border-red-600/50 text-red-400 hover:bg-red-900/20 hover:border-red-500" 
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Enhanced Account Details */}
            <div className="lg:col-span-3 space-y-8">
              {/* Personal Information */}
              <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="flex items-center gap-3 text-lg text-white">
                    <div className="p-2 rounded-lg bg-blue-900/50 border border-blue-700/50">
                      <User className="w-5 h-5 text-blue-400" />
                    </div>
                    Personal Information
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Update your personal details and contact information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Full Name</label>
                      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-sm font-medium text-white">{displayName}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-400">Email Address</label>
                      <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                        <p className="text-sm font-medium text-white">{displayEmail}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-primary/50 text-primary hover:bg-primary/10"
                      onClick={() => router.push('/profile')}
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Profile
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="border-green-600/50 text-green-400 hover:bg-green-900/20 hover:border-green-500"
                      onClick={() => {
                        if (userData?.role === 'creator') {
                          router.push('/setup');
                        } else if (userData?.role === 'individual') {
                          router.push('/individual-setup');
                        } else {
                          setShowPersonalization(true);
                        }
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Setup Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Personalization */}
              <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="flex items-center gap-3 text-lg text-white">
                    <div className="p-2 rounded-lg bg-purple-900/50 border border-purple-700/50">
                      <RefreshCw className="w-5 h-5 text-purple-400" />
                    </div>
                    Profile Personalization
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Change your role and personalize your experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
                      <div className="flex items-center gap-3">
                        {getRoleIcon(userData?.role)}
                        <div>
                          <div className="font-medium text-white">Current Role</div>
                          <div className="text-sm text-gray-400">
                            {getRoleDisplayName(userData?.role)}
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className={getRoleColor(userData?.role)}>
                        {getRoleDisplayName(userData?.role)}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-400">
                      <p>
                        Your role determines which setup flow and features are available to you. 
                        You can change this at any time.
                      </p>
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setShowPersonalization(true)}
                      className="border-purple-600/50 text-purple-400 hover:bg-purple-900/20 hover:border-purple-500"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Change Role
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Platform Integration */}
              <PlatformIntegration />

              {/* Minimal Account Statistics */}
              <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="flex items-center gap-3 text-lg text-white">
                    <div className="p-2 rounded-lg bg-purple-900/50 border border-purple-700/50">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                    </div>
                    Statistics
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Your activity and usage statistics
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="p-3 bg-blue-600/20 rounded-full w-fit mx-auto mb-3 border border-blue-600/30">
                        <Brain className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-3xl font-bold text-blue-400">0</div>
                      <div className="text-sm text-gray-400 font-medium">AI Sessions</div>
                    </div>
                    <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="p-3 bg-purple-600/20 rounded-full w-fit mx-auto mb-3 border border-purple-600/30">
                        <FileText className="w-6 h-6 text-purple-400" />
                      </div>
                      <div className="text-3xl font-bold text-purple-400">0</div>
                      <div className="text-sm text-gray-400 font-medium">Scripts</div>
                    </div>
                    <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="p-3 bg-green-600/20 rounded-full w-fit mx-auto mb-3 border border-green-600/30">
                        <Hash className="w-6 h-6 text-green-400" />
                      </div>
                      <div className="text-3xl font-bold text-green-400">0</div>
                      <div className="text-sm text-gray-400 font-medium">Captions</div>
                    </div>
                    <div className="text-center p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="p-3 bg-orange-600/20 rounded-full w-fit mx-auto mb-3 border border-orange-600/30">
                        <Sparkles className="w-6 h-6 text-orange-400" />
                      </div>
                      <div className="text-3xl font-bold text-orange-400">0</div>
                      <div className="text-sm text-gray-400 font-medium">Ideas</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Minimal Quick Actions */}
              <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
                <CardHeader className="border-b border-gray-800">
                  <CardTitle className="flex items-center gap-3 text-lg text-white">
                    <div className="p-2 rounded-lg bg-green-900/50 border border-green-700/50">
                      <Zap className="w-5 h-5 text-green-400" />
                    </div>
                    Quick Actions
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Access your most used features and tools
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="h-16 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 border-0 shadow-lg">
                      <div className="text-left w-full flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">AI Copilot</div>
                          <div className="text-xs opacity-90">Try our intelligent assistant</div>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                    <Button variant="outline" className="h-16 border-gray-700 hover:bg-gray-800/50 text-white shadow-lg">
                      <div className="text-left w-full flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">Generate Scripts</div>
                          <div className="text-xs opacity-90">Create viral content</div>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                    <Button variant="outline" className="h-16 border-gray-700 hover:bg-gray-800/50 text-white shadow-lg">
                      <div className="text-left w-full flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">Create Captions</div>
                          <div className="text-xs opacity-90">Engaging social media captions</div>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                    <Button variant="outline" className="h-16 border-gray-700 hover:bg-gray-800/50 text-white shadow-lg">
                      <div className="text-left w-full flex items-center justify-between">
                        <div>
                          <div className="font-semibold text-lg">Settings</div>
                          <div className="text-xs opacity-90">Manage preferences</div>
                        </div>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Personalization Overlay */}
      <PersonalizationOverlay
        isOpen={showPersonalization}
        onClose={() => setShowPersonalization(false)}
        onComplete={handlePersonalizationComplete}
      />
    </div>
  );
}
