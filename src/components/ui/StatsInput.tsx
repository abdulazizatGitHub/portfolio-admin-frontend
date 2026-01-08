'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';

export interface Stat {
  label: string;
  value: string;
}

interface StatsInputProps {
  stats: Stat[];
  onChange: (stats: Stat[]) => void;
  maxStats?: number;
}

export function StatsInput({ stats, onChange, maxStats = 10 }: StatsInputProps) {
  const [newLabel, setNewLabel] = useState('');
  const [newValue, setNewValue] = useState('');

  const addStat = () => {
    if (newLabel.trim() && newValue.trim() && stats.length < maxStats) {
      onChange([...stats, { label: newLabel.trim(), value: newValue.trim() }]);
      setNewLabel('');
      setNewValue('');
    }
  };

  const removeStat = (index: number) => {
    onChange(stats.filter((_, i) => i !== index));
  };

  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const updated = stats.map((stat, i) =>
      i === index ? { ...stat, [field]: value } : stat
    );
    onChange(updated);
  };

  const handleKeyDown = (e: React.KeyboardEvent, field: 'label' | 'value') => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (field === 'label') {
        // Focus value input
        const valueInput = e.currentTarget.parentElement?.parentElement?.querySelector(
          'input[placeholder="Value"]'
        ) as HTMLInputElement;
        valueInput?.focus();
      } else {
        // Add stat
        addStat();
      }
    }
  };

  return (
    <div className="stats-input-container">
      {/* Existing Stats */}
      {stats.length > 0 && (
        <div className="stats-list">
          <div className="stats-list-header">
            <span className="stats-col-label">Label</span>
            <span className="stats-col-value">Value</span>
            <span className="stats-col-action">Action</span>
          </div>
          {stats.map((stat, index) => (
            <div key={index} className="stat-row">
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                className="stat-input stat-label-input"
                placeholder="Label"
              />
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                className="stat-input stat-value-input"
                placeholder="Value"
              />
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="stat-remove-btn"
                aria-label={`Remove ${stat.label}`}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Stat */}
      <div className="stats-add-section">
        <div className="stats-add-inputs">
          <input
            type="text"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'label')}
            placeholder="Label (e.g., CGPA)"
            className="stat-input"
            disabled={stats.length >= maxStats}
          />
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, 'value')}
            placeholder="Value (e.g., 3.8/4.0)"
            className="stat-input"
            disabled={stats.length >= maxStats}
          />
          <button
            type="button"
            onClick={addStat}
            className="btn-secondary"
            disabled={!newLabel.trim() || !newValue.trim() || stats.length >= maxStats}
          >
            <Plus size={16} />
            Add
          </button>
        </div>
        {stats.length >= maxStats && (
          <p className="stats-limit-text">Maximum {maxStats} statistics reached</p>
        )}
      </div>
    </div>
  );
}


