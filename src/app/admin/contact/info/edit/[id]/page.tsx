'use client';

import { useRouter, useParams } from 'next/navigation';
import { useContactInfo } from '@/lib/hooks';
import { ContactInfoForm } from '@/components/sections/Contact/ContactInfoForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { ContactInfoItem } from '@/types';

export default function EditContactInfoPage() {
  const router = useRouter();
  const params = useParams();
  const { data } = useContactInfo();
  const contactInfo = data?.find((c) => c.id === Number(params.id));

  const handleSubmit = async (data: ContactInfoItem) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Updating contact info:', data);
    router.push('/admin/contact');
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
        <p className="mt-2 text-gray-600">
          Update contact information
        </p>
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


