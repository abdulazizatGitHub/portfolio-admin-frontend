'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Mail, Share2, Sparkles, Zap, Shield, Globe, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useContactInfo, useSocialLinks } from '@/lib/hooks';
import { ContactInfoCard } from '@/components/sections/Contact/ContactInfoCard';
import { SocialLinkCard } from '@/components/sections/Contact/SocialLinkCard';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/Button';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/lib/hooks/useToast';
import type { ContactInfoItem, SocialLink } from '@/types';
import { cn } from '@/lib/utils/cn';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 15 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ContactPage() {
  const router = useRouter();
  const { data: initialContactInfo, isLoading: contactLoading } = useContactInfo();
  const { data: initialSocialLinks, isLoading: socialLoading } = useSocialLinks();
  const { success, error: showError } = useToast();

  const [contactInfo, setContactInfo] = useState<ContactInfoItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ type: 'contact' | 'social'; id: number; name: string } | null>(null);
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

  return (
    <div className="space-y-12">
      {/* Page Header Matrix */}
      <PageHeader
        title="Contact Management"
        description="Manage your contact information and social media links."
        breadcrumbs={[
          { label: 'Dashboard', href: '/admin' },
          { label: 'Contact' },
        ]}
      />

      {/* Contact Information Section Architecture */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
              <Mail size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-none mb-1">
                Contact Methods
              </h2>
              <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic uppercase tracking-widest">
                Your primary contact information
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/contact/info/add')}
              className="bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-black uppercase tracking-widest px-6 py-5 rounded-2xl border border-white/10 transition-all active:scale-95 shadow-xl group text-xs"
            >
              <Plus className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Add Contact Info
            </Button>
          </motion.div>
        </div>

        <div className="relative min-h-[100px]">
          {contactLoading ? (
            <div className="py-12 flex justify-center"><LoadingSpinner className="text-[var(--primary-500)]" /></div>
          ) : contactInfo.length === 0 ? (
            <motion.div variants={itemVariants} className="p-12 rounded-[40px] glass-panel border-2 border-dashed border-white/5 flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-3xl bg-white/5 text-[var(--text-tertiary)]"><Globe size={32} /></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] italic">Status: No Contact Info Found</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactInfo.map((item) => (
                <motion.div key={item.id} variants={itemVariants}>
                  <ContactInfoCard
                    item={item}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Social Links Section Architecture */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="flex items-center justify-between px-2 pt-4 border-t border-white/5">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-2xl bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
              <Share2 size={24} />
            </div>
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)] leading-none mb-1">
                Social Media
              </h2>
              <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic uppercase tracking-widest">
                Your social media profiles and external links
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="primary"
              onClick={() => router.push('/admin/contact/social/add')}
              className="bg-white/5 hover:bg-white/10 text-[var(--text-primary)] font-black uppercase tracking-widest px-6 py-5 rounded-2xl border border-white/10 transition-all active:scale-95 shadow-xl group text-xs"
            >
              <Plus className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:rotate-90" />
              Add Social Link
            </Button>
          </motion.div>
        </div>

        <div className="relative min-h-[100px]">
          {socialLoading ? (
            <div className="py-12 flex justify-center"><LoadingSpinner className="text-[var(--accent-500)]" /></div>
          ) : socialLinks.length === 0 ? (
            <motion.div variants={itemVariants} className="p-12 rounded-[40px] glass-panel border-2 border-dashed border-white/5 flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-3xl bg-white/5 text-[var(--text-tertiary)]"><Terminal size={32} /></div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-tertiary)] italic">Status: No Social Links Found</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {socialLinks.map((link) => (
                <motion.div key={link.id} variants={itemVariants}>
                  <SocialLinkCard
                    link={link}
                    onEdit={handleEditSocial}
                    onDelete={handleDeleteSocial}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Status Meta Indicators */}
      {!isLoading && (contactInfo.length > 0 || socialLinks.length > 0) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-6 px-8 py-6 rounded-[32px] bg-white/[0.02] border border-white/5 border-dashed"
        >
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Contact info is valid</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-white/10" />
          <div className="flex items-center gap-3">
            <Sparkles size={16} className="text-amber-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Social links are active</span>
          </div>
          <motion.div
            animate={{ opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="ml-auto flex items-center gap-2"
          >
            <Zap size={14} className="text-[var(--primary-500)]" />
            <span className="text-[9px] font-bold text-[var(--text-tertiary)] italic uppercase tracking-tighter">All channels active</span>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Architecture */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={handleDeleteConfirm}
        title={itemToDelete?.type === 'contact' ? 'Delete Contact Info' : 'Delete Social Link'}
        message={`Are you sure you want to delete "${itemToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
}
