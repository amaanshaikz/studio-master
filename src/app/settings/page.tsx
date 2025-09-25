'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Settings, 
  ArrowLeft,
  Bell,
  Eye,
  Lock,
  Palette,
  Globe,
  Database,
  Trash2,
  Download,
  Upload,
  ChevronRight
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import DeleteAccountModal from '@/components/ui/delete-account-modal';
import { useToast } from '@/hooks/use-toast';

interface UserData {
  id: string;
  email: string;
  full_name?: string;
  role?: string;
  created_at: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Settings state
  const [notifications, setNotifications] = useState(true);
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchUserData();
    }
  }, [session]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserData(data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await fetch('/api/user/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete account');
      }

      // Show success message
      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
      });

      // Sign out and redirect to home page
      await signOut({ callbackUrl: '/' });
      
    } catch (error) {
      console.error('Error deleting account:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = userData?.full_name || session?.user?.name || session?.user?.email?.split('@')[0] || 'User';
  const displayEmail = session?.user?.email || '';
  const memberSince = userData?.created_at ? new Date(userData.created_at).toLocaleDateString() : 'Today';

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Manage your account and preferences</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader className="text-center pb-4">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-20 h-20 border-4 border-primary/20">
                    <AvatarImage src={session?.user?.image || ''} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl text-white">{displayName}</CardTitle>
                <CardDescription className="text-gray-400">{displayEmail}</CardDescription>
                <Badge variant="secondary" className="w-fit mx-auto mt-2">
                  {userData?.role || 'User'}
                </Badge>
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
                      <Shield className="w-3 h-3" />
                      Account status
                    </span>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      Active
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Management */}
            <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg text-white">
                  <div className="p-2 rounded-lg bg-blue-900/50 border border-blue-700/50">
                    <User className="w-5 h-5 text-blue-400" />
                  </div>
                  Profile Management
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your profile information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="h-12 border-gray-700 hover:bg-gray-800/50 text-white"
                    onClick={() => router.push('/profile')}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Eye className="w-5 h-5" />
                      <span>View Profile</span>
                    </div>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="h-12 border-gray-700 hover:bg-gray-800/50 text-white"
                    onClick={() => {
                      if (userData?.role === 'creator') {
                        router.push('/setup');
                      } else if (userData?.role === 'individual') {
                        router.push('/individual-setup');
                      } else {
                        router.push('/setup');
                      }
                    }}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <Settings className="w-5 h-5" />
                      <span>Setup Profile</span>
                    </div>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg text-white">
                  <div className="p-2 rounded-lg bg-green-900/50 border border-green-700/50">
                    <Bell className="w-5 h-5 text-green-400" />
                  </div>
                  Notifications
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Control how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Push Notifications</div>
                    <div className="text-sm text-gray-400">Receive notifications in your browser</div>
                  </div>
                  <Switch
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <Separator className="bg-gray-700" />
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Email Updates</div>
                    <div className="text-sm text-gray-400">Get updates via email</div>
                  </div>
                  <Switch
                    checked={emailUpdates}
                    onCheckedChange={setEmailUpdates}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Appearance Settings */}
            <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg text-white">
                  <div className="p-2 rounded-lg bg-purple-900/50 border border-purple-700/50">
                    <Palette className="w-5 h-5 text-purple-400" />
                  </div>
                  Appearance
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Customize the look and feel of your interface
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Dark Mode</div>
                    <div className="text-sm text-gray-400">Use dark theme for better visibility</div>
                  </div>
                  <Switch
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy & Security */}
            <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg text-white">
                  <div className="p-2 rounded-lg bg-red-900/50 border border-red-700/50">
                    <Lock className="w-5 h-5 text-red-400" />
                  </div>
                  Privacy & Security
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your privacy settings and data
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white">Analytics</div>
                    <div className="text-sm text-gray-400">Help improve our service with usage data</div>
                  </div>
                  <Switch
                    checked={analytics}
                    onCheckedChange={setAnalytics}
                  />
                </div>
                <Separator className="bg-gray-700" />
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700 hover:bg-gray-800/50 text-white"
                  onClick={() => {/* Export data functionality */}}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Download className="w-5 h-5" />
                    <span>Export My Data</span>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-red-700 hover:bg-red-900/20 text-red-400"
                  onClick={() => setShowDeleteModal(true)}
                >
                  <div className="flex items-center gap-3 w-full">
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Account</span>
                  </div>
                </Button>
              </CardContent>
            </Card>

            {/* Account Actions */}
            <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-lg text-white">
                  <div className="p-2 rounded-lg bg-orange-900/50 border border-orange-700/50">
                    <Shield className="w-5 h-5 text-orange-400" />
                  </div>
                  Account Actions
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your account and session
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-700 hover:bg-gray-800/50 text-white"
                  onClick={handleSignOut}
                >
                  <div className="flex items-center gap-3 w-full">
                    <ArrowLeft className="w-5 h-5" />
                    <span>Sign Out</span>
                  </div>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        userEmail={session?.user?.email}
      />
    </div>
  );
}
