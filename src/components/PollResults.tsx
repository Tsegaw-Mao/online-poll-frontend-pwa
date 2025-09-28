import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from "../services/api";
import { ENDPOINTS } from "../services/api";
import type { Poll, Option } from "../types/poll";

const PollResults: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Color palette for charts
  const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#f97316', '#84cc16', '#ec4899', '#6366f1'];

  const fetchPoll = async () => {
    if (!id) return;
    
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(ENDPOINTS.POLLS.DETAIL(parseInt(id)));
      setPoll(response.data);
      setLastUpdated(new Date());
    } catch (err: any) {
      console.error('Failed to fetch poll results:', err);
      setError(err.response?.data?.detail || 'Failed to load poll results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();

    // Set up auto-refresh every 5 seconds for real-time updates
    const intervalId = setInterval(fetchPoll, 5000);
    
    return () => clearInterval(intervalId);
  }, [id]);

  // Prepare data for charts
  const chartData = poll?.options?.map((option: Option, index: number) => ({
    name: option.text,
    votes: option.vote_count,
    percentage: poll.total_votes ? ((option.vote_count / poll.total_votes) * 100).toFixed(1) : 0,
    color: COLORS[index % COLORS.length]
  })) || [];

  if (loading && !poll) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '4px solid #f3f3f3', 
          borderTop: '4px solid #2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 16px'
        }}></div>
        <p>Loading poll results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <div style={{ color: '#dc2626', marginBottom: '20px' }}>
          <h2>Error Loading Results</h2>
          <p>{error}</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '10px'
          }}
        >
          Back to Polls
        </button>
        <button 
          onClick={fetchPoll}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#059669',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!poll) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        <p>Poll not found.</p>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginTop: '16px'
          }}
        >
          Back to Polls
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
      {/* Navigation */}
      <nav style={{ marginBottom: '24px' }}>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: '0.9rem',
            marginBottom: '8px'
          }}
        >
          ← Back to All Polls
        </button>
        <button 
          onClick={() => navigate(`/poll/${poll.id}/vote`)}
          style={{ 
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← Back to Voting
        </button>
      </nav>

      {/* Header */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '32px'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '8px'
        }}>
          {poll.title} - Results
        </h1>
        
        {poll.description && (
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '20px'
          }}>
            {poll.description}
          </p>
        )}

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          fontSize: '0.9rem',
          color: '#6b7280'
        }}>
          <div>
            <strong>Created by:</strong> {poll.created_by}
          </div>
          <div>
            <strong>Total Votes:</strong> {poll.total_votes || 0}
          </div>
          <div>
            <strong>Options:</strong> {poll.options?.length || 0}
          </div>
          <div>
            <strong>Last Updated:</strong> {lastUpdated.toLocaleTimeString()}
          </div>
        </div>

        {/* Auto-refresh indicator */}
        <div style={{ 
          marginTop: '16px',
          padding: '8px 12px',
          backgroundColor: '#f0f9ff',
          border: '1px solid #bae6fd',
          borderRadius: '6px',
          fontSize: '0.8rem',
          color: '#0369a1',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '8px',
            height: '8px',
            backgroundColor: '#0ea5e9',
            borderRadius: '50%',
            animation: 'pulse 2s infinite'
          }}></div>
          Live results - updating every 5 seconds
        </div>
      </div>

      {/* Charts Section */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '32px',
        marginBottom: '40px'
      }}>
        {/* Pie Chart */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#374151'
          }}>
            Vote Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${percentage}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="votes"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: number) => [`${value} votes`, 'Votes']}
                labelFormatter={(label) => `Option: ${label}`}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div style={{ 
          backgroundColor: 'white',
          padding: '24px',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#374151'
          }}>
            Vote Comparison
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip 
                formatter={(value: number) => [`${value} votes`, 'Votes']}
                labelFormatter={(label) => `Option: ${label}`}
              />
              <Legend />
              <Bar dataKey="votes" name="Votes">
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Results Table */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          marginBottom: '24px',
          color: '#374151'
        }}>
          Detailed Results
        </h3>
        
        <div style={{ display: 'grid', gap: '12px' }}>
          {poll.options?.map((option, index) => {
            const percentage = poll.total_votes ? ((option.vote_count / poll.total_votes) * 100) : 0;
            
            return (
              <div key={option.id} style={{ 
                padding: '16px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '8px'
                }}>
                  <span style={{ 
                    fontSize: '1rem', 
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      backgroundColor: COLORS[index % COLORS.length],
                      borderRadius: '2px'
                    }}></div>
                    {option.text}
                  </span>
                  <span style={{ fontWeight: '600', color: '#059669' }}>
                    {option.vote_count} vote{option.vote_count !== 1 ? 's' : ''}
                  </span>
                </div>
                
                {/* Progress bar */}
                <div style={{ 
                  width: '100%',
                  height: '8px',
                  backgroundColor: '#e5e7eb',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{ 
                      width: `${percentage}%`,
                      height: '100%',
                      backgroundColor: COLORS[index % COLORS.length],
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '4px',
                  fontSize: '0.8rem',
                  color: '#6b7280'
                }}>
                  <span>{percentage.toFixed(1)}%</span>
                  <span>{option.vote_count} of {poll.total_votes} total votes</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        justifyContent: 'center',
        marginTop: '40px',
        padding: '20px'
      }}>
        <button 
          onClick={() => navigate(`/poll/${poll.id}/vote`)}
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
          Vote on This Poll
        </button>
        <button 
          onClick={() => navigate('/')}
          style={{ 
            padding: '12px 24px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          Back to All Polls
        </button>
      </div>
    </div>
  );
};

export default PollResults;