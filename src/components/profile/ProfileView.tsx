'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Brain, 
  Briefcase, 
  Edit, 
  CheckCircle,
  Clock,
  MapPin,
  Languages,
  Target,
  Lightbulb,
  Settings,
  Loader2
} from 'lucide-react';
import CreatorProfileView from './CreatorProfileView';

interface ProfileData {
  id?: string;
  user_id?: string;
  full_name?: string;
  nickname?: string;
  age?: number;
  pronouns?: string;
  location?: string;
  timezone?: string;
  languages?: string[];
  communication_style?: string;
  goals_now?: string[];
  focus_improvement?: string;
  motivation?: string;
  personality_type?: string;
  productive_time?: string;
  productivity_systems?: string[];
  profession?: string;
  career_study_goals?: string[];
  career_study_goals_notes?: string;
  tools_used?: string[];
  work_challenges?: string;
  ai_support_preference?: string[];
  is_setup_complete?: boolean;
  current_step?: number;
  ai_boundaries?: string;
}

const ProfileView = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      loadUserRole();
    }
  }, [session, status]);

  const loadUserRole = async () => {
    try {
      const response = await fetch('/api/user/role');
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.user.role);
        
        // Load appropriate profile data based on role
        if (data.user.role === 'creator') {
          // For creators, we'll let CreatorProfileView handle the data loading
          setIsLoading(false);
        } else {
          // For individuals, load the regular profile data
          loadProfileData();
        }
      } else {
        // No role set, load regular profile data
        loadProfileData();
      }
    } catch (error) {
      console.error('Error loading user role:', error);
      // Fallback to loading regular profile data
      loadProfileData();
    }
  };

  const loadProfileData = async () => {
    try {
      const response = await fetch('/api/user/profile/setup');
      if (response.ok) {
        const data = await response.json();
        setProfileData(data);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
      toast({
        title: "Error",
        description: "Failed to load profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = async () => {
    // Check user role to determine which setup to redirect to
    try {
      const response = await fetch('/api/user/role');
      if (response.ok) {
        const data = await response.json();
        if (data.user.role === 'creator') {
          router.push('/setup');
        } else if (data.user.role === 'individual') {
          router.push('/individual-setup');
        } else {
          // No role set, go to main setup which will show personalization
          router.push('/setup');
        }
      } else {
        router.push('/setup');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      router.push('/setup');
    }
  };

  const handleCompleteSetup = () => {
    router.push('/setup');
  };

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is a creator, render the CreatorProfileView
  if (userRole === 'creator') {
    return <CreatorProfileView />;
  }

  // For individual users or users without a role set
  if (!profileData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              No profile data found. Please complete your setup.
            </p>
            <Button onClick={handleCompleteSetup} className="w-full">
              Complete Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSetupComplete = profileData.is_setup_complete;

  return (
    <div className="min-h-screen bg-black relative">
      {/* Stars Background */}
      <div className="stars-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Your Profile
            </h1>
            {!isSetupComplete && (
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Clock className="w-4 h-4" />
                <span>Setup incomplete - Step {profileData.current_step || 1} of 3</span>
              </div>
            )}
            <div className="flex justify-center gap-2">
              <Button onClick={handleEditProfile} variant="outline" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
              {!isSetupComplete && (
                <Button onClick={handleCompleteSetup} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Setup
                </Button>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <p className="text-lg">{profileData.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Nickname</Label>
                  <p className="text-lg">{profileData.nickname || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                  <p className="text-lg">{profileData.age || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Pronouns</Label>
                  <p className="text-lg">{profileData.pronouns || 'Not provided'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <p className="text-lg">{profileData.location || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Timezone</Label>
                  <p className="text-lg">{profileData.timezone || 'Not provided'}</p>
                </div>
              </div>

              {profileData.languages && profileData.languages.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Languages className="w-4 h-4" />
                    Languages
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData.languages.map((language) => (
                      <Badge key={language} variant="secondary">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Communication Style</Label>
                <p className="text-lg">{profileData.communication_style || 'Not provided'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Personal Insights */}
          <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Personal Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Important Goals removed as requested */}

              {profileData.focus_improvement && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Area of Focus</Label>
                  <p className="text-lg">{profileData.focus_improvement}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Motivation</Label>
                  <p className="text-lg capitalize">{profileData.motivation || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Personality Type</Label>
                  <p className="text-lg capitalize">{profileData.personality_type || 'Not provided'}</p>
                </div>
              </div>

              {profileData.ai_boundaries && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">AI Boundaries</Label>
                  <p className="text-lg">{profileData.ai_boundaries}</p>
                </div>
              )}

              <div>
                <Label className="text-sm font-medium text-muted-foreground">Most Productive Time</Label>
                <p className="text-lg">{profileData.productive_time || 'Not provided'}</p>
              </div>

              {profileData.productivity_systems && profileData.productivity_systems.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Productivity Systems</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {profileData.productivity_systems.map((system) => (
                      <Badge key={system} variant="outline">
                        {system}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Professional Profile */}
          {(profileData.profession || (profileData.career_study_goals && profileData.career_study_goals.length > 0)) && (
            <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Professional Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Profession</Label>
                  <p className="text-lg">{profileData.profession || '—'}</p>
                </div>

                {profileData.career_study_goals && profileData.career_study_goals.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      Career/Study Goals
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.career_study_goals.map((goal) => (
                        <Badge key={goal} variant="secondary">
                          {goal}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profileData.career_study_goals_notes && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Notes</Label>
                    <p className="text-lg">{profileData.career_study_goals_notes}</p>
                  </div>
                )}

                {profileData.tools_used && profileData.tools_used.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Tools & Platforms</Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.tools_used.map((tool) => (
                        <Badge key={tool} variant="secondary">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {profileData.work_challenges && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Work Challenge</Label>
                    <p className="text-lg">{profileData.work_challenges}</p>
                  </div>
                )}

                {profileData.ai_support_preference && profileData.ai_support_preference.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                      <Lightbulb className="w-4 h-4" />
                      AI Support Preferences
                    </Label>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {profileData.ai_support_preference.map((preference) => (
                        <Badge key={preference} variant="default" className="bg-blue-500/20 text-blue-400">
                          {preference}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
