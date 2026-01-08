'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { PersonalProfile } from '@/types';
import { PersonalProfileForm } from '@/components/sections/Personal/PersonalProfileForm';
import { useToast } from '@/lib/hooks/useToast';
import { fetchPersonalProfiles } from '@/lib/data/mockData';

export default function EditPersonalProfilePage() {
  const router = useRouter();
  const params = useParams();
  const { success, error: showError } = useToast();
  const [profile, setProfile] = useState<PersonalProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const profileId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    if (!profileId) {
      showError('Invalid profile ID');
      router.push('/admin/personal');
      return;
    }

    setIsLoadingProfile(true);
    try {
      const profiles = await fetchPersonalProfiles();
      const foundProfile = profiles.find((p) => p.id === profileId);

      if (!foundProfile) {
        showError('Profile not found');
        router.push('/admin/personal');
        return;
      }

      setProfile(foundProfile);
    } catch (err) {
      showError('Failed to load profile');
      router.push('/admin/personal');
    } finally {
      setIsLoadingProfile(false);
    }
  };

  const handleSave = async (profileData: Partial<PersonalProfile>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would make an API call to update the profile
      console.log('Updating profile:', profileId, profileData);

      success('Profile updated successfully');
      router.push('/admin/personal');
    } catch (err) {
      showError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  return <PersonalProfileForm profile={profile} onSave={handleSave} isLoading={isLoading} />;
}


