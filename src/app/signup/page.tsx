
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Eye, EyeOff, Mail, Lock, User, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import PersonalizationOverlay from '@/components/auth/PersonalizationOverlay';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPersonalization, setShowPersonalization] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: '',
  });
  const router = useRouter();
  const { toast } = useToast();

  const checkPasswordStrength = (password: string) => {
    let score = 0;
    let feedback = '';

    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score < 2) feedback = 'Weak';
    else if (score < 4) feedback = 'Fair';
    else if (score < 5) feedback = 'Good';
    else feedback = 'Strong';

    setPasswordStrength({ score, feedback });
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Check password strength
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the registration API
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.error?.includes('already registered')) {
          toast({
            title: "Account already exists",
            description: "Please sign in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup failed",
            description: data.error || "Please try again.",
            variant: "destructive",
          });
        }
        return;
      }

      if (data.success) {
        toast({
          title: "Account created successfully!",
          description: "Welcome to CreateX AI!",
        });

        // Sign in the user after successful signup
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });

        if (!result?.error) {
          // Show personalization overlay instead of going directly to setup
          setShowPersonalization(true);
        } else {
          console.error('NextAuth signin error:', result.error);
          toast({
            title: "Account created but login failed",
            description: "Please try logging in manually.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleSignup = async () => {
  //   try {
  //     await signIn('google', {
  //       callbackUrl: '/setup',
  //     });
  //   } catch (error) {
  //     console.error('Google signup error:', error);
  //     toast({
  //       title: "Google signup failed",
  //       description: "Please try again later.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  const handlePersonalizationComplete = (role: string) => {
    setShowPersonalization(false);
    if (role === 'creator') {
      router.push('/setup');
    } else {
      router.push('/individual-setup');
    }
    router.refresh();
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score < 2) return 'text-destructive';
    if (passwordStrength.score < 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="min-h-screen relative">
      {/* Stars Background */}
      <div className="stars-container">
        <div id="stars"></div>
        <div id="stars2"></div>
        <div id="stars3"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Card className="shadow-2xl border-border/40 bg-card/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4 pb-8">
              <div className="mx-auto w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Create Account
                </CardTitle>
                <CardDescription className="text-muted-foreground mt-2">
                  Join CreateX AI and start your journey
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium text-foreground">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10 h-12 border-2 transition-all duration-200 bg-background/50",
                        errors.fullName 
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                          : "border-border focus:border-primary focus:ring-primary/20"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.fullName && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-foreground">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10 h-12 border-2 transition-all duration-200 bg-background/50",
                        errors.email 
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                          : "border-border focus:border-primary focus:ring-primary/20"
                      )}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-foreground">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10 pr-10 h-12 border-2 transition-all duration-200 bg-background/50",
                        errors.password 
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                          : "border-border focus:border-primary focus:ring-primary/20"
                      )}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.password && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className={getPasswordStrengthColor()}>
                        {passwordStrength.feedback}
                      </span>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((level) => (
                          <div
                            key={level}
                            className={cn(
                              "w-2 h-2 rounded-full",
                              level <= passwordStrength.score
                                ? getPasswordStrengthColor().replace('text-', 'bg-')
                                : "bg-muted"
                            )}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {errors.password && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.password}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={cn(
                        "pl-10 pr-10 h-12 border-2 transition-all duration-200 bg-background/50",
                        errors.confirmPassword 
                          ? "border-destructive focus:border-destructive focus:ring-destructive/20" 
                          : formData.confirmPassword && formData.password === formData.confirmPassword
                          ? "border-green-500 focus:border-green-500 focus:ring-green-500/20"
                          : "border-border focus:border-primary focus:ring-primary/20"
                      )}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password === formData.confirmPassword && (
                    <div className="flex items-center gap-1 text-green-500 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      Passwords match
                    </div>
                  )}
                  {errors.confirmPassword && (
                    <div className="flex items-center gap-1 text-destructive text-sm">
                      <AlertCircle className="w-4 h-4" />
                      {errors.confirmPassword}
                    </div>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:scale-100" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {/* Google Auth Section - Commented out until setup is complete */}
              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <Button 
                type="button"
                variant="outline"
                onClick={handleGoogleSignup}
                className="w-full h-12 border-2 border-border hover:border-primary transition-all duration-200"
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </Button> */}

              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-foreground">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="underline hover:text-foreground">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Personalization Overlay */}
      <PersonalizationOverlay
        isOpen={showPersonalization}
        onClose={() => setShowPersonalization(false)}
        onComplete={handlePersonalizationComplete}
      />
    </div>
  );
}
