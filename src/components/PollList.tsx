import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { ENDPOINTS } from "../services/api";
import type { Poll } from "../types/poll";
import { useAuth } from "../hooks/useAuth";
import { useMemo } from 'react';
import { PollSkeleton } from './SkeletonLoader';
import SearchBar from './SearchBar';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../hooks/useTheme';

const PollList: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const { addNotification } = useNotifications();
  const { theme } = useTheme();

  // Theme-based card styles
  const cardStyles = {
    light: {
      backgroundColor: '#ffffff',
      borderColor: '#e5e7eb',
      textColor: '#111827',
      secondaryText: '#6b7280',
      hoverShadow: '0 4px 16px rgba(0,0,0,0.15)'
    },
    dark: {
      backgroundColor: '#374151',
      borderColor: '#4b5563',
      textColor: '#f9fafb',
      secondaryText: '#d1d5db',
      hoverShadow: '0 4px 16px rgba(0,0,0,0.3)'
    }
  };

  const currentCardStyle = cardStyles[theme];


  // Filters state
  const [filters, setFilters] = useState({
    created_by: "",
    id: "",
    expiry_start: "",
    expiry_end: "",
    created_start: "",
    created_end: "",
  });

  // Pagination & sorting
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordering, setOrdering] = useState("-created_at"); // newest first

  const fetchPolls = async () => {
    setLoading(true);
    setError(null);
    try {
      const params: any = {
        page,
        ordering,
      };

      // Add filters only if they have values
      if (filters.created_by) params.created_by = filters.created_by;
      if (filters.id) params.id = filters.id;
      if (filters.expiry_start) params.expiry_start = filters.expiry_start;
      if (filters.expiry_end) params.expiry_end = filters.expiry_end;
      if (filters.created_start) params.created_start = filters.created_start;
      if (filters.created_end) params.created_end = filters.created_end;

      console.log('Fetching polls with params:', params);

      const res = await api.get(ENDPOINTS.POLLS.LIST, { params });
      console.log('Polls response:', res.data);

      setPolls(res.data.results || []);
      setTotalPages(Math.ceil(res.data.count / 10) || 1);
    } catch (err: any) {
      console.error('Error fetching polls:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        "Failed to fetch polls. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Filter polls based on search term
  const filteredPolls = useMemo(() => {
    if (!searchTerm) return polls;

    const term = searchTerm.toLowerCase();
    return polls.filter(poll =>
      poll.title.toLowerCase().includes(term) ||
      poll.description?.toLowerCase().includes(term) ||
      poll.created_by.toLowerCase().includes(term)
    );
  }, [polls, searchTerm]);

  useEffect(() => {
    fetchPolls();
  }, [page, ordering]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyFilters = () => {
    setPage(1); // Reset to first page when filtering
    fetchPolls();
  };

  const clearFilters = () => {
    setFilters({
      created_by: "",
      id: "",
      expiry_start: "",
      expiry_end: "",
      created_start: "",
      created_end: "",
    });
    setPage(1);
    // Don't fetch immediately, let user click Apply
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px' }}>
            Online Polls
          </h1>
          <div style={{
            display: 'inline-block',
            padding: '4px 12px',
            backgroundColor: '#dbeafe',
            color: '#1e40af',
            borderRadius: '20px'
          }}>
            Loading polls...
          </div>
        </div>
        {[1, 2, 3].map(i => (
          <PollSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ color: '#dc2626', marginBottom: '16px' }}>
          <h3>Error Loading Polls</h3>
          <p>{error}</p>
        </div>
        <button
          onClick={fetchPolls}
          style={{
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      minHeight: '80vh'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '40px',
        padding: '20px 0'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          backgroundColor: currentCardStyle.backgroundColor,
          color: currentCardStyle.textColor,
          marginBottom: '8px'
        }}>
          Online Polls
        </h1>
        <p style={{
          fontSize: '1.1rem',
          backgroundColor: currentCardStyle.backgroundColor,
          color: currentCardStyle.textColor,
          marginBottom: '20px'
        }}>
          Vote on current polls and see real-time results
        </p>
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          backgroundColor: currentCardStyle.backgroundColor,
          color: currentCardStyle.textColor,
          borderRadius: '20px',
          fontSize: '0.9rem'
        }}>
          {polls.length} poll{polls.length !== 1 ? 's' : ''} available
        </div>
      </header>

      {/* Create Poll Button for Authenticated Users */}
      {isAuthenticated() && (
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link
            to="/create-poll"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '12px 24px',
              backgroundColor: '#059669',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: '500',
              fontSize: '1rem',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#047857';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>+</span>
            Create New Poll
          </Link>
        </div>
      )}

      {/* Filters Section */}
      <div style={{
        backgroundColor: currentCardStyle.backgroundColor,
        padding: '24px',
        borderRadius: '12px',
        marginBottom: '32px',
        border: currentCardStyle.borderColor
      }}>
        <h3 style={{
          fontSize: '1.25rem',
          fontWeight: '600',
          marginBottom: '20px',
          color: currentCardStyle.textColor
        }}>
          Filters & Sorting
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px',
          marginBottom: '20px'
        }}>
          {/* Text filters */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500'}}>
              Created by username:
            </label>
            <input
              type="text"
              name="created_by"
              placeholder="Filter by creator"
              value={filters.created_by}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
                backgroundColor: currentCardStyle.backgroundColor
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
              Poll ID:
            </label>
            <input
              type="text"
              name="id"
              placeholder="Filter by poll ID"
              value={filters.id}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
                backgroundColor: currentCardStyle.backgroundColor
              }}
            />
          </div>

          {/* Date filters */}
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
              Expiry date from:
            </label>
            <input
              type="date"
              name="expiry_start"
              value={filters.expiry_start}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
                backgroundColor: currentCardStyle.backgroundColor
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
              Expiry date to:
            </label>
            <input
              type="date"
              name="expiry_end"
              value={filters.expiry_end}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
                backgroundColor: currentCardStyle.backgroundColor
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
              Created date from:
            </label>
            <input
              type="date"
              name="created_start"
              value={filters.created_start}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                backgroundColor: currentCardStyle.backgroundColor,
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
              Created date to:
            </label>
            <input
              type="date"
              name="created_end"
              value={filters.created_end}
              onChange={handleFilterChange}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
                backgroundColor: currentCardStyle.backgroundColor
              }}
            />
          </div>
        </div>

        {/* Sorting and Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: '1', minWidth: '200px' }}>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '0.9rem', fontWeight: '500' }}>
              Sort by:
            </label>
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem',
                backgroundColor: currentCardStyle.backgroundColor
              }}
            >
              <option value="-created_at">Newest First</option>
              <option value="created_at">Oldest First</option>
              <option value="expiry_date">Expiry (Earliest)</option>
              <option value="-expiry_date">Expiry (Latest)</option>
              <option value="title">Title (A-Z)</option>
              <option value="-title">Title (Z-A)</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
            <button
              onClick={handleApplyFilters}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                height: 'fit-content'
              }}
            >
              Apply Filters
            </button>

            <button
              onClick={clearFilters}
              style={{
                padding: '10px 20px',
                backgroundColor: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: '500',
                height: 'fit-content'
              }}
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Polls List */}
      {polls.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#6b7280',
          backgroundColor: '#f9fafb',
          borderRadius: '12px',
          border: '1px dashed #d1d5db'
        }}>
          <p style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No polls found</p>
          <p>Try adjusting your filters or check back later for new polls.</p>
          {!isAuthenticated() && (
            <div style={{ marginTop: '20px' }}>
              <p style={{ fontSize: '0.9rem', marginBottom: '12px' }}>
                Want to create your own poll?
              </p>
              <Link
                to="/login"
                style={{
                  display: 'inline-block',
                  padding: '8px 16px',
                  backgroundColor: '#2563eb',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '6px',
                  fontSize: '0.9rem'
                }}
              >
                Login to Create Poll
              </Link>
            </div>
          )}
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {polls.map((poll) => (
              <div
                key={poll.id}
                style={{
                  border: `1px solid ${currentCardStyle.borderColor}`,
                  padding: '24px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  backgroundColor: currentCardStyle.backgroundColor,
                  color: currentCardStyle.textColor,
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = currentCardStyle.hoverShadow;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <div style={{ marginBottom: '16px' }}>
                  <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '600',
                    color: currentCardStyle.textColor,
                    marginBottom: '8px'
                  }}>
                    {poll.title}
                  </h2>

                  {poll.description && (
                    <p style={{
                      color: currentCardStyle.secondaryText,
                      fontSize: '1rem',
                      lineHeight: '1.5'
                    }}>
                      {poll.description}
                    </p>
                  )}
                </div>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '12px',
                  fontSize: '0.9rem',
                  color: currentCardStyle.secondaryText,
                  marginBottom: '20px',
                  padding: '16px',
                  backgroundColor: currentCardStyle.backgroundColor,
                  borderRadius: '8px'
                }}>
                  <div>
                    <strong style={{
                      backgroundColor: currentCardStyle.backgroundColor,
                      color: currentCardStyle.textColor
                    }}>Created by:</strong> {poll.created_by}
                  </div>
                  <div>
                    <strong style={{
                      backgroundColor: currentCardStyle.backgroundColor,
                      color: currentCardStyle.textColor
                    }}>Expires:</strong> {new Date(poll.expiry_date).toLocaleDateString()}
                  </div>
                  <div>
                    <strong style={{
                      backgroundColor: currentCardStyle.backgroundColor,
                      color: currentCardStyle.textColor
                    }}>Options:</strong> {poll.options?.length || 0}
                  </div>
                  <div>
                    <strong style={{
                      backgroundColor: currentCardStyle.backgroundColor,
                      color: currentCardStyle.textColor
                    }}>Total votes:</strong> {poll.total_votes || 0}
                  </div>
                </div>

                {/* Poll options preview */}
                {poll.options && poll.options.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      fontWeight: '600',
                      marginBottom: '12px',
                      backgroundColor: currentCardStyle.backgroundColor,
                      color: currentCardStyle.textColor
                    }}>
                      Options:
                    </h4>
                    <div style={{
                      display: 'grid',
                      gap: '8px'
                    }}>
                      {poll.options.slice(0, 3).map(option => (
                        <div key={option.id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: currentCardStyle.backgroundColor,
                          color: currentCardStyle.textColor,
                          borderRadius: '6px',
                          border: '1px solid #e2e8f0'
                        }}>
                          <span style={{ fontSize: '0.9rem' }}>{option.text}</span>
                          <span style={{
                            fontWeight: '600',
                            color: option.vote_count > 0 ? '#059669' : '#6b7280',
                            fontSize: '0.8rem'
                          }}>
                            {option.vote_count} vote{option.vote_count !== 1 ? 's' : ''}
                          </span>
                        </div>
                      ))}
                      {poll.options.length > 3 && (
                        <div style={{
                          textAlign: 'center',
                          color: '#6b7280',
                          fontSize: '0.8rem',
                          padding: '8px'
                        }}>
                          + {poll.options.length - 3} more options
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '12px' }}>
                  <Link
                    to={`/poll/${poll.id}/vote`}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#1d4ed8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#2563eb';
                    }}
                  >
                    Vote on this Poll
                  </Link>
                  <Link
                    to={`/poll/${poll.id}/results`}
                    style={{
                      flex: 1,
                      padding: '12px 20px',
                      backgroundColor: '#059669',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textDecoration: 'none',
                      textAlign: 'center',
                      fontWeight: '500',
                      fontSize: '0.9rem',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#047857';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#059669';
                    }}
                  >
                    View Results
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '16px',
              marginTop: '40px',
              padding: '20px'
            }}>
              <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: page === 1 ? '#f3f4f6' : 'white',
                  color: page === 1 ? '#9ca3af' : '#374151',
                  cursor: page === 1 ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Previous
              </button>

              <span style={{
                padding: '10px 16px',
                fontSize: '0.9rem',
                color: '#374151'
              }}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  backgroundColor: page === totalPages ? '#f3f4f6' : 'white',
                  color: page === totalPages ? '#9ca3af' : '#374151',
                  cursor: page === totalPages ? 'not-allowed' : 'pointer',
                  fontSize: '0.9rem'
                }}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PollList;