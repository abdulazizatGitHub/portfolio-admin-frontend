'use client';

import { useRouter, useParams } from 'next/navigation';
import { useContactInfo, useUpdateContactInfo } from '@/lib/hooks';
import { ContactInfoForm } from '@/components/sections/Contact/ContactInfoForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useToast } from '@/lib/hooks/useToast';
import type { ContactInfoItem } from '@/types';

export default function EditContactInfoPage() {
  const router = useRouter();
  const params = useParams();
  const { data } = useContactInfo();
  const updateContactInfo = useUpdateContactInfo();
  const { error: showError } = useToast();
  const contactInfo = data?.find((c) => c.id === params.id);

  const handleSubmit = async (data: ContactInfoItem) => {
    if (!contactInfo?.id) return;
    try {
      await updateContactInfo.mutateAsync({ id: contactInfo.id, data });
      router.push('/admin/contact');
    } catch (err) {
      showError('Failed to update contact info');
    }
  };

  const handleCancel = () => {
    router.push('/admin/contact');
  };

  if (!contactInfo) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <div className="p-6 text-gray-600">Contact information not found</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Edit Contact Information</h1>
        <p className="mt-2 text-gray-600">Update contact information</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Contact Information</h2>
        </CardHeader>
        <CardBody>
          <ContactInfoForm
            initialData={contactInfo}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
          />
        </CardBody>
      </Card>
    </div>
  );
}
