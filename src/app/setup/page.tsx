'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SetupWizard from '@/components/setup/SetupWizard';
import IndividualSetupWizard from '@/components/setup/IndividualSetupWizard';
import PersonalizationOverlay from '@/components/auth/PersonalizationOverlay';

export default function SetupPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPersonalization, setShowPersonalization] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserRole();
    }
  }, [session, status]);

  const fetchUserRole = async () => {
    try {
      const response = await fetch('/api/user/role');
      if (response.ok) {
        const data = await response.json();
        setUserRole(data.user.role);
      } else {
        // If no role is set, show personalization overlay
        setShowPersonalization(true);
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setShowPersonalization(true);
    } finally {
      setLoading(false);
    }
  };

  const handlePersonalizationComplete = (role: string) => {
    setShowPersonalization(false);
    setUserRole(role);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no role is set, show personalization overlay
  if (!userRole) {
    return (
      <PersonalizationOverlay
        isOpen={true}
        onClose={() => router.push('/account')}
        onComplete={handlePersonalizationComplete}
      />
    );
  }

  // Render appropriate setup wizard based on role
  if (userRole === 'creator') {
    return <SetupWizard />;
  } else if (userRole === 'individual') {
    return <IndividualSetupWizard />;
  }

  // Fallback - should not reach here
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-white">Invalid role. Please contact support.</div>
    </div>
  );
}
