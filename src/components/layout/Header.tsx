
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const navLinks = [
  { href: '/features', label: 'Features' },
  { href: '/explore', label: 'Explore' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    const checkLoginStatus = () => {
        const loggedIn = typeof window !== 'undefined' && localStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(loggedIn);
    };
    checkLoginStatus();
    
    window.addEventListener('storage', checkLoginStatus);
    
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    router.push('/');
    router.refresh();
  };


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-4 ml-2">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="https://i.postimg.cc/YSLhszmj/Connect-Create-Collaborate-5-2-1-removebg-preview-1.png" alt="CreateX AI Logo" width={24} height={24} className="h-6 w-6" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              CreateX AI
            </span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        
        <div className="flex items-center gap-2">
           <div className="md:hidden">
            <Sheet open={isMenuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="pr-0">
                <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
                <SheetDescription className="sr-only">A menu for navigating the website on mobile devices.</SheetDescription>
                <Link href="/" className="flex items-center space-x-2 mb-6" onClick={() => setMenuOpen(false)}>
                   <Image src="https://i.postimg.cc/YSLhszmj/Connect-Create-Collaborate-5-2-1-removebg-preview-1.png" alt="CreateX AI Logo" width={24} height={24} className="h-6 w-6" />
                   <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                      CreateX AI
                   </span>
                </Link>
                <div className="flex flex-col space-y-3">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="text-lg transition-colors hover:text-foreground"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.label}
                    </Link>
                  ))}
                   {isMounted && isLoggedIn && <Link
                      href="/account"
                      className="text-lg transition-colors hover:text-foreground"
                      onClick={() => setMenuOpen(false)}
                    >
                      Account
                    </Link>}
                     {isMounted && isLoggedIn && <Button
                      variant="ghost"
                      className="text-lg justify-start p-0 h-auto hover:text-foreground"
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                    >
                      Logout
                    </Button>}
                </div>
                 <Button asChild className="mt-6 bg-gradient-to-r from-primary to-accent text-white" onClick={() => setMenuOpen(false)}>
                  <Link href="/copilot">Try AI Copilot</Link>
                </Button>
                {isMounted && !isLoggedIn && (
                  <div className="mt-4 flex flex-col space-y-2">
                     <Button asChild variant="ghost" onClick={() => setMenuOpen(false)}>
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild variant="ghost" onClick={() => setMenuOpen(false)}>
                      <Link href="/signup">Sign Up</Link>
                    </Button>
                  </div>
                )}
              </SheetContent>
            </Sheet>
          </div>

          <div className="hidden md:flex items-center gap-2">
             <Button asChild size="sm" className="bg-gradient-to-r from-primary to-accent text-white">
                <Link href="/copilot">Try AI Copilot</Link>
            </Button>
            {isMounted && (
              isLoggedIn ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                      <span className="sr-only">Account</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                       <Link href="/account">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
