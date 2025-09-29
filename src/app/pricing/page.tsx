'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, Star, Zap, Crown, Sparkles, ArrowRight, Users, BarChart3, Calendar, Mic, Globe, TrendingUp } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Freemium',
      description: 'Perfect for getting started',
      price: 'Free',
      period: '',
      icon: Users,
      color: 'from-gray-600 to-gray-700',
      borderColor: 'border-gray-700',
      buttonText: 'Start Free',
      buttonVariant: 'outline' as const,
      features: [
        'Limited personalization access',
        'Up to 10 queries/day on CreateX AI',
        '3 engagement predictions/week',
        'Basic access to insights',
        'Community support'
      ],
      popular: false
    },
    {
      name: 'Premium',
      description: 'For growing creators',
      price: isAnnual ? '$4' : '$5',
      period: '/month',
      icon: Zap,
      color: 'from-primary to-accent',
      borderColor: 'border-primary/50',
      buttonText: 'Upgrade',
      buttonVariant: 'default' as const,
      features: [
        'Full personalization access',
        'Unlimited CreateX AI queries',
        'Up to 30 engagement predictions/month',
        'Priority insights',
        'Email support',
        'Advanced analytics'
      ],
      popular: false
    },
    {
      name: 'Premium Pro',
      description: 'Complete creator toolkit',
      price: isAnnual ? '$16' : '$20',
      period: '/month',
      icon: Crown,
      color: 'from-yellow-500 to-orange-500',
      borderColor: 'border-yellow-500/50',
      buttonText: 'Go Pro',
      buttonVariant: 'default' as const,
      features: [
        'Full personalization access',
        'Unlimited CreateX AI queries',
        'Unlimited engagement predictions',
        'Creator Studio Access',
        'AI reel edits',
        'AI voiceovers',
        'Translations',
        'Trend intelligence & alerts',
        'Creator calendar',
        'Priority support'
      ],
      popular: true,
      studioFeatures: [
        { icon: Mic, text: 'AI Voiceovers' },
        { icon: Globe, text: 'Translations' },
        { icon: TrendingUp, text: 'Trend Intelligence' },
        { icon: Calendar, text: 'Creator Calendar' }
      ]
    }
  ];

  const handlePlanSelect = (planName: string) => {
    if (!session) {
      router.push('/signup');
      return;
    }

    // Handle plan selection logic here
    switch (planName) {
      case 'Freemium':
        router.push('/account');
        break;
      case 'Premium':
        // Redirect to payment for Premium
        console.log('Redirect to Premium payment');
        break;
      case 'Premium Pro':
        // Redirect to payment for Premium Pro
        console.log('Redirect to Premium Pro payment');
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 relative overflow-hidden">
      {/* Starry Background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute top-40 right-20 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/4 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse delay-2000"></div>
        <div className="absolute top-80 right-1/3 w-1 h-1 bg-white rounded-full opacity-30 animate-pulse delay-3000"></div>
        <div className="absolute top-32 left-3/4 w-1 h-1 bg-white rounded-full opacity-70 animate-pulse delay-500"></div>
        <div className="absolute top-96 left-1/2 w-1 h-1 bg-white rounded-full opacity-40 animate-pulse delay-1500"></div>
        <div className="absolute top-48 right-10 w-1 h-1 bg-white rounded-full opacity-60 animate-pulse delay-2500"></div>
        <div className="absolute top-72 left-10 w-1 h-1 bg-white rounded-full opacity-50 animate-pulse delay-3500"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-8 sm:py-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-primary to-accent">
              <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 px-2">
            Choose Your <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Creator Plan</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
            Unlock the full potential of AI-powered content creation with plans designed for every creator
          </p>
          
          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className={`text-sm ${!isAnnual ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
            <button
              onClick={() => setIsAnnual(!isAnnual)}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-transparent"
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  isAnnual ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`text-sm ${isAnnual ? 'text-white' : 'text-gray-400'}`}>Annual</span>
            {isAnnual && (
              <Badge variant="secondary" className="bg-green-900/50 text-green-300 border-green-700/50">
                Save 20%
              </Badge>
            )}
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const IconComponent = plan.icon;
            return (
              <Card
                key={plan.name}
                className={`relative border-2 ${
                  plan.popular
                    ? 'border-yellow-500/50 bg-gradient-to-b from-yellow-500/5 to-transparent scale-105 shadow-2xl'
                    : plan.borderColor
                } bg-gray-900/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4 sm:pb-6 px-4 sm:px-6">
                  <div className="flex justify-center mb-3 sm:mb-4">
                    <div className={`p-2 sm:p-3 rounded-full bg-gradient-to-r ${plan.color}`}>
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                    </div>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-white">{plan.name}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm sm:text-base">{plan.description}</CardDescription>
                  <div className="mt-3 sm:mt-4">
                    <span className="text-3xl sm:text-4xl font-bold text-white">{plan.price}</span>
                    <span className="text-gray-400 text-sm sm:text-base">{plan.period}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  {/* Features List */}
                  <div className="space-y-2 sm:space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-2 sm:gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300 text-xs sm:text-sm leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Creator Studio Features for Premium Pro */}
                  {plan.studioFeatures && (
                    <div className="border-t border-gray-700 pt-3 sm:pt-4">
                      <h4 className="text-white font-semibold mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                        <BarChart3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        Creator Studio
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 sm:gap-2">
                        {plan.studioFeatures.map((feature, featureIndex) => {
                          const FeatureIcon = feature.icon;
                          return (
                            <div key={featureIndex} className="flex items-center gap-1 sm:gap-2 text-xs text-gray-300">
                              <FeatureIcon className="w-3 h-3 text-primary flex-shrink-0" />
                              <span className="leading-relaxed">{feature.text}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    onClick={() => handlePlanSelect(plan.name)}
                    variant={plan.buttonVariant}
                    className={`w-full h-10 sm:h-12 text-sm sm:text-base ${
                      plan.popular
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white border-0'
                        : plan.buttonVariant === 'outline'
                        ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white'
                        : 'bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white border-0'
                    } font-semibold`}
                  >
                    {plan.buttonText}
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 sm:mt-24 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 px-4">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto px-4">
            <div className="text-left">
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Can I change plans anytime?</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">What payment methods do you accept?</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">We accept all major credit cards, PayPal, and other secure payment methods.</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Is there a free trial?</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Yes! Start with our Freemium plan and upgrade when you're ready for more features.</p>
            </div>
            <div className="text-left">
              <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Can I cancel anytime?</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">Absolutely. Cancel your subscription anytime with no cancellation fees or penalties.</p>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 sm:mt-16 text-center px-4">
          <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base">Ready to transform your content creation?</p>
          <Button
            onClick={() => router.push('/signup')}
            className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg font-semibold"
          >
            Get Started Free
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
