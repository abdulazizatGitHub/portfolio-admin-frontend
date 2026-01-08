'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils/cn';

interface FieldSliderProps {
  label?: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  className?: string;
  showValue?: boolean;
  marks?: boolean;
}

export function FieldSlider({
  label,
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  className,
  showValue = true,
  marks = false,
}: FieldSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const percentage = ((value - min) / (max - min)) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
          {showValue && (
            <span className="text-sm font-semibold text-purple-600 dark:text-purple-400">
              {value}%
            </span>
          )}
        </div>
      )}

      <div className="relative">
        {/* Track */}
        <div className="relative h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          {/* Fill */}
          <motion.div
            className="absolute h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Slider Input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            'absolute inset-0 w-full h-2 opacity-0 cursor-pointer',
            disabled && 'cursor-not-allowed'
          )}
        />

        {/* Thumb */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white dark:bg-gray-800 rounded-full shadow-lg border-2 border-purple-500 cursor-grab active:cursor-grabbing"
          style={{
            left: `calc(${percentage}% - 12px)`,
          }}
          animate={{
            scale: isDragging ? 1.2 : 1,
          }}
        >
          {/* Tooltip */}
          {isDragging && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: -35 }}
              className="absolute top-0 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs font-medium whitespace-nowrap"
            >
              {value}%
            </motion.div>
          )}
        </motion.div>

        {/* Marks */}
        {marks && (
          <div className="flex justify-between mt-2">
            {[0, 25, 50, 75, 100].map((mark) => (
              <div
                key={mark}
                className={cn(
                  'text-xs text-gray-500 dark:text-gray-400',
                  value >= mark && 'text-purple-600 dark:text-purple-400 font-medium'
                )}
              >
                {mark}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

