'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, CheckCircle, Shield, Users, Database, Globe, AlertTriangle, Lock, Mail, Calendar, Settings, Gavel } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary/20 border border-primary/30">
                <FileText className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Terms of Service
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Effective Date: July 21, 2025</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Last Updated: July 29, 2025</span>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardContent className="p-6">
              <p className="text-gray-300 leading-relaxed">
                Welcome to CreateX AI, a service operated by AceNexus. By accessing our website, platform, or services — including integrations with Instagram, Facebook, and LinkedIn — you agree to the following Terms of Service.
              </p>
            </CardContent>
          </Card>

          {/* Acceptance of Terms */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                By using CreateX AI, you confirm that you agree to these Terms. If you do not accept these Terms, please discontinue use of the platform.
              </p>
            </CardContent>
          </Card>

          {/* Services Overview */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                2. Services Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                CreateX AI offers AI-driven tools to content creators, influencers, and professionals. Services may include:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>AI-powered content creation</li>
                <li>Internship and creator opportunities</li>
                <li>Dashboard analytics and personalized insights</li>
                <li>Social media profile integration (Meta & LinkedIn)</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Conduct */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                3. User Conduct
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Provide accurate and truthful information</li>
                <li>Use the platform responsibly and lawfully</li>
                <li>Not misuse, interfere with, or reverse-engineer platform functionality</li>
                <li>Comply with Meta and LinkedIn's respective Platform Policies</li>
                <li>Avoid sharing login credentials or unauthorized access</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Accounts */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                4. User Accounts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Accounts may be created using standard login or via Instagram/Facebook/LinkedIn OAuth login (handled by NextAuth). You are responsible for keeping your login credentials secure.
              </p>
              <p className="text-gray-300">
                We store user session and profile data securely in Supabase. For more information, review our <span className="text-primary hover:underline cursor-pointer">Privacy Policy</span>.
              </p>
            </CardContent>
          </Card>

          {/* Suspension and Termination */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                5. Suspension and Termination
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">
                AceNexus may suspend or terminate your access without notice if you:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Violate these Terms or applicable platform policies</li>
                <li>Abuse the platform (e.g., spamming, scraping, API misuse)</li>
                <li>Infringe on copyrights or intellectual property</li>
                <li>Harm the service, its users, or reputation</li>
              </ul>
            </CardContent>
          </Card>

          {/* Ownership & Intellectual Property */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                6. Ownership & Intellectual Property
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                All content, tools, algorithms, designs, and platform functionality are the intellectual property of AceNexus.
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>You retain rights to your inputs</li>
                <li>You may use AI-generated outputs for personal or commercial use</li>
                <li>You may not resell, clone, or rebrand platform tools or outputs without express written permission</li>
              </ul>
            </CardContent>
          </Card>

          {/* Third-Party Services & Integrations */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                7. Third-Party Services & Integrations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                CreateX AI uses the following services under respective terms and licenses:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">Supabase</Badge>
                  <span className="text-gray-300 text-sm">Data storage, auth, and file storage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400">NextAuth.js</Badge>
                  <span className="text-gray-300 text-sm">Authentication and session management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400">Gemini AI</Badge>
                  <span className="text-gray-300 text-sm">AI content generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-pink-400 border-pink-400">Meta</Badge>
                  <span className="text-gray-300 text-sm">Profile access (with permission)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">LinkedIn API</Badge>
                  <span className="text-gray-300 text-sm">Public profile access (with permission)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-400 border-gray-400">GitHub</Badge>
                  <span className="text-gray-300 text-sm">Development and code version control</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                We are not liable for any interruptions caused by third-party service outages.
              </p>
            </CardContent>
          </Card>

          {/* Disclaimers */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                8. Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>AI-generated content is provided "as-is" without any warranties</li>
                <li>You are solely responsible for how you use the content</li>
                <li>We do not guarantee accuracy, legality, or outcomes based on platform use</li>
              </ul>
            </CardContent>
          </Card>

          {/* Changes to Terms */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                9. Changes to Terms
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                We may update these Terms at any time. The latest version will be published at: <span className="text-primary">https://createxai.in/terms</span> Continued use of the platform constitutes acceptance of any changes.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Gavel className="h-5 w-5 text-primary" />
                10. Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                These Terms are governed by the laws of India, without regard to conflicts of law principles.
              </p>
            </CardContent>
          </Card>

          {/* Contact Us */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                11. Contact Us
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">For questions or concerns, contact:</p>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-primary border-primary">AceNexus</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-primary" />
                  <span className="text-gray-300">Email: <span className="text-primary">acenexusagency@gmail.com</span></span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 