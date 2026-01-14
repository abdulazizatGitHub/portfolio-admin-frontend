'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAboutContent } from '@/lib/hooks';
import { AboutForm } from '@/components/sections/About/AboutForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { AboutSection } from '@/types';

export default function AboutFormPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;

    const { data, isLoading: isFetching } = useAboutContent();
    const { success, error: showError } = useToast();

    const [initialData, setInitialData] = useState<AboutSection | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEdit && data && id) {
            // Handle both array and single object from the hook
            const sectionsArray = Array.isArray(data) ? data : [data];
            const section = sectionsArray.find((s) => s.id === Number(id));
            if (section) {
                setInitialData(section);
            } else {
                showError('About section not found');
                router.push('/admin/about');
            }
        }
    }, [data, id, isEdit, showError, router]);

    const handleSubmit = async (formData: AboutSection) => {
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(isEdit ? 'Updating about section:' : 'Creating about section:', formData);
            success(isEdit ? 'About section updated successfully' : 'About section created successfully');
            router.push('/admin/about');
        } catch (err) {
            showError(`Failed to ${isEdit ? 'update' : 'create'} about section. Please try again.`);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/about');
    };

    // Show loading while fetching data for edit
    if (isEdit && isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    // Wait for initial data in edit mode
    if (isEdit && !initialData) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <PageHeader
                title={isEdit ? 'Edit About Section' : 'Add About Section'}
                description={isEdit ? 'Update your about section details' : 'Create a new about section to showcase your professional identity'}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'About', href: '/admin/about' },
                    { label: isEdit ? 'Edit Section' : 'Add Section' },
                ]}
            />

            {/* Centered Form Container */}
            <div className="flex justify-center">
                <div className="w-full max-w-[1000px]">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl p-8 shadow-sm">
                        <AboutForm
                            initialData={initialData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
