
'use client';

import Image from 'next/image';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Eye, Heart, Users, MessageCircle, Mail, Instagram, X } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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


const initialAnalyticsData = [
  { name: 'Jan', total: 0 },
  { name: 'Feb', total: 0 },
  { name: 'Mar', total: 0 },
  { name: 'Apr', total: 0 },
  { name: 'May', total: 0 },
  { name: 'Jun', total: 0 },
];

const portfolioData = {
  reels: [
    { id: 1, src: 'https://placehold.co/400x600.png', alt: 'Reel 1', 'data-ai-hint': 'social media video' },
    { id: 2, src: 'https://placehold.co/400x600.png', alt: 'Reel 2', 'data-ai-hint': 'product demo' },
    { id: 3, src: 'https://placehold.co/400x600.png', alt: 'Reel 3', 'data-ai-hint': 'travel vlog' },
  ],
  caseStudies: [
    { title: 'Viral Campaign for Tech Startup', summary: 'Achieved 10M+ views and 500% follower growth in 3 months.' },
    { title: 'Brand Awareness for Fashion Label', summary: 'Increased brand mentions by 300% and drove record online sales.' },
  ],
  testimonials: [
    { quote: 'Working with Alex was a game-changer for our brand. The content was top-notch and the results speak for themselves!', author: 'CEO, Tech Startup' },
    { quote: 'An incredibly professional and creative partner. The campaign exceeded all our expectations.', author: 'Marketing Director, Fashion Label' },
  ],
};

const performanceMetrics = [
    { icon: Eye, value: '15.2M', label: 'Views' },
    { icon: Heart, value: '1.8M', label: 'Likes' },
    { icon: MessageCircle, value: '55K', label: 'Comments' },
    { icon: Users, value: '1.2M', label: 'Followers' },
];


export default function PortfolioPage() {
  const [analytics, setAnalytics] = useState(initialAnalyticsData);
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  useEffect(() => {
    setAnalytics([
      { name: 'Jan', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Feb', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Mar', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Apr', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'May', total: Math.floor(Math.random() * 5000) + 1000 },
      { name: 'Jun', total: Math.floor(Math.random() * 5000) + 1000 },
    ]);
  }, []);

  return (
    <div className="relative">
      <div className={cn(isOverlayVisible && "blur-sm pointer-events-none")}>
        <div className="container mx-auto px-4 py-16 md:py-24 space-y-16">
          <Section className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative">
              <Avatar className="h-32 w-32 border-4 border-primary/50">
                <AvatarImage src="https://placehold.co/200x200/000000/000000.png" data-ai-hint="creator portrait" alt="Creator Avatar" />
                <AvatarFallback>AC</AvatarFallback>
              </Avatar>
              <div className="absolute bottom-1 right-1 p-1.5 bg-background rounded-full">
                <Instagram className="h-6 w-6 text-pink-500" />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Alex Creator</h1>
              <p className="mt-2 text-lg text-muted-foreground">Digital Storyteller & AI-Powered Content Specialist</p>
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                  {performanceMetrics.map((metric) => (
                      <div key={metric.label} className="flex items-center gap-2 text-muted-foreground">
                          <metric.icon className="h-5 w-5 text-accent" />
                          <div>
                            <p className="font-bold text-lg text-foreground">{metric.value}</p>
                            <p className="text-xs">{metric.label}</p>
                          </div>
                      </div>
                  ))}
              </div>
            </div>
          </Section>
          
          <Section>
            <Tabs defaultValue="testimonials" className="w-full">
              <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
                <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
                <TabsTrigger value="reels">Featured Reels</TabsTrigger>
                <TabsTrigger value="case-studies">Case Studies</TabsTrigger>
              </TabsList>

              <TabsContent value="reels" className="mt-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {portfolioData.reels.map((reel) => (
                    <Card key={reel.id} className="overflow-hidden group">
                      <Image src={reel.src} alt={reel.alt} data-ai-hint={reel['data-ai-hint']} width={400} height={600} className="w-full h-auto object-cover aspect-[9/16] group-hover:scale-105 transition-transform duration-300" />
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="case-studies" className="mt-8">
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {portfolioData.caseStudies.map((study) => (
                    <Card key={study.title} className="h-full">
                      <CardHeader>
                        <CardTitle>{study.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{study.summary}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="testimonials" className="mt-8">
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                  {portfolioData.testimonials.map((testimonial) => (
                    <Card key={testimonial.author} className="h-full flex flex-col justify-center items-center text-center p-6">
                      <blockquote className="text-lg italic">"{testimonial.quote}"</blockquote>
                      <p className="mt-4 font-semibold text-primary">{testimonial.author}</p>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Section>
          
          <div className="grid lg:grid-cols-5 gap-8 items-start">
            <Section className="lg:col-span-3">
              <h2 className="text-3xl font-bold text-center mb-8">Analytics Dashboard</h2>
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Growth</CardTitle>
                  <CardDescription>Follower growth over the last 6 months.</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={analytics}>
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value / 1000}K`} />
                      <Bar dataKey="total" fill="url(#colorUv)" radius={[4, 4, 0, 0]} />
                       <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0.8}/>
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Section>

            <Section className="lg:col-span-2">
               <h2 className="text-3xl font-bold text-center mb-8">Ready to Collaborate?</h2>
               <Card className="p-8 text-center">
                 <p className="text-muted-foreground mb-6">
                    Let's create something amazing together. Reach out to discuss partnership opportunities and brand collaborations.
                </p>
                <Button size="lg" className="bg-gradient-to-r from-primary to-accent text-white w-full">
                    <Mail className="mr-2 h-5 w-5"/>
                    Contact for Brand Deals
                </Button>
               </Card>
            </Section>
          </div>
        </div>
      </div>
      {isOverlayVisible && (
        <div className="fixed inset-0 z-10 flex items-center justify-center bg-background/30 backdrop-blur-sm">
            <Card className="max-w-md text-center shadow-2xl animate-in fade-in-0 zoom-in-95 relative">
              <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={() => setIsOverlayVisible(false)}>
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
              <CardHeader>
                <div className="mx-auto p-3 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 mb-4 border border-border/30 w-fit">
                    <Instagram className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Unlock Your Creator Portfolio</CardTitle>
                <CardDescription className="text-muted-foreground">Connect your Instagram to unlock your full Creator Portfolio and optimize AI features.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button>
                  Connect Instagram
                </Button>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
