
'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, User, MapPin, TrendingUp, Users, Instagram, Rocket, ArrowLeft, X } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';

const creators = [
  {
    name: 'Alex Creator',
    handle: '@alexcreates',
    avatar: 'https://placehold.co/200x200/000000/000000.png',
    hint: 'creator portrait',
    niche: 'Tech',
    city: 'San Francisco',
    followers: '1.2M',
    isTrending: true,
  },
  {
    name: 'Bella Vlogs',
    handle: '@bellav',
    avatar: 'https://placehold.co/200x200/000000/000000.png',
    hint: 'travel vlogger',
    niche: 'Travel',
    city: 'New York',
    followers: '850K',
    isTrending: false,
  },
  {
    name: 'Carlos Cooks',
    handle: '@carloscooks',
    avatar: 'https://placehold.co/200x200/000000/000000.png',
    hint: 'chef portrait',
    niche: 'Food',
    city: 'Miami',
    followers: '950K',
    isTrending: true,
  },
  {
    name: 'Diana Designs',
    handle: '@dianad',
    avatar: 'https://placehold.co/200x200/000000/000000.png',
    hint: 'fashion designer',
    niche: 'Fashion',
    city: 'Los Angeles',
    followers: '2.1M',
    isTrending: true,
  },
  {
    name: 'Ethan Explores',
    handle: '@ethanexplores',
    avatar: 'https://placehold.co/200x200/000000/000000.png',
    hint: 'hiker portrait',
    niche: 'Adventure',
    city: 'Denver',
    followers: '450K',
    isTrending: false,
  },
  {
    name: 'Fiona Fitness',
    handle: '@fionafit',
    avatar: 'https://placehold.co/200x200/000000/000000.png',
    hint: 'fitness instructor',
    niche: 'Fitness',
    city: 'Chicago',
    followers: '1.5M',
    isTrending: true,
  },
   {
    name: 'George Gamer',
    handle: '@georgegames',
    avatar: 'https://placehold.co/200x200/000000/000000.png',
    hint: 'gamer portrait',
    niche: 'Gaming',
    city: 'Austin',
    followers: '3.2M',
    isTrending: true,
  },
  {
    name: 'Hannah Heals',
    handle: '@hannahheals',
    avatar: 'https://placehold.co/200x200/000000/000000.png',
    hint: 'wellness coach',
    niche: 'Wellness',
    city: 'San Francisco',
    followers: '720K',
    isTrending: false,
  },
];

const niches = ['All Niches', ...new Set(creators.map(c => c.niche))];
const cities = ['All Cities', ...new Set(creators.map(c => c.city))];

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


export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [nicheFilter, setNicheFilter] = useState('All Niches');
  const [cityFilter, setCityFilter] = useState('All Cities');
  const [trendingFilter, setTrendingFilter] = useState('All');
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);

  const filteredCreators = useMemo(() => {
    return creators.filter(creator => {
      const matchesSearch = creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            creator.handle.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesNiche = nicheFilter === 'All Niches' || creator.niche === nicheFilter;
      const matchesCity = cityFilter === 'All Cities' || creator.city === cityFilter;
      const matchesTrending = trendingFilter === 'All' || (trendingFilter === 'Yes' ? creator.isTrending : !creator.isTrending);
      
      return matchesSearch && matchesNiche && matchesCity && (trendingFilter === 'All' || matchesTrending);
    });
  }, [searchTerm, nicheFilter, cityFilter, trendingFilter]);

  return (
    <div className="relative">
      <div className={cn(isOverlayVisible && "blur-sm pointer-events-none")}>
        <div className="container mx-auto px-4 py-16 md:py-24">
          <Section className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Explore Creators</h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Discover and connect with talented creators from our community.
            </p>
          </Section>
          
          <Section className="mb-10 max-w-3xl mx-auto">
            <div className="flex items-center bg-card/60 backdrop-blur-sm border border-border/50 rounded-lg shadow-lg overflow-hidden">
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or @handle..."
                        className="pl-12 text-base h-14 border-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <Separator orientation="vertical" className="h-8" />
                
                <Select value={nicheFilter} onValueChange={setNicheFilter}>
                    <SelectTrigger className="border-0 bg-transparent focus:ring-0 w-[150px] h-14 text-muted-foreground">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {niches.map(niche => (
                        <SelectItem key={niche} value={niche}>{niche}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Separator orientation="vertical" className="h-8" />
                
                <Select value={cityFilter} onValueChange={setCityFilter}>
                    <SelectTrigger className="border-0 bg-transparent focus:ring-0 w-[150px] h-14 text-muted-foreground">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {cities.map(city => (
                        <SelectItem key={city} value={city}>{city}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
          </Section>

          <Section>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCreators.map(creator => (
                <Card key={creator.handle} className="overflow-hidden group flex flex-col transition-all duration-300 transform hover:scale-[1.03] hover:shadow-primary/20 hover:shadow-lg">
                    <CardContent className="p-4 flex flex-col items-center text-center">
                        <div className="relative mb-4">
                          <Avatar className="h-24 w-24 border-4 border-transparent group-hover:border-primary/50 transition-colors duration-300">
                              <AvatarImage src={creator.avatar} data-ai-hint={creator.hint} alt={creator.name} />
                              <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
                          </Avatar>
                          <div className="absolute bottom-0 right-0 p-1 bg-background rounded-full">
                            <Instagram className="h-5 w-5 text-pink-500" />
                          </div>
                        </div>
                        <h3 className="text-xl font-bold">{creator.name}</h3>
                        <p className="text-muted-foreground">{creator.handle}</p>
                        
                        <div className="flex flex-wrap gap-2 my-4 justify-center">
                            <Badge variant="secondary">{creator.niche}</Badge>
                            <Badge variant="outline" className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" /> {creator.city}
                            </Badge>
                            {creator.isTrending && (
                                <Badge className="bg-primary/10 text-primary border-primary/20 flex items-center gap-1">
                                    <TrendingUp className="h-3 w-3" /> Trending
                                </Badge>
                            )}
                        </div>
                        
                        <div className="flex items-center gap-2 text-muted-foreground mt-2">
                            <Users className="h-4 w-4" />
                            <span className="font-semibold text-foreground">{creator.followers}</span> followers
                        </div>
                    </CardContent>
                    <div className="p-4 mt-auto border-t">
                        <Button asChild className="w-full bg-gradient-to-r from-primary to-accent text-white">
                            <Link href="/account">View Profile</Link>
                        </Button>
                    </div>
                </Card>
              ))}
            </div>
            {filteredCreators.length === 0 && (
                <div className="text-center col-span-full py-16">
                    <p className="text-muted-foreground text-lg">No creators found matching your criteria.</p>
                </div>
            )}
          </Section>
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
                    <Rocket className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Coming Soon!</CardTitle>
                <CardDescription className="text-muted-foreground">We're building something amazing. The Creator Marketplace will be here soon.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild>
                  <Link href="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Go Back Home
                  </Link>
                </Button>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
