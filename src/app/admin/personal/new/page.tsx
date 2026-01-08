'use client';

import { useRouter } from 'next/navigation';
import { PersonalProfile } from '@/types';
import { PersonalProfileForm } from '@/components/sections/Personal/PersonalProfileForm';
import { useToast } from '@/lib/hooks/useToast';
import { useState } from 'react';

export default function NewPersonalProfilePage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (profileData: Partial<PersonalProfile>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would make an API call to create the profile
      console.log('Creating new profile:', profileData);

      success('Profile created successfully');
      router.push('/admin/personal');
    } catch (err) {
      showError('Failed to create profile');
    } finally {
      setIsLoading(false);
    }
  };

  return <PersonalProfileForm onSave={handleSave} isLoading={isLoading} />;
}


