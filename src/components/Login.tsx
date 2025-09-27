import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../services/api";
import { ENDPOINTS } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import type { LoginCredentials } from "../types/auth";

const Login: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [credentials, setCredentials] = useState<LoginCredentials>({
        username: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string>("");

    // Get redirect path from location state or default to home
    const from = (location.state as any)?.from?.pathname || "/";

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (!credentials.username || !credentials.password) {
            setError("Please enter both username and password");
            setLoading(false);
            return;
        }

        try {
            const response = await api.post(ENDPOINTS.AUTH.LOGIN, credentials);

            // Handle different response structures
            let accessToken, refreshToken;

            if (response.data.access && response.data.refresh) {
                // Standard response structure
                accessToken = response.data.access;
                refreshToken = response.data.refresh;
            } else if (response.data.token) {
                // Alternative structure
                accessToken = response.data.token;
                refreshToken = response.data.refresh || response.data.token;
            } else {
                throw new Error("Invalid response format from server");
            }

            // Store tokens
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            localStorage.setItem('username', credentials.username);

            // Update auth context
            login(accessToken, refreshToken, credentials.username);

            // Show success and redirect
            setError(""); // Clear any previous errors

            // Redirect to the intended page or home
            navigate(from, { replace: true });

        } catch (err: any) {
            console.error("Login error:", err);
            setError(
                err.response?.data?.detail ||
                err.response?.data?.message ||
                "Login failed. Please check your credentials and try again."
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
                    Sign In
                </h1>

                <p style={{
                    textAlign: "center",
                    color: "#6b7280",
                    marginBottom: "32px"
                }}>
                    Access your poll account
                </p>

                <form onSubmit={handleLogin}>
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
                                fontSize: "1rem",
                                transition: "border-color 0.2s"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#3b82f6";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#d1d5db";
                            }}
                            placeholder="Enter your username"
                        />
                    </div>

                    <div style={{ marginBottom: "24px" }}>
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
                                fontSize: "1rem",
                                transition: "border-color 0.2s"
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#3b82f6";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#d1d5db";
                            }}
                            placeholder="Enter your password"
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

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: loading ? "#9ca3af" : "#2563eb",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            fontWeight: "500",
                            cursor: loading ? "not-allowed" : "pointer",
                            transition: "background-color 0.2s"
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
                                Signing In...
                            </>
                        ) : (
                            "Sign In"
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
                        Don't have an account?
                    </p>
                    <Link
                        to="/register"
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
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f0f7ff";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent";
                        }}
                    >
                        Create Account
                    </Link>
                </div>

                <div style={{
                    marginTop: "20px",
                    padding: "12px",
                    backgroundColor: "#f0f9ff",
                    borderRadius: "6px",
                    fontSize: "0.8rem",
                    color: "#0369a1",
                    textAlign: "center"
                }}>
                    <strong>Demo Tip:</strong> Use your backend credentials to login
                </div>
            </div>
        </div>
    );
};

export default Login;