'use client';

import { useRouter } from 'next/navigation';
import { SocialLinkForm } from '@/components/sections/Contact/SocialLinkForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { SocialLink } from '@/types';

export default function AddSocialLinkPage() {
  const router = useRouter();

  const handleSubmit = async (data: SocialLink) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Creating social link:', data);
    router.push('/admin/contact');
  };

  const handleCancel = () => {
    router.push('/admin/contact');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Social Link</h1>
        <p className="mt-2 text-gray-600">
          Add a new social media link
        </p>
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


