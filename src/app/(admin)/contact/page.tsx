'use client';

import { useState } from 'react';
import { useContactInfo, useSocialLinks } from '@/lib/hooks';
import { ContactInfoForm, SocialLinkForm } from '@/components/forms/ContactForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { ContactInfoItem, SocialLink } from '@/types';

export default function ContactPage() {
  const { data: initialContactInfo, isLoading: contactLoading, error: contactError } = useContactInfo();
  const { data: initialSocialLinks, isLoading: socialLoading, error: socialError } = useSocialLinks();
  
  const [contactInfo, setContactInfo] = useState<ContactInfoItem[]>(initialContactInfo || []);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(initialSocialLinks || []);
  
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [isSocialModalOpen, setIsSocialModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<ContactInfoItem | null>(null);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddContact = () => {
    setEditingContact(null);
    setIsContactModalOpen(true);
  };

  const handleEditContact = (item: ContactInfoItem) => {
    setEditingContact(item);
    setIsContactModalOpen(true);
  };

  const handleDeleteContact = (id: number) => {
    if (confirm('Are you sure you want to delete this contact info?')) {
      setContactInfo(contactInfo.filter((c) => c.id !== id));
    }
  };

  const handleAddSocial = () => {
    setEditingSocial(null);
    setIsSocialModalOpen(true);
  };

  const handleEditSocial = (link: SocialLink) => {
    setEditingSocial(link);
    setIsSocialModalOpen(true);
  };

  const handleDeleteSocial = (id: number) => {
    if (confirm('Are you sure you want to delete this social link?')) {
      setSocialLinks(socialLinks.filter((s) => s.id !== id));
    }
  };

  const handleContactSubmit = async (formData: any) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingContact?.id) {
      setContactInfo(
        contactInfo.map((c) =>
          c.id === editingContact.id ? { ...c, ...formData } : c
        )
      );
    } else {
      const newContact: ContactInfoItem = {
        id: Date.now(),
        ...formData,
        orderIndex: contactInfo.length,
      };
      setContactInfo([...contactInfo, newContact]);
    }

    setIsSaving(false);
    setIsContactModalOpen(false);
    setEditingContact(null);
  };

  const handleSocialSubmit = async (formData: any) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingSocial?.id) {
      setSocialLinks(
        socialLinks.map((s) =>
          s.id === editingSocial.id ? { ...s, ...formData } : s
        )
      );
    } else {
      const newSocial: SocialLink = {
        id: Date.now(),
        ...formData,
        orderIndex: socialLinks.length,
      };
      setSocialLinks([...socialLinks, newSocial]);
    }

    setIsSaving(false);
    setIsSocialModalOpen(false);
    setEditingSocial(null);
  };

  const isLoading = contactLoading || socialLoading;
  const error = contactError || socialError;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-600">Error loading contact information</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Contact</h1>
        <p className="mt-2 text-gray-600">
          Manage your contact information and social links
        </p>
      </div>

      {/* Contact Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Contact Information</h2>
            <Button onClick={handleAddContact} size="sm">
              Add Contact Info
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {contactInfo.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No contact information yet.
            </div>
          ) : (
            <div className="space-y-3">
              {contactInfo.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-500">{item.label}</p>
                    <p className="text-lg text-gray-900">{item.value}</p>
                    {item.href && (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {item.href}
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditContact(item)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => item.id && handleDeleteContact(item.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Social Links */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Social Links</h2>
            <Button onClick={handleAddSocial} size="sm">
              Add Social Link
            </Button>
          </div>
        </CardHeader>
        <CardBody>
          {socialLinks.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No social links yet.
            </div>
          ) : (
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <div
                  key={link.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{link.platform}</p>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {link.url}
                    </a>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleEditSocial(link)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => link.id && handleDeleteSocial(link.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>

      {/* Contact Info Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setEditingContact(null);
        }}
        title={editingContact ? 'Edit Contact Info' : 'Add Contact Info'}
        size="md"
      >
        <ContactInfoForm
          initialData={editingContact || undefined}
          onSubmit={handleContactSubmit}
          onCancel={() => {
            setIsContactModalOpen(false);
            setEditingContact(null);
          }}
          isLoading={isSaving}
        />
      </Modal>

      {/* Social Link Modal */}
      <Modal
        isOpen={isSocialModalOpen}
        onClose={() => {
          setIsSocialModalOpen(false);
          setEditingSocial(null);
        }}
        title={editingSocial ? 'Edit Social Link' : 'Add Social Link'}
        size="md"
      >
        <SocialLinkForm
          initialData={editingSocial || undefined}
          onSubmit={handleSocialSubmit}
          onCancel={() => {
            setIsSocialModalOpen(false);
            setEditingSocial(null);
          }}
          isLoading={isSaving}
        />
      </Modal>
    </div>
  );
}

