'use client';

import { useRouter } from 'next/navigation';
import { AboutSection } from '@/types';
import { AboutSectionForm } from '@/components/sections/About/AboutSectionForm';
import { useToast } from '@/lib/hooks/useToast';
import { useState } from 'react';

export default function NewAboutSectionPage() {
  const router = useRouter();
  const { success, error: showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (sectionData: Partial<AboutSection>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would make an API call to create the section
      console.log('Creating new section:', sectionData);

      success('Section created successfully');
      router.push('/admin/about');
    } catch (err) {
      showError('Failed to create section');
    } finally {
      setIsLoading(false);
    }
  };

  return <AboutSectionForm onSave={handleSave} isLoading={isLoading} />;
}


