import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .login-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
    background: #fafaf8;
  }

  /* Left panel */
  .login-panel-left {
    background: #1c1917;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }
  .login-panel-left::before {
    content: '';
    position: absolute;
    top: -120px; right: -120px;
    width: 420px; height: 420px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(167,139,250,0.18) 0%, transparent 70%);
    pointer-events: none;
  }
  .login-panel-left::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 320px; height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(251,191,36,0.10) 0%, transparent 70%);
    pointer-events: none;
  }

  .login-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1;
  }
  .login-brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #a78bfa, #7c3aed);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .login-brand-name {
    font-family: 'Playfair Display', serif;
    color: #fafaf8;
    font-size: 20px;
    letter-spacing: -0.3px;
  }

  .login-left-body {
    z-index: 1;
  }
  .login-left-body h2 {
    font-family: 'Playfair Display', serif;
    color: #fafaf8;
    font-size: 38px;
    line-height: 1.2;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .login-left-body p {
    color: #a8a29e;
    font-size: 15px;
    line-height: 1.6;
    max-width: 300px;
    font-weight: 300;
  }

  .login-left-footer {
    display: flex;
    gap: 12px;
    z-index: 1;
  }
  .login-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: #44403c;
  }
  .login-dot.active { background: #a78bfa; }

  /* Right panel */
  .login-panel-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 64px;
  }

  .login-form-container {
    width: 100%;
    max-width: 380px;
    animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .login-form-header {
    margin-bottom: 36px;
  }
  .login-form-header h1 {
    font-size: 26px;
    font-weight: 600;
    color: #1c1917;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .login-form-header p {
    color: #78716c;
    font-size: 14px;
    font-weight: 400;
  }

  .login-field {
    margin-bottom: 20px;
  }
  .login-field label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #44403c;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .login-field input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #e7e5e4;
    border-radius: 10px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #1c1917;
    background: #fff;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .login-field input::placeholder { color: #c4bfbc; }
  .login-field input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.09);
  }

  .login-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
  }

  .login-btn {
    width: 100%;
    padding: 12px;
    background: #1c1917;
    color: #fafaf8;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s;
    letter-spacing: 0.2px;
    margin-top: 4px;
  }
  .login-btn:hover:not(:disabled) {
    background: #292524;
    transform: translateY(-1px);
  }
  .login-btn:active { transform: translateY(0); }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .login-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0;
  }
  .login-divider span {
    flex: 1;
    height: 1px;
    background: #e7e5e4;
  }
  .login-divider p {
    color: #a8a29e;
    font-size: 12px;
  }

  .login-footer-text {
    text-align: center;
    font-size: 13px;
    color: #78716c;
  }
  .login-footer-text a {
    color: #7c3aed;
    font-weight: 600;
    text-decoration: none;
  }
  .login-footer-text a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .login-root { grid-template-columns: 1fr; }
    .login-panel-left { display: none; }
    .login-panel-right { padding: 32px 24px; }
  }
`;

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/login/', { username, password });
            if (response.data.success && response.data.token) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                window.location.href = '/';
            } else {
                setError(response.data.error || 'Login failed');
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid username or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{styles}</style>
            <div className="login-root">

                {/* Left decorative panel */}
                <div className="login-panel-left">
                    <div className="login-brand">
                        <div className="login-brand-icon">🌺</div>
                        <span className="login-brand-name">HerCircle</span>
                    </div>
                    <div className="login-left-body">
                        <h2>A space made for you.</h2>
                        <p>Connect, share, and grow with a community that understands you.</p>
                    </div>
                    <div className="login-left-footer">
                        <div className="login-dot active" />
                        <div className="login-dot" />
                        <div className="login-dot" />
                    </div>
                </div>

                {/* Right form panel */}
                <div className="login-panel-right">
                    <div className="login-form-container">
                        <div className="login-form-header">
                            <h1>Welcome back</h1>
                            <p>Sign in to your HerCircle account</p>
                        </div>

                        {error && <div className="login-error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="login-field">
                                <label htmlFor="username">Username</label>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    required
                                    autoComplete="username"
                                />
                            </div>

                            <div className="login-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                />
                            </div>

                            <button type="submit" className="login-btn" disabled={loading}>
                                {loading ? 'Signing in…' : 'Sign In'}
                            </button>
                        </form>

                        <div className="login-divider">
                            <span /><p>or</p><span />
                        </div>

                        <p className="login-footer-text">
                            Don't have an account?{' '}
                            <Link to="/register">Create one</Link>
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
}

export default Login;