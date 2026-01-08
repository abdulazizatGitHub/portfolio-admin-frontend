'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { EnhancedTable } from '@/components/ui/EnhancedTable';
import { Button } from '@/components/ui/Button';
import type { Skill } from '@/types';

interface SkillsListProps {
  data: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export function SkillsList({ data, onEdit, onDelete, isLoading }: SkillsListProps) {
  const [activeCategory, setActiveCategory] = useState<'technical' | 'ai'>('technical');

  const filteredData = data.filter((s) => s.category === activeCategory);
  const technicalSkills = data.filter((s) => s.category === 'technical');
  const aiSkills = data.filter((s) => s.category === 'ai');

  const columns = [
    {
      key: 'name',
      label: 'Skill Name',
      render: (item: Skill) => (
        <span className="font-medium text-gray-900">{item.name}</span>
      ),
    },
    {
      key: 'level',
      label: 'Level',
      render: (item: Skill) => (
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${item.level}%` }}
              />
            </div>
          </div>
          <span className="text-sm font-medium text-gray-700 w-12 text-right">
            {item.level}%
          </span>
        </div>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      className: 'text-right',
      render: (item: Skill) => (
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(item);
            }}
            className="cursor-pointer"
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              if (item.id) onDelete(item.id);
            }}
            className="cursor-pointer"
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Skills</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your technical and AI/ML skills
          </p>
        </div>
        <Link href="/admin/skills/add">
          <Button className="cursor-pointer">
            <svg className="w-5 h-5 mr-2 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Skill
          </Button>
        </Link>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveCategory('technical')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors
              ${
                activeCategory === 'technical'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            Technical Skills ({technicalSkills.length})
          </button>
          <button
            onClick={() => setActiveCategory('ai')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm cursor-pointer transition-colors
              ${
                activeCategory === 'ai'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            AI/ML Skills ({aiSkills.length})
          </button>
        </nav>
      </div>

      {isLoading ? (
        null
      ) : filteredData.length === 0 ? (
        <div className="py-12">
          <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">No {activeCategory === 'technical' ? 'technical' : 'AI/ML'} skills</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              Get started by adding your first {activeCategory === 'technical' ? 'technical' : 'AI/ML'} skill.
            </p>
            <div className="mt-6">
              <Link href="/admin/skills/add">
                <Button className="cursor-pointer">
                  Add Skill
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <EnhancedTable
          data={filteredData}
          columns={columns}
          emptyMessage={`No ${activeCategory === 'technical' ? 'technical' : 'AI/ML'} skills yet. Click 'Add Skill' to get started.`}
        />
      )}
    </div>
  );
}

