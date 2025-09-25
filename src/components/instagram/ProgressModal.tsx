'use client';

import { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Loader2, XCircle, Instagram } from 'lucide-react';

interface ProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
  status: 'idle' | 'queued' | 'running' | 'completed' | 'failed';
  progress: number;
  message: string;
}

export default function ProgressModal({ 
  isOpen, 
  onClose, 
  taskId, 
  status, 
  progress, 
  message 
}: ProgressModalProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      // Delay hiding to allow for smooth animation
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const getStatusIcon = () => {
    switch (status) {
      case 'queued':
        return <Loader2 className="h-6 w-6 animate-spin text-yellow-500" />;
      case 'running':
        return <Loader2 className="h-6 w-6 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'failed':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <Instagram className="h-6 w-6 text-pink-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'queued':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'running':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'failed':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'queued':
        return 'Queued';
      case 'running':
        return 'Analyzing';
      case 'completed':
        return 'Completed';
      case 'failed':
        return 'Failed';
      default:
        return 'Ready';
    }
  };

  const getProgressColor = () => {
    switch (status) {
      case 'queued':
        return 'bg-gradient-to-r from-yellow-500 to-orange-500';
      case 'running':
        return 'bg-gradient-to-r from-blue-500 to-purple-500';
      case 'completed':
        return 'bg-gradient-to-r from-green-500 to-emerald-500';
      case 'failed':
        return 'bg-gradient-to-r from-red-500 to-pink-500';
      default:
        return 'bg-gradient-to-r from-gray-500 to-gray-600';
    }
  };

  if (!isVisible) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-500">
              <Instagram className="h-5 w-5 text-white" />
            </div>
            Instagram Profile Analysis
          </DialogTitle>
          <DialogDescription>
            We're analyzing your Instagram profile to extract creator intelligence insights.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Status Section */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <div className="font-medium text-gray-900">Status</div>
                <div className="text-sm text-gray-500">{message || 'Processing...'}</div>
              </div>
            </div>
            <Badge variant="outline" className={getStatusColor()}>
              {getStatusText()}
            </Badge>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium text-gray-900">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
            />
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Task ID (for debugging) */}
          {taskId && (
            <div className="text-xs text-gray-500 font-mono bg-gray-100 p-2 rounded">
              Task ID: {taskId}
            </div>
          )}

          {/* Analysis Steps */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Analysis Steps:</div>
            <div className="space-y-1 text-xs text-gray-600">
              <div className={`flex items-center gap-2 ${progress >= 20 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${progress >= 20 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Profile data extraction
              </div>
              <div className={`flex items-center gap-2 ${progress >= 40 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${progress >= 40 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Content analysis
              </div>
              <div className={`flex items-center gap-2 ${progress >= 60 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${progress >= 60 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Audience insights
              </div>
              <div className={`flex items-center gap-2 ${progress >= 80 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${progress >= 80 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Performance metrics
              </div>
              <div className={`flex items-center gap-2 ${progress >= 100 ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-2 h-2 rounded-full ${progress >= 100 ? 'bg-green-500' : 'bg-gray-300'}`} />
                Finalizing results
              </div>
            </div>
          </div>

          {/* Close button for completed/failed states */}
          {(status === 'completed' || status === 'failed') && (
            <div className="pt-4 border-t">
              <button
                onClick={onClose}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                {status === 'completed' ? 'Continue' : 'Close'}
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
