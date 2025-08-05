'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Instagram, CheckCircle, Loader2, Brain, Palette, Hash, Users, Heart, MessageCircle, Share2, Image, Video, FileText, Zap, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function InstagramSyncingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const router = useRouter();

  const steps = [
    {
      icon: Instagram,
      title: 'Connecting to Instagram',
      description: 'Establishing secure connection to your Instagram account',
      color: 'text-pink-500'
    },
    {
      icon: Image,
      title: 'Analyzing Your Content',
      description: 'Processing your photos and videos to understand your style',
      color: 'text-blue-500'
    },
    {
      icon: FileText,
      title: 'Extracting Captions & Hashtags',
      description: 'Analyzing your writing style and hashtag usage patterns',
      color: 'text-purple-500'
    },
    {
      icon: Users,
      title: 'Understanding Your Audience',
      description: 'Analyzing follower demographics and engagement patterns',
      color: 'text-green-500'
    },
    {
      icon: Heart,
      title: 'Processing Engagement Data',
      description: 'Analyzing likes, comments, and post performance',
      color: 'text-red-500'
    },
    {
      icon: Brain,
      title: 'Training AI Model',
      description: 'Personalizing AI model with your content preferences',
      color: 'text-orange-500'
    },
    {
      icon: Sparkles,
      title: 'Finalizing Setup',
      description: 'Preparing personalized content suggestions',
      color: 'text-yellow-500'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            router.push('/demo?connected=true');
          }, 1000);
          return 100;
        }
        return prev + 1.4; // Faster progress to complete in ~7 seconds
      });
    }, 100);

    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(stepInterval);
          return steps.length - 1;
        }
        return prev + 1;
      });
    }, 1000); // Change step every second

    return () => {
      clearInterval(interval);
      clearInterval(stepInterval);
    };
  }, [router, steps.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-2xl border-0 bg-black/90 backdrop-blur-md text-white border border-gray-800/50">
        <CardHeader className="text-center pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 rounded-full bg-gradient-to-br from-pink-500 to-purple-600">
              <Instagram className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Syncing with Instagram
          </CardTitle>
          <p className="text-gray-300 text-sm">
            Analyzing your content to unlock personalized AI features
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-300">Progress</span>
              <span className="text-white font-semibold">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="h-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Current Step */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Current Step:</h4>
            <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg bg-gray-800 ${steps[currentStep]?.color}`}>
                  {steps[currentStep] && React.createElement(steps[currentStep].icon, { className: "h-5 w-5" })}
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-white">{steps[currentStep]?.title}</h5>
                  <p className="text-sm text-gray-300 mt-1">{steps[currentStep]?.description}</p>
                </div>
                <Loader2 className="h-5 w-5 text-primary animate-spin" />
              </div>
            </div>
          </div>

          {/* All Steps */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white">Process Steps:</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                  <div 
                    key={index} 
                    className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                      isCompleted 
                        ? 'bg-green-900/20 border border-green-700/50' 
                        : isCurrent 
                        ? 'bg-primary/20 border border-primary/50' 
                        : 'bg-gray-900/20 border border-gray-700/50'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${
                      isCompleted 
                        ? 'bg-green-600' 
                        : isCurrent 
                        ? 'bg-primary' 
                        : 'bg-gray-700'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : isCurrent ? (
                        <Loader2 className="h-4 w-4 text-white animate-spin" />
                      ) : (
                        <Icon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h6 className={`text-sm font-medium ${
                        isCompleted 
                          ? 'text-green-400' 
                          : isCurrent 
                          ? 'text-primary' 
                          : 'text-gray-400'
                      }`}>
                        {step.title}
                      </h6>
                      <p className="text-xs text-gray-500">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Demo Info */}
          <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-700/50">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-blue-400 border-blue-400 text-xs">
                Demo Mode
              </Badge>
            </div>
            <p className="text-xs text-blue-300">
              This is a mock syncing process. In a real scenario, this would analyze your actual Instagram data.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 