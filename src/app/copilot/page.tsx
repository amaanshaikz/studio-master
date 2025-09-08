
'use client';

import * as React from 'react';
import { useState, useRef, useEffect, useCallback, useContext } from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Mic, Hash, CornerDownLeft, Loader2, Sparkles, Settings2, X, Copy, Bot, User, BrainCircuit, Send, Paperclip, FileCheck2, MessageSquare, Image as ImageIcon, Lightbulb, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useForm, FormProvider, type SubmitHandler, useFormContext, Controller, type FieldValues, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ScrollArea } from '@/components/ui/scroll-area';
import { generationSchema, chatSchema, type GenerationInput, type ChatInput } from '@/lib/schemas';
import { handleGenerateScript, handleGenerateCaptions, handleGenerateHashtags, handleGenerateIdeas, handleGenerateChatResponse } from '@/app/actions/generationActions';
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
import { TypingAnimation } from '@/components/ui/typing-animation';
import PlatformConnectionOverlay from '@/components/platforms/PlatformConnectionOverlay';


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

const hookStyles = ['Shocking Fact or Statistic', 'Personal Relatable Story', 'Bold/Controversial Statement', 'Direct Question to Audience', 'Trend-based Hook', 'Emotional Trigger'];
const audienceTypes = ['Gen Z', 'Millennials', 'Entrepreneurs', 'Fitness Enthusiasts', 'Tech Geeks', 'Students', 'Middle-Aged Adults'];
const contentGoals = ['Awareness', 'Engagement', 'Sales', 'Personal Branding'];
const targetPlatforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter (X)', 'LinkedIn'];
const videoLengths = [
    'Instagram Reel (0–30 sec)',
    'YouTube Shorts (0–60 sec)',
    'TikTok Video',
    'Voiceover Script',
    'Talking Head Video',
    'Storytelling Carousel (Text-based)',
    'Long-form YouTube (3–5 min)',
];
const ctaOptions = ['Like / Comment / Share', 'Follow your page', 'Visit link in bio', 'Save the post', 'DM for more info', 'Signup / Join community'];

// New options for Captions
const captionLengths = ["Short & Snappy (Under 100 characters)", "Medium (100–200 characters)", "Long-form Microblog (200+ characters)"];
const captionTones = ["Witty & Humorous", "Motivational / Uplifting", "Professional & Informative", "Bold & Attention-Grabbing", "Personal & Relatable", "Sarcastic / Edgy", "Trendy / Gen-Z Slang"];
const captionHookStyles = ["Ask a Question", "Shocking Fact", "Bold Statement", "Story Teaser", "Trending Phrase / Meme-style", "Emotional Trigger"];
const captionPlatforms = ["Instagram", "TikTok", "LinkedIn", "YouTube Shorts", "Threads / Twitter", "Facebook"];
const engagementTriggers = [
    { id: "Ask a question", label: "Ask a question" },
    { id: "Encourage shares", label: "Encourage shares" },
    { id: "Spark debate", label: "Spark debate" },
    { id: "Build FOMO", label: "Build FOMO" },
    { id: "Invite DMs", label: "Invite DMs" },
    { id: "Drive comments", label: "Drive comments (eg: “Tag a friend”, “Your thoughts?”)" },
    { id: "Inspire saves", label: "Inspire saves (tips, carousels)" },
];

// New options for Hashtags
const hashtagMixes = ["Trending", "Evergreen"];
const hashtagGoals = [
    { id: 'Increase Reach (go viral / explore page)', label: 'Increase Reach (go viral / explore page)' },
    { id: 'Target Niche Audience', label: 'Target Niche Audience' },
    { id: 'Follow Trends', label: 'Follow Trends' },
    { id: 'Improve SEO & Discoverability', label: 'Improve SEO & Discoverability' },
    { id: 'Build Personal Brand Identity', label: 'Build Personal Brand Identity' },
];
const nicheCategories = ["Fashion", "Fitness", "Tech", "Finance", "Food", "Travel", "Self-Improvement", "Creator Economy", "AI / Startups"];
const contentTones = ["Funny", "Emotional", "Bold/Controversial", "Storytelling", "Educational", "Relatable"];

