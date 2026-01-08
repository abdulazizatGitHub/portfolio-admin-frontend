'use client';

import { useState } from 'react';

interface RolesInputProps {
  roles: string[];
  onChange: (roles: string[]) => void;
  maxRoles?: number;
  placeholder?: string;
}

export function RolesInput({ 
  roles, 
  onChange, 
  maxRoles = 10,
  placeholder = "+ Add role..."
}: RolesInputProps) {
  const [inputValue, setInputValue] = useState('');
  
  const addRole = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && roles.length < maxRoles && !roles.includes(trimmedValue)) {
      onChange([...roles, trimmedValue]);
      setInputValue('');
    }
  };
  
  const removeRole = (index: number) => {
    onChange(roles.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addRole();
    }
  };
  
  return (
    <div className="roles-input-container">
      {/* Display existing roles in HORIZONTAL ROW */}
      {roles.length > 0 && (
        <div className="roles-display">
          {roles.map((role, index) => (
            <div key={index} className="role-tag">
              <span>{role}</span>
              <button
                type="button"
                onClick={() => removeRole(index)}
                className="role-remove-btn"
                aria-label={`Remove ${role}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Add new role input */}
      <div className="role-input-wrapper">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="role-input"
          disabled={roles.length >= maxRoles}
        />
        <button 
          type="button" 
          onClick={addRole} 
          className="btn-secondary btn-sm"
          disabled={!inputValue.trim() || roles.length >= maxRoles}
        >
          Add
        </button>
      </div>
      
      {roles.length >= maxRoles && (
        <p className="roles-limit-text">Maximum {maxRoles} roles reached</p>
      )}
    </div>
  );
}


