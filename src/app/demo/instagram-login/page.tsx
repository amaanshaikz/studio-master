'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, Eye, EyeOff, CheckCircle, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InstagramLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: 'demo_user',
    password: 'demo_password'
  });
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login process
    setTimeout(() => {
      setIsLoading(false);
      router.push('/demo/instagram-permissions');
    }, 2000);
  };

  const handleBack = () => {
    router.push('/demo');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white text-black">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
              <Instagram className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-black">
            Instagram Login
          </CardTitle>
          <p className="text-gray-600 text-sm">
            Connect your Instagram account to unlock personalized AI features
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Username or Email</label>
              <Input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="bg-gray-50 border-gray-300 text-black"
                placeholder="Username or email"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-gray-50 border-gray-300 text-black pr-10"
                  placeholder="Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="text-sm text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-sm text-blue-600 hover:text-blue-800">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Instagram className="h-4 w-4" />
                  <span>Log In</span>
                </div>
              )}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Or</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-blue-600 rounded"></div>
                <span>Continue with Facebook</span>
              </div>
            </Button>
            
            <Button variant="outline" className="w-full border-gray-300 text-black hover:bg-gray-50">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 bg-red-600 rounded"></div>
                <span>Continue with Google</span>
              </div>
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <button className="text-blue-600 hover:text-blue-800 font-semibold">
                Sign up
              </button>
            </p>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-blue-600 border-blue-600 text-xs">
                Demo Mode
              </Badge>
            </div>
            <p className="text-xs text-blue-700">
              This is a mock Instagram login. In a real scenario, this would redirect to Instagram's OAuth flow.
            </p>
          </div>

          {/* Back Button */}
          <Button
            variant="ghost"
            onClick={handleBack}
            className="w-full text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Demo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 