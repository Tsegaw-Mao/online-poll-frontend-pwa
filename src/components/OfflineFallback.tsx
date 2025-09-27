import React from 'react';

const OfflineFallback: React.FC = () => {
  const reloadPage = () => {
    window.location.reload();
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      textAlign: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        fontSize: '4rem',
        marginBottom: '20px'
      }}>
        📶
      </div>
      
      <h1 style={{
        fontSize: '2rem',
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: '16px'
      }}>
        You're Offline
      </h1>
      
      <p style={{
        fontSize: '1.1rem',
        color: '#6b7280',
        marginBottom: '32px',
        maxWidth: '400px'
      }}>
        It looks like you've lost your internet connection. Some features may not be available while offline.
      </p>
      
      <div style={{
        display: 'flex',
        gap: '16px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={reloadPage}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Try Again
        </button>
        
        <button
          onClick={() => window.history.back()}
          style={{
            padding: '12px 24px',
            backgroundColor: 'transparent',
            color: '#2563eb',
            border: '1px solid #2563eb',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Go Back
        </button>
      </div>
      
      <div style={{
        marginTop: '40px',
        padding: '16px',
        backgroundColor: '#f0f9ff',
        borderRadius: '8px',
        maxWidth: '400px'
      }}>
        <h3 style={{ color: '#0369a1', marginBottom: '8px' }}>Offline Tips</h3>
        <ul style={{ textAlign: 'left', color: '#6b7280', fontSize: '0.9rem' }}>
          <li>Check your internet connection</li>
          <li>Try refreshing the page</li>
          <li>Previously viewed polls may be available</li>
        </ul>
      </div>
    </div>
  );
};

export default OfflineFallback;