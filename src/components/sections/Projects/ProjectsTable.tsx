'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Project } from '@/types';
import { ProjectRow } from './ProjectRow';

interface ProjectsTableProps {
  projects: Project[];
  onView: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

export function ProjectsTable({
  projects,
  onView,
  onEdit,
  onDelete,
  onSelectionChange,
}: ProjectsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'title' | 'date' | 'status'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter and sort logic
  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.techStack.some((tech) => tech.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFilter = statusFilter === 'all' || project.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'date') {
      const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return dateB - dateA;
    }
    if (sortBy === 'status') return a.status.localeCompare(b.status);
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = sortedProjects.slice(startIndex, startIndex + itemsPerPage);

  // Selection handlers
  const toggleSelectAll = () => {
    if (selectedIds.length === paginatedProjects.length && paginatedProjects.length > 0) {
      setSelectedIds([]);
      onSelectionChange?.([]);
    } else {
      const allIds = paginatedProjects.map((p) => String(p.id));
      setSelectedIds(allIds);
      onSelectionChange?.(allIds);
    }
  };

  const toggleSelect = (id: string) => {
    const newSelection = selectedIds.includes(id)
      ? selectedIds.filter((i) => i !== id)
      : [...selectedIds, id];
    setSelectedIds(newSelection);
    onSelectionChange?.(newSelection);
  };

  // Reset to page 1 when filters change
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleSortChange = (value: 'title' | 'date' | 'status') => {
    setSortBy(value);
    setCurrentPage(1);
  };

  return (
    <div className="projects-table-container">
      {/* Table Header with Controls */}
      <div className="table-header">
        <div className="table-header-left">
          <h2 className="table-title">
            Projects <span className="count-badge">({projects.length})</span>
          </h2>
        </div>

        <div className="table-header-right">
          {/* Search */}
          <div className="search-input-wrapper">
            <Search className="search-icon" size={16} />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="search-input"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Status</option>
            <option value="live">Live</option>
            <option value="draft">Draft</option>
            <option value="development">In Development</option>
            <option value="archived">Archived</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as any)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="title">Sort by Title</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="projects-table">
          <thead>
            <tr>
              <th className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedIds.length === paginatedProjects.length && paginatedProjects.length > 0}
                  onChange={toggleSelectAll}
                  className="checkbox"
                  aria-label="Select all projects"
                />
              </th>
              <th className="thumbnail-col">Image</th>
              <th className="title-col">Project</th>
              <th className="tech-col">Tech Stack</th>
              <th className="status-col">Status</th>
              <th className="actions-col">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProjects.map((project) => (
              <ProjectRow
                key={project.id}
                project={project}
                selected={selectedIds.includes(String(project.id))}
                onToggleSelect={() => toggleSelect(String(project.id))}
                onView={() => onView(project)}
                onEdit={() => onEdit(project)}
                onDelete={() => onDelete(project)}
              />
            ))}
          </tbody>
        </table>

        {paginatedProjects.length === 0 && (
          <div className="empty-state">
            <p>No projects found</p>
            {searchQuery && (
              <button onClick={() => handleSearchChange('')} className="btn-ghost btn-sm">
                Clear search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="table-footer">
          <div className="results-info">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedProjects.length)} of{' '}
            {sortedProjects.length}
          </div>

          <div className="pagination">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
              aria-label="Previous page"
            >
              ◀
            </button>

            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                  aria-label={`Page ${pageNum}`}
                  aria-current={currentPage === pageNum ? 'page' : undefined}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
              aria-label="Next page"
            >
              ▶
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


