import React from 'react';
import Header from './Header';
import InstallPrompt from './InstallPrompt';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { loading } = useAuth();
  const { theme } = useTheme();

  // Theme-based styles
  const layoutStyles = {
    light: {
      backgroundColor: '#f8fafc',
      color: '#111827'
    },
    dark: {
      backgroundColor: '#111827',
      color: '#f9fafb'
    }
  };

  const footerStyles = {
    light: {
      backgroundColor: 'transparent',
      color: '#6b7280',
      borderColor: '#e5e7eb'
    },
    dark: {
      backgroundColor: 'transparent',
      color: '#9ca3af',
      borderColor: '#374151'
    }
  };

  const currentLayoutStyle = layoutStyles[theme];
  const currentFooterStyle = footerStyles[theme];

  // Calculate main content padding to account for fixed header
  const headerHeight = '80px'; // Approximate height of the fixed header

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: currentLayoutStyle.backgroundColor,
        color: currentLayoutStyle.color,
        transition: 'background-color 0.3s ease, color 0.3s ease'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            width: '50px', 
            height: '50px', 
            border: '4px solid #f3f3f3', 
            borderTop: `4px solid ${theme === 'dark' ? '#3b82f6' : '#2563eb'}`,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: currentLayoutStyle.color }}>Loading Pollify...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: currentLayoutStyle.backgroundColor,
      color: currentLayoutStyle.color,
      transition: 'background-color 0.3s ease, color 0.3s ease'
    }}>
      <Header />
      
      {/* Main content with padding to account for fixed header */}
      <main style={{ 
        minHeight: `calc(100vh - ${headerHeight} - 100px)`, // Account for header and footer
        paddingTop: headerHeight, // Push content down below fixed header
        transition: 'background-color 0.3s ease'
      }}>
        {children}
      </main>
      
      <footer style={{ 
        padding: '20px', 
        textAlign: 'center', 
        color: currentFooterStyle.color,
        borderTop: `1px solid ${currentFooterStyle.borderColor}`,
        fontSize: '0.9rem',
        backgroundColor: currentFooterStyle.backgroundColor,
        transition: 'all 0.3s ease'
      }}>
        <p style={{ margin: 0 }}>
          &copy; 2025 Online Poll System - 
          <span style={{ 
            display: 'inline-block',
            padding: '2px 8px',
            backgroundColor: theme === 'dark' ? '#1e40af' : '#dbeafe',
            color: theme === 'dark' ? '#dbeafe' : '#1e40af',
            borderRadius: '12px',
            fontSize: '0.8rem',
            marginLeft: '8px',
            transition: 'all 0.3s ease'
          }}>
            {theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
        </p>
        <p style={{ margin: '8px 0 0 0', fontSize: '0.8rem' }}>
          Works offline • Fast loading • Installable
        </p>
      </footer>
      
      <InstallPrompt />
    </div>
  );
};

export default Layout;