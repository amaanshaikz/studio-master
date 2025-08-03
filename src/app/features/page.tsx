
'use client';

import { BrainCircuit, TrendingUp, Zap, Calendar, Wand, UserSquare2 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRef, useEffect, useState } from 'react';

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

const features: Feature[] = [
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
];


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


export default function FeaturesPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <Section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Platform Features</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Everything you need to create, optimize, and grow, all in one place.
        </p>
      </Section>

      <Section>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="relative p-px rounded-xl overflow-hidden group transition-all duration-300 transform hover:scale-[1.03]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/50 to-accent/50 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500"></div>
              <div className="relative h-full bg-card/60 backdrop-blur-sm p-6 rounded-lg flex flex-col items-start text-left border border-border/50">
                <div className="p-3 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4 border border-border/30">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}
