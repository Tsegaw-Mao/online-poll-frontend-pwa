import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { ENDPOINTS } from "../services/api";
import type { Poll } from "../types/poll";

const PollVote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [poll, setPoll] = useState<Poll | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [voting, setVoting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoll = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      try {
        const response = await api.get(ENDPOINTS.POLLS.DETAIL(parseInt(id)));
        setPoll(response.data);
      } catch (err: any) {
        console.error('Failed to fetch poll:', err);
        setError(err.response?.data?.detail || 'Failed to load poll');
      } finally {
        setLoading(false);
      }
    };

    fetchPoll();
  }, [id]);

  const handleVote = async () => {
    if (!selectedOption || !poll) return;
    
    setVoting(true);
    setError(null);
    try {
      await api.post(ENDPOINTS.POLLS.VOTE, { 
        poll_id: poll.id, 
        option_id: selectedOption 
      });
      
      // Redirect to results page after successful vote
      navigate(`/poll/${poll.id}/results`);
    } catch (err: any) {
      console.error('Failed to vote:', err);
      setError(err.response?.data?.detail || 'Failed to cast vote');
    } finally {
      setVoting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '600px',
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
        <p>Loading poll...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{ color: '#dc2626', marginBottom: '20px' }}>
          <h2>Error</h2>
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
            cursor: 'pointer'
          }}
        >
          Back to Polls
        </button>
      </div>
    );
  }

  if (!poll) {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        maxWidth: '600px',
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
      padding: '40px 20px',
      maxWidth: '600px',
      margin: '0 auto'
    }}>
      {/* Breadcrumb */}
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
            fontSize: '0.9rem'
          }}
        >
          ← Back to All Polls
        </button>
      </nav>

      {/* Poll Content */}
      <div style={{ 
        backgroundColor: 'white',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#111827',
          marginBottom: '8px'
        }}>
          {poll.title}
        </h1>
        
        {poll.description && (
          <p style={{ 
            color: '#6b7280', 
            fontSize: '1.1rem',
            lineHeight: '1.6',
            marginBottom: '32px'
          }}>
            {poll.description}
          </p>
        )}

        <div style={{ marginBottom: '8px', color: '#6b7280', fontSize: '0.9rem' }}>
          <strong>Created by:</strong> {poll.created_by} • 
          <strong> Expires:</strong> {new Date(poll.expiry_date).toLocaleDateString()}
        </div>

        {/* Voting Options */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: '600', 
            marginBottom: '20px',
            color: '#374151'
          }}>
            Select your choice:
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {poll.options?.map((option) => (
              <label 
                key={option.id}
                style={{ 
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  border: selectedOption === option.id ? '2px solid #2563eb' : '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: selectedOption === option.id ? '#f0f7ff' : 'white',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (selectedOption !== option.id) {
                    e.currentTarget.style.backgroundColor = '#f9fafb';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedOption !== option.id) {
                    e.currentTarget.style.backgroundColor = 'white';
                  }
                }}
              >
                <input
                  type="radio"
                  name="pollOption"
                  value={option.id}
                  checked={selectedOption === option.id}
                  onChange={() => setSelectedOption(option.id)}
                  style={{ 
                    marginRight: '12px',
                    width: '18px',
                    height: '18px'
                  }}
                />
                <span style={{ fontSize: '1rem', fontWeight: '500' }}>
                  {option.text}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Vote Button */}
        <button
          disabled={!selectedOption || voting}
          onClick={handleVote}
          style={{ 
            width: '100%',
            padding: '16px',
            backgroundColor: selectedOption ? '#2563eb' : '#9ca3af',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: selectedOption ? 'pointer' : 'not-allowed',
            fontSize: '1.1rem',
            fontWeight: '600',
            transition: 'background-color 0.2s'
          }}
          onMouseEnter={(e) => {
            if (selectedOption) {
              e.currentTarget.style.backgroundColor = '#1d4ed8';
            }
          }}
          onMouseLeave={(e) => {
            if (selectedOption) {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }
          }}
        >
          {voting ? (
            <>
              <div style={{ 
                display: 'inline-block',
                width: '16px',
                height: '16px',
                border: '2px solid transparent',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                marginRight: '8px'
              }}></div>
              Casting Vote...
            </>
          ) : (
            'Cast Your Vote'
          )}
        </button>

        {error && (
          <div style={{ 
            color: '#dc2626', 
            textAlign: 'center',
            marginTop: '16px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            borderRadius: '6px',
            border: '1px solid #fecaca'
          }}>
            {error}
          </div>
        )}

        {/* View Results Link */}
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <button 
            onClick={() => navigate(`/poll/${poll.id}/results`)}
            style={{ 
              background: 'none',
              border: 'none',
              color: '#2563eb',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '0.9rem'
            }}
          >
            View current results without voting
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollVote;