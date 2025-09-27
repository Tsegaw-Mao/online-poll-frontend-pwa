import React from 'react';

export const PollSkeleton: React.FC = () => {
  return (
    <div style={{ 
      border: '1px solid #e5e7eb', 
      padding: '24px', 
      borderRadius: '12px',
      backgroundColor: 'white',
      marginBottom: '24px'
    }}>
      <div style={{ 
        width: '70%', 
        height: '24px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '4px',
        marginBottom: '12px',
        animation: 'pulse 2s infinite'
      }}></div>
      <div style={{ 
        width: '90%', 
        height: '16px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '4px',
        marginBottom: '16px',
        animation: 'pulse 2s infinite',
        animationDelay: '0.2s'
      }}></div>
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ 
            width: '80px', 
            height: '12px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '4px',
            animation: 'pulse 2s infinite',
            animationDelay: `${i * 0.1}s`
          }}></div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '12px' }}>
        <div style={{ 
          flex: 1, 
          height: '36px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '6px',
          animation: 'pulse 2s infinite',
          animationDelay: '0.4s'
        }}></div>
        <div style={{ 
          flex: 1, 
          height: '36px', 
          backgroundColor: '#f3f4f6', 
          borderRadius: '6px',
          animation: 'pulse 2s infinite',
          animationDelay: '0.5s'
        }}></div>
      </div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      height: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ 
        width: '100%', 
        height: '200px', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '8px',
        animation: 'pulse 2s infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#6b7280',
        fontSize: '1.1rem'
      }}>
        Loading chart...
      </div>
    </div>
  );
};