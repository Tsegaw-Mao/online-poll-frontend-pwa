import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import { ENDPOINTS } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { RegisterCredentials } from "../types/auth";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState<RegisterCredentials>({
    username: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const from = (location.state as any)?.from?.pathname || "/";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = (): string => {
    if (!credentials.username || !credentials.password || !credentials.password2) {
      return "Please fill in all fields";
    }
    
    if (credentials.username.length < 3) {
      return "Username must be at least 3 characters long";
    }
    
    if (credentials.password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    
    if (credentials.password !== credentials.password2) {
      return "Passwords do not match";
    }
    
    return "";
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await api.post(ENDPOINTS.AUTH.REGISTER, {
        username: credentials.username,
        password: credentials.password,
      });

      setSuccess("Account created successfully! Redirecting to login...");
      
      // Auto-login after successful registration
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            from: location.state,
            username: credentials.username 
          } 
        });
      }, 2000);

    } catch (err: any) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.username?.[0] ||
        err.response?.data?.detail || 
        err.response?.data?.message || 
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center",
      minHeight: "80vh",
      padding: "20px"
    }}>
      <div style={{ 
        backgroundColor: "white",
        padding: "40px",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        width: "100%",
        maxWidth: "400px"
      }}>
        <h1 style={{ 
          fontSize: "2rem", 
          fontWeight: "bold", 
          textAlign: "center",
          marginBottom: "8px",
          color: "#111827"
        }}>
          Create Account
        </h1>
        
        <p style={{ 
          textAlign: "center", 
          color: "#6b7280",
          marginBottom: "32px"
        }}>
          Join the poll community
        </p>

        <form onSubmit={handleRegister}>
          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="username" style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={credentials.username}
              onChange={handleInputChange}
              disabled={loading}
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem"
              }}
              placeholder="Choose a username"
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label htmlFor="password" style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              disabled={loading}
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem"
              }}
              placeholder="Enter your password"
            />
          </div>

          <div style={{ marginBottom: "24px" }}>
            <label htmlFor="password2" style={{ 
              display: "block", 
              marginBottom: "8px",
              fontWeight: "500",
              color: "#374151"
            }}>
              Confirm Password
            </label>
            <input
              type="password"
              id="password2"
              name="password2"
              value={credentials.password2}
              onChange={handleInputChange}
              disabled={loading}
              style={{ 
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "6px",
                fontSize: "1rem"
              }}
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div style={{ 
              padding: "12px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              color: "#dc2626",
              marginBottom: "20px",
              fontSize: "0.9rem"
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ 
              padding: "12px",
              backgroundColor: "#f0f9ff",
              border: "1px solid #bae6fd",
              borderRadius: "6px",
              color: "#0369a1",
              marginBottom: "20px",
              fontSize: "0.9rem"
            }}>
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ 
              width: "100%",
              padding: "14px",
              backgroundColor: loading ? "#9ca3af" : "#059669",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? (
              <>
                <div style={{ 
                  display: "inline-block",
                  width: "16px",
                  height: "16px",
                  border: "2px solid transparent",
                  borderTop: "2px solid white",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  marginRight: "8px"
                }}></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: "center", 
          marginTop: "24px",
          paddingTop: "24px",
          borderTop: "1px solid #e5e7eb"
        }}>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>
            Already have an account?
          </p>
          <Link 
            to="/login" 
            state={{ from: location.state }}
            style={{ 
              display: "inline-block",
              padding: "10px 20px",
              backgroundColor: "transparent",
              color: "#2563eb",
              border: "1px solid #2563eb",
              borderRadius: "6px",
              textDecoration: "none",
              fontWeight: "500",
              transition: "all 0.2s"
            }}
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;