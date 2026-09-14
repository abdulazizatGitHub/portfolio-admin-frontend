'use client';

import { useRouter } from 'next/navigation';
import { SocialLinkForm } from '@/components/sections/Contact/SocialLinkForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useCreateSocialLink } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import type { SocialLink } from '@/types';

export default function AddSocialLinkPage() {
  const router = useRouter();
  const createSocialLink = useCreateSocialLink();
  const { error: showError } = useToast();

  const handleSubmit = async (data: SocialLink) => {
    try {
      await createSocialLink.mutateAsync(data);
      router.push('/admin/contact');
    } catch (err) {
      showError('Failed to create social link');
    }
  };

  const handleCancel = () => {
    router.push('/admin/contact');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Social Link</h1>
        <p className="mt-2 text-gray-600">Add a new social media link</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Social Link Information</h2>
        </CardHeader>
        <CardBody>
          <SocialLinkForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardBody>
      </Card>
    </div>
  );
}
