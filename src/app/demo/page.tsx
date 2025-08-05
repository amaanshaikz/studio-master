'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Mic, Hash, CornerDownLeft, Loader2, Sparkles, Settings2, X, Copy, Bot, User, BrainCircuit, Send, Paperclip, FileCheck2, MessageSquare, Image as ImageIcon, Lightbulb, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm, FormProvider, type SubmitHandler, useFormContext, Controller, type FieldValues, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import PlatformConnectionOverlay from '@/components/platforms/PlatformConnectionOverlay';
import { useSearchParams, useRouter } from 'next/navigation';

type Tool = 'chat' | 'ideas' | 'scripts' | 'captions' | 'hashtags';

interface MessageContent {
  text?: string;
  script?: string;
  captions?: string[];
  hashtags?: string[];
  ideas?: string[];
  chatResponse?: string;
  imageUrl?: string;
  documentName?: string;
  documentContent?: string;
  followUpPrompts?: string[];
}

interface Message {
  role: 'user' | 'model';
  content: MessageContent;
}

const toolConfig = {
    chat: { label: 'Chat', icon: MessageSquare },
    ideas: { label: 'Ideas', icon: Sparkles },
    scripts: { label: 'Scripts', icon: FileText },
    captions: { label: 'Captions', icon: Mic },
    hashtags: { label: 'Hashtags', icon: Hash },
};

interface CopilotContextProps {
  activeTool: Tool;
}
const CopilotContext = React.createContext<CopilotContextProps>({ activeTool: 'chat' });

const useCopilotContext = () => {
    const context = useContext(CopilotContext);
    if (!context) {
        throw new Error('useCopilotContext must be used within a CopilotProvider');
    }
    return context;
};

const messageToHistoryItem = (msg: Message) => {
    let content = '';
    if (msg.content.text) content = msg.content.text;
    if (msg.content.chatResponse) content = msg.content.chatResponse;
    if (msg.content.script) content = msg.content.script;
    if (msg.content.captions) content = msg.content.captions.join('\n');
    if (msg.content.hashtags) content = msg.content.hashtags.join(' ');
    if (msg.content.ideas) content = msg.content.ideas.join('\n');
    
    return { role: msg.role, content };
};

