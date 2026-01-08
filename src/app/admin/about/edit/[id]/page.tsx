'use client';

import { useRouter, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AboutSection } from '@/types';
import { AboutSectionForm } from '@/components/sections/About/AboutSectionForm';
import { useToast } from '@/lib/hooks/useToast';
import { fetchAboutSections } from '@/lib/data/mockData';

export default function EditAboutSectionPage() {
  const router = useRouter();
  const params = useParams();
  const { success, error: showError } = useToast();
  const [section, setSection] = useState<AboutSection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSection, setIsLoadingSection] = useState(true);

  const sectionId = params?.id ? parseInt(params.id as string) : null;

  useEffect(() => {
    loadSection();
  }, [sectionId]);

  const loadSection = async () => {
    if (!sectionId) {
      showError('Invalid section ID');
      router.push('/admin/about');
      return;
    }

    setIsLoadingSection(true);
    try {
      const sections = await fetchAboutSections();
      const foundSection = sections.find((s) => s.id === sectionId);

      if (!foundSection) {
        showError('Section not found');
        router.push('/admin/about');
        return;
      }

      setSection(foundSection);
    } catch (err) {
      showError('Failed to load section');
      router.push('/admin/about');
    } finally {
      setIsLoadingSection(false);
    }
  };

  const handleSave = async (sectionData: Partial<AboutSection>) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, this would make an API call to update the section
      console.log('Updating section:', sectionId, sectionData);

      success('Section updated successfully');
      router.push('/admin/about');
    } catch (err) {
      showError('Failed to update section');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSection) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading section...</p>
        </div>
      </div>
    );
  }

  return <AboutSectionForm section={section} onSave={handleSave} isLoading={isLoading} />;
}


