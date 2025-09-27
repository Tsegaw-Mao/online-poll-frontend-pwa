import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';
import ThemeToggle from './ThemeToggle';

const Header: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.position = 'static';
      document.body.style.width = 'auto';
    };
  }, [isMenuOpen]);

  // Theme-based styles
  const headerStyles = {
    light: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      textColor: '#6b7280',
      activeColor: '#2563eb',
      hoverBg: '#f3f4f6',
      shadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
    },
    dark: {
      backgroundColor: '#1f2937',
      borderColor: '#374151',
      textColor: '#d1d5db',
      activeColor: '#3b82f6',
      hoverBg: '#374151',
      shadow: '0 2px 10px rgba(0, 0, 0, 0.3)'
    }
  };

  const currentStyle = headerStyles[theme];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeMenu();
    }
  };

  // Navigation links component
  const navLinks = (
    <>
      <li>
        <Link 
          to="/" 
          onClick={closeMenu}
          style={{ 
            textDecoration: 'none',
            color: location.pathname === '/' ? currentStyle.activeColor : currentStyle.textColor,
            fontWeight: location.pathname === '/' ? '600' : '400',
            padding: '12px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s',
            display: 'block',
            fontSize: '1rem'
          }}
          onMouseEnter={(e) => {
            if (location.pathname !== '/') {
              e.currentTarget.style.backgroundColor = currentStyle.hoverBg;
            }
          }}
          onMouseLeave={(e) => {
            if (location.pathname !== '/') {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          Home
        </Link>
      </li>

      {isAuthenticated() && (
        <li>
          <Link 
            to="/create-poll" 
            onClick={closeMenu}
            style={{ 
              textDecoration: 'none',
              color: location.pathname === '/create-poll' ? currentStyle.activeColor : currentStyle.textColor,
              fontWeight: location.pathname === '/create-poll' ? '600' : '400',
              padding: '12px 16px',
              borderRadius: '6px',
              transition: 'all 0.2s',
              display: 'block',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== '/create-poll') {
                e.currentTarget.style.backgroundColor = currentStyle.hoverBg;
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== '/create-poll') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Create Poll
          </Link>
        </li>
      )}

      {isAuthenticated() ? (
        <li style={{ 
          display: 'flex', 
          flexDirection: 'column',
          gap: '12px', 
          padding: '12px 16px',
          borderTop: '1px solid currentStyle.borderColor',
          marginTop: '8px',
          paddingTop: '20px'
        }}>
          <span style={{ 
            color: '#059669',
            fontWeight: '500',
            fontSize: '0.9rem'
          }}>
            Welcome, {user?.username}
          </span>
          <button
            onClick={handleLogout}
            style={{ 
              padding: '10px 16px',
              backgroundColor: '#dc2626',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500',
              transition: 'background-color 0.2s',
              width: '100%'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#b91c1c';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#dc2626';
            }}
          >
            Logout
          </button>
        </li>
      ) : (
        <>
          <li>
            <Link 
              to="/login" 
              onClick={closeMenu}
              style={{ 
                textDecoration: 'none',
                color: location.pathname === '/login' ? currentStyle.activeColor : currentStyle.textColor,
                fontWeight: location.pathname === '/login' ? '600' : '400',
                padding: '12px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s',
                display: 'block',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/login') {
                  e.currentTarget.style.backgroundColor = currentStyle.hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/login') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Login
            </Link>
          </li>
          <li>
            <Link 
              to="/register" 
              onClick={closeMenu}
              style={{ 
                textDecoration: 'none',
                color: location.pathname === '/register' ? currentStyle.activeColor : currentStyle.textColor,
                fontWeight: location.pathname === '/register' ? '600' : '400',
                padding: '12px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s',
                display: 'block',
                fontSize: '1rem'
              }}
              onMouseEnter={(e) => {
                if (location.pathname !== '/register') {
                  e.currentTarget.style.backgroundColor = currentStyle.hoverBg;
                }
              }}
              onMouseLeave={(e) => {
                if (location.pathname !== '/register') {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }
              }}
            >
              Register
            </Link>
          </li>
        </>
      )}

      <li style={{ 
        padding: '12px 16px',
        borderTop: `1px solid ${currentStyle.borderColor}`,
        marginTop: '8px',
        paddingTop: '20px'
      }}>
        <a 
          href="https://online-poll-backend-ehm8.onrender.com/admin" 
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeMenu}
          style={{ 
            textDecoration: 'none',
            color: currentStyle.textColor,
            padding: '10px 16px',
            borderRadius: '6px',
            transition: 'all 0.2s',
            fontSize: '0.9rem',
            border: `1px solid ${currentStyle.borderColor}`,
            display: 'block',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = currentStyle.hoverBg;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          Admin Panel
        </a>
      </li>
    </>
  );

  return (
    <header style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      backgroundColor: currentStyle.backgroundColor,
      borderBottom: `1px solid ${currentStyle.borderColor}`,
      padding: '16px 0',
      boxShadow: currentStyle.shadow,
      zIndex: 1000,
      transition: 'all 0.3s ease'
    }}>
      <div style={{ 
        maxWidth: '1400px', 
        margin: '0 auto',
        padding: '0 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        {/* Logo/Brand */}
        <Link 
          to="/" 
          onClick={closeMenu}
          style={{ 
            textDecoration: 'none',
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: currentStyle.activeColor,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 1001
          }}
        >
          🗳️ Pollify
        </Link>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="desktop-nav">
          <ul style={{ 
            display: 'flex', 
            gap: '16px', 
            listStyle: 'none',
            margin: 0,
            padding: 0,
            alignItems: 'center'
          }}>
            {/* Desktop version of nav links */}
            <li>
              <Link 
                to="/" 
                style={{ 
                  textDecoration: 'none',
                  color: location.pathname === '/' ? currentStyle.activeColor : currentStyle.textColor,
                  fontWeight: location.pathname === '/' ? '600' : '400',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                  fontSize: '0.9rem'
                }}
                onMouseEnter={(e) => {
                  if (location.pathname !== '/') {
                    e.currentTarget.style.backgroundColor = currentStyle.hoverBg;
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname !== '/') {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                Home
              </Link>
            </li>

            {isAuthenticated() && (
              <li>
                <Link 
                  to="/create-poll" 
                  style={{ 
                    textDecoration: 'none',
                    color: location.pathname === '/create-poll' ? currentStyle.activeColor : currentStyle.textColor,
                    fontWeight: location.pathname === '/create-poll' ? '600' : '400',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    fontSize: '0.9rem'
                  }}
                  onMouseEnter={(e) => {
                    if (location.pathname !== '/create-poll') {
                      e.currentTarget.style.backgroundColor = currentStyle.hoverBg;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== '/create-poll') {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  Create Poll
                </Link>
              </li>
            )}

            {isAuthenticated() ? (
              <li style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  color: '#059669',
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  Welcome, {user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  style={{ 
                    padding: '6px 12px',
                    backgroundColor: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '500',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <Link 
                    to="/login" 
                    style={{ 
                      textDecoration: 'none',
                      color: location.pathname === '/login' ? currentStyle.activeColor : currentStyle.textColor,
                      fontWeight: location.pathname === '/login' ? '600' : '400',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                      fontSize: '0.9rem'
                    }}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/register" 
                    style={{ 
                      textDecoration: 'none',
                      color: location.pathname === '/register' ? currentStyle.activeColor : currentStyle.textColor,
                      fontWeight: location.pathname === '/register' ? '600' : '400',
                      padding: '8px 16px',
                      borderRadius: '6px',
                      transition: 'all 0.2s',
                      fontSize: '0.9rem'
                    }}
                  >
                    Register
                  </Link>
                </li>
              </>
            )}

            <li>
              <ThemeToggle />
            </li>

            <li>
              <a 
                href="https://online-poll-backend-ehm8.onrender.com/admin" 
                target="_blank"
                rel="noopener noreferrer"
                style={{ 
                  textDecoration: 'none',
                  color: currentStyle.textColor,
                  padding: '8px 12px',
                  borderRadius: '6px',
                  transition: 'all 0.2s',
                  fontSize: '0.8rem',
                  border: `1px solid ${currentStyle.borderColor}`
                }}
              >
                Admin
              </a>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Button - Hidden on desktop */}
        <button
          onClick={toggleMenu}
          className="mobile-menu-button"
          aria-label="Toggle menu"
          style={{
            display: 'none',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '30px',
            height: '30px',
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            gap: '4px',
            zIndex: 1001
          }}
        >
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: currentStyle.activeColor,
            transition: 'all 0.3s',
            transform: isMenuOpen ? 'rotate(45deg) translate(6px, 6px)' : 'none'
          }}></span>
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: currentStyle.activeColor,
            transition: 'all 0.3s',
            opacity: isMenuOpen ? 0 : 1
          }}></span>
          <span style={{
            width: '100%',
            height: '2px',
            backgroundColor: currentStyle.activeColor,
            transition: 'all 0.3s',
            transform: isMenuOpen ? 'rotate(-45deg) translate(6px, -6px)' : 'none'
          }}></span>
        </button>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div 
            className="mobile-menu-overlay"
            onClick={handleOverlayClick}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              zIndex: 999
            }}
          >
            {/* Mobile Navigation Menu */}
            <div 
              className="mobile-menu"
              onClick={(e) => e.stopPropagation()}
              style={{
                position: 'fixed',
                top: '80px',
                left: '20px',
                right: '20px',
                backgroundColor: currentStyle.backgroundColor,
                borderRadius: '12px',
                boxShadow: currentStyle.shadow,
                zIndex: 1000,
                maxHeight: 'calc(100vh - 100px)',
                overflowY: 'auto',
                border: `1px solid ${currentStyle.borderColor}`
              }}
            >
              <ul style={{ 
                listStyle: 'none',
                margin: 0,
                padding: '20px 0',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                {navLinks}
              </ul>
            </div>
          </div>
        )}
      </div>

      <style>{`
        /* Mobile styles */
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          
          .mobile-menu-button {
            display: flex !important;
          }
        }
        
        /* Desktop styles */
        @media (min-width: 769px) {
          .mobile-menu-button {
            display: none !important;
          }
          
          .mobile-menu-overlay {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;