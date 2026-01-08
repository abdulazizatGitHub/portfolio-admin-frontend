'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AddProjectPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main projects page
    // The create modal can be opened from there
    router.replace('/admin/projects');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p className="text-text-secondary">Redirecting...</p>
      </div>
    </div>
  );
}