export default function DemoPage() {
    const [activeTool, setActiveTool] = useState<Tool>('chat');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState<{name: string, content: string, type: string} | null>(null);
    const [showPlatformOverlay, setShowPlatformOverlay] = useState(true);
    const [hasShownWelcome, setHasShownWelcome] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();
    const searchParams = useSearchParams();
    const router = useRouter();

    const form = useForm({
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            query: '',
            topic: '',
        },
    });
     
    useEffect(() => {
        form.reset({
            query: '',
            topic: '',
        });
    }, [activeTool, form]);

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages]);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: 'Copied to clipboard!' });
    };

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

    const submitFollowUpPrompt = (prompt: string) => {
      setShowPlatformOverlay(false);
      
      const isChatTool = activeTool === 'chat';
      const needsSwitch = !isChatTool;
      
      const prepareAndSubmit = () => {
        form.setValue(isChatTool ? 'query' : 'topic', prompt);
        setTimeout(() => {
          form.handleSubmit(handleToolSubmit)();
        }, 50);
      };

      if (needsSwitch) {
        setActiveTool('chat');
        setTimeout(prepareAndSubmit, 0);
      } else {
        prepareAndSubmit();
      }
    };
    
    const handleToolSubmit: SubmitHandler<any> = useCallback(async (values) => {
        setShowPlatformOverlay(false);
        
        setIsLoading(true);
        const userMessageText = activeTool === 'chat' ? values.query : values.topic;
        const userMessage: Message = { 
            role: 'user', 
            content: { 
                text: userMessageText,
                ...(attachedFile && { 
                    documentName: attachedFile.name,
                    documentContent: attachedFile.content 
                }),
            } 
        };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        // Simulate AI response with personalized Instagram data
        setTimeout(() => {
            const personalizedResponses = {
                chat: `Hi Sarah! I'm so excited to work with you! Your authentic voice is what makes your content special - your followers can tell when you're being genuine. I think we can really amplify your reach by focusing on your storytelling strengths. What's on your mind today?`,
                ideas: `Sarah, I love your content style! Here are some ideas that would really showcase your strengths:\n\n• **"Why I Travel" Series** - Your audience loves your personal stories. Share the deeper reasons behind your adventures.\n• **"Behind the Perfect Shot"** - Show your creative process. Your followers trust your recommendations.\n• **"Local Hidden Gems"** - Your travel content is gold! Share those off-the-beaten-path discoveries.\n• **"Day in My Life"** - Your authentic lifestyle posts perform amazingly well.\n\nThese play to your superpower of genuine connection!`,
                scripts: `Sarah, here's a script that really captures your voice:\n\n**Hook:** "The moment I realized travel isn't about the destination..."\n\n**Story:** Share a personal revelation or unexpected discovery from your travels\n\n**Call-to-Action:** "What's your biggest travel lesson? Share below! 👇"\n\nThis approach has worked so well for your authentic content style!`,
                captions: `Sarah, here are some caption options that feel like you:\n\n**Option 1:** "Sometimes the best adventures are the ones you don't plan ✨ Your followers love when you share these raw, real moments."\n\n**Option 2:** "This place taught me that beauty exists in the simplest moments 🌍 Your travel stories always resonate deeply."\n\n**Option 3:** "Living proof that the best stories come from unexpected detours 🌸 Your audience trusts your authentic voice."`,
                hashtags: `Sarah, here are hashtags that will bring your ideal audience:\n\n**Your Signature Style:**\n#authentictravel #lifestyleblogger #wanderlust #traveldiaries\n\n**Growing Your Reach:**\n#travelphotography #minimaliststyle #warmtones #travelcommunity\n\n**Engagement Boosters:**\n#travelinspiration #lifestylegoals #wanderlust #travelblogger\n\nThese will help you reach more people who love your authentic vibe!`
            };

            const aiResponse: Message = {
                role: 'model',
                content: {
                    chatResponse: personalizedResponses[activeTool as keyof typeof personalizedResponses] || personalizedResponses.chat,
                    followUpPrompts: [
                        "Create a caption for my next travel post",
                        "Suggest hashtags for my lifestyle content",
                        "Analyze my recent post performance",
                        "Generate content ideas for this week"
                    ]
                }
            };
            setMessages(prev => [...prev, aiResponse]);
            setIsLoading(false);
        }, 2000);
    }, [activeTool, attachedFile, messages]);

    // Instagram integration flow handlers
    const handleInstagramConnect = () => {
        setShowPlatformOverlay(false);
        router.push('/demo/instagram-login');
    };

    // Check if user just connected from Instagram flow
    useEffect(() => {
        const connected = searchParams.get('connected');
        if (connected === 'true' && !hasShownWelcome) {
            // Show personalized welcome message with mock Instagram data
            const successMessage: Message = {
                role: 'model',
                content: {
                    chatResponse: `🎉 **Welcome Sarah! Your Personalized AI Copilot is Ready!**

Hi Sarah! I've just analyzed your Instagram account (@sarah_travels) and I'm genuinely excited about what I found. You have such a unique voice in the travel and lifestyle space!

**📊 Quick Stats:**
• **Followers:** 1,234 (↑ 12% this month)
• **Posts:** 89
• **Engagement Rate:** 4.2% (above average!)
• **Best Content:** Travel & Lifestyle posts

**🌟 Your Superpowers:**
Your authentic storytelling is your biggest strength. When you share those behind-the-scenes moments from your travels, your audience connects on a deeper level. Your engagement rate shows you're building genuine relationships, not just collecting followers.

**🚀 Growth Opportunities I See:**
• Your travel content is gold! But I noticed your audience loves when you share the "why" behind your adventures. Try adding more personal stories to your captions.
• Your warm, minimalist aesthetic is perfect for your brand. Your followers trust your recommendations because your style is consistent and authentic.
• You're posting at great times (7-9 PM works well for you), but I think we could boost your reach by experimenting with more interactive content.

**💡 What I'm Most Excited to Help You With:**
• Creating captions that feel like you're talking to a friend (because that's your superpower!)
• Finding the perfect hashtags that bring in your ideal audience
• Brainstorming content ideas that play to your strengths
• Optimizing your posting strategy to reach even more people who love your vibe

**🎯 My Personalized Strategy for You:**
Based on your data, I think we can grow your reach by 40% in the next 3 months by focusing on your authentic voice and leveraging your best-performing content themes. Your audience is hungry for more of your travel stories and lifestyle tips!

Ready to create some amazing content together? I'm here to help you shine even brighter! ✨`,
                    followUpPrompts: [
                        "Create a caption for my next travel post",
                        "Suggest hashtags for my lifestyle content",
                        "Analyze my recent post performance",
                        "Generate content ideas for this week"
                    ]
                }
            };
            setMessages(prev => {
                // Check if welcome message already exists to prevent duplicates
                const hasWelcomeMessage = prev.some(msg => 
                    msg.role === 'model' && 
                    msg.content.chatResponse && 
                    msg.content.chatResponse.includes('Welcome Sarah! Your Personalized AI Copilot is Ready!')
                );
                
                if (hasWelcomeMessage) {
                    return prev;
                }
                
                return [...prev, successMessage];
            });
            setHasShownWelcome(true);
        }
    }, [searchParams]);
    
    const renderMessageContent = (content: MessageContent) => {
        let responseText = '';
        if (content.chatResponse) {
          responseText = content.chatResponse;
        } else if (content.script) {
            responseText = `Generated Script:\n\n${content.script}`;
        } else if (content.captions) {
            responseText = `Generated Captions:\n\n${content.captions.join('\n\n---\n\n')}`;
        } else if (content.hashtags) {
            responseText = `Suggested Hashtags:\n\n${content.hashtags.join(' ')}`;
        } else if (content.ideas) {
            responseText = `Here are some ideas:\n\n${content.ideas.map(idea => `• ${idea}`).join('\n')}`;
        }

        if (responseText) {
             return <p className="whitespace-pre-wrap">{responseText}</p>
        }
       
        if (content.text) {
            return (
                <div className="flex flex-col gap-2">
                  <p className="whitespace-pre-wrap">{content.text}</p>
                  {content.documentName && content.documentContent && (
                    <div className="flex items-center gap-2 text-xs text-accent-foreground/80 bg-accent/30 rounded-md p-2 border border-accent/50 w-fit">
                      {content.documentContent.startsWith('data:image/') ? (
                         <Image src={content.documentContent} alt={content.documentName} width={40} height={40} className="rounded-md object-cover" />
                      ) : (
                        <FileCheck2 className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span className="truncate">{content.documentName}</span>
                    </div>
                  )}
                </div>
            )
        }
        
        return null;
    };

    return (
        <CopilotContext.Provider value={{ activeTool }}>
        <FormProvider {...form}>
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 container mx-auto px-4 py-8 md:py-12 bg-black min-h-screen">
                
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-white">Demo: Instagram Integration</h1>
                        <Badge variant="outline" className="text-green-400 border-green-400">
                            Demo Mode
                        </Badge>
                    </div>
                    
                    <div className="flex flex-col h-[calc(100vh-theme(height.14)-100px)]">
                        <ScrollArea className="flex-grow pr-4" ref={scrollAreaRef}>
                            <div className="space-y-6 max-w-3xl mx-auto">
                                {messages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-16 relative min-h-[400px]">
                                        {showPlatformOverlay && (
                                            <PlatformConnectionOverlay 
                                                onClose={() => setShowPlatformOverlay(false)}
                                                onInstagramConnect={handleInstagramConnect}
                                            />
                                        )}
                                        <div className="p-4 rounded-full bg-primary/10 border border-primary/20 mb-4">
                                            <BrainCircuit className="h-12 w-12 text-primary" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-foreground">Demo: Instagram Integration</h2>
                                        <p className="max-w-md">Experience the complete Instagram integration flow. Connect your Instagram account to unlock personalized AI content creation.</p>
                                    </div>
                                ) : (
                                    messages.map((message, index) => (
                                        <div key={index} className={cn('flex flex-col gap-4', message.role === 'user' ? 'items-end' : 'items-start')}>
                                           <div className={cn('flex items-start gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                                {message.role === 'model' && <div className="p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0"><Bot className="w-6 h-6 text-primary" /></div>}
                                                <div className={cn(
                                                    'relative group max-w-xl px-4 py-3', 
                                                    message.role === 'user' 
                                                        ? 'bg-neutral-800 text-primary-foreground rounded-2xl' 
                                                        : 'text-foreground'
                                                )}>
                                                    {renderMessageContent(message.content)}
                                                </div>
                                           </div>
                                           {message.role === 'model' && message.content.followUpPrompts && message.content.followUpPrompts.length > 0 && index === messages.length - 1 && !isLoading && (
                                                <div className="flex flex-wrap gap-2 max-w-xl ml-14">
                                                  {message.content.followUpPrompts.map((prompt, i) => (
                                                      <Button
                                                          key={i}
                                                          variant="outline"
                                                          size="sm"
                                                          onClick={() => submitFollowUpPrompt(prompt)}
                                                          className="text-xs h-auto py-1.5 px-3"
                                                      >
                                                          <Lightbulb className="h-3 w-3 mr-2" />
                                                          {prompt}
                                                      </Button>
                                                  ))}
                                                </div>
                                            )}
                                        </div>
                                    ))
                                )}
                                {isLoading && (
                                    <div className="flex items-start gap-4 justify-start">
                                    <div className="p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0"><Bot className="w-6 h-6 text-primary" /></div>
                                        <div className="max-w-md rounded-xl px-4 py-3 flex items-center">
                                            <Loader2 className="h-5 w-5 animate-spin text-primary" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </ScrollArea>
                        
                        <div className="mt-auto pt-4">
                            <div className="w-full max-w-3xl mx-auto">
                                <form onSubmit={form.handleSubmit(handleToolSubmit)}>
                                    <div className="relative">
                                        <FormField
                                            control={form.control}
                                            name={activeTool === 'chat' ? 'query' : 'topic'}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="relative">
                                                            {attachedFile && (
                                                                <div className="absolute top-2.5 left-2.5">
                                                                    <Badge variant="secondary" className="pl-2 h-auto">
                                                                        {attachedFile.type.startsWith('image/') ? (
                                                                            <Image src={attachedFile.content} alt={attachedFile.name} width={24} height={24} className="h-6 w-6 rounded-sm object-cover mr-2"/>
                                                                        ) : (
                                                                            <FileCheck2 className="h-3 w-3 mr-1" />
                                                                        )}
                                                                        <span className="truncate max-w-[120px] sm:max-w-xs">{attachedFile.name}</span>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="h-5 w-5 ml-1 rounded-full hover:bg-background/20"
                                                                            onClick={() => {
                                                                                setAttachedFile(null);
                                                                            }}
                                                                        >
                                                                            <X className="h-3 w-3" />
                                                                        </Button>
                                                                    </Badge>
                                                                </div>
                                                            )}
                                                            <Textarea
                                                                placeholder={
                                                                    activeTool === 'chat'
                                                                    ? 'Ask me anything...'
                                                                    : `Enter a topic for ${toolConfig[activeTool].label}...`
                                                                }
                                                                className={cn(
                                                                    "resize-none rounded-2xl border-input bg-card p-4 pr-24",
                                                                    attachedFile ? "pt-12" : ""
                                                                )}
                                                                {...field}
                                                                onKeyDown={(e) => {
                                                                    if (e.key === 'Enter' && !e.shiftKey) {
                                                                        e.preventDefault();
                                                                        form.handleSubmit(handleToolSubmit)();
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="pl-4" />
                                                </FormItem>
                                            )}
                                        />
                                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                                            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.md,.html,image/*,video/*" />
                                            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => fileInputRef.current?.click()}>
                                                <Paperclip className="h-5 w-5" />
                                            </Button>
                                            <Button type="submit" size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
                                                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                                            </Button>
                                        </div>
                                    </div>
                                </form>
                                
                                <div className="mt-3 flex items-center justify-center gap-2">
                                    <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-1 flex-grow flex items-center justify-center gap-1">
                                        {Object.keys(toolConfig).map((key) => {
                                            const toolKey = key as Tool;
                                            const tool = toolConfig[toolKey];
                                            return (
                                                <TooltipProvider key={key}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                variant="ghost"
                                                                className={cn(
                                                                    "flex-1",
                                                                    activeTool === key && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                                                                )}
                                                                onClick={() => {
                                                                    setActiveTool(toolKey);
                                                                }}
                                                            >
                                                                <tool.icon className="h-5 w-5" />
                                                                <span className="hidden sm:inline ml-2">{tool.label}</span>
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>{tool.label}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </FormProvider>
        </CopilotContext.Provider>
    );
} 