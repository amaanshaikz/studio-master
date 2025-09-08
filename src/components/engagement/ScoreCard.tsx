'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Flame, Heart, Eye, Palette, TrendingUp, Users, Target, Star, Zap, Award, TrendingDown, CheckCircle, AlertCircle, Compass, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface EngagementScores {
    viralityScore: number;
    relatability: number;
    nicheAlignment: number;
    visualAppeal: number;
    averageViewRange: string;
    engagementPercent: number;
    aestheticsScore: number;
}

interface AnimatedScoreProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    color: string;
    suffix?: string;
    customValue?: string;
    trend?: 'up' | 'down' | 'stable';
    showBar?: boolean;
    subtitle?: string;
}

function AnimatedScore({ label, value, icon, color, suffix = '', customValue, trend, showBar = true, subtitle }: AnimatedScoreProps) {
    const [animatedValue, setAnimatedValue] = useState(0);

    useEffect(() => {
        // Only animate if we have actual scores (not the initial 0 state)
        if (value > 0) {
            const timer = setTimeout(() => {
                setAnimatedValue(value);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setAnimatedValue(0);
        }
    }, [value]);

    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-3 h-3 text-green-500" />;
        if (trend === 'down') return <TrendingDown className="w-3 h-3 text-red-500" />;
        return <CheckCircle className="w-3 h-3 text-blue-500" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-500';
        if (trend === 'down') return 'text-red-500';
        return 'text-blue-500';
    };

    return (
        <div className="group relative p-4 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all duration-300 hover:shadow-lg hover:shadow-white/5">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${color} group-hover:scale-110 transition-transform duration-300`}>
                        {icon}
                    </div>
                    <div>
                        <div className="text-sm text-white/60 font-medium">{label}</div>
                        <div className="text-base font-bold text-white">
                            {customValue || `${Math.round(animatedValue)}${suffix}`}
                        </div>
                    </div>
                </div>
                {trend && (
                    <div className={cn("flex items-center gap-1 text-xs font-medium", getTrendColor())}>
                        {getTrendIcon()}
                        <span className="capitalize">{trend}</span>
                    </div>
                )}
            </div>
            {showBar && (
                <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                        className={`h-full transition-all duration-1000 ease-out shadow-sm ${
                            color.includes('blue') ? 'bg-gradient-to-r from-blue-500 to-blue-400' :
                            color.includes('green') ? 'bg-gradient-to-r from-green-500 to-green-400' :
                            color.includes('red') ? 'bg-gradient-to-r from-red-500 to-red-400' :
                            color.includes('purple') ? 'bg-gradient-to-r from-purple-500 to-purple-400' :
                            color.includes('yellow') ? 'bg-gradient-to-r from-yellow-500 to-yellow-400' :
                            'bg-gradient-to-r from-gray-500 to-gray-400'
                        }`}
                        style={{ width: `${animatedValue}%` }}
                    ></div>
                </div>
            )}
            <div className="mt-2 text-xs text-white/40">
                {subtitle || (showBar ? (animatedValue >= 80 ? 'Excellent' : animatedValue >= 60 ? 'Good' : animatedValue >= 40 ? 'Fair' : 'Needs Improvement') : '')}
            </div>
        </div>
    );
}

function CircularScore({ label, value, icon, color, subtitle }: { label: string; value: number; icon: React.ReactNode; color: string; subtitle?: string }) {
    const [animatedValue, setAnimatedValue] = useState(0);
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

    useEffect(() => {
        // Only animate if we have actual scores (not the initial 0 state)
        if (value > 0) {
            const timer = setTimeout(() => {
                setAnimatedValue(value);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setAnimatedValue(0);
        }
    }, [value]);

    const getScoreLabel = () => {
        if (animatedValue >= 80) return 'Outstanding';
        if (animatedValue >= 60) return 'Strong';
        if (animatedValue >= 40) return 'Moderate';
        return 'Weak';
    };

    return (
        <div className="flex flex-col items-center gap-3 group">
            <div className="relative">
                <svg className="w-20 h-20 transform -rotate-90 group-hover:scale-105 transition-transform duration-300">
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="3"
                        fill="transparent"
                    />
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="3"
                        fill="transparent"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        className={`transition-all duration-1000 ease-out ${color}`}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">{Math.round(animatedValue)}</div>
                        <div className="text-xs text-white/60 font-medium">{label}</div>
                    </div>
                </div>
            </div>
            <div className="text-center">
                <div className={`p-2 rounded-full ${color} group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                </div>
                <div className="mt-2 text-xs text-white/60 font-medium">{getScoreLabel()}</div>
                {subtitle && <div className="text-xs text-white/40 mt-1">{subtitle}</div>}
            </div>
        </div>
    );
}

function PerformanceIndicator({ scores }: { scores: EngagementScores }) {
    const overallScore = Math.round((scores.viralityScore + scores.engagementPercent + scores.aestheticsScore) / 3);
    
    const getPerformanceLevel = () => {
        if (overallScore >= 80) return { level: 'Viral Potential', color: 'text-green-400', icon: <Zap className="w-4 h-4" /> };
        if (overallScore >= 60) return { level: 'Strong Content', color: 'text-blue-400', icon: <Star className="w-4 h-4" /> };
        if (overallScore >= 40) return { level: 'Good Foundation', color: 'text-yellow-400', icon: <CheckCircle className="w-4 h-4" /> };
        return { level: 'Needs Work', color: 'text-orange-400', icon: <AlertCircle className="w-4 h-4" /> };
    };

    const { level, color, icon } = getPerformanceLevel();

    return (
        <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded-full bg-white/10 ${color}`}>
                        {icon}
                    </div>
                    <div className="text-sm text-white/60 font-medium">Overall Performance</div>
                </div>
                <div className="text-lg font-bold text-white">
                    {overallScore}
                </div>
            </div>
            <div className="text-sm font-semibold text-white mb-2">{level}</div>
            <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out shadow-lg"
                    style={{ width: `${overallScore}%` }}
                ></div>
            </div>
        </div>
    );
}

export default function ScoreCard({ scores }: { scores: EngagementScores | null }) {
    return (
        <div className="w-full h-full">
            <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-md border border-white/10 shadow-2xl" style={{ minHeight: '240px' }}>
                {/* Enhanced background with subtle elements */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                <div className="absolute top-6 right-6 w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                <div className="absolute bottom-6 left-6 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-300"></div>
                
                <div className="relative h-full flex flex-col p-6">
                    {/* Enhanced Header */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-4 group hover:bg-white/8 transition-colors duration-300">
                            <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                            <span className="text-sm text-white/70 font-medium">
                                {scores ? 'AI Analysis Complete' : 'Ready for Analysis'}
                            </span>
                            {scores && <Award className="w-4 h-4 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />}
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                            Engagement Predictor
                        </h2>
                        <div className="text-sm text-white/60">
                            {scores ? 'AI-powered virality analysis & optimization insights' : 'Upload a video to get started'}
                        </div>
                    </div>

                    <div className="flex-1 grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Left Column - Key Metrics */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                                <div className="text-sm font-semibold text-white/90">Key Metrics</div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <CircularScore 
                                    label="Virality" 
                                    value={scores?.viralityScore || 0} 
                                    icon={<Flame className="w-4 h-4 text-orange-500" />}
                                    color="text-orange-500"
                                    subtitle="Viral potential"
                                />
                                <CircularScore 
                                    label="Aesthetics" 
                                    value={scores?.aestheticsScore || 0} 
                                    icon={<Palette className="w-4 h-4 text-purple-500" />}
                                    color="text-purple-500"
                                    subtitle="Visual quality"
                                />
                            </div>
                        </div>

                        {/* Middle Column - Performance Metrics */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-gradient-to-r from-green-400 to-blue-400 rounded-full"></div>
                                <div className="text-sm font-semibold text-white/90">Performance</div>
                            </div>
                            <div className="space-y-4">
                                <AnimatedScore 
                                    label="Engagement Rate" 
                                    value={scores?.engagementPercent || 0} 
                                    icon={<TrendingUp className="w-4 h-4 text-green-500" />}
                                    color="bg-green-500/20"
                                    suffix="%"
                                    trend={scores?.engagementPercent ? (scores.engagementPercent >= 6 ? 'up' : scores.engagementPercent >= 4 ? 'stable' : 'down') : undefined}
                                />
                                <AnimatedScore 
                                    label="Average Views" 
                                    value={0} 
                                    icon={<Users className="w-4 h-4 text-blue-500" />}
                                    color="bg-blue-500/20"
                                    customValue={scores?.averageViewRange || '0–1k views'}
                                    showBar={false}
                                    subtitle={scores ? 'Based on content analysis & creator profile' : 'Upload video for AI prediction'}
                                />
                                {scores ? <PerformanceIndicator scores={scores} /> : (
                                    <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="text-sm text-white/60 font-medium">Performance Score</div>
                                            <div className="text-lg font-bold text-white">0</div>
                                        </div>
                                        <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-1000 ease-out shadow-lg" style={{ width: '0%' }}></div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Creative Metrics */}
                        <div className="space-y-5">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                                <div className="text-sm font-semibold text-white/90">Creative Quality</div>
                            </div>
                            <div className="space-y-4">
                                <AnimatedScore 
                                    label="Relatability" 
                                    value={scores?.relatability || 0} 
                                    icon={<Target className="w-4 h-4 text-blue-500" />}
                                    color="bg-blue-500/20"
                                    suffix="%"
                                    trend={scores?.relatability ? (scores.relatability >= 70 ? 'up' : scores.relatability >= 50 ? 'stable' : 'down') : undefined}
                                />
                                <AnimatedScore 
                                    label="Niche Alignment" 
                                    value={scores?.nicheAlignment || 0} 
                                    icon={<Compass className="w-4 h-4 text-green-500" />}
                                    color="bg-green-500/20"
                                    suffix="%"
                                    trend={scores?.nicheAlignment ? (scores.nicheAlignment >= 70 ? 'up' : scores.nicheAlignment >= 50 ? 'stable' : 'down') : undefined}
                                />
                                <div className="p-4 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-full bg-purple-500/20">
                                                <Sparkles className="w-4 h-4 text-purple-500" />
                                            </div>
                                            <div className="text-sm text-white/60 font-medium">Creative Score</div>
                                        </div>
                                        <div className="text-lg font-bold text-white">
                                            {scores ? Math.round((scores.relatability + scores.nicheAlignment + scores.visualAppeal) / 3) : 0}
                                        </div>
                                    </div>
                                    <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 transition-all duration-1000 ease-out shadow-lg"
                                            style={{ width: `${scores ? (scores.relatability + scores.nicheAlignment + scores.visualAppeal) / 3 : 0}%` }}
                                        ></div>
                                    </div>
                                    <div className="mt-2 text-xs text-white/40 text-center">
                                        {scores ? (scores.visualAppeal >= 70 ? 'High Visual Appeal' : scores.visualAppeal >= 50 ? 'Good Visual Appeal' : 'Visual Appeal Needs Work') : 'Upload video to analyze'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




