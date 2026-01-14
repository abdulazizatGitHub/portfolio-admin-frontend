'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { PersonalProfile } from '@/types';
import { RolesInput } from '@/components/ui/RolesInput';
import { FileUpload } from '@/components/ui/FileUpload';

interface PersonalProfileFormProps {
  profile?: PersonalProfile | null;
  onSave: (profile: Partial<PersonalProfile>) => Promise<void>;
  isLoading?: boolean;
}

import { motion } from 'framer-motion';
import { User, Briefcase, FileText, Download, Save, X, ChevronLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

const sectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
  }
};

export function PersonalProfileForm({
  profile,
  onSave,
  isLoading = false,
}: PersonalProfileFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<Partial<PersonalProfile>>({
    name: '',
    titlePrefix: '',
    description: '',
    roles: [],
    cvFile: '',
    cvFileName: '',
    cvDownloadName: '',
    isDefault: false,
  });

  const [currentFile, setCurrentFile] = useState<{ name: string; size: number } | undefined>();
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
      if (profile.cvFileName) {
        setCurrentFile({ name: profile.cvFileName, size: 0 });
      }
    }
  }, [profile]);

  const handleChange = (field: keyof PersonalProfile, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleFileSelect = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      setFormData((prev) => ({
        ...prev,
        cvFile: base64,
        cvFileName: file.name,
        cvDownloadName: prev.cvDownloadName || file.name,
      }));
      setCurrentFile({ name: file.name, size: file.size });
    };
    reader.readAsDataURL(file);
  };

  const handleFileRemove = () => {
    setFormData((prev) => ({
      ...prev,
      cvFile: '',
      cvFileName: '',
    }));
    setCurrentFile(undefined);
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.titlePrefix?.trim()) {
      newErrors.titlePrefix = 'Title prefix is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.roles || formData.roles.length === 0) {
      newErrors.roles = 'At least one role is required';
    }

    if (!formData.cvDownloadName?.trim()) {
      newErrors.cvDownloadName = 'CV download filename is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    await onSave(formData);
  };

  const handleCancel = () => {
    router.push('/admin/personal');
  };

  return (
    <div className="max-w-4xl mx-auto pb-24">
      {/* Breadcrumb Navigation */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={handleCancel}
        className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--primary-500)] transition-colors mb-8 group"
      >
        <div className="p-1.5 rounded-lg bg-[var(--bg-tertiary)] group-hover:bg-[var(--primary-500)]/10 group-hover:text-[var(--primary-500)] transition-colors">
          <ChevronLeft size={14} />
        </div>
        Back to Identity Nexus
      </motion.button>

      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-[900] text-[var(--text-primary)] tracking-tight mb-2">
          {profile ? 'Refine Persona' : 'Initialize Identity'}
        </h1>
        <p className="text-sm font-medium text-[var(--text-secondary)]">
          {profile
            ? 'Updating established professional metadata for current context.'
            : 'Establishing a new digital representation in the global identity matrix.'}
        </p>
      </motion.div>

      {/* Form Grid */}
      <form onSubmit={handleSubmit} className="space-y-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="space-y-10"
        >
          {/* Identity Fundamentals */}
          <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--primary-500)] to-transparent"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-[var(--primary-500)]/10 text-[var(--primary-500)]">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Identity Fundamentals</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Core personal descriptors</p>
              </div>
            </div>

            <div className="grid gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                    Full Designation <span className="text-[var(--error-500)]">*</span>
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className={cn(
                      "w-full px-5 py-3.5 rounded-2xl border transition-all premium-input",
                      errors.name ? "border-[var(--error-500)]" : "border-[var(--border-subtle)]"
                    )}
                    placeholder="e.g., Abdul Hannan"
                  />
                  {errors.name && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="titlePrefix" className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                    Introduction Hook <span className="text-[var(--error-500)]">*</span>
                  </label>
                  <input
                    id="titlePrefix"
                    type="text"
                    value={formData.titlePrefix}
                    onChange={(e) => handleChange('titlePrefix', e.target.value)}
                    className={cn(
                      "w-full px-5 py-3.5 rounded-2xl border transition-all premium-input",
                      errors.titlePrefix ? "border-[var(--error-500)]" : "border-[var(--border-subtle)]"
                    )}
                    placeholder="Hi, I'm"
                  />
                  {errors.titlePrefix && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.titlePrefix}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                  Professional Manifesto <span className="text-[var(--error-500)]">*</span>
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className={cn(
                    "w-full px-5 py-4 rounded-3xl border transition-all premium-input min-h-[160px] resize-none",
                    errors.description ? "border-[var(--error-500)]" : "border-[var(--border-subtle)]"
                  )}
                  placeholder="Envision your professional impact..."
                  rows={6}
                />
                {errors.description && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.description}</p>}
              </div>
            </div>
          </motion.section>

          {/* Professional Trajectory */}
          <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--accent-500)] to-transparent"></div>

            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 rounded-2xl bg-[var(--accent-500)]/10 text-[var(--accent-500)]">
                <Briefcase size={24} />
              </div>
              <div>
                <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Professional Trajectory</h3>
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Designated expertise roles</p>
              </div>
            </div>

            <div className="space-y-4">
              <RolesInput
                roles={formData.roles || []}
                onChange={(roles) => handleChange('roles', roles)}
                maxRoles={10}
              />
              {errors.roles && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.roles}</p>}
            </div>
          </motion.section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Credential Artifact */}
            <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--info-500)] to-transparent"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-[var(--info-500)]/10 text-[var(--info-500)]">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Credential Artifact</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">CV/Resume transmission</p>
                </div>
              </div>

              <FileUpload
                accept=".pdf,application/pdf"
                maxSize={5 * 1024 * 1024} // 5MB
                currentFile={currentFile}
                onFileSelect={handleFileSelect}
                onFileRemove={handleFileRemove}
                label="Initialize PDF Transfer"
              />
            </motion.section>

            {/* Distribution Metadata */}
            <motion.section variants={sectionVariants} className="glass-panel p-8 rounded-[40px] relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-[var(--success-500)] to-transparent"></div>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 rounded-2xl bg-[var(--success-500)]/10 text-[var(--success-500)]">
                  <Download size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-[900] text-[var(--text-primary)] tracking-tight">Access Control</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-tertiary)]">Distribution settings</p>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-2">
                  <label htmlFor="cvDownloadName" className="text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] ml-1">
                    Download Designation <span className="text-[var(--error-500)]">*</span>
                  </label>
                  <input
                    id="cvDownloadName"
                    type="text"
                    value={formData.cvDownloadName}
                    onChange={(e) => handleChange('cvDownloadName', e.target.value)}
                    className={cn(
                      "w-full px-5 py-3.5 rounded-2xl border transition-all premium-input",
                      errors.cvDownloadName ? "border-[var(--error-500)]" : "border-[var(--border-subtle)]"
                    )}
                    placeholder="e.g., Hannan_Resume_2024.pdf"
                  />
                  <p className="text-[10px] font-medium text-[var(--text-tertiary)] italic ml-1">
                    Final filename upon external retrieval.
                  </p>
                  {errors.cvDownloadName && <p className="text-[10px] font-bold text-[var(--error-500)] ml-1">{errors.cvDownloadName}</p>}
                </div>

                <div className="pt-4">
                  <label className="flex items-center gap-4 p-5 rounded-3xl glass-panel bg-white/5 dark:bg-black/5 hover:border-[var(--primary-500)] transition-all cursor-pointer group/toggle">
                    <input
                      id="isDefault"
                      type="checkbox"
                      checked={formData.isDefault}
                      onChange={(e) => handleChange('isDefault', e.target.checked)}
                      className="w-5 h-5 rounded-lg accent-[var(--primary-500)] cursor-pointer"
                    />
                    <div className="flex-1">
                      <span className="block text-sm font-[900] text-[var(--text-primary)] tracking-tight">Primary Identity Nexus</span>
                      <span className="block text-[10px] font-medium text-[var(--text-tertiary)]">Designated for global exposition.</span>
                    </div>
                    {formData.isDefault && <Sparkles size={18} className="text-[var(--primary-500)] animate-pulse" />}
                  </label>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Form Actions */}
          <motion.div
            variants={sectionVariants}
            className="flex items-center justify-between p-8 glass-panel rounded-[40px] border-t-4 border-t-[var(--primary-500)]"
          >
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] transition-all active:scale-95 flex items-center gap-2"
              disabled={isLoading}
            >
              <X size={14} />
              Abort
            </button>
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="px-12 py-4 rounded-2xl shadow-2xl shadow-[var(--primary-500)]/20 text-[11px] font-black uppercase tracking-widest active:scale-95 transition-all flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Save size={14} />
                  <span>{profile ? 'Authorize Change' : 'Finalize Identity'}</span>
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>
    </div>
  );
}


