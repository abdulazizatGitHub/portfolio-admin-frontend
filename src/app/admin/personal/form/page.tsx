'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PersonalForm } from '@/components/sections/Personal/PersonalForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import { fetchPersonalProfiles } from '@/lib/data/mockData';
import type { PersonalProfile } from '@/types';

function PersonalFormContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const isEdit = !!id;

    const { success, error: showError } = useToast();

    const [initialData, setInitialData] = useState<PersonalProfile | undefined>(undefined);
    const [isFetching, setIsFetching] = useState(isEdit);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isEdit && id) {
            loadProfile(Number(id));
        }
    }, [id, isEdit]);

    const loadProfile = async (profileId: number) => {
        setIsFetching(true);
        try {
            const data = await fetchPersonalProfiles();
            const profile = data.find((p) => p.id === profileId);
            if (profile) {
                setInitialData(profile);
            } else {
                showError('Profile not found');
                router.push('/admin/personal');
            }
        } catch (err) {
            showError('Failed to load profile data');
            router.push('/admin/personal');
        } finally {
            setIsFetching(false);
        }
    };

    const handleSubmit = async (formData: PersonalProfile) => {
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000));
            console.log(isEdit ? 'Updating profile:' : 'Creating profile:', formData);

            success(isEdit ? 'Profile updated successfully' : 'Profile created successfully');
            router.push('/admin/personal');
        } catch (err) {
            showError(`Failed to ${isEdit ? 'update' : 'create'} profile. Please try again.`);
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/admin/personal');
    };

    if (isFetching) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PageHeader
                title={isEdit ? 'Edit Personal Profile' : 'New Personal Profile'}
                description={isEdit ? 'Update your professional identity details' : 'Create a new profile for a specific professional context'}
                breadcrumbs={[
                    { label: 'Dashboard', href: '/admin' },
                    { label: 'Personal', href: '/admin/personal' },
                    { label: isEdit ? 'Edit Profile' : 'New Profile' },
                ]}
            />

            <div className="flex justify-center pb-20">
                <div className="w-full max-w-[1000px]">
                    <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-3xl p-8 md:p-12 shadow-sm">
                        <PersonalForm
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

export default function PersonalFormPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner size="lg" />
            </div>
        }>
            <PersonalFormContent />
        </Suspense>
    );
}
