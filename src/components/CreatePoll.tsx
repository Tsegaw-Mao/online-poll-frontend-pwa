import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { ENDPOINTS } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from '../hooks/useTheme';

const CreatePoll: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  // Theme-based form styles
  const formStyles = {
    light: {
      backgroundColor: '#ffffff',
      borderColor: '#d1d5db',
      textColor: '#374151',
      labelColor: '#374151',
      focusBorder: '#2563eb'
    },
    dark: {
      backgroundColor: '#374151',
      borderColor: '#4b5563',
      textColor: '#f9fafb',
      labelColor: '#d1d5db',
      focusBorder: '#3b82f6'
    }
  };

  const currentFormStyle = formStyles[theme];

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    navigate('/login', {
      state: {
        from: '/create-poll',
        message: 'Please login to create a poll'
      }
    });
    return null;
  }

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 10) {
      setOptions([...options, ""]);
    }
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title || options.some((o) => !o)) {
      alert("❌ Title and all options are required");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title,
        description,
        expiry_date: expiryDate || undefined,
        options: options.filter(opt => opt.trim().length > 0),
      };

      const response = await api.post(ENDPOINTS.POLLS.CREATE, payload);

      alert("✅ Poll created successfully!");

      // Reset form
      setTitle("");
      setDescription("");
      setExpiryDate("");
      setOptions(["", ""]);

      // Redirect to the new poll
      setTimeout(() => {
        navigate(`/poll/${response.data.id}/vote`);
      }, 1000);

    } catch (err: any) {
      const msg =
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        "Error creating poll";
      console.error("CreatePoll error:", msg);
      alert(`❌ ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setExpiryDate("");
    setOptions(["", ""]);
  };

  return (
    <div style={{
      padding: '40px 20px 20px 20px', // Reduced top padding since header is fixed
      maxWidth: '600px',
      margin: '0 auto',
      minHeight: 'calc(100vh - 200px)'
    }}>
      {/* Nav */}
      <nav style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            fontSize: '0.9rem'
          }}
        >
          ← Back to All Polls
        </button>
      </nav>

      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '32px'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#111827',
          marginBottom: '8px'
        }}>
          Create a Poll
        </h1>
        <p style={{
          fontSize: '1rem',
          color: '#6b7280'
        }}>
          Create a poll for others to vote on
        </p>
      </div>

      {/* Create Poll Form */}
      <div style={{
        backgroundColor: currentFormStyle.backgroundColor,
        color: currentFormStyle.textColor,
        transition: 'border-color 0.2s ease',
        padding: '32px',
        borderRadius: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Poll Title */}
          <div>
            <label htmlFor="title" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              backgroundColor: currentFormStyle.backgroundColor,
              color: currentFormStyle.textColor,
              transition: 'border-color 0.2s ease'
            }}>
              Poll Title *
            </label>
            <input
              type="text"
              id="title"
              placeholder="What is your favorite programming language?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: currentFormStyle.backgroundColor,
                color: currentFormStyle.textColor,
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          {/* Poll Description */}
          <div>
            <label htmlFor="description" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              backgroundColor: currentFormStyle.backgroundColor,
              color: currentFormStyle.textColor,
              transition: 'border-color 0.2s ease'
            }}>
              Description (Optional)
            </label>
            <textarea
              id="description"
              placeholder="Add more context about your poll..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={loading}
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                resize: 'vertical',
                minHeight: '80px',
                backgroundColor: currentFormStyle.backgroundColor,
                color: currentFormStyle.textColor,
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label htmlFor="expiry_date" style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: '600',
              backgroundColor: currentFormStyle.backgroundColor,
              color: currentFormStyle.textColor,
              transition: 'border-color 0.2s ease'
            }}>
              Expiry Date (Optional)
            </label>
            <input
              type="datetime-local"
              id="expiry_date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                backgroundColor: currentFormStyle.backgroundColor,
                color: currentFormStyle.textColor,
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          {/* Poll Options */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <label style={{
                fontWeight: '600',
                backgroundColor: currentFormStyle.backgroundColor,
                color: currentFormStyle.textColor,
                transition: 'border-color 0.2s ease'
              }}>
                Poll Options *
              </label>
              <span style={{
                fontSize: '0.8rem',
                backgroundColor: currentFormStyle.backgroundColor,
                color: currentFormStyle.textColor,
                transition: 'border-color 0.2s ease'
              }}>
                {options.length}/10 options
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              {options.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    disabled={loading}
                    placeholder={`Option ${index + 1}`}
                    required
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '1rem',
                      backgroundColor: currentFormStyle.backgroundColor,
                      color: currentFormStyle.textColor,
                      transition: 'border-color 0.2s ease'
                    }}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      disabled={loading}
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>

            {options.length < 10 && (
              <button
                type="button"
                onClick={addOption}
                disabled={loading}
                style={{
                  padding: '10px 16px',
                  backgroundColor: 'transparent',
                  color: '#2563eb',
                  border: '1px solid #2563eb',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <span>+</span>
                Add Another Option
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center'
          }}>
            <button
              type="button"
              onClick={clearForm}
              disabled={loading}
              style={{
                padding: '14px 28px',
                backgroundColor: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '500'
              }}
            >
              Clear Form
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '14px 28px',
                backgroundColor: loading ? '#9ca3af' : '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '500',
                flex: 1,
                maxWidth: '200px'
              }}
            >
              {loading ? (
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
                  Creating...
                </>
              ) : (
                'Create Poll'
              )}
            </button>
          </div>
        </form>

        {/* Form Tips */}
        <div style={{
          marginTop: '32px',
          padding: '20px',
          borderRadius: '8px',
          border: '1px dashed #d1d5db',
          backgroundColor: currentFormStyle.backgroundColor,
          color: currentFormStyle.textColor,
          transition: 'border-color 0.2s ease'
        }}>
          <h4 style={{
            backgroundColor: currentFormStyle.backgroundColor,
            color: currentFormStyle.textColor,
            transition: 'border-color 0.2s ease',
            marginBottom: '12px',
            fontSize: '1rem'
          }}>
            💡 Creating Effective Polls
          </h4>
          <ul style={{
            backgroundColor: currentFormStyle.backgroundColor,
            color: currentFormStyle.textColor,
            transition: 'border-color 0.2s ease',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            paddingLeft: '20px'
          }}>
            <li>Keep poll titles clear and concise</li>
            <li>Provide balanced and distinct options</li>
            <li>Use descriptions to add context when needed</li>
            <li>Set an expiry date for time-sensitive polls</li>
            <li>2-6 options usually work best</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;