
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MessageSquare, Sparkles, FileText, Mic, Hash, Paperclip, Send, Bot, User } from 'lucide-react';


const tools = [
  { name: 'Chat', icon: MessageSquare, active: true },
  { name: 'Ideas', icon: Sparkles, active: false },
  { name: 'Scripts', icon: FileText, active: false },
  { name: 'Captions', icon: Mic, active: false },
  { name: 'Hashtags', icon: Hash, active: false },
];

export default function ChatbotPreview() {
  return (
    <section className="py-12">
      <Link href="/copilot" className="block group">
        <div className="relative w-full max-w-3xl mx-auto">
          <div className="absolute -inset-8 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-0 group-hover:opacity-20 group-active:opacity-30 transition-opacity duration-300"></div>
          <div className="relative bg-card/60 backdrop-blur-sm border border-border/50 rounded-2xl p-4 md:p-6 shadow-lg group-hover:border-primary/50 transition-all duration-300">
            {/* Mini Chat Result */}
            <div className="mb-4 space-y-4 px-2">
                <div className='flex items-start gap-3 justify-end'>
                    <div className="bg-neutral-800 text-primary-foreground rounded-2xl px-4 py-2 max-w-xs">
                        <p className="text-sm">I need a short-form video idea for my Gen Z audience about AI productivity.</p>
                    </div>
                    <div className="p-2 rounded-full bg-accent/20 border border-accent/30 flex-shrink-0"><User className="w-5 h-5 text-accent" /></div>
                </div>
                 <div className='flex items-start gap-3 justify-start'>
                    <div className="p-2 rounded-full bg-primary/10 border border-primary/20 flex-shrink-0"><Bot className="w-5 h-5 text-primary" /></div>
                    <div className="max-w-sm">
                        <p className="text-sm font-semibold">Great idea! Based on your channel's analytics, a "3 AI Tools That Feel Like Cheating" concept would perform well. </p>
                        <ul className="list-disc list-inside text-sm text-muted-foreground mt-2 space-y-1">
                            <li>Keep it fast-paced (under 45s).</li>
                            <li>Use a trending, upbeat audio.</li>
                            <li>End with a "save this for later" call-to-action.</li>
                        </ul>
                    </div>
                </div>
            </div>


            {/* Static Input Controls */}
            <div className="space-y-3 pt-4 border-t border-border/50">
                 {/* Fake Input Bar */}
                <div className="relative">
                    <div className="flex w-full items-center rounded-2xl border border-input bg-card p-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-14">
                        <span className="text-muted-foreground">Ask me anything...</span>
                    </div>
                    <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <Button type="button" variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled>
                            <Paperclip className="h-5 w-5" />
                        </Button>
                        <Button type="submit" size="icon" className="h-8 w-8 rounded-full bg-primary text-primary-foreground" disabled>
                            <Send className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                {/* Fake Tool Selector */}
                <div className="bg-card border border-border/50 rounded-lg p-1 flex items-center justify-center gap-1">
                    {tools.map((tool) => (
                        <Button
                            key={tool.name}
                            variant="ghost"
                            className={cn(
                                "flex-1",
                                tool.active && "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                            disabled
                        >
                            <tool.icon className="h-5 w-5" />
                            <span className="hidden sm:inline ml-2">{tool.name}</span>
                        </Button>
                    ))}
                </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}
