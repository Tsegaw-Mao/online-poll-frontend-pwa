import React from 'react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  placeholder = "Search polls..." 
}) => {
  return (
    <div style={{ position: 'relative', maxWidth: '400px', margin: '0 auto 24px' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '12px 16px 12px 40px',
          border: '1px solid #d1d5db',
          borderRadius: '24px',
          fontSize: '1rem',
          backgroundColor: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          transition: 'all 0.2s'
        }}
        onFocus={(e) => {
          e.target.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
          e.target.style.borderColor = '#2563eb';
        }}
        onBlur={(e) => {
          e.target.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
          e.target.style.borderColor = '#d1d5db';
        }}
      />
      <span style={{
        position: 'absolute',
        left: '16px',
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: '1.1rem',
        color: '#6b7280'
      }}>
        🔍
      </span>
      
      {value && (
        <button
          onClick={() => onChange('')}
          style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: '#6b7280',
            padding: '4px'
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;