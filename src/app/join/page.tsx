
'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { joinFormSchema, type JoinFormInput } from '@/lib/schemas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { handleJoinRequest } from '@/app/actions/joinActions';
import { Loader2, CheckCircle } from 'lucide-react';

export default function JoinPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<JoinFormInput>({
    resolver: zodResolver(joinFormSchema),
    defaultValues: {
      name: '',
      email: '',
      reason: '',
    },
  });

  const onSubmit = async (data: JoinFormInput) => {
    setIsLoading(true);
    const result = await handleJoinRequest(data);
    setIsLoading(false);

    if (result.error) {
      toast({
        variant: 'destructive',
        title: 'Error submitting application',
        description: result.error,
      });
    } else {
      setIsSubmitted(true);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Join Our Community</CardTitle>
          <CardDescription>Apply to become part of the AceNexus creator community.</CardDescription>
        </CardHeader>
        <CardContent>
          {isSubmitted ? (
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Application Received!</h3>
              <p className="text-muted-foreground">Thank you for your interest. We've received your application and will be in touch soon.</p>
            </div>
          ) : (
            <FormProvider {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your.email@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Why do you want to join?</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a bit about yourself and what you're looking for in a community..."
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Application'
                  )}
                </Button>
              </form>
            </FormProvider>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
