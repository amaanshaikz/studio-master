'use client';

import * as React from 'react';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { UploadCloud, Play, Loader2, X } from 'lucide-react';

export interface AnalyzeVideoResult {
    scores: {
        viralityScore: number;
        relatability: number;
        nicheAlignment: number;
        visualAppeal: number;
        averageViewRange: string;
        engagementPercent: number;
        aestheticsScore: number;
    };
    transcript?: string;
    summary?: string;
    suggestions?: string;
}

export default function VideoUploadBox({
    onAnalyzed,
}: {
    onAnalyzed: (result: AnalyzeVideoResult) => void;
}) {
    const [file, setFile] = useState<File | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const f = e.dataTransfer.files?.[0];
        if (f && f.type.startsWith('video/')) {
            setFile(f);
            toast({ title: 'Video uploaded', description: `${f.name} has been uploaded successfully.` });
        } else if (f) {
            toast({ variant: 'destructive', title: 'Invalid file', description: 'Please drop a video file.' });
        }
    }, [toast]);

    const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    }, []);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            toast({ title: 'Video selected', description: `${selectedFile.name} has been selected.` });
        } else if (selectedFile) {
            toast({ variant: 'destructive', title: 'Invalid file', description: 'Please select a video file.' });
        }
    }, [toast]);

    const removeFile = useCallback(() => {
        setFile(null);
        toast({ title: 'File removed', description: 'Video file has been removed.' });
    }, [toast]);

    const analyze = async () => {
        if (!file) {
            toast({ title: 'No file selected', description: 'Please upload a reel/short video.' });
            return;
        }
        try {
            setIsLoading(true);
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch('/api/analyzeVideo', { method: 'POST', body: formData });
            if (!res.ok) throw new Error('Failed to analyze video');
            const data = await res.json();
            onAnalyzed(data);
            toast({ title: 'Analysis complete', description: 'Video has been analyzed successfully!' });
        } catch (err: any) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: err.message || 'Something went wrong.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full h-full">
            <div className="relative group h-full">
                <div 
                    className="relative w-full h-full rounded-3xl bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-md border border-white/10 shadow-2xl transition-all duration-500 hover:border-white/20 hover:shadow-3xl hover:shadow-blue-500/10" 
                    style={{aspectRatio: '9/16', minHeight: '240px'}}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                >
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 via-transparent to-transparent"></div>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-300"></div>
                    
                    <div className="relative h-full flex flex-col items-center justify-center p-4">
                        {!file ? (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center">
                                <div className="p-3 rounded-full bg-gradient-to-br from-white/10 to-white/5 border border-white/20 shadow-lg transition-all duration-300 group-hover:scale-110">
                                    <UploadCloud className="h-7 w-7 text-white" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-semibold text-white">Upload Reel</div>
                                    <div className="text-xs text-white/70 leading-relaxed">Drag & drop your video here</div>
                                    <div className="text-xs text-white/50">or click to browse</div>
                                </div>
                                <input 
                                    id="video-input" 
                                    type="file" 
                                    accept="video/*" 
                                    className="hidden"
                                    onChange={handleFileSelect}
                                />
                                <Button 
                                    onClick={() => {
                                        const input = document.getElementById('video-input') as HTMLInputElement;
                                        if (input) input.click();
                                    }}
                                    className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-accent hover:text-accent-foreground h-10 bg-gradient-to-r from-white/10 to-white/5 border-white/20 text-white hover:from-white/20 hover:to-white/10 hover:border-white/30 transition-all duration-300 px-4 py-1.5 rounded-xl font-medium text-xs"
                                >
                                    Choose Video
                                </Button>
                            </div>
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center gap-3 text-center">
                                <div className="p-3 rounded-full bg-gradient-to-br from-green-500/20 to-green-400/20 border border-green-400/30 shadow-lg">
                                    <Play className="h-7 w-7 text-green-400" />
                                </div>
                                <div className="space-y-1.5">
                                    <div className="text-sm font-semibold text-white">Video Selected</div>
                                    <div className="text-xs text-white/70 leading-relaxed">{file.name}</div>
                                    <div className="text-xs text-white/50">{(file.size / (1024 * 1024)).toFixed(2)} MB</div>
                                </div>
                                <div className="flex gap-2">
                                    <Button 
                                        onClick={removeFile}
                                        className="inline-flex items-center justify-center whitespace-nowrap ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border hover:bg-red-500/20 hover:text-red-400 h-10 bg-gradient-to-r from-white/10 to-white/5 border-white/20 text-white hover:from-red-500/20 hover:border-red-400/30 transition-all duration-300 px-4 py-1.5 rounded-xl font-medium text-xs"
                                    >
                                        <X className="h-4 w-4 mr-1" />
                                        Remove
                                    </Button>
                                </div>
                            </div>
                        )}
                        
                        {/* Predict & Optimize button - positioned inside container */}
                        <div className="mt-2">
                            <Button 
                                onClick={analyze} 
                                disabled={isLoading || !file}
                                className="bg-gradient-to-r from-blue-500 via-purple-600 to-pink-500 hover:from-blue-600 hover:via-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 text-xs px-4 py-1.5 rounded-xl font-semibold"
                            >
                                {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-1.5" /> : null}
                                {isLoading ? 'Analyzing...' : 'Predict & Optimize'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


