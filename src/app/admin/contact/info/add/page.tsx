'use client';

import { useRouter } from 'next/navigation';
import { ContactInfoForm } from '@/components/sections/Contact/ContactInfoForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { useCreateContactInfo } from '@/lib/hooks';
import { useToast } from '@/lib/hooks/useToast';
import type { ContactInfoItem } from '@/types';

export default function AddContactInfoPage() {
  const router = useRouter();
  const createContactInfo = useCreateContactInfo();
  const { error: showError } = useToast();

  const handleSubmit = async (data: ContactInfoItem) => {
    try {
      await createContactInfo.mutateAsync(data);
      router.push('/admin/contact');
    } catch (err) {
      showError('Failed to create contact info');
    }
  };

  const handleCancel = () => {
    router.push('/admin/contact');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Contact Information</h1>
        <p className="mt-2 text-gray-600">Add a new contact information entry</p>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Contact Information</h2>
        </CardHeader>
        <CardBody>
          <ContactInfoForm onSubmit={handleSubmit} onCancel={handleCancel} />
        </CardBody>
      </Card>
    </div>
  );
}
