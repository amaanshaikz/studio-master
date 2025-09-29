'use client';

import * as React from 'react';
import { useState } from 'react';
import VideoUploadBox from '@/components/engagement/VideoUploadBox';
import ScoreCard, { EngagementScores } from '@/components/engagement/ScoreCard';
import CreateXChatbox from '@/components/engagement/CreateXChatbox';
import OptimizedVideoContainer from '@/components/engagement/OptimizedVideoContainer';

export default function EngagementPredictorPage() {
    const [scores, setScores] = useState<EngagementScores | null>(null);
    const [transcript, setTranscript] = useState<string>('');
    const [summary, setSummary] = useState<string>('');
    const [suggestions, setSuggestions] = useState<string>('');
    const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

    return (
        <div className="flex-1 min-h-screen bg-black container mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 lg:py-12">
            {/* Page Header */}
            <div className="text-center mb-6 sm:mb-8">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 sm:mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent px-2">
                    Engagement Predictor
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-white/70 max-w-2xl mx-auto px-4">
                    Upload your reel and get AI-powered insights to maximize your content's viral potential
                </p>
            </div>

            {/* Main Content - 1/3 VideoUpload, 2/3 ScoreCard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8 items-start">
                <div className="flex justify-center">
                    <div className="w-full max-w-xs sm:max-w-sm">
                        <VideoUploadBox
                            onAnalyzed={(result) => {
                                setScores(result.scores);
                                setTranscript(result.transcript || '');
                                setSummary(result.summary || '');
                                setSuggestions(result.suggestions || '');
                            }}
                        />
                    </div>
                </div>
                <div className="lg:col-span-2 flex justify-center">
                    <div className="w-full max-w-4xl">
                        <ScoreCard scores={scores} />
                    </div>
                </div>
            </div>

            {/* Chat Section */}
            <div className="flex justify-center mb-6 sm:mb-8">
                <div className="w-full max-w-5xl px-2 sm:px-0">
                    <CreateXChatbox
                        initialSystemMessage={summary || undefined}
                        initialSuggestions={suggestions}
                        transcriptContext={transcript}
                    />
                </div>
            </div>

            {/* Optimized Sample Video Section */}
            <div className="flex justify-center">
                <div className="w-full max-w-5xl px-2 sm:px-0">
                    <OptimizedVideoContainer
                        videoSummary={summary}
                        suggestions={suggestions ? suggestions.split('\n').filter(s => s.trim()) : []}
                        engagementScores={scores ? {
                            relatability: scores.relatability,
                            nicheAlignment: scores.nicheAlignment,
                            creativeScore: scores.visualAppeal // Map visualAppeal to creativeScore
                        } : undefined}
                        onVideoGenerated={setGeneratedVideoUrl}
                    />
                </div>
            </div>
        </div>
    );
}


