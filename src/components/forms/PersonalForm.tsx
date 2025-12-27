'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Textarea, Button } from '@/components/ui';
import { personalContentSchema, type PersonalContentFormData } from '@/lib/utils/validation';
import type { PersonalContent } from '@/types';

interface PersonalFormProps {
  initialData?: PersonalContent;
  onSubmit: (data: PersonalContentFormData) => void;
  isLoading?: boolean;
}

export function PersonalForm({
  initialData,
  onSubmit,
  isLoading = false,
}: PersonalFormProps) {
  const [roles, setRoles] = useState<string[]>(initialData?.roles || []);
  const [newRole, setNewRole] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<PersonalContentFormData>({
    resolver: zodResolver(personalContentSchema),
    defaultValues: initialData || {
      name: '',
      titlePrefix: '',
      description: '',
      roles: [],
      cvFilePath: '',
      cvDownloadName: '',
    },
  });

  const addRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      const updatedRoles = [...roles, newRole.trim()];
      setRoles(updatedRoles);
      setValue('roles', updatedRoles);
      setNewRole('');
    }
  };

  const removeRole = (roleToRemove: string) => {
    const updatedRoles = roles.filter((role) => role !== roleToRemove);
    setRoles(updatedRoles);
    setValue('roles', updatedRoles);
  };

  const moveRole = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === roles.length - 1)
    ) {
      return;
    }

    const newRoles = [...roles];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newRoles[index], newRoles[targetIndex]] = [newRoles[targetIndex], newRoles[index]];
    setRoles(newRoles);
    setValue('roles', newRoles);
  };

  const onSubmitForm = (data: PersonalContentFormData) => {
    onSubmit({ ...data, roles });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <Input
        label="Name"
        required
        {...register('name')}
        error={errors.name?.message}
      />

      <Input
        label="Title Prefix"
        required
        placeholder="Hi, I'm"
        {...register('titlePrefix')}
        error={errors.titlePrefix?.message}
      />

      <Textarea
        label="Description"
        required
        rows={4}
        {...register('description')}
        error={errors.description?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Roles <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Add a role"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRole();
                }
              }}
              className="flex-1"
            />
            <Button type="button" onClick={addRole} variant="secondary">
              Add Role
            </Button>
          </div>

          {errors.roles && (
            <p className="text-sm text-red-600">{errors.roles.message}</p>
          )}

          {roles.length > 0 && (
            <div className="space-y-2">
              {roles.map((role, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">{role}</div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => moveRole(index, 'up')}
                      disabled={index === 0}
                      className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                      aria-label="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => moveRole(index, 'down')}
                      disabled={index === roles.length - 1}
                      className="p-1 text-gray-600 hover:text-gray-900 disabled:opacity-50"
                      aria-label="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRole(role)}
                      className="p-1 text-red-600 hover:text-red-800"
                      aria-label="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Input
        label="CV File Path"
        required
        placeholder="/documents/cv.pdf"
        {...register('cvFilePath')}
        error={errors.cvFilePath?.message}
      />

      <Input
        label="CV Download Name"
        required
        placeholder="John_Doe_CV.pdf"
        {...register('cvDownloadName')}
        error={errors.cvDownloadName?.message}
      />

      <div className="flex justify-end gap-4">
        <Button type="submit" loading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

