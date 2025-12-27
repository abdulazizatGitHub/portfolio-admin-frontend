'use client';

import { useState } from 'react';
import { useEducation } from '@/lib/hooks';
import { EducationForm } from '@/components/forms/EducationForm';
import { Card, CardHeader, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { EducationEntry } from '@/types';

interface SortableEducationItemProps {
  entry: EducationEntry;
  onEdit: () => void;
  onDelete: () => void;
}

function SortableEducationItem({
  entry,
  onEdit,
  onDelete,
}: SortableEducationItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `education-${entry.id}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
    >
      <button
        {...attributes}
        {...listeners}
        className="p-2 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing mt-1"
        aria-label="Drag to reorder"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-500">{entry.period}</p>
            <h3 className="text-lg font-semibold text-gray-900 mt-1">{entry.title}</h3>
            <p className="text-gray-600 mt-2">{entry.description}</p>
          </div>
          <div className="flex gap-2 ml-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EducationPage() {
  const { data: initialData, isLoading, error } = useEducation();
  const [education, setEducation] = useState<EducationEntry[]>(initialData || []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<EducationEntry | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeIndex = education.findIndex(
        (e) => `education-${e.id}` === active.id
      );
      const overIndex = education.findIndex(
        (e) => `education-${e.id}` === over.id
      );

      if (activeIndex !== -1 && overIndex !== -1) {
        const newEducation = arrayMove(education, activeIndex, overIndex).map(
          (entry, index) => ({ ...entry, orderIndex: index })
        );
        setEducation(newEducation);
      }
    }
  };

  const handleAdd = () => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const handleEdit = (entry: EducationEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this education entry?')) {
      setEducation(education.filter((e) => e.id !== id));
    }
  };

  const handleSubmit = async (formData: any) => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (editingEntry?.id) {
      setEducation(
        education.map((e) =>
          e.id === editingEntry.id ? { ...e, ...formData } : e
        )
      );
    } else {
      const newEntry: EducationEntry = {
        id: Date.now(),
        ...formData,
        orderIndex: education.length,
      };
      setEducation([...education, newEntry]);
    }

    setIsSaving(false);
    setIsModalOpen(false);
    setEditingEntry(null);
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
        <div className="text-red-600">Error loading education entries</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Education</h1>
          <p className="mt-2 text-gray-600">
            Manage your education entries
          </p>
        </div>
        <Button onClick={handleAdd}>Add Education Entry</Button>
      </div>

      <Card>
        <CardBody>
          {education.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No education entries yet.</p>
              <Button onClick={handleAdd} className="mt-4">
                Add Your First Entry
              </Button>
            </div>
          ) : (
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={education.map((e) => `education-${e.id}`)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-4">
                  {education.map((entry) => (
                    <SortableEducationItem
                      key={entry.id}
                      entry={entry}
                      onEdit={() => handleEdit(entry)}
                      onDelete={() => entry.id && handleDelete(entry.id)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardBody>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        title={editingEntry ? 'Edit Education Entry' : 'Add Education Entry'}
        size="md"
      >
        <EducationForm
          initialData={editingEntry || undefined}
          onSubmit={handleSubmit}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingEntry(null);
          }}
          isLoading={isSaving}
        />
      </Modal>
    </div>
  );
}

