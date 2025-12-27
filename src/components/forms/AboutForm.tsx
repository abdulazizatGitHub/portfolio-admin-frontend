'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { Input, Textarea, Button } from '@/components/ui';
import type { AboutContent } from '@/types';

const aboutContentSchema = z.object({
  roleTitle: z.string().min(1, 'Role title is required'),
  paragraphs: z.array(z.string().min(1)).min(1, 'At least one paragraph is required'),
  stats: z.array(
    z.object({
      label: z.string().min(1),
      value: z.string().min(1),
    })
  ).min(1, 'At least one stat is required'),
});

type AboutContentFormData = z.infer<typeof aboutContentSchema>;

interface AboutFormProps {
  initialData?: AboutContent;
  onSubmit: (data: AboutContentFormData) => void;
  isLoading?: boolean;
}

interface SortableParagraphProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}

function SortableParagraph({
  id,
  value,
  onChange,
  onRemove,
}: SortableParagraphProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex gap-2 items-start p-3 bg-gray-50 rounded-lg"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="flex-1"
      />
      <button
        type="button"
        onClick={onRemove}
        className="p-1 text-red-600 hover:text-red-800"
        aria-label="Remove paragraph"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function AboutForm({
  initialData,
  onSubmit,
  isLoading = false,
}: AboutFormProps) {
  const [paragraphs, setParagraphs] = useState<string[]>(
    initialData?.paragraphs || ['']
  );
  const [stats, setStats] = useState(
    initialData?.stats || [
      { label: 'CGPA', value: '' },
      { label: 'Projects', value: '' },
      { label: 'Experience', value: '' },
    ]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<AboutContentFormData>({
    resolver: zodResolver(aboutContentSchema),
    defaultValues: initialData || {
      roleTitle: '',
      paragraphs: [''],
      stats: [],
    },
  });

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = paragraphs.findIndex((_, i) => `paragraph-${i}` === active.id);
      const newIndex = paragraphs.findIndex((_, i) => `paragraph-${i}` === over.id);
      const newParagraphs = arrayMove(paragraphs, oldIndex, newIndex);
      setParagraphs(newParagraphs);
      setValue('paragraphs', newParagraphs);
    }
  };

  const addParagraph = () => {
    const newParagraphs = [...paragraphs, ''];
    setParagraphs(newParagraphs);
    setValue('paragraphs', newParagraphs);
  };

  const removeParagraph = (index: number) => {
    if (paragraphs.length > 1) {
      const newParagraphs = paragraphs.filter((_, i) => i !== index);
      setParagraphs(newParagraphs);
      setValue('paragraphs', newParagraphs);
    }
  };

  const updateParagraph = (index: number, value: string) => {
    const newParagraphs = [...paragraphs];
    newParagraphs[index] = value;
    setParagraphs(newParagraphs);
    setValue('paragraphs', newParagraphs);
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setStats(newStats);
    setValue('stats', newStats);
  };

  const onSubmitForm = (data: AboutContentFormData) => {
    onSubmit({ ...data, paragraphs, stats });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <Input
        label="Role Title"
        required
        {...register('roleTitle')}
        error={errors.roleTitle?.message}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Paragraphs <span className="text-red-500">*</span>
        </label>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={paragraphs.map((_, i) => `paragraph-${i}`)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-3">
              {paragraphs.map((paragraph, index) => (
                <SortableParagraph
                  key={`paragraph-${index}`}
                  id={`paragraph-${index}`}
                  value={paragraph}
                  onChange={(value) => updateParagraph(index, value)}
                  onRemove={() => removeParagraph(index)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        {errors.paragraphs && (
          <p className="mt-1 text-sm text-red-600">{errors.paragraphs.message}</p>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={addParagraph}
          className="mt-3"
        >
          Add Paragraph
        </Button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Stats <span className="text-red-500">*</span>
        </label>
        <div className="space-y-3">
          {stats.map((stat, index) => (
            <div key={index} className="grid grid-cols-2 gap-3">
              <Input
                label="Label"
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
              />
              <Input
                label="Value"
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
              />
            </div>
          ))}
        </div>
        {errors.stats && (
          <p className="mt-1 text-sm text-red-600">{errors.stats.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4">
        <Button type="submit" loading={isLoading}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

