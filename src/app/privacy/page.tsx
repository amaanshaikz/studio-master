'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Mail, MapPin, Globe, Calendar, Users, Database, Lock, Eye, Trash2, FileText } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="p-3 rounded-full bg-primary/20 border border-primary/30">
                <Shield className="h-8 w-8 text-primary" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Privacy Policy
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
                AceNexus ("we," "us," or "our") respects your privacy. This Privacy Policy outlines how we collect, use, and protect your information when you use our AI platform, CreateX AI, or interact with our services — including via third-party platforms like Facebook, Instagram, and LinkedIn.
              </p>
            </CardContent>
          </Card>

          {/* Who We Are */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                1. Who We Are
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-primary border-primary">Company Name</Badge>
                    <span className="text-gray-300">AceNexus</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-primary mt-1" />
                    <span className="text-gray-300 text-sm">
                      Survey No: 62/1A, Bahadurpally, Jeedimetla, Hyderabad, Telangana 500043, India
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-gray-300">acenexusagency@gmail.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-primary" />
                    <span className="text-gray-300">https://createxai.in</span>
                  </div>
                </div>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                CreateX AI is a content generation platform powered by AI, designed for creators, and may interact with social media platforms like Meta (Facebook, Instagram) and LinkedIn to enhance personalization and platform utility.
              </p>
            </CardContent>
          </Card>

          {/* Data We Collect */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                2. Data We Collect
              </CardTitle>
              <CardDescription className="text-gray-400">
                Depending on how you use CreateX AI, we may collect:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-white mb-2">a. Personal Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    <li>Name, email address, profile photo</li>
                    <li>Login identifiers from social platforms (e.g., Facebook, Instagram, LinkedIn)</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">b. Public Social Media and Professional Data</h4>
                  <p className="text-gray-300 text-sm mb-2">Only if you explicitly authorize access:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    <li>From Meta (Instagram/Facebook): Username, bio, followers, media</li>
                    <li>From LinkedIn: Public profile URL, headline, job title, connections count, and profile picture</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">c. Usage Data</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    <li>Interaction logs with AI tools and dashboard</li>
                    <li>Session activity and click patterns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">d. Optional Inputs</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                    <li>Any manually submitted data such as social media handles, bio, niche preferences, etc.</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Why We Collect Your Data */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                3. Why We Collect Your Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">We use your data to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Deliver personalized AI-generated content and strategy suggestions</li>
                <li>Authenticate and authorize user access through third-party providers</li>
                <li>Improve platform features, UX, and performance</li>
                <li>Communicate support, updates, or partnership/internship opportunities</li>
                <li>Comply with Meta and LinkedIn API and data usage policies</li>
              </ul>
            </CardContent>
          </Card>

          {/* Third-Party Integrations */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                4. Third-Party Integrations and Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                We do not sell your data. We only share your data securely with the following service providers, essential for platform functionality:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">Supabase</Badge>
                  <span className="text-gray-300 text-sm">Database, secure storage, and analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-green-400 border-green-400">NextAuth.js</Badge>
                  <span className="text-gray-300 text-sm">Secure authentication and session management</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-purple-400 border-purple-400">Gemini AI</Badge>
                  <span className="text-gray-300 text-sm">Content generation</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-pink-400 border-pink-400">Meta Platforms</Badge>
                  <span className="text-gray-300 text-sm">Social login and public Instagram/Facebook profile data</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400">LinkedIn</Badge>
                  <span className="text-gray-300 text-sm">Social login and public profile access</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-400 border-gray-400">GitHub</Badge>
                  <span className="text-gray-300 text-sm">Developer collaboration (if necessary)</span>
                </div>
              </div>
              <p className="text-gray-300 text-sm">
                All partners comply with strict data protection and security standards.
              </p>
            </CardContent>
          </Card>

          {/* Cookies and Analytics */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                5. Cookies and Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                We may use browser cookies and third-party analytics tools (e.g., Google Analytics, Supabase logs) to understand user behavior and improve experience. These cookies do not collect sensitive personal data.
              </p>
            </CardContent>
          </Card>

          {/* User Data Deletion */}
          <Card id="data-deletion" className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-primary" />
                6. User Data Deletion
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                If you wish to delete your data from CreateX AI:
              </p>
              <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
                <h5 className="font-semibold text-white mb-2">How to Request Deletion:</h5>
                <p className="text-gray-300 text-sm mb-3">Send an email to: <span className="text-primary">acenexusagency@gmail.com</span></p>
                <p className="text-gray-300 text-sm mb-3">Subject Line: "Data Deletion Request"</p>
                <p className="text-gray-300 text-sm mb-3">Include the following:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                  <li>Full Name</li>
                  <li>Email address used on our platform</li>
                  <li>Any linked social media accounts (e.g., Instagram handle, LinkedIn profile URL)</li>
                  <li>A confirmation that you want all associated data deleted</li>
                </ul>
              </div>
              <p className="text-gray-300 text-sm">
                We will process your request within 7 business days and confirm via email once your data has been permanently removed from our systems.
              </p>
              <p className="text-gray-300 text-sm">
                <strong>Note:</strong> This will revoke access to any personalized content or features associated with your account.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                7. Your Rights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">You have the right to:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>Request access, correction, or deletion of your personal data</li>
                <li>Withdraw consent at any time</li>
                <li>Contact us regarding your data at <span className="text-primary">acenexusagency@gmail.com</span></li>
              </ul>
            </CardContent>
          </Card>

          {/* Children's Privacy */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                8. Children's Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                CreateX AI is not intended for individuals under 18 years of age. We do not knowingly collect or store information from minors.
              </p>
            </CardContent>
          </Card>

          {/* Security Measures */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                9. Security Measures
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-3">We implement industry-grade security, including:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-300 text-sm">
                <li>HTTPS encryption</li>
                <li>API-level access control</li>
                <li>Token-based authentication</li>
                <li>Row-Level Security in Supabase</li>
                <li>Rate limiting and firewall protection</li>
              </ul>
            </CardContent>
          </Card>

          {/* Policy Updates */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                10. Policy Updates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                We may revise this Privacy Policy as needed. Updates will be posted on: <span className="text-primary">🔗 https://createxai.in/privacy</span> Your continued use of the platform implies acceptance of the revised policy.
              </p>
            </CardContent>
          </Card>

          {/* Governing Law */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                11. Governing Law
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                This Privacy Policy is governed by the laws of India.
              </p>
            </CardContent>
          </Card>

          {/* Platform-Specific Notices */}
          <Card className="bg-black/50 backdrop-blur-sm border border-gray-800/50">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-white flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                12. Platform-Specific Notices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-white mb-2">Meta (Facebook/Instagram)</h4>
                <p className="text-gray-300 text-sm">
                  We comply with Meta's Platform Terms, Developer Policies, and Data Deletion Requirements. Data accessed from Meta APIs is strictly limited to user-authorized scopes.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-white mb-2">LinkedIn</h4>
                <p className="text-gray-300 text-sm">
                  We comply with LinkedIn Marketing Developer Platform Guidelines and LinkedIn API Terms of Use. Any data retrieved from LinkedIn APIs is used strictly within the permissions granted and is never sold or redistributed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 