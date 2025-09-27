import React from 'react';
import { useNotifications } from '../hooks/useNotifications';
import type { Notification } from '../hooks/useNotifications';

const NotificationItem: React.FC<{ notification: Notification; onClose: () => void }> = ({
  notification,
  onClose
}) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '💡';
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success': return '#f0f9ff';
      case 'error': return '#fef2f2';
      case 'warning': return '#fffbeb';
      case 'info': return '#f0f9ff';
      default: return '#f8fafc';
    }
  };

  const getBorderColor = () => {
    switch (notification.type) {
      case 'success': return '#bae6fd';
      case 'error': return '#fecaca';
      case 'warning': return '#fed7aa';
      case 'info': return '#bae6fd';
      default: return '#e2e8f0';
    }
  };

  return (
    <div style={{
      backgroundColor: getBackgroundColor(),
      border: `1px solid ${getBorderColor()}`,
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      animation: 'slideInRight 0.3s ease-out',
      maxWidth: '400px'
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{getIcon()}</span>
        <div style={{ flex: 1 }}>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem', fontWeight: '600' }}>
            {notification.title}
          </h4>
          <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
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
      </div>
      
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotifications();

  if (notifications.length === 0) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 10000,
      maxWidth: '400px'
    }}>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );
};