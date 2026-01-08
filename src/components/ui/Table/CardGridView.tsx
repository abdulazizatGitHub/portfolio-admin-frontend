'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '../Card';
import { EmptyState } from '../EmptyState';
import { Skeleton } from '../Skeleton';
import { Edit, Trash2, Eye, ExternalLink, Github } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { MoreHorizontal } from 'lucide-react';

interface CardGridViewProps<TData> {
  data: TData[];
  isLoading?: boolean;
  renderCard: (item: TData, index: number) => React.ReactNode;
  emptyMessage?: string;
  emptyDescription?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function CardGridView<TData>({
  data,
  isLoading = false,
  renderCard,
  emptyMessage = 'No items found',
  emptyDescription = 'Get started by creating your first item.',
  columns = 3,
}: CardGridViewProps<TData>) {
  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  };

  if (isLoading) {
    return (
      <div className={cn('grid gap-6', columnClasses[columns])}>
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} height={300} variant="rectangular" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <Card>
        <div className="p-12">
          <EmptyState
            title={emptyMessage}
            description={emptyDescription}
            icon={
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                <MoreHorizontal className="w-8 h-8 text-purple-500" />
              </div>
            }
          />
        </div>
      </Card>
    );
  }

  return (
    <div className={cn('grid gap-6', columnClasses[columns])}>
      {data.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05, duration: 0.3 }}
        >
          {renderCard(item, index)}
        </motion.div>
      ))}
    </div>
  );
}

// Project Card Component Example
interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  tech?: string[];
  liveUrl?: string;
  sourceUrl?: string;
  isPublished?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
}

export function ProjectCard({
  title,
  description,
  image,
  tech = [],
  liveUrl,
  sourceUrl,
  isPublished = false,
  onEdit,
  onDelete,
  onView,
}: ProjectCardProps) {
  return (
    <Card hover className="h-full flex flex-col overflow-hidden">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 overflow-hidden group">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl">🚀</div>
          </div>
        )}
        
        {/* Overlay with actions on hover */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {onView && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onView}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <Eye className="w-5 h-5 text-white" />
            </motion.button>
          )}
          {onEdit && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onEdit}
              className="p-2 rounded-lg bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              <Edit className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </div>

        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span
            className={cn(
              'px-2 py-1 rounded-full text-xs font-medium',
              isPublished
                ? 'bg-green-500/90 text-white'
                : 'bg-gray-500/90 text-white'
            )}
          >
            {isPublished ? 'Published' : 'Draft'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
          {description}
        </p>

        {/* Tech Tags */}
        {tech.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {tech.slice(0, 3).map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 text-xs rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
              >
                {tag}
              </span>
            ))}
            {tech.length > 3 && (
              <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                +{tech.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {liveUrl && (
              <a
                href={liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </a>
            )}
            {sourceUrl && (
              <a
                href={sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Github className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </a>
            )}
          </div>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <MoreHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content
                className="min-w-[150px] glass rounded-lg shadow-lg border border-gray-200/50 dark:border-gray-700/50 p-1 z-50"
                sideOffset={5}
              >
                {onView && (
                  <DropdownMenu.Item
                    onClick={onView}
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </DropdownMenu.Item>
                )}
                {onEdit && (
                  <DropdownMenu.Item
                    onClick={onEdit}
                    className="px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer outline-none flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </DropdownMenu.Item>
                )}
                {onDelete && (
                  <>
                    <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-700 my-1" />
                    <DropdownMenu.Item
                      onClick={onDelete}
                      className="px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer outline-none flex items-center gap-2 text-sm text-red-600 dark:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </DropdownMenu.Item>
                  </>
                )}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        </div>
      </div>
    </Card>
  );
}

