'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Video, 
  Play, 
  Download, 
  Loader2, 
  Sparkles, 
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';

interface OptimizedVideoContainerProps {
  videoSummary?: string;
  suggestions?: string[];
  engagementScores?: {
    relatability: number;
    nicheAlignment: number;
    creativeScore: number;
  };
  onVideoGenerated?: (videoUrl: string) => void;
}

export default function OptimizedVideoContainer({
  videoSummary,
  suggestions = [],
  engagementScores,
  onVideoGenerated
}: OptimizedVideoContainerProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [videoDescription, setVideoDescription] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleGenerateVideo = async () => {
    if (!videoSummary) {
      setError('Video summary is required to generate optimized video');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoSummary,
          suggestions,
          engagementScores
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate video');
      }

      setGeneratedVideoUrl(data.videoUrl);
      setVideoDescription(data.description || null);
      onVideoGenerated?.(data.videoUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate video');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = () => {
    if (generatedVideoUrl) {
      const link = document.createElement('a');
      link.href = generatedVideoUrl;
      link.download = 'optimized-sample-video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const canGenerate = videoSummary && videoSummary.length > 0;

  return (
    <Card className="border border-gray-800 bg-gray-900/50 backdrop-blur-sm">
      <CardHeader className="border-b border-gray-800">
        <CardTitle className="flex items-center gap-3 text-lg text-white">
          <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 border border-purple-700/50">
            <Video className="w-5 h-5 text-white" />
          </div>
          Optimized Sample Video
        </CardTitle>
        <CardDescription className="text-gray-400">
          Generate an AI-optimized video based on your content analysis and engagement predictions
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6 pt-6">
        {/* Generation Status */}
        {isGenerating && (
          <div className="space-y-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <div>
                <div className="font-medium text-blue-400">Generating Video...</div>
                <div className="text-sm text-gray-400">Using Veo 3 Fast AI model</div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Progress</span>
                <span>Processing</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Video Summary Display */}
        {videoSummary && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-medium text-gray-300">Video Summary</span>
            </div>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-300">{videoSummary}</p>
            </div>
          </div>
        )}

        {/* Suggestions Display */}
        {suggestions.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Optimization Suggestions</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="text-xs bg-green-500/10 text-green-400 border-green-500/30"
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Engagement Scores Display */}
        {engagementScores && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-sm font-medium text-gray-300">Engagement Scores</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-lg font-bold text-blue-400">{engagementScores.relatability}%</div>
                <div className="text-xs text-gray-400">Relatability</div>
              </div>
              <div className="text-center p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-lg font-bold text-green-400">{engagementScores.nicheAlignment}%</div>
                <div className="text-xs text-gray-400">Niche Alignment</div>
              </div>
              <div className="text-center p-2 bg-gray-800/50 rounded-lg border border-gray-700">
                <div className="text-lg font-bold text-purple-400">{engagementScores.creativeScore}%</div>
                <div className="text-xs text-gray-400">Creative Score</div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerateVideo}
          disabled={!canGenerate || isGenerating}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Video...
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Generate Optimized Sample Video
            </>
          )}
        </Button>

        {/* Generated Video Display */}
        {generatedVideoUrl && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-green-400" />
              <span className="text-sm font-medium text-gray-300">Generated Video</span>
            </div>
            
            <div className="relative bg-black rounded-lg overflow-hidden border border-gray-700">
              <video
                src={generatedVideoUrl}
                controls
                className="w-full h-auto max-h-96"
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
                poster="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkFJLUdlbmVyYXRlZCBWaWRlbzwvdGV4dD48L3N2Zz4="
              >
                Your browser does not support the video tag.
              </video>
              
              {/* Video Overlay */}
              {!isVideoPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                  <div className="p-3 bg-white/10 backdrop-blur-sm rounded-full">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
            </div>

            {/* Video Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleDownload}
                variant="outline"
                size="sm"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Video
              </Button>
              <Button
                onClick={() => setGeneratedVideoUrl(null)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Generate New
              </Button>
            </div>

            {/* Video Description */}
            {videoDescription && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-medium text-gray-300">AI Video Description</span>
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-700">
                  <p className="text-sm text-gray-300">{videoDescription}</p>
                </div>
              </div>
            )}

            {/* Video Info */}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>8-10 seconds</span>
              </div>
              <div className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                <span>Vertical (9:16)</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                <span>AI Optimized</span>
              </div>
            </div>
          </div>
        )}

        {/* Demo Mode Notice */}
        <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <div className="flex items-center gap-2 text-sm text-blue-400">
            <Video className="w-4 h-4" />
            <span className="font-medium">Demo Mode</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            Currently showing sample videos. In production, this would generate AI-optimized videos using Veo 3 Fast.
          </p>
        </div>

        {/* Help Text */}
        {!canGenerate && (
          <div className="text-center text-sm text-gray-500 py-4">
            Upload a video to get AI-optimized suggestions and generate a sample video
          </div>
        )}
      </CardContent>
    </Card>
  );
}
