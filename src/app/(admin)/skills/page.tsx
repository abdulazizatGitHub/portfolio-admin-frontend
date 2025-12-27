'use client';

import { useState } from 'react';
import { useSkills } from '@/lib/hooks';
import { SkillsForm } from '@/components/forms/SkillsForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { Skill } from '@/types';

export default function SkillsPage() {
  const { data: initialData, isLoading, error } = useSkills();
  const [skills, setSkills] = useState<Skill[]>(initialData || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'technical' | 'ai'>('technical');

  const technicalSkills = skills.filter((s) => s.category === 'technical');
  const aiSkills = skills.filter((s) => s.category === 'ai');

  const handleAdd = () => {
    setEditingSkill(null);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: Skill) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      setSkills(skills.filter((s) => s.id !== id));
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingSkill?.id) {
      setSkills(
        skills.map((s) =>
          s.id === editingSkill.id ? { ...s, ...formData } : s
        )
      );
    } else {
      const newSkill: Skill = {
        id: Date.now(),
        ...formData,
        orderIndex: skills.filter((s) => s.category === formData.category).length,
      };
      setSkills([...skills, newSkill]);
    }

    setIsSaving(false);
    setIsModalOpen(false);
    setEditingSkill(null);
  };

  const renderSkillsList = (skillList: Skill[]) => {
    if (skillList.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No skills in this category yet.
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {skillList.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{skill.name}</h3>
                <span className="text-sm font-medium text-gray-600">{skill.level}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleEdit(skill)}
              >
                Edit
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => skill.id && handleDelete(skill.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  };

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
        <div className="text-red-600">Error loading skills</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Skills</h1>
          <p className="mt-2 text-gray-600">
            Manage your technical and AI/ML skills
          </p>
        </div>
        <Button onClick={handleAdd}>Add Skill</Button>
      </div>

      {/* Category Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveCategory('technical')}
            className={`
              py-4 px-1 border-b-2 font-medium text-sm
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
              py-4 px-1 border-b-2 font-medium text-sm
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

      {/* Skills List */}
      <Card>
        <CardBody>
          {activeCategory === 'technical'
            ? renderSkillsList(technicalSkills)
            : renderSkillsList(aiSkills)}
        </CardBody>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(null);
        }}
        title={editingSkill ? 'Edit Skill' : 'Add Skill'}
        size="md"
      >
        <SkillsForm
          initialData={editingSkill || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingSkill(null);
          }}
          isLoading={isSaving}
        />
      </Modal>
    </div>
  );
}

