'use client';

import React from 'react';
import { Edit, Trash2, ExternalLink, Github, Star, Calendar } from 'lucide-react';
import Image from 'next/image';
import {
    getStatusInfo,
    getProjectDuration,
    getPlaceholderThumbnail
} from '@/lib/utils/projectHelpers';
import type { Project } from '@/types/projects';
import { cn } from '@/lib/utils/cn';

interface ProjectCardProps {
    project: Project;
    onEdit: (project: Project) => void;
    onDelete: (project: Project) => void;
    onView: (project: Project) => void;
}

import { motion } from 'framer-motion';

/**
 * ProjectCard - Visual card for displaying project with thumbnail and details
 */
export function ProjectCard({ project, onEdit, onDelete, onView }: ProjectCardProps) {
    const statusInfo = getStatusInfo(project.status);
    const duration = getProjectDuration(project.startDate, project.endDate);
    const thumbnail = project.thumbnail || getPlaceholderThumbnail(project.title);

    // Show max 4 tech stack items, rest as "+N more"
    const visibleTech = project.techStack.slice(0, 4);
    const remainingTech = project.techStack.length - 4;

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className={cn(
                'group relative flex flex-col rounded-[24px] overflow-hidden card h-full cursor-pointer',
                'border-[var(--border-subtle)] hover:border-[var(--primary-500)]/30'
            )}
            onClick={() => onView(project)}
        >
            {/* Thumbnail */}
            <div className="relative w-full aspect-video bg-[var(--bg-tertiary)] overflow-hidden">
                <Image
                    src={thumbnail}
                    alt={project.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Featured Badge */}
                {project.featured && (
                    <div className="absolute top-3 left-3 z-10">
                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--warning-500)] text-white text-[10px] font-black uppercase tracking-widest shadow-xl">
                            <Star className="w-3 h-3 fill-current" />
                            Featured
                        </div>
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <div
                        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-xl border"
                        style={{
                            backgroundColor: `${statusInfo.bgColor}cc`,
                            color: statusInfo.color,
                            borderColor: `${statusInfo.color}40`
                        }}
                    >
                        {statusInfo.label}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1 group-hover:text-[var(--primary-600)] transition-colors">
                        {project.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-wider">
                        <Calendar className="w-3 h-3" />
                        {duration}
                    </div>
                </div>

                {/* Short Description */}
                <p className="text-sm text-[var(--text-secondary)] line-clamp-2 leading-relaxed font-medium">
                    {project.shortDescription}
                </p>

                {/* Tech Stack Pills */}
                {project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                        {visibleTech.map((tech) => (
                            <span
                                key={tech}
                                className="px-3 py-1 rounded-lg text-[10px] font-bold bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                            >
                                {tech}
                            </span>
                        ))}
                        {remainingTech > 0 && (
                            <span className="px-3 py-1 rounded-lg text-[10px] font-bold bg-[var(--primary-50)] dark:bg-[var(--primary-900)]/20 text-[var(--primary-600)] border border-[var(--primary-100)] dark:border-[var(--primary-900)]/30">
                                +{remainingTech}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Links & Quick Actions Overlay */}
            <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-[var(--primary-900)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <div className="flex items-center justify-between pointer-events-auto">
                    <div className="flex items-center gap-2">
                        {project.liveUrl && (
                            <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 text-[var(--primary-600)] hover:scale-110 transition-transform shadow-lg border border-[var(--primary-500)]/20"
                                title="View live demo"
                            >
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        )}
                        {project.githubUrl && (
                            <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 hover:scale-110 transition-transform shadow-lg border border-slate-400/20"
                                title="View source code"
                            >
                                <Github className="w-4 h-4" />
                            </a>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit(project);
                            }}
                            className="p-2.5 rounded-xl bg-[var(--primary-500)] text-white hover:scale-110 transition-transform shadow-lg"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(project);
                            }}
                            className="p-2.5 rounded-xl bg-[var(--error-500)] text-white hover:scale-110 transition-transform shadow-lg"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
