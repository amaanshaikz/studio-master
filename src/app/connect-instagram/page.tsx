'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ProgressModal from '@/components/instagram/ProgressModal';

export default function ConnectInstagramPage() {
  const { data: session, status: sessionStatus } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'queued' | 'running' | 'completed' | 'failed'>('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    agreeToTerms: false
  });
  
  const router = useRouter();

  // Check authentication and redirect if not logged in
  useEffect(() => {
    if (sessionStatus === 'loading') return; // Still loading
    
    if (!session) {
      // Redirect to login with callback URL
      router.push('/login?callbackUrl=/connect-instagram');
      return;
    }
  }, [session, sessionStatus, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.username || !formData.password || !formData.agreeToTerms) {
      setError('All fields are required. Please fill in username, password, and agree to terms.');
      return;
    }

    // Validate username format (alphanumeric, dots, underscores only)
    const usernameRegex = /^[a-zA-Z0-9._]+$/;
    if (!usernameRegex.test(formData.username)) {
      setError('Username can only contain letters, numbers, dots, and underscores.');
      return;
    }

    setError('');
    setIsLoading(true);
    setStatus('queued');
    setProgress(10);
    setMessage('Starting analysis...');

    try {
      // Construct the full Instagram URL from username
      const instagramUrl = `https://www.instagram.com/${formData.username}/`;
      
      const response = await fetch('/api/run-instagram-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ instagram_url: instagramUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start analysis');
      }

      if (data.status === 'success' && data.creator_id) {
        // Profile already exists
        setStatus('completed');
        setProgress(100);
        setMessage('Creator profile already exists! 🎉');
        setTimeout(() => {
          router.push('/account');
        }, 2000);
        return;
      }

      if (data.task_id) {
        setTaskId(data.task_id);
        setStatus('queued');
        setProgress(20);
        setMessage('Analysis queued successfully');
        
        // Start polling for status updates
        pollTaskStatus(data.task_id);
      }
    } catch (err) {
      console.error('Instagram connection error:', err);
      
      // Handle authentication errors specifically
      if (err instanceof Error && err.message.includes('Authentication required')) {
        setError('Please log in to connect your Instagram account.');
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/login?callbackUrl=/connect-instagram');
        }, 2000);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred');
      }
      
      setStatus('failed');
      setProgress(0);
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const pollTaskStatus = async (taskId: string) => {
    const pollInterval = setInterval(async () => {
      try {
        // Construct the full Instagram URL from username for polling
        const instagramUrl = `https://www.instagram.com/${formData.username}/`;
        const response = await fetch(`/api/run-instagram-task?task_id=${taskId}&instagram_url=${encodeURIComponent(instagramUrl)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to check status');
        }

        setStatus(data.status);
        setMessage(data.message || '');

        switch (data.status) {
          case 'queued':
            setProgress(30);
            break;
          case 'running':
            setProgress(60);
            break;
          case 'completed':
            setProgress(100);
            setMessage('Creator profile saved 🎉');
            clearInterval(pollInterval);
            setTimeout(() => {
              router.push('/account');
            }, 2000);
            break;
          case 'failed':
            setError(data.message || 'Analysis failed');
            clearInterval(pollInterval);
            break;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to check status');
        setStatus('failed');
        clearInterval(pollInterval);
      }
    }, 2000); // Poll every 2 seconds

    // Clear interval after 5 minutes to prevent infinite polling
    setTimeout(() => {
      clearInterval(pollInterval);
      if (status !== 'completed' && status !== 'failed') {
        setError('Analysis timed out. Please try again.');
        setStatus('failed');
      }
    }, 300000);
  };


  const getStatusIcon = () => {
    switch (status) {
      case 'queued':
      case 'running':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600" />;
      case 'completed':
        return <div className="h-4 w-4 rounded-full bg-green-500" />;
      case 'failed':
        return <div className="h-4 w-4 rounded-full bg-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'queued':
        return 'text-yellow-600';
      case 'running':
        return 'text-blue-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleBack = () => {
    router.push('/account');
  };

  // Show loading state while checking authentication
  if (sessionStatus === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4 sm:p-6">
      <Card className="w-full max-w-md sm:max-w-lg shadow-2xl border-0 bg-black text-white">
        <CardHeader className="text-center pb-4 px-4 sm:px-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
              <Instagram className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-xl sm:text-2xl font-bold text-white">
            Connect Instagram
          </CardTitle>
          <p className="text-gray-300 text-xs sm:text-sm px-2">
            Connect your Instagram account to unlock personalized AI features
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4 px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Username</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">@</span>
                </div>
                <Input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pl-8"
                  placeholder="yourusername"
                  required
                />
              </div>
              <p className="text-xs text-gray-400">
                Please double-check your username is correct
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 pr-10"
                  placeholder="Password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <input 
                type="checkbox" 
                id="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="rounded border-gray-600 bg-gray-800 mt-1 flex-shrink-0" 
                required
              />
              <label htmlFor="agreeToTerms" className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-300">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-300">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {error && (
              <div className="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
                {error}
              </div>
            )}

            {/* Progress Section */}
            {(status === 'queued' || status === 'running' || status === 'completed') && (
              <div className="space-y-4 p-4 bg-gray-800 rounded-lg">
                <div className="flex items-center gap-2">
                  {getStatusIcon()}
                  <span className={`font-medium ${getStatusColor()}`}>
                    {status === 'queued' && 'Queued'}
                    {status === 'running' && 'Analyzing...'}
                    {status === 'completed' && 'Completed!'}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-300">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
                
                {message && (
                  <p className="text-sm text-gray-300">{message}</p>
                )}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || status === 'running' || !formData.username || !formData.password || !formData.agreeToTerms}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              {isLoading || status === 'running' ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>{status === 'queued' ? 'Queuing...' : 'Analyzing...'}</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Instagram className="h-4 w-4" />
                  <span>Connect Instagram</span>
                </div>
              )}
            </Button>
          </form>


          <div className="text-center pt-4">
            <p className="text-xs sm:text-sm text-gray-300">
              Don't have an account?{' '}
              <button className="text-blue-400 hover:text-blue-300 font-semibold">
                Sign up
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-800">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                Creator Intelligence
              </Badge>
            </div>
            <p className="text-xs text-blue-300 leading-relaxed">
              This will analyze your Instagram profile to provide personalized AI insights and recommendations.
            </p>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="w-full text-gray-300 hover:text-gray-100 hover:bg-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Account
          </Button>
        </CardContent>
      </Card>

      {/* Progress Modal */}
      <ProgressModal
        isOpen={status === 'queued' || status === 'running'}
        onClose={() => {
          setStatus('idle');
          setProgress(0);
          setMessage('');
          setTaskId(null);
        }}
        taskId={taskId}
        status={status}
        progress={progress}
        message={message}
      />
    </div>
  );
}
