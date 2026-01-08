'use client';

import React, { useState } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';

interface FilterColumn {
  key: string;
  label: string;
  filterType?: 'text' | 'select' | 'date' | 'number';
  filterOptions?: Array<{ value: string; label: string }>;
}

interface FilterConfig {
  key: string;
  value: any;
}

interface TableFiltersProps {
  columns: FilterColumn[];
  filters: FilterConfig[];
  onFilter: (key: string, value: any) => void;
  className?: string;
}

export function TableFilters({
  columns,
  filters,
  onFilter,
  className = '',
}: TableFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState<Record<string, any>>({});

  const activeFiltersCount = filters.length;

  const handleApplyFilters = () => {
    Object.entries(tempFilters).forEach(([key, value]) => {
      onFilter(key, value);
    });
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    columns.forEach((col) => {
      onFilter(col.key, '');
    });
    setTempFilters({});
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="cursor-pointer"
      >
        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
        {activeFiltersCount > 0 && (
          <span className="ml-2 px-2 py-0.5 text-xs bg-blue-600 text-white rounded-full">
            {activeFiltersCount}
          </span>
        )}
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Filter Data"
        size="md"
      >
        <div className="space-y-4">
          {columns.map((column) => {
            const currentValue = tempFilters[column.key] || filters.find((f) => f.key === column.key)?.value || '';

            return (
              <div key={column.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {column.label}
                </label>
                {column.filterType === 'select' && column.filterOptions ? (
                  <select
                    value={currentValue}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, [column.key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="">All</option>
                    {column.filterOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ) : column.filterType === 'date' ? (
                  <input
                    type="date"
                    value={currentValue}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, [column.key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  />
                ) : column.filterType === 'number' ? (
                  <input
                    type="number"
                    value={currentValue}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, [column.key]: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                  />
                ) : (
                  <input
                    type="text"
                    value={currentValue}
                    onChange={(e) =>
                      setTempFilters({ ...tempFilters, [column.key]: e.target.value })
                    }
                    placeholder={`Filter by ${column.label.toLowerCase()}...`}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                  />
                )}
              </div>
            );
          })}

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <Button
              variant="secondary"
              onClick={handleClearFilters}
              className="cursor-pointer"
            >
              Clear All
            </Button>
            <Button onClick={handleApplyFilters} className="cursor-pointer">
              Apply Filters
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}


