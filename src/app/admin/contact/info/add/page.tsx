'use client';

import { useRouter } from 'next/navigation';
import { ContactInfoForm } from '@/components/sections/Contact/ContactInfoForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import type { ContactInfoItem } from '@/types';

export default function AddContactInfoPage() {
  const router = useRouter();

  const handleSubmit = async (data: ContactInfoItem) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Creating contact info:', data);
    router.push('/admin/contact');
  };

  const handleCancel = () => {
    router.push('/admin/contact');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Add Contact Information</h1>
        <p className="mt-2 text-gray-600">
          Add a new contact information entry
        </p>
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


