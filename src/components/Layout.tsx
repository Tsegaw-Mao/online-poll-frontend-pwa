import React from 'react';
import Header from './Header';
import Footer from './Footer';
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
      <main style={{ 
        minHeight: 'calc(100vh - 200px)',
        transition: 'background-color 0.3s ease'
      }}>
        {children}
      </main>
      <Footer />
      <InstallPrompt />
    </div>
  );
};

export default Layout;