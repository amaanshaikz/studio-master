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
  Video, 
  TrendingUp, 
  Edit, 
  CheckCircle,
  Clock,
  MapPin,
  Languages,
  Target,
  Lightbulb,
  Settings,
  Loader2,
  Users,
  Eye,
  Calendar,
  Mic,
  Music,
  DollarSign,
  Zap,
  Shield,
  Globe,
  Hash,
  Sparkles
} from 'lucide-react';
import { CreatorData } from '@/types/creator';

const CreatorProfileView = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [creatorData, setCreatorData] = useState<CreatorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      loadCreatorData();
    }
  }, [session, status]);

  const loadCreatorData = async () => {
    try {
      const response = await fetch('/api/user/creator/profile');
      if (response.ok) {
        const data = await response.json();
        setCreatorData(data.creator);
      } else if (response.status === 404) {
        // No creator profile found
        setCreatorData(null);
      } else {
        throw new Error('Failed to load creator profile');
      }
    } catch (error) {
      console.error('Error loading creator data:', error);
      toast({
        title: "Error",
        description: "Failed to load creator profile data.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditProfile = () => {
    router.push('/setup');
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

  if (!creatorData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Creator Profile Not Found</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-muted-foreground">
              No creator profile data found. Please complete your creator setup.
            </p>
            <Button onClick={handleCompleteSetup} className="w-full">
              Complete Creator Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isSetupComplete = creatorData.is_setup_complete;

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
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-400">
                <Video className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Creator Profile
              </h1>
            </div>
            {!isSetupComplete && (
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <Clock className="w-4 h-4" />
                <span>Setup incomplete - Step {creatorData.current_step || 1} of 3</span>
              </div>
            )}
            <div className="flex justify-center gap-2">
              <Button onClick={handleEditProfile} variant="outline" className="flex items-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Creator Profile
              </Button>
              {!isSetupComplete && (
                <Button onClick={handleCompleteSetup} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Complete Setup
                </Button>
              )}
            </div>
          </div>

          {/* SECTION 1: CREATOR PROFILE & BRAND */}
          <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Creator Profile & Brand
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <p className="text-lg">{creatorData.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Age</Label>
                  <p className="text-lg">{creatorData.age || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    Location
                  </Label>
                  <p className="text-lg">{creatorData.location || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Languages className="w-4 h-4" />
                    Primary Language
                  </Label>
                  <p className="text-lg">{creatorData.primary_language || 'Not provided'}</p>
                </div>
              </div>

              {/* Platforms */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  Platforms
                </Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {creatorData.platforms && creatorData.platforms.length > 0 ? (
                    creatorData.platforms.map((platform) => (
                      <Badge 
                        key={platform} 
                        variant={platform === creatorData.main_focus_platform ? "default" : "secondary"}
                        className={platform === creatorData.main_focus_platform ? "bg-blue-500/20 text-blue-400" : ""}
                      >
                        {platform}
                        {platform === creatorData.main_focus_platform && (
                          <Sparkles className="w-3 h-3 ml-1" />
                        )}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No platforms specified</p>
                  )}
                </div>
                {creatorData.other_platforms && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Other: {creatorData.other_platforms}
                  </p>
                )}
              </div>

              {/* Niche & Audience */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Primary Niche</Label>
                  <p className="text-lg">{creatorData.primary_niche || 'Not provided'}</p>
                  {creatorData.sub_niche && (
                    <p className="text-sm text-muted-foreground">Sub-niche: {creatorData.sub_niche}</p>
                  )}
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Target Audience
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {creatorData.target_audience && creatorData.target_audience.length > 0 ? (
                      creatorData.target_audience.map((audience) => (
                        <Badge key={audience} variant="outline">
                          {audience}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No target audience specified</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Brand & Tone */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Brand Words</Label>
                  <p className="text-lg">{creatorData.brand_words || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tone/Style</Label>
                  <p className="text-lg">{creatorData.tone_style || 'Not provided'}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Total Followers
                  </Label>
                  <p className="text-lg">{creatorData.total_followers?.toLocaleString() || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    Average Views
                  </Label>
                  <p className="text-lg">{creatorData.average_views?.toLocaleString() || 'Not provided'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SECTION 2: CONTENT STYLE & CREATIVE DIRECTION */}
          <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Video className="w-5 h-5" />
                Content Style & Creative Direction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Content Formats */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Content Formats</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {creatorData.content_formats && creatorData.content_formats.length > 0 ? (
                    creatorData.content_formats.map((format) => (
                      <Badge key={format} variant="secondary">
                        {format}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No content formats specified</p>
                  )}
                </div>
                {creatorData.other_formats && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Other: {creatorData.other_formats}
                  </p>
                )}
              </div>

              {/* Content Length */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Typical Length</Label>
                  <p className="text-lg">
                    {creatorData.typical_length_number && creatorData.typical_length_unit 
                      ? `${creatorData.typical_length_number} ${creatorData.typical_length_unit}`
                      : 'Not provided'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Posting Schedule
                  </Label>
                  <p className="text-lg">{creatorData.posting_schedule || 'Not provided'}</p>
                  {creatorData.posting_frequency && (
                    <p className="text-sm text-muted-foreground">
                      {creatorData.posting_frequency} posts per week
                    </p>
                  )}
                </div>
              </div>

              {/* On-Camera & Voiceovers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">On Camera</Label>
                  <p className="text-lg">{creatorData.on_camera || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Mic className="w-4 h-4" />
                    Use Voiceovers
                  </Label>
                  <p className="text-lg">{creatorData.use_voiceovers || 'Not provided'}</p>
                </div>
              </div>

              {/* Editing Style */}
              {creatorData.editing_music_style && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Music className="w-4 h-4" />
                    Editing/Music Style
                  </Label>
                  <p className="text-lg">{creatorData.editing_music_style}</p>
                </div>
              )}

              {/* Goals */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    Short-term Goals (3 months)
                  </Label>
                  <p className="text-lg">{creatorData.short_term_goals || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Long-term Goals (1-3 years)
                  </Label>
                  <p className="text-lg">{creatorData.long_term_goals || 'Not provided'}</p>
                </div>
              </div>

              {/* Biggest Challenge */}
              {creatorData.biggest_challenge && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Biggest Challenge</Label>
                  <p className="text-lg">{creatorData.biggest_challenge}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* SECTION 3: GROWTH, MONETIZATION & AI PERSONALIZATION */}
          <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Growth, Monetization & AI Personalization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Strengths</Label>
                  <p className="text-lg">{creatorData.strengths || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Weaknesses</Label>
                  <p className="text-lg">{creatorData.weaknesses || 'Not provided'}</p>
                </div>
              </div>

              {/* Income Streams */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-4 h-4" />
                  Income Streams
                </Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {creatorData.income_streams && creatorData.income_streams.length > 0 ? (
                    creatorData.income_streams.map((stream) => (
                      <Badge key={stream} variant="default" className="bg-green-500/20 text-green-400">
                        {stream}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No income streams specified</p>
                  )}
                </div>
              </div>

              {/* Brand Types to Avoid */}
              {creatorData.brand_types_to_avoid && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Brand Types to Avoid
                  </Label>
                  <p className="text-lg">{creatorData.brand_types_to_avoid}</p>
                </div>
              )}

              {/* AI Help Preferences */}
              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                  <Zap className="w-4 h-4" />
                  AI Help Preferences
                </Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {creatorData.ai_help_preferences && creatorData.ai_help_preferences.length > 0 ? (
                    creatorData.ai_help_preferences.map((preference) => (
                      <Badge key={preference} variant="default" className="bg-purple-500/20 text-purple-400">
                        {preference}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-muted-foreground">No AI help preferences specified</p>
                  )}
                </div>
              </div>

              {/* Content Strategy */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Niche Focus</Label>
                  <p className="text-lg">{creatorData.niche_focus || 'Not provided'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Content Style</Label>
                  <p className="text-lg">{creatorData.content_style || 'Not provided'}</p>
                </div>
              </div>

              {/* Non-negotiable Rules */}
              {creatorData.non_negotiable_rules && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                    <Shield className="w-4 h-4" />
                    Non-negotiable Rules
                  </Label>
                  <p className="text-lg">{creatorData.non_negotiable_rules}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfileView;