const toolConfig = {
    chat: { label: 'Chat', icon: MessageSquare },
    // ideas: { label: 'Ideas', icon: Sparkles },
    // scripts: { label: 'Scripts', icon: FileText },
    // captions: { label: 'Captions', icon: Mic },
    // hashtags: { label: 'Hashtags', icon: Hash },
};

const Section = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <section
      ref={ref}
      className={cn(
        'transition-all duration-700 ease-out',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {children}
    </section>
  );
};

interface FormChipGroupProps<TFieldValues extends FieldValues> {
    name: FieldPath<TFieldValues>;
    options: readonly string[];
}

interface FormCheckboxGroupProps<TFieldValues extends FieldValues> {
  name: FieldPath<TFieldValues>;
  options: readonly { id: string; label: string }[];
}

function FormCheckboxGroup<TFieldValues extends FieldValues>({ name, options }: FormCheckboxGroupProps<TFieldValues>) {
  const { control } = useFormContext<TFieldValues>();
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {options.map((item) => (
            <FormField
              key={item.id}
              control={control}
              name={name}
              render={({ field }) => {
                return (
                  <FormItem
                    key={item.id}
                    className="flex flex-row items-start space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(item.id)}
                        onCheckedChange={(checked) => {
                          const value = field.value || [];
                          return checked
                            ? field.onChange([...value, item.id])
                            : field.onChange(
                                value?.filter(
                                  (value: string) => value !== item.id
                                )
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm">{item.label}</FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


function FormChipGroup<TFieldValues extends FieldValues>({ name, options }: FormChipGroupProps<TFieldValues>) {
    const { control } = useFormContext<TFieldValues>();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => {
                const selectedValues = new Set(field.value || []);
                return (
                    <div className="flex flex-wrap gap-2">
                        {options.map((option) => (
                            <Button
                                key={option}
                                type="button"
                                variant={selectedValues.has(option) ? 'secondary' : 'outline'}
                                size="sm"
                                className="h-auto px-3 py-1 text-sm"
                                onClick={() => {
                                    const newSelectedValues = new Set(selectedValues);
                                    if (newSelectedValues.has(option)) {
                                        newSelectedValues.delete(option);
                                    } else {
                                        newSelectedValues.add(option);
                                    }
                                    field.onChange(Array.from(newSelectedValues));
                                }}
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                );
            }}
        />
    );
}

const AdvancedOptionsContent = () => {
    const { control } = useFormContext();
    const { activeTool } = useCopilotContext();
    
    return (
         <div className="space-y-4 p-1">
            {activeTool === 'ideas' && (
                <>
                    <FormField control={control} name="niche" render={({ field }) => ( <FormItem><FormLabel>Niche</FormLabel><FormControl><Input placeholder="e.g., Tech Reviews" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="audienceType" render={({ field }) => ( <FormItem><FormLabel>Audience Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an audience type" /></SelectTrigger></FormControl><SelectContent>{audienceTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={control} name="contentGoal" render={({ field }) => ( <FormItem><FormLabel>Content Goal</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a content goal" /></SelectTrigger></FormControl><SelectContent>{contentGoals.map((goal) => (<SelectItem key={goal} value={goal}>{goal}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={control} name="targetPlatform" render={({ field }) => ( <FormItem><FormLabel>Target Platform</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a target platform" /></SelectTrigger></FormControl><SelectContent>{targetPlatforms.map((platform) => (<SelectItem key={platform} value={platform}>{platform}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormItem>
                        <FormLabel>What should be the tone of the content?</FormLabel>
                        <FormControl>
                            <FormChipGroup name="contentTones" options={contentTones} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </>
            )}

            {activeTool === 'scripts' && (
                <>
                    <FormField control={control} name="niche" render={({ field }) => ( <FormItem><FormLabel>Niche</FormLabel><FormControl><Input placeholder="e.g., Tech Reviews" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="audienceType" render={({ field }) => ( <FormItem><FormLabel>Audience Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select an audience type" /></SelectTrigger></FormControl><SelectContent>{audienceTypes.map((type) => (<SelectItem key={type} value={type}>{type}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={control} name="hookStyle" render={({ field }) => ( <FormItem><FormLabel>Hook Style</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a hook style" /></SelectTrigger></FormControl><SelectContent>{hookStyles.map((style) => (<SelectItem key={style} value={style}>{style}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={control} name="videoLength" render={({ field }) => ( <FormItem><FormLabel>What kind of script are you looking for?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a video format" /></SelectTrigger></FormControl><SelectContent>{videoLengths.map((length) => (<SelectItem key={length} value={length}>{length}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                     <FormItem>
                        <FormLabel>What should the CTA encourage?</FormLabel>
                        <FormControl>
                            <FormChipGroup name="callToAction" options={ctaOptions} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </>
            )}
            
            {activeTool === 'captions' && (
                <div className="space-y-4">
                    <FormField control={control} name="captionLength" render={({ field }) => ( <FormItem className="space-y-3"><FormLabel>Caption Length?</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col space-y-1">{captionLengths.map((length) => (<FormItem key={length} className="flex items-center space-x-3 space-y-0"><FormControl><RadioGroupItem value={length} /></FormControl><FormLabel className="font-normal">{length}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="captionTone" render={({ field }) => ( <FormItem><FormLabel>Choose the tone of your caption</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger></FormControl><SelectContent>{captionTones.map((tone) => (<SelectItem key={tone} value={tone}>{tone}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={control} name="hookStyle" render={({ field }) => ( <FormItem><FormLabel>Pick a hook style to start your caption</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a hook style" /></SelectTrigger></FormControl><SelectContent>{captionHookStyles.map((style) => (<SelectItem key={style} value={style}>{style}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={control} name="platform" render={({ field }) => ( <FormItem><FormLabel>Which platform is this for?</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl><SelectContent>{captionPlatforms.map((platform) => (<SelectItem key={platform} value={platform}>{platform}</SelectItem>))}</SelectContent></Select><FormMessage /></FormItem> )} />
                    <FormField control={control} name="engagementTrigger" render={({ field }) => ( 
                        <FormItem><FormLabel>Engagement Trigger</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select an engagement trigger" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {engagementTriggers.map((trigger) => (
                                        <SelectItem key={trigger.id} value={trigger.id}>{trigger.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem> 
                    )} />
                </div>
            )}

            {activeTool === 'hashtags' && (
                <div className="space-y-4">
                    <FormField control={control} name="niche" render={({ field }) => ( 
                        <FormItem>
                            <FormLabel>Select your content niche</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a niche" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {nicheCategories.map((niche) => (
                                        <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem> 
                    )} />
                     <FormItem>
                        <FormLabel>What’s your primary hashtag goal?</FormLabel>
                        <FormControl>
                            <FormCheckboxGroup name="hashtagGoals" options={hashtagGoals} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    <FormField control={control} name="keywords" render={({ field }) => ( <FormItem><FormLabel>Keywords to Include</FormLabel><FormControl><Input placeholder="e.g., AI, content creation" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="location" render={({ field }) => ( <FormItem><FormLabel>Geo-Target (Optional)</FormLabel><FormControl><Input placeholder="e.g., Los Angeles or Spain" {...field} /></FormControl></FormItem> )} />
                    <FormField control={control} name="hashtagMix" render={({ field }) => ( <FormItem className="pt-2"><FormLabel>Trending vs. Evergreen Mix</FormLabel><FormControl><RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4 pt-2">{hashtagMixes.map((mix) => (<FormItem key={mix} className="flex items-center space-x-2"><FormControl><RadioGroupItem value={mix} id={mix} /></FormControl><FormLabel htmlFor={mix} className="font-normal">{mix}</FormLabel></FormItem>))}</RadioGroup></FormControl><FormMessage /></FormItem> )} />
                    <FormField control={control} name="blendStructure" render={({ field }) => ( <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm"><div className="space-y-0.5"><FormLabel>Custom Blend Structure</FormLabel><FormDescription>Auto-generate a strategic blend of hashtag types.</FormDescription></div><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl></FormItem> )} />
                </div>
            )}
        </div>
    )
}

const AdvancedOptions = () => {
    const { activeTool } = useCopilotContext();

    if (activeTool === 'chat') {
        return null;
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block">
                <Card className="bg-card/60 backdrop-blur-sm border border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <Settings2 className="h-5 w-5 text-primary" />
                            Advanced Options
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <AdvancedOptionsContent />
                    </CardContent>
                </Card>
            </div>

             {/* Mobile/Tablet Accordion */}
            <div className="lg:hidden w-full max-w-3xl mx-auto mb-4">
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="advanced-options" className="border rounded-lg bg-card/60 backdrop-blur-sm border-border/50">
                        <AccordionTrigger className="px-4 py-3 text-base hover:no-underline">
                             <div className="flex items-center gap-2">
                                <Settings2 className="h-5 w-5 text-primary" />
                                Advanced Options
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-4">
                             <AdvancedOptionsContent />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </>
    );
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

interface PromptCardProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    prompt: string;
    onClick: () => void;
}

const PromptCard = ({ icon, title, description, prompt, onClick }: PromptCardProps) => {
    return (
        <button
            onClick={onClick}
            className="group relative p-4 rounded-xl bg-card/60 backdrop-blur-sm border border-border/50 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 text-left w-full"
        >
            <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-300">
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-300">
                        {title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                        {description}
                    </p>
                    <div className="mt-2 text-xs text-primary/70 group-hover:text-primary transition-colors duration-300">
                        "{prompt}"
                    </div>
                </div>
            </div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </button>
    );
};

export default function CopilotPage() {
    const [activeTool, setActiveTool] = useState<Tool>('chat');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [attachedFile, setAttachedFile] = useState<{name: string, content: string, type: string} | null>(null);
    const [showPlatformOverlay, setShowPlatformOverlay] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    const form = useForm<GenerationInput & ChatInput>({
        resolver: (data, context, options) => {
            const schema = activeTool === 'chat' ? chatSchema : generationSchema;
            return zodResolver(schema)(data, context, options);
        },
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            query: '',
            topic: '',
            history: [],
            documentContent: '',
            niche: '',
            hookStyle: '',
            audienceType: '',
            targetPlatform: 'Instagram',
            videoLength: 'Instagram Reel (0–30 sec)',
            callToAction: [],
            // captions
            captionLength: 'Medium (100–200 characters)',
            captionTone: '',
            platform: 'Instagram',
            engagementTrigger: '',
            // hashtags
            location: '',
            keywords: '',
            hashtagMix: '',
            blendStructure: false,
            hashtagGoals: [],
            // ideas
            contentGoal: 'Engagement',
            contentTones: [],
        },
    });
     
    useEffect(() => {
        form.reset({
            query: '',
            topic: '',
            history: [],
            documentContent: attachedFile?.content || '',
            niche: '',
            hookStyle: '',
            audienceType: '',
            targetPlatform: 'Instagram',
            videoLength: 'Instagram Reel (0–30 sec)',
            callToAction: [],
            captionLength: 'Medium (100–200 characters)',
            captionTone: '',
            platform: 'Instagram',
            engagementTrigger: '',
            location: '',
            keywords: '',
            hashtagMix: '',
            blendStructure: false,
            hashtagGoals: [],
            contentGoal: 'Engagement',
            contentTones: [],
        });
    }, [activeTool, form, attachedFile?.content]);

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
                form.setValue('documentContent', content);
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
      // Hide the platform overlay when user clicks follow-up prompts
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
        // Let the state update before setting the value
        setTimeout(prepareAndSubmit, 0);
      } else {
        prepareAndSubmit();
      }
    };
    
    const handleToolSubmit: SubmitHandler<GenerationInput & ChatInput> = useCallback(async (values) => {
        // Hide the platform overlay when user starts chatting
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

        const history = newMessages.slice(-5, -1).map(messageToHistoryItem);
        
        let result: any;
        const submissionData = { ...values, history };
        if (activeTool !== 'chat') {
            submissionData.topic = userMessageText;
        } else {
            submissionData.query = userMessageText;
        }

        try {
            switch (activeTool) {
                case 'chat':
                    result = await handleGenerateChatResponse(submissionData as ChatInput);
                    if (result.data) setMessages((prev) => [...prev, { role: 'model', content: { chatResponse: result.data.response, followUpPrompts: result.data.followUpPrompts } }]);
                    break;
                case 'scripts':
                    result = await handleGenerateScript(submissionData as GenerationInput);
                    if (result.data) setMessages((prev) => [...prev, { role: 'model', content: { script: result.data.script, followUpPrompts: result.data.followUpPrompts } }]);
                    break;
                case 'captions':
                    result = await handleGenerateCaptions(submissionData as GenerationInput);
                    if (result.data) setMessages((prev) => [...prev, { role: 'model', content: { captions: result.data.captions, followUpPrompts: result.data.followUpPrompts } }]);
                    break;
                case 'hashtags':
                    result = await handleGenerateHashtags(submissionData as GenerationInput);
                    if (result.data) setMessages((prev) => [...prev, { role: 'model', content: { hashtags: result.data.hashtags, followUpPrompts: result.data.followUpPrompts } }]);
                    break;
                case 'ideas':
                    result = await handleGenerateIdeas(submissionData as GenerationInput);
                    if (result.data) setMessages((prev) => [...prev, { role: 'model', content: { ideas: result.data.ideas, followUpPrompts: result.data.followUpPrompts } }]);
                    break;
            }

            if (result?.error) {
                toast({ variant: 'destructive', title: 'Error', description: result.error });
                setMessages((prev) => prev.slice(0, -1));
            }

        } catch (error) {
            console.error('Error:', error);
            toast({ variant: 'destructive', title: 'Error', description: 'Something went wrong. Please try again.' });
            setMessages((prev) => prev.slice(0, -1));
        } finally {
            setIsLoading(false);
            // Reset the form to clear the input fields
            const currentValues = form.getValues();
            form.reset({
                ...currentValues,
                query: '',
                topic: '',
                history: [], // Clear history from form state
                // Keep advanced options by reusing currentValues
            });
            if (attachedFile) {
                form.setValue('documentContent', attachedFile.content);
            } else {
                 form.setValue('documentContent', '');
            }
        }
    }, [activeTool, messages, attachedFile, toast]);
    
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
             return <TypingAnimation text={responseText} speed={15} className="whitespace-pre-wrap" enableMarkdown={true} />
        }
       
        if (content.text) {
            return (
                <div className="flex flex-col gap-2">
                  <div className="whitespace-pre-wrap">{content.text}</div>
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
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 container mx-auto px-2 sm:px-4 py-4 sm:py-8 md:py-12 bg-black min-h-screen">
                
                {/* Desktop sidebar commented out - only chat functionality available */}
                {/* {activeTool !== 'chat' && (
                  <div className="hidden lg:block lg:col-span-1">
                      <AdvancedOptions />
                  </div>
                )} */}
                
                <div className="flex flex-col h-[calc(100vh-4rem)] sm:h-[calc(100vh-5rem)] md:h-[calc(100vh-theme(height.14)-100px)] lg:col-span-3">
                    <ScrollArea className="flex-grow pr-2 sm:pr-4 overflow-y-auto" ref={scrollAreaRef}>
                        <div className="space-y-4 sm:space-y-6 max-w-3xl mx-auto px-2 sm:px-0">
                            {messages.length === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center text-muted-foreground pt-8 sm:pt-16 relative min-h-[300px] sm:min-h-[400px]">
                                    {showPlatformOverlay && (
                                        <PlatformConnectionOverlay onClose={() => setShowPlatformOverlay(false)} />
                                    )}
                                    <div className="p-3 sm:p-4 rounded-full bg-primary/10 border border-primary/20 mb-3 sm:mb-4">
                                        <BrainCircuit className="h-8 w-8 sm:h-12 sm:w-12 text-primary" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Personalized AI Content Copilot</h2>
                                    <p className="max-w-md text-sm sm:text-base px-4 text-center mb-8">Your all-in-one creative copilot — tailored to your style, your audience, your growth.</p>
                                    
                                    {/* Prompt Containers */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-2xl px-4">
                                        <PromptCard
                                            icon={<Lightbulb className="h-5 w-5" />}
                                            title="Content Ideas"
                                            description="Get fresh content ideas tailored to your niche"
                                            prompt="Help me brainstorm content ideas for my audience"
                                            onClick={() => submitFollowUpPrompt("Help me brainstorm content ideas for my audience")}
                                        />
                                        <PromptCard
                                            icon={<FileText className="h-5 w-5" />}
                                            title="Script Writing"
                                            description="Create engaging scripts for your videos"
                                            prompt="Write a script for a 30-second Instagram reel about"
                                            onClick={() => submitFollowUpPrompt("Write a script for a 30-second Instagram reel about")}
                                        />
                                        <PromptCard
                                            icon={<Hash className="h-5 w-5" />}
                                            title="Hashtag Strategy"
                                            description="Find the perfect hashtags to boost reach"
                                            prompt="Suggest trending hashtags for my content"
                                            onClick={() => submitFollowUpPrompt("Suggest trending hashtags for my content")}
                                        />
                                        <PromptCard
                                            icon={<Mic className="h-5 w-5" />}
                                            title="Caption Writing"
                                            description="Craft compelling captions that drive engagement"
                                            prompt="Write an engaging caption for my post about"
                                            onClick={() => submitFollowUpPrompt("Write an engaging caption for my post about")}
                                        />
                                    </div>
                                </div>
                            ) : (
                                messages.map((message, index) => (
                                    <div key={index} className={cn('flex flex-col gap-2 sm:gap-4', message.role === 'user' ? 'items-end' : 'items-start')}>
                                       <div className={cn('flex items-start gap-2 sm:gap-4', message.role === 'user' ? 'justify-end' : 'justify-start')}>
                                            {message.role === 'model' && <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0"><Bot className="w-4 h-4 sm:w-6 sm:h-6 text-primary" /></div>}
                                            <div className={cn(
                                                'relative group min-w-0 flex-1 max-w-[calc(100vw-4rem)] sm:max-w-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm sm:text-base', 
                                                message.role === 'user' 
                                                    ? 'bg-neutral-800 text-primary-foreground rounded-2xl' 
                                                    : 'text-foreground'
                                            )}>
                                                <div className="whitespace-pre-wrap break-words overflow-hidden">
                                                    {renderMessageContent(message.content)}
                                                </div>
                                            </div>
                                       </div>
                                       {message.role === 'model' && message.content.followUpPrompts && message.content.followUpPrompts.length > 0 && index === messages.length - 1 && !isLoading && (
                                            <div className="flex flex-col sm:flex-wrap gap-2 sm:gap-1.5 min-w-0 flex-1 max-w-[calc(100vw-4rem)] sm:max-w-2xl ml-8 sm:ml-14">
                                              {message.content.followUpPrompts.map((prompt, i) => (
                                                  <Button
                                                      key={i}
                                                      variant="outline"
                                                      size="sm"
                                                      onClick={() => submitFollowUpPrompt(prompt)}
                                                      className="text-xs h-auto py-1.5 px-2 sm:px-3 min-h-[32px] sm:min-h-[36px] w-full sm:w-auto min-w-0"
                                                  >
                                                      <Lightbulb className="h-3 w-3 mr-1.5 sm:mr-2 flex-shrink-0" />
                                                      <span className="truncate w-full sm:max-w-none min-w-0">{prompt}</span>
                                                  </Button>
                                              ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                            {isLoading && (
                                <div className="flex items-start gap-2 sm:gap-4 justify-start">
                                <div className="p-1.5 sm:p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0"><Bot className="w-4 h-4 sm:w-6 sm:h-6 text-primary" /></div>
                                    <div className="min-w-0 flex-1 max-w-[calc(100vw-4rem)] sm:max-w-2xl rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center">
                                        <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin text-primary" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                    
                    <div className="mt-auto pt-2 sm:pt-4 px-2 sm:px-0">
                        {/* Advanced options commented out - only chat functionality available */}
                        {/* {activeTool !== 'chat' && (
                            <div className="lg:hidden">
                                <AdvancedOptions />
                            </div>
                        )} */}
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
                                                            <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5">
                                                                <Badge variant="secondary" className="pl-1.5 sm:pl-2 h-auto text-xs">
                                                                    {attachedFile.type.startsWith('image/') ? (
                                                                        <Image src={attachedFile.content} alt={attachedFile.name} width={20} height={20} className="h-5 w-5 sm:h-6 sm:w-6 rounded-sm object-cover mr-1.5 sm:mr-2"/>
                                                                    ) : (
                                                                        <FileCheck2 className="h-3 w-3 mr-1" />
                                                                    )}
                                                                    <span className="truncate max-w-[80px] sm:max-w-[120px] md:max-w-xs">{attachedFile.name}</span>
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        className="h-4 w-4 sm:h-5 sm:w-5 ml-1 rounded-full hover:bg-background/20"
                                                                        onClick={() => {
                                                                            setAttachedFile(null);
                                                                            form.setValue('documentContent', '');
                                                                        }}
                                                                    >
                                                                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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
                                                                "resize-none rounded-2xl border-input bg-card p-3 sm:p-4 pr-20 sm:pr-24 text-sm sm:text-base min-h-[44px] max-h-[120px]",
                                                                attachedFile ? "pt-10 sm:pt-12" : ""
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
                                                <FormMessage className="pl-3 sm:pl-4" />
                                            </FormItem>
                                        )}
                                    />
                                    <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 flex items-center gap-1.5 sm:gap-2">
                                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.md,.html,image/*,video/*" />
                                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 sm:h-8 sm:w-8 rounded-full min-h-[32px] sm:min-h-[32px]" onClick={() => fileInputRef.current?.click()}>
                                            <Paperclip className="h-4 w-4 sm:h-5 sm:w-5" />
                                        </Button>
                                        <Button type="submit" size="icon" className="h-8 w-8 sm:h-8 sm:w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 min-h-[32px] sm:min-h-[32px]" disabled={isLoading}>
                                            {isLoading ? <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" /> : <Send className="h-4 w-4 sm:h-5 sm:w-5" />}
                                        </Button>
                                    </div>
                                </div>
                            </form>
                            
                            {/* Tab navigation commented out - only chat functionality available */}
                            {/* <div className="mt-2 sm:mt-3 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-0">
                                <div className="bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg p-1 flex-grow flex items-center justify-center gap-0.5 sm:gap-1">
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
                                                                "flex-1 min-h-[36px] sm:min-h-[40px] text-xs sm:text-sm",
                                                                activeTool === key && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                                                            )}
                                                            onClick={() => {
                                                                setActiveTool(toolKey);
                                                            }}
                                                        >
                                                            <tool.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                                            <span className="hidden sm:inline ml-1.5 sm:ml-2">{tool.label}</span>
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
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </FormProvider>
        </CopilotContext.Provider>
    );
}
