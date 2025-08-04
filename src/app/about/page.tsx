
'use client';

import { Rocket, Wand2, Users, Target, Globe, Milestone, BrainCircuit, UserSquare2, Bot, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

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


const buildingBlocks = [
  {
    icon: Bot,
    title: 'CreateX AI',
    description: 'A cutting-edge AI platform that acts as your creative partner. It adapts to your unique style and goals, helping you script, strategize, and optimize content with unmatched precision — so your voice always breaks through the noise.',
  },
  {
    icon: UserSquare2,
    title: 'Creator Portfolio 2.0',
    description: 'Go beyond static feeds. Create dynamic, interactive portfolios that showcase your best reels, testimonials, case studies, and even performance insights — making it easy for brands and collaborators to see your full potential.',
  },
  {
    icon: Users,
    title: 'The Createx Community',
    description: 'A private space by AceNexus where micro and student creators connect, learn, co-create, and grow together. From expert-led sessions to future employment opportunities at AceNexus, this is where emerging talent rises, together.',
  },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 space-y-20">
      
      <Section className="text-center">
        <div className="flex justify-center items-center mb-4">
            <Image src="https://i.postimg.cc/YSLhszmj/Connect-Create-Collaborate-5-2-1-removebg-preview-1.png" alt="AceNexus Logo" width={64} height={64} className="h-16 w-16" />
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">AceNexus</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Where Creators Meet the Future. AceNexus is a next-generation creator tech startup on a mission to redefine how micro and student creators build their brands, craft exceptional content, and thrive in the digital economy.
        </p>
      </Section>

      <div className="relative">
        <div className="absolute -inset-12 top-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20"></div>
        <Section className="relative grid md:grid-cols-2 gap-12 items-center bg-card/60 backdrop-blur-sm text-foreground p-8 md:p-12 rounded-2xl border border-border/50">
            <div>
              <h2 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Wand2 className="h-8 w-8 text-primary" />
                Introducing CreateX AI
              </h2>
              <p className="text-muted-foreground mb-4">
                CreateX AI is more than software — it’s your personal AI-powered Content Studio. Built by AceNexus, it learns your style, understands your audience, and delivers tailor-made scripts, captions, hashtags, and even voiceovers that resonate deeply.
              </p>
              <p className="text-muted-foreground">
                From spotting niche trends to predicting post performance, CreateX AI is engineered to keep you ahead, effortlessly. It’s the smartest way for creators to design, edit, and amplify their content — all in one seamless space.
              </p>
            </div>
            <div className="flex justify-center">
                 <div className="p-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
                    <BrainCircuit className="h-20 w-20 text-primary" />
                 </div>
            </div>
        </Section>
      </div>


      <Section className="grid md:grid-cols-2 gap-8 text-center">
        <Card className="p-8">
          <CardHeader className="p-0">
             <Target className="h-10 w-10 mx-auto text-primary mb-4" />
            <CardTitle className="text-2xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-muted-foreground">To build a world where every emerging creator, no matter their starting point, has access to advanced, intuitive tools like CreateX AI, meaningful guidance, and a global network to help them become a powerful brand of their own.</p>
          </CardContent>
        </Card>
        <Card className="p-8">
           <CardHeader className="p-0">
             <Globe className="h-10 w-10 mx-auto text-accent mb-4" />
            <CardTitle className="text-2xl">Our Mission</CardTitle>
           </CardHeader>
          <CardContent className="p-0 mt-4">
            <p className="text-muted-foreground">To unlock every creator’s potential with cutting-edge tools like CreateX AI and a powerful global community, so they can stand out — not burn out — in the fast-changing creator landscape.</p>
          </CardContent>
        </Card>
      </Section>
      
      <Section className="text-center">
        <h2 className="text-3xl font-bold mb-10 flex items-center justify-center gap-3">
            <Milestone className="h-8 w-8 text-primary" />
            What We’re Building
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {buildingBlocks.map((block) => (
            <div key={block.title} className="text-left bg-card p-6 rounded-lg border border-border/50">
                <div className="flex items-center gap-3 mb-3">
                     <block.icon className="h-6 w-6 text-accent" />
                     <h3 className="text-xl font-semibold">{block.title}</h3>
                </div>
              <p className="text-muted-foreground">{block.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <div className="relative">
        <div className="absolute -inset-12 top-0 bg-gradient-to-r from-primary to-accent rounded-3xl blur-2xl opacity-20"></div>
        <Section className="relative bg-card/60 backdrop-blur-sm text-foreground p-8 md:p-12 rounded-2xl text-center border border-border/50">
            <Image src="https://i.postimg.cc/YSLhszmj/Connect-Create-Collaborate-5-2-1-removebg-preview-1.png" alt="AceNexus Logo" width={48} height={48} className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Why AceNexus & CreateX AI?</h2>
            <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-6">
            Because we’re not just building an AI tool. We’re shaping the next era of the creator economy. With CreateX AI, your content isn’t just made — it’s crafted to resonate, perform, and elevate your brand. And with our thriving community, you’ll never have to navigate this journey alone.
            </p>
        </Section>
      </div>
      
      <Section className="text-center">
        <div className="flex justify-center items-center gap-4 mb-4">
            <CheckCircle className="h-10 w-10 text-primary" />
            <h2 className="text-3xl font-bold">Join Us & Be Part of Something Extraordinary</h2>
        </div>
        <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-6">
            At AceNexus, through innovations like CreateX AI, we’re empowering creators everywhere to own their growth, magnify their influence, and shape what’s next.
        </p>
        <Button asChild size="lg" className="bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 transition-opacity">
            <Link href="/join">Join Our Community</Link>
        </Button>
      </Section>
    </div>
  );
}
