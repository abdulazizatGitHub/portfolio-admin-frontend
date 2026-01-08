'use client';

import { useRouter, useParams } from 'next/navigation';
import { useSocialLinks } from '@/lib/hooks';
import { SocialLinkForm } from '@/components/sections/Contact/SocialLinkForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { SocialLink } from '@/types';

export default function EditSocialLinkPage() {
  const router = useRouter();
  const params = useParams();
  const { data } = useSocialLinks();
  const socialLink = data?.find((s) => s.id === Number(params.id));

  const handleSubmit = async (data: SocialLink) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Updating social link:', data);
    router.push('/admin/contact');
  };

  const handleCancel = () => {
    router.push('/admin/contact');
  };

  if (!socialLink) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <div className="p-6 text-gray-600">Social link not found</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Social Link</h1>
        <p className="mt-2 text-gray-600">
          Update social link information
        </p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Social Link Information</h2>
        </CardHeader>
        <CardBody>
          <SocialLinkForm
            initialData={socialLink}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardBody>
      </Card>
    </div>
  );
}


