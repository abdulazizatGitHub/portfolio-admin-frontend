'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mail, Share2, FileText } from 'lucide-react';
import {
  useContactInfo,
  useSocialLinks,
  useDeleteContactInfo,
  useDeleteSocialLink,
} from '@/lib/hooks';
import { ContactInfoCard } from '@/components/sections/Contact/ContactInfoCard';
import { SocialLinkCard } from '@/components/sections/Contact/SocialLinkCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { ContactInfoItem, SocialLink } from '@/types';

export default function ContactPage() {
  const router = useRouter();
  const { data: contactInfo = [], isLoading: contactLoading } = useContactInfo();
  const { data: socialLinks = [], isLoading: socialLoading } = useSocialLinks();
  const { success, error: showError } = useToast();
  const deleteContactInfo = useDeleteContactInfo();
  const deleteSocialLink = useDeleteSocialLink();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    type: 'contact' | 'social';
    id: string;
    name: string;
  } | null>(null);
  const isDeleting = deleteContactInfo.isPending || deleteSocialLink.isPending;

  const handleEditContact = (item: ContactInfoItem) => {
    router.push(`/admin/contact/info/edit/${item.id}`);
  };

  const handleDeleteContact = (item: ContactInfoItem) => {
    if (!item.id) return;
    setItemToDelete({ type: 'contact', id: item.id, name: item.label });
    setDeleteModalOpen(true);
  };

  const handleEditSocial = (link: SocialLink) => {
    router.push(`/admin/contact/social/edit/${link.id}`);
  };

  const handleDeleteSocial = (link: SocialLink) => {
    if (!link.id) return;
    setItemToDelete({ type: 'social', id: link.id, name: link.platform });
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    try {
      if (itemToDelete.type === 'contact') {
        await deleteContactInfo.mutateAsync(itemToDelete.id);
        success('Contact info deleted');
      } else {
        await deleteSocialLink.mutateAsync(itemToDelete.id);
        success('Social link deleted');
      }
      setDeleteModalOpen(false);
      setItemToDelete(null);
    } catch (err) {
      showError('Failed to delete item');
    }
  };

  const isLoading = contactLoading || socialLoading;

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Contact"
        description="Manage your contact information and social media profiles."
        breadcrumbs={[{ label: 'Dashboard', href: '/admin' }, { label: 'Contact' }]}
      />

      {/* Contact Information Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
              <Mail size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Contact Methods</h2>
              <p className="text-sm text-[var(--text-tertiary)]">
                Email, phone, and other ways to reach you
              </p>
            </div>
          </div>
          <Button variant="primary" onClick={() => router.push('/admin/contact/info/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Contact
          </Button>
        </div>

        <div className="min-h-[80px]">
          {contactLoading ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : contactInfo.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center mb-3">
                <Mail size={24} className="text-[var(--text-tertiary)]" />
              </div>
              <p className="text-sm text-[var(--text-tertiary)]">
                No contact information added yet
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {contactInfo.map((item) => (
                <ContactInfoCard
                  key={item.id}
                  item={item}
                  onEdit={handleEditContact}
                  onDelete={handleDeleteContact}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Social Links Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
              <Share2 size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">Social Links</h2>
              <p className="text-sm text-[var(--text-tertiary)]">
                Your social media profiles and external links
              </p>
            </div>
          </div>
          <Button variant="primary" onClick={() => router.push('/admin/contact/social/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Social Link
          </Button>
        </div>

        <div className="min-h-[80px]">
          {socialLoading ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner />
            </div>
          ) : socialLinks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-6 bg-[var(--bg-surface)] border border-[var(--border-subtle)] border-dashed rounded-xl">
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-hover)] flex items-center justify-center mb-3">
                <Share2 size={24} className="text-[var(--text-tertiary)]" />
              </div>
              <p className="text-sm text-[var(--text-tertiary)]">No social links added yet</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {socialLinks.map((link) => (
                <SocialLinkCard
                  key={link.id}
                  link={link}
                  onEdit={handleEditSocial}
                  onDelete={handleDeleteSocial}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer Summary */}
      {!isLoading && (contactInfo.length > 0 || socialLinks.length > 0) && (
        <div className="flex items-center gap-4 px-4 py-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-sm text-[var(--text-tertiary)]">
          <FileText size={16} />
          <span>
            {contactInfo.length} contact method{contactInfo.length !== 1 ? 's' : ''}
          </span>
          <span>•</span>
          <span>
            {socialLinks.length} social link{socialLinks.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={itemToDelete?.type === 'contact' ? 'Delete Contact Info' : 'Delete Social Link'}
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
