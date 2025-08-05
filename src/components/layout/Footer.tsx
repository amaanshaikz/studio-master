import Link from 'next/link';
import { Twitter, Instagram, Linkedin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/95">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
             <Link href="/" className="flex items-center space-x-2">
                            <Image src="https://i.postimg.cc/YSLhszmj/Connect-Create-Collaborate-5-2-1-removebg-preview-1.png" alt="CreateX AI Logo" width={24} height={24} className="h-6 w-6" />
            <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              CreateX AI
            </span>
            </Link>
          </div>
          <div className="text-center md:text-left mb-4 md:mb-0">
             <p className="text-sm text-muted-foreground">The most intelligent content creation suite for modern creators.</p>
          </div>
          <div className="flex space-x-4">
            <Link href="#" passHref>
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                <span className="sr-only">Twitter</span>
              </Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="ghost" size="icon">
                <Instagram className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                <span className="sr-only">Instagram</span>
              </Button>
            </Link>
            <Link href="#" passHref>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-border/40 pt-4 text-center text-sm text-muted-foreground">
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <p>&copy; {new Date().getFullYear()} CreateX AI. All rights reserved.</p>
                      <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </Link>
          </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
