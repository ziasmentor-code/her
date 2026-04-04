import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Playfair+Display:wght@500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .reg-root {
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-family: 'DM Sans', sans-serif;
    background: #fafaf8;
  }

  /* Left panel */
  .reg-panel-left {
    background: #1c1917;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 48px;
    position: relative;
    overflow: hidden;
  }
  .reg-panel-left::before {
    content: '';
    position: absolute;
    top: -100px; right: -100px;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(167,139,250,0.15) 0%, transparent 70%);
    pointer-events: none;
  }
  .reg-panel-left::after {
    content: '';
    position: absolute;
    bottom: -80px; left: -80px;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(251,191,36,0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  .reg-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 1;
  }
  .reg-brand-icon {
    width: 36px; height: 36px;
    background: linear-gradient(135deg, #a78bfa, #7c3aed);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
  }
  .reg-brand-name {
    font-family: 'Playfair Display', serif;
    color: #fafaf8;
    font-size: 20px;
    letter-spacing: -0.3px;
  }

  .reg-left-body { z-index: 1; }
  .reg-left-body h2 {
    font-family: 'Playfair Display', serif;
    color: #fafaf8;
    font-size: 38px;
    line-height: 1.2;
    font-weight: 500;
    margin-bottom: 16px;
  }
  .reg-left-body p {
    color: #a8a29e;
    font-size: 15px;
    line-height: 1.6;
    max-width: 300px;
    font-weight: 300;
  }

  .reg-features {
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .reg-feature-item {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .reg-feature-dot {
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(167,139,250,0.15);
    display: flex; align-items: center; justify-content: center;
    font-size: 14px;
    flex-shrink: 0;
  }
  .reg-feature-item span {
    color: #a8a29e;
    font-size: 13px;
    font-weight: 300;
  }

  /* Right panel */
  .reg-panel-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 48px 64px;
    overflow-y: auto;
  }

  .reg-form-container {
    width: 100%;
    max-width: 380px;
    animation: slideUp 0.5s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .reg-form-header {
    margin-bottom: 32px;
  }
  .reg-form-header h1 {
    font-size: 26px;
    font-weight: 600;
    color: #1c1917;
    letter-spacing: -0.5px;
    margin-bottom: 6px;
  }
  .reg-form-header p {
    color: #78716c;
    font-size: 14px;
    font-weight: 400;
  }

  .reg-field {
    margin-bottom: 16px;
  }
  .reg-field label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #44403c;
    margin-bottom: 6px;
    letter-spacing: 0.2px;
  }
  .reg-field input {
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
  .reg-field input::placeholder { color: #c4bfbc; }
  .reg-field input:focus {
    border-color: #7c3aed;
    box-shadow: 0 0 0 3px rgba(124,58,237,0.09);
  }
  .reg-field input.error {
    border-color: #f87171;
    box-shadow: 0 0 0 3px rgba(248,113,113,0.09);
  }
  .reg-field-hint {
    font-size: 12px;
    color: #a8a29e;
    margin-top: 4px;
  }
  .reg-field-hint.error { color: #dc2626; }

  .reg-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 18px;
  }

  .reg-success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #16a34a;
    padding: 11px 14px;
    border-radius: 10px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 18px;
  }

  .reg-btn {
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
    margin-top: 8px;
  }
  .reg-btn:hover:not(:disabled) {
    background: #292524;
    transform: translateY(-1px);
  }
  .reg-btn:active { transform: translateY(0); }
  .reg-btn:disabled { opacity: 0.5; cursor: not-allowed; }

  .reg-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 22px 0;
  }
  .reg-divider span {
    flex: 1;
    height: 1px;
    background: #e7e5e4;
  }
  .reg-divider p {
    color: #a8a29e;
    font-size: 12px;
  }

  .reg-footer-text {
    text-align: center;
    font-size: 13px;
    color: #78716c;
  }
  .reg-footer-text a {
    color: #7c3aed;
    font-weight: 600;
    text-decoration: none;
  }
  .reg-footer-text a:hover { text-decoration: underline; }

  @media (max-width: 768px) {
    .reg-root { grid-template-columns: 1fr; }
    .reg-panel-left { display: none; }
    .reg-panel-right { padding: 32px 24px; }
  }
`;

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Minimum 6 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/register/', {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      if (response.data.success) {
        setSuccess('Account created! Redirecting…');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(response.data.error || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="reg-root">

        {/* Left panel */}
        <div className="reg-panel-left">
          <div className="reg-brand">
            <div className="reg-brand-icon">🌺</div>
            <span className="reg-brand-name">HerCircle</span>
          </div>

          <div className="reg-left-body">
            <h2>Join the circle today.</h2>
            <p>A safe, supportive community built for women — by women.</p>
          </div>

          <div className="reg-features">
            <div className="reg-feature-item">
              <div className="reg-feature-dot">💬</div>
              <span>Anonymous chat & peer support</span>
            </div>
            <div className="reg-feature-item">
              <div className="reg-feature-dot">📚</div>
              <span>Courses and counselling resources</span>
            </div>
            <div className="reg-feature-item">
              <div className="reg-feature-dot">🤝</div>
              <span>Sister support network</span>
            </div>
          </div>
        </div>

        {/* Right form panel */}
        <div className="reg-panel-right">
          <div className="reg-form-container">
            <div className="reg-form-header">
              <h1>Create your account</h1>
              <p>Join the HerCircle community today</p>
            </div>

            {error && <div className="reg-error">{error}</div>}
            {success && <div className="reg-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="reg-field">
                <label htmlFor="username">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="Choose a username"
                  className={fieldErrors.username ? 'error' : ''}
                  autoComplete="username"
                />
                {fieldErrors.username && <p className="reg-field-hint error">{fieldErrors.username}</p>}
              </div>

              <div className="reg-field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={fieldErrors.email ? 'error' : ''}
                  autoComplete="email"
                />
                {fieldErrors.email && <p className="reg-field-hint error">{fieldErrors.email}</p>}
              </div>

              <div className="reg-field">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={fieldErrors.password ? 'error' : ''}
                  autoComplete="new-password"
                />
                {fieldErrors.password
                  ? <p className="reg-field-hint error">{fieldErrors.password}</p>
                  : <p className="reg-field-hint">Minimum 6 characters</p>
                }
              </div>

              <div className="reg-field">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={fieldErrors.confirmPassword ? 'error' : ''}
                  autoComplete="new-password"
                />
                {fieldErrors.confirmPassword && <p className="reg-field-hint error">{fieldErrors.confirmPassword}</p>}
              </div>

              <button type="submit" className="reg-btn" disabled={loading}>
                {loading ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <div className="reg-divider">
              <span /><p>or</p><span />
            </div>

            <p className="reg-footer-text">
              Already have an account?{' '}
              <Link to="/login">Sign In</Link>
            </p>
          </div>
        </div>

      </div>
    </>
  );
}

export default Register;