'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useContactInfo, useSocialLinks } from '@/lib/hooks';
import { ContactInfoList } from '@/components/sections/Contact/ContactInfoList';
import { SocialLinksList } from '@/components/sections/Contact/SocialLinksList';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { useToast } from '@/lib/hooks/useToast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { ContactInfoItem, SocialLink } from '@/types';

export default function ContactPage() {
  const router = useRouter();
  const { data: initialContactInfo, isLoading: contactLoading, error: contactError } = useContactInfo();
  const { data: initialSocialLinks, isLoading: socialLoading, error: socialError } = useSocialLinks();
  const { success, error: showError } = useToast();
  
  const [contactInfo, setContactInfo] = useState<ContactInfoItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'contact' | 'social'; id: number } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (initialContactInfo) {
      setContactInfo(initialContactInfo);
    }
    if (initialSocialLinks) {
      setSocialLinks(initialSocialLinks);
    }
  }, [initialContactInfo, initialSocialLinks]);

  const handleEditContact = (item: ContactInfoItem) => {
    router.push(`/admin/contact/info/edit/${item.id}`);
  };

  const handleDeleteContact = (id: number) => {
    setItemToDelete({ type: 'contact', id });
    setDeleteModalOpen(true);
  };

  const handleEditSocial = (link: SocialLink) => {
    router.push(`/admin/contact/social/edit/${link.id}`);
  };

  const handleDeleteSocial = (id: number) => {
    setItemToDelete({ type: 'social', id });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;
    
    setIsDeleting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      if (itemToDelete.type === 'contact') {
        setContactInfo(contactInfo.filter((c) => c.id !== itemToDelete.id));
        success('Contact info deleted successfully');
      } else {
        setSocialLinks(socialLinks.filter((s) => s.id !== itemToDelete.id));
        success('Social link deleted successfully');
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete item');
    } finally {
      setIsDeleting(false);
    }
  };

  const isLoading = contactLoading || socialLoading;
  const error = contactError || socialError;

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <Card>
          <div className="p-6">
            <div className="text-[var(--danger)] mb-4">Error loading contact information</div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-[var(--accent-primary)] hover:text-[var(--accent-hover)] cursor-pointer"
            >
              Try again
            </button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Contact Management"
        description="Manage your contact information and social media links"
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Contact' },
        ]}
      />

      <div className="space-y-6">
        <Card>
          <div className="p-6">
            {contactLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <ContactInfoList
                data={contactInfo}
                onEdit={handleEditContact}
                onDelete={handleDeleteContact}
                isLoading={contactLoading}
              />
            )}
          </div>
        </Card>

        <Card>
          <div className="p-6">
            {socialLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : (
              <SocialLinksList
                data={socialLinks}
                onEdit={handleEditSocial}
                onDelete={handleDeleteSocial}
                isLoading={socialLoading}
              />
            )}
          </div>
        </Card>
      </div>

      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={itemToDelete?.type === 'contact' ? 'Delete Contact Info' : 'Delete Social Link'}
        message={`Are you sure you want to delete this ${itemToDelete?.type === 'contact' ? 'contact info' : 'social link'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </>
  );
}
