'use client';

import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, Send, Bot, User, Sparkles, Paperclip, X, FileCheck2 } from 'lucide-react';
import { TypingAnimation } from '@/components/ui/typing-animation';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Message { role: 'user' | 'model'; content: string; }

export default function CreateXChatbox({
    initialSystemMessage,
    initialSuggestions,
    transcriptContext,
}: {
    initialSystemMessage?: string;
    initialSuggestions?: string;
    transcriptContext?: string;
}) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState<{name: string, content: string, type: string} | null>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { toast } = useToast();

    // Initialize messages with video analysis results
    useEffect(() => {
        const initialMessages: Message[] = [];
        
        if (initialSystemMessage || initialSuggestions) {
            let combinedContent = '';
            
            if (initialSystemMessage) {
                combinedContent += `🎬 **Video Analysis Complete!**\n\n📝 **Video Summary:**\n\n${initialSystemMessage}`;
            }
            
            if (initialSuggestions) {
                if (combinedContent) combinedContent += '\n\n';
                // Format suggestions as proper markdown numbered list with spacing
                const formattedSuggestions = initialSuggestions
                    .split('\n')
                    .filter(line => line.trim())
                    .reduce((acc, line, index) => {
                        const trimmedLine = line.trim();
                        
                        // Check if this line starts with a number (like "1." or "2.")
                        if (/^\d+\.\s*$/.test(trimmedLine)) {
                            // This is just a number line, skip it - the content will be on the next line
                            return acc;
                        }
                        
                        // Check if this line starts with a number followed by content
                        if (/^\d+\.\s*/.test(trimmedLine)) {
                            // Remove the existing number and add our own
                            const cleanLine = trimmedLine.replace(/^\d+\.\s*/, '');
                            acc.push(`${acc.length + 1}. ${cleanLine}`);
                        } else {
                            // This is content without a number, add it to the previous item or create new
                            if (acc.length === 0) {
                                acc.push(`${acc.length + 1}. ${trimmedLine}`);
                            } else {
                                // Append to the last item
                                acc[acc.length - 1] += ` ${trimmedLine}`;
                            }
                        }
                        
                        return acc;
                    }, [] as string[])
                    .join('\n\n');
                combinedContent += `💡 **Optimization Suggestions:**\n\n${formattedSuggestions}`;
            }
            
            if (combinedContent) {
                initialMessages.push({ 
                    role: 'model', 
                    content: combinedContent
                });
            }
        }
        
        if (initialMessages.length > 0) {
            setMessages(initialMessages);
        }
    }, [initialSystemMessage, initialSuggestions]);

    useEffect(() => {
        if (!viewportRef.current) return;
        const viewport = viewportRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }, [messages]);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result as string;
                setAttachedFile({ name: file.name, content, type: file.type });
                toast({ title: "File attached", description: file.name });
            };
            if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        }
    };

    const ask = async () => {
        const question = input.trim();
        if (!question) return;
        try {
            setIsLoading(true);
            const userMsg: Message = { role: 'user', content: question };
            const newMessages = [...messages, userMsg];
            setMessages(newMessages);
            
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    query: question, 
                    transcript: transcriptContext || '',
                    // Include video analysis context if available
                    documentContent: initialSystemMessage && initialSuggestions 
                        ? `Video Analysis Summary: ${initialSystemMessage}\n\nOptimization Suggestions: ${initialSuggestions}`
                        : undefined
                }),
            });
            
            if (!res.ok) throw new Error('Chat failed');
            const data = await res.json();
            setMessages((prev) => [...prev, { role: 'model', content: data.answer }]);
        } catch (err: any) {
            console.error(err);
            toast({ variant: 'destructive', title: 'Error', description: err.message || 'Something went wrong.' });
        } finally {
            setIsLoading(false);
            setInput('');
            setAttachedFile(null);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            ask();
        }
    };

    return (
        <div className="w-full">
            <div className="bg-gradient-to-br from-white/5 via-white/3 to-transparent backdrop-blur-md border border-white/10 rounded-3xl shadow-2xl">
                <ScrollArea className="h-[50vh] min-h-[400px] max-h-[600px] p-6" ref={viewportRef}>
                    <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto">
                        {messages.length === 0 && !initialSystemMessage && (
                            <div className="flex justify-center items-center h-32">
                                <div className="text-center text-white/50">
                                    <Sparkles className="h-8 w-8 mx-auto mb-2 text-white/30" />
                                    <p className="text-sm">Upload a video to get started with AI analysis</p>
                                </div>
                            </div>
                        )}
                        
                        {messages.map((m, i) => (
                            <div key={i} className={cn('flex flex-col gap-2 sm:gap-4', m.role === 'user' ? 'items-end' : 'items-start')}>
                                <div className={cn('flex items-start gap-2 sm:gap-4', m.role === 'user' ? 'justify-end' : 'justify-start')}>
                                    {m.role === 'model' && (
                                        <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                                            <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                                        </div>
                                    )}
                                    <div className={cn(
                                        'relative group min-w-0 flex-1 max-w-[calc(100vw-4rem)] sm:max-w-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base', 
                                        m.role === 'user' 
                                            ? 'bg-neutral-800 text-primary-foreground rounded-2xl' 
                                            : 'text-foreground'
                                    )}>
                                        <div className="whitespace-pre-wrap break-words overflow-hidden">
                                            {m.role === 'model' ? (
                                                <TypingAnimation 
                                                    text={m.content} 
                                                    speed={15} 
                                                    className="whitespace-pre-wrap" 
                                                    enableMarkdown={true} 
                                                />
                                            ) : (
                                                <div className="flex flex-col gap-2">
                                                    <div className="whitespace-pre-wrap">{m.content}</div>
                                                    {attachedFile && (
                                                        <div className="flex items-center gap-2 text-xs text-accent-foreground/80 bg-accent/30 rounded-md p-2 border border-accent/50 w-fit">
                                                            {attachedFile.type.startsWith('image/') ? (
                                                                <img src={attachedFile.content} alt={attachedFile.name} className="h-5 w-5 sm:h-6 sm:w-6 rounded-sm object-cover" />
                                                            ) : (
                                                                <FileCheck2 className="h-3 w-3 flex-shrink-0" />
                                                            )}
                                                            <span className="truncate">{attachedFile.name}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {isLoading && (
                            <div className="flex items-start gap-2 sm:gap-4 justify-start">
                                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0">
                                    <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1 max-w-[calc(100vw-4rem)] sm:max-w-2xl rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center">
                                    <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>
                
                <div className="p-6">
                    <div className="w-full max-w-3xl mx-auto">
                        <div className="relative">
                            {attachedFile && (
                                <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                                    <Badge variant="secondary" className="pl-1.5 sm:pl-2 h-auto text-xs">
                                        {attachedFile.type.startsWith('image/') ? (
                                            <img src={attachedFile.content} alt={attachedFile.name} width={20} height={20} className="h-5 w-5 sm:h-6 sm:w-6 rounded-sm object-cover mr-1.5 sm:mr-2"/>
                                        ) : (
                                            <FileCheck2 className="h-3 w-3 mr-1" />
                                        )}
                                        <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-xs">{attachedFile.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-4 w-4 sm:h-5 sm:w-5 ml-1 rounded-full hover:bg-background/20"
                                            onClick={() => setAttachedFile(null)}
                                        >
                                            <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                        </Button>
                                    </Badge>
                                </div>
                            )}
                            <Textarea
                                placeholder={initialSystemMessage ? "Ask me about your video analysis or how to improve your content..." : "Ask me how to improve your content..."}
                                className={cn(
                                    "resize-none rounded-2xl border-input bg-card p-3 sm:p-4 pr-20 sm:pr-24 text-sm sm:text-base min-h-[44px] max-h-[120px]",
                                    attachedFile ? "pt-10 sm:pt-12" : ""
                                )}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                            <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center gap-1.5 sm:gap-2">
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.md,.html,image/*,video/*" />
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    size="icon" 
                                    className="h-8 w-8 sm:h-8 sm:w-8 rounded-full min-h-[32px] sm:min-h-[32px]" 
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                                </Button>
                                <Button 
                                    size="icon" 
                                    className="h-8 w-8 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 min-h-[32px] sm:min-h-[32px]" 
                                    onClick={ask} 
                                    disabled={isLoading || !input.trim()}
                                >
                                    {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


