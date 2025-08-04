
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit, TrendingUp, Zap, Calendar, Wand, UserSquare2, Wand2 } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import ChatbotPreview from '@/components/home/ChatbotPreview';

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
        'transition-all duration-700 ease-out py-20 md:py-28',
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8',
        className
      )}
    >
      {children}
    </section>
  );
};


const features = [
  {
    icon: BrainCircuit,
    title: 'Smart Personalization Engine',
    description: 'Learns your unique tone, voice, and niche to generate content that perfectly matches your brand personality.',
  },
  {
    icon: TrendingUp,
    title: 'Performance Optimization',
    description: 'Utilize advanced tools like caption A/B testing and post engagement forecasting to maximize your content\'s impact.',
  },
  {
    icon: Zap,
    title: 'Trend Intelligence',
    description: 'Stay ahead of the curve with real-time trending audios, hashtags, and alerts for emerging trends in your niche.',
  },
  {
    icon: Calendar,
    title: 'Content Planning Tools',
    description: 'Streamline your workflow with an AI-powered content calendar and a weekly batch script generator.',
  },
  {
    icon: Wand,
    title: 'Creator Toolkit Add-ons',
    description: 'Enhance your content with AI-powered thumbnails, voiceovers, auto-subtitles, and multi-language translations.',
  },
  {
    icon: UserSquare2,
    title: 'Creator Portfolio 2.0',
    description: 'Showcase your work with reels, case studies, and testimonials, complete with an analytics dashboard and brand contact section.',
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="container mx-auto px-4 pt-16 md:pt-24 pb-8 text-center">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
            AI Content Copilot for Creators
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl text-muted-foreground">
            CreateX AI helps creators generate viral scripts, captions, and hashtags personalized to their brand & audience.
          </p>
          <Button asChild size="lg" className="mt-8 text-lg bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity">
            <Link href="/copilot">Try AI Copilot For Free</Link>
          </Button>
        </div>
      </section>

      <ChatbotPreview />

       {/* Introducing CreateX AI Section */}
      <div className="container mx-auto px-4 py-12 mt-12 md:mt-16">
        <div className="relative">
            <div className="absolute -inset-12 top-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20"></div>
            <div className="relative grid md:grid-cols-2 gap-12 items-center bg-card/60 backdrop-blur-sm text-foreground p-8 md:p-12 rounded-2xl border border-border/50">
                <div>
                  <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <Wand2 className="h-8 w-8 text-primary" />
                    Introducing CreateX AI
                  </h2>
                  <p className="text-muted-foreground mb-4">
                    CreateX AI is more than software — it's your personal AI-powered Content Studio. Built by AceNexus, it learns your style, understands your audience, and delivers tailor-made scripts, captions, hashtags, and even voiceovers that resonate deeply.
                  </p>
                  <p className="text-muted-foreground">
                    From spotting niche trends to predicting post performance, CreateX AI is engineered to keep you ahead, effortlessly. It's the smartest way for creators to design, edit, and amplify their content — all in one seamless space.
                  </p>
                </div>
                <div className="flex justify-center">
                     <div className="p-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                        <BrainCircuit className="h-20 w-20 text-primary" />
                     </div>
                </div>
            </div>
        </div>
      </div>


      {/* Social Proof */}
      <div className="py-12 bg-background/50">
        <div className="container mx-auto px-4">
          <p className="text-center text-muted-foreground font-semibold uppercase tracking-wider mb-8">
            Trusted by top creators & brands
          </p>
          <div className="flex flex-wrap justify-center items-center gap-x-8 md:gap-x-12 gap-y-4">
            <p className="text-2xl font-bold text-muted-foreground/60">NexaVerse</p>
            <p className="text-2xl font-bold text-muted-foreground/60">QuantumLeap</p>
            <p className="text-2xl font-bold text-muted-foreground/60">AetherSync</p>
            <p className="text-2xl font-bold text-muted-foreground/60">Zenith Media</p>
            <p className="text-2xl font-bold text-muted-foreground/60">Stellar Solutions</p>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <Section>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Go Viral</h2>
            <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
              Our powerful features are designed to save you time and supercharge your content strategy.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="text-left bg-card/60 p-6 rounded-lg border border-border/50 transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
                  <div className="p-3 inline-block rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4 border border-border/30">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* How It Works */}
      <Section className="bg-card/30">
          <div className="container mx-auto px-4">
              <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Create Content in 3 Simple Steps</h2>
                  <p className="mt-3 max-w-2xl mx-auto text-lg text-muted-foreground">
                      Our intuitive process makes content creation faster and smarter than ever before.
                  </p>
              </div>
              <div className="grid md:grid-cols-3 gap-12 text-center">
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
                      <h3 className="text-2xl font-semibold mb-2">Choose a Tool</h3>
                      <p className="text-muted-foreground">Select from our suite of tools, whether you need ideas, scripts, captions, or hashtags.</p>
                  </div>
                  <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
                      <h3 className="text-2xl font-semibold mb-2">Provide Your Topic</h3>
                      <p className="text-muted-foreground">Enter a simple topic or a detailed brief. Our AI understands context and nuance.</p>
                  </div>
                   <div className="flex flex-col items-center">
                      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div>
                      <h3 className="text-2xl font-semibold mb-2">Generate & Refine</h3>
                      <p className="text-muted-foreground">Instantly receive high-quality content. Use advanced options to refine it to perfection.</p>
                  </div>
              </div>
          </div>
      </Section>
      
      {/* Final CTA Section */}
      <Section>
        <div className="container mx-auto px-4">
            <div className="relative bg-gradient-to-r from-primary to-accent p-8 md:p-12 rounded-2xl text-center text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative">
                    <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Ready to Revolutionize Your Content?</h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl opacity-90">
                        Stop guessing what works and start creating content that gets results. Join thousands of creators who are saving time and growing faster with CreateX AI.
                    </p>
                    <Button asChild size="lg" variant="secondary" className="mt-8 text-lg bg-white text-primary hover:bg-white/90">
                        <Link href="/copilot">Start Creating For Free</Link>
                    </Button>
                </div>
            </div>
        </div>
      </Section>
    </div>
  );
}
