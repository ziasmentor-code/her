// frontend/src/components/admin/AdminLogin.jsx
import React, { useState } from 'react';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focused, setFocused] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:8000/api/admin/login/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);
                localStorage.setItem('user', JSON.stringify({
                    ...data.user,
                    is_superuser: true,
                    role: 'ADMIN'
                }));
                window.location.href = '/admin/dashboard';
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Connection error. Make sure server is running.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600&family=DM+Sans:wght@300;400;500&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .al-root {
                    min-height: 100vh;
                    display: flex;
                    font-family: 'DM Sans', sans-serif;
                    background: #0d0d12;
                    overflow: hidden;
                    position: relative;
                }

                /* Ambient background blobs */
                .al-blob {
                    position: absolute;
                    border-radius: 50%;
                    filter: blur(90px);
                    opacity: 0.18;
                    pointer-events: none;
                    animation: blobFloat 8s ease-in-out infinite alternate;
                }
                .al-blob-1 {
                    width: 520px; height: 520px;
                    background: radial-gradient(circle, #c84b9e, #6a0dad);
                    top: -160px; left: -160px;
                }
                .al-blob-2 {
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, #4361ee, #00c6fb);
                    bottom: -100px; right: -100px;
                    animation-delay: -4s;
                }
                @keyframes blobFloat {
                    from { transform: translate(0, 0) scale(1); }
                    to   { transform: translate(20px, 20px) scale(1.06); }
                }

                /* Grid noise overlay */
                .al-noise {
                    position: absolute; inset: 0;
                    background-image:
                        repeating-linear-gradient(0deg, rgba(255,255,255,0.015) 0px, transparent 1px),
                        repeating-linear-gradient(90deg, rgba(255,255,255,0.015) 0px, transparent 1px);
                    background-size: 40px 40px;
                    pointer-events: none;
                }

                /* Split layout */
                .al-left {
                    width: 42%;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    padding: 60px 56px;
                    position: relative;
                    border-right: 1px solid rgba(255,255,255,0.06);
                }

                .al-brand {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 48px;
                    animation: fadeUp 0.6s ease both;
                }
                .al-brand-icon {
                    width: 38px; height: 38px;
                    border-radius: 10px;
                    background: linear-gradient(135deg, #c84b9e, #4361ee);
                    display: flex; align-items: center; justify-content: center;
                }
                .al-brand-icon svg { width: 20px; height: 20px; }
                .al-brand-name {
                    font-family: 'Playfair Display', serif;
                    font-size: 20px;
                    font-weight: 600;
                    color: #fff;
                    letter-spacing: 0.02em;
                }
                .al-brand-name span { color: #c84b9e; }

                .al-tagline {
                    font-size: 38px;
                    font-weight: 500;
                    font-family: 'Playfair Display', serif;
                    color: #fff;
                    line-height: 1.25;
                    margin-bottom: 20px;
                    animation: fadeUp 0.6s 0.1s ease both;
                }
                .al-tagline em {
                    font-style: italic;
                    background: linear-gradient(90deg, #c84b9e, #4361ee);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                .al-desc {
                    font-size: 14px;
                    font-weight: 300;
                    color: rgba(255,255,255,0.45);
                    line-height: 1.7;
                    max-width: 320px;
                    animation: fadeUp 0.6s 0.2s ease both;
                }

                .al-divider {
                    width: 40px; height: 2px;
                    background: linear-gradient(90deg, #c84b9e, #4361ee);
                    border-radius: 2px;
                    margin: 32px 0;
                    animation: fadeUp 0.6s 0.3s ease both;
                }

                .al-stats {
                    display: flex;
                    gap: 32px;
                    animation: fadeUp 0.6s 0.35s ease both;
                }
                .al-stat-num {
                    font-family: 'Playfair Display', serif;
                    font-size: 22px;
                    font-weight: 600;
                    color: #fff;
                }
                .al-stat-label {
                    font-size: 11px;
                    font-weight: 400;
                    color: rgba(255,255,255,0.35);
                    text-transform: uppercase;
                    letter-spacing: 0.12em;
                    margin-top: 2px;
                }

                /* Right panel - form */
                .al-right {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 40px;
                    position: relative;
                }

                .al-card {
                    width: 100%;
                    max-width: 400px;
                    animation: fadeUp 0.5s 0.15s ease both;
                }

                .al-card-header {
                    margin-bottom: 36px;
                }
                .al-card-title {
                    font-size: 26px;
                    font-family: 'Playfair Display', serif;
                    font-weight: 500;
                    color: #fff;
                    margin-bottom: 6px;
                }
                .al-card-subtitle {
                    font-size: 13px;
                    color: rgba(255,255,255,0.35);
                    font-weight: 300;
                }

                /* Error */
                .al-error {
                    background: rgba(231, 76, 60, 0.1);
                    border: 1px solid rgba(231, 76, 60, 0.3);
                    color: #ff6b6b;
                    padding: 12px 16px;
                    border-radius: 10px;
                    font-size: 13px;
                    margin-bottom: 24px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    animation: shake 0.35s ease;
                }
                @keyframes shake {
                    0%,100% { transform: translateX(0); }
                    25%      { transform: translateX(-6px); }
                    75%      { transform: translateX(6px); }
                }

                /* Field */
                .al-field {
                    margin-bottom: 18px;
                }
                .al-label {
                    display: block;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: rgba(255,255,255,0.4);
                    margin-bottom: 8px;
                }
                .al-input-wrap {
                    position: relative;
                }
                .al-input-icon {
                    position: absolute;
                    left: 14px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: rgba(255,255,255,0.25);
                    transition: color 0.2s;
                    pointer-events: none;
                    display: flex;
                }
                .al-input-wrap:focus-within .al-input-icon {
                    color: #c84b9e;
                }
                .al-input {
                    width: 100%;
                    padding: 13px 14px 13px 42px;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    color: #fff;
                    font-size: 14px;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 300;
                    outline: none;
                    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
                }
                .al-input::placeholder { color: rgba(255,255,255,0.2); }
                .al-input:focus {
                    border-color: rgba(200, 75, 158, 0.6);
                    background: rgba(255,255,255,0.07);
                    box-shadow: 0 0 0 3px rgba(200,75,158,0.12);
                }

                /* Button */
                .al-btn {
                    width: 100%;
                    padding: 14px;
                    margin-top: 8px;
                    border: none;
                    border-radius: 10px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 14px;
                    font-weight: 500;
                    letter-spacing: 0.04em;
                    color: #fff;
                    background: linear-gradient(135deg, #c84b9e 0%, #4361ee 100%);
                    cursor: pointer;
                    position: relative;
                    overflow: hidden;
                    transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
                    box-shadow: 0 4px 20px rgba(200, 75, 158, 0.3);
                }
                .al-btn:not(:disabled):hover {
                    opacity: 0.9;
                    transform: translateY(-1px);
                    box-shadow: 0 8px 28px rgba(200, 75, 158, 0.4);
                }
                .al-btn:not(:disabled):active {
                    transform: translateY(0);
                }
                .al-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .al-btn-inner {
                    display: flex; align-items: center;
                    justify-content: center; gap: 8px;
                }

                /* Spinner */
                .al-spinner {
                    width: 16px; height: 16px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-top-color: #fff;
                    border-radius: 50%;
                    animation: spin 0.7s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }

                /* Footer */
                .al-footer {
                    margin-top: 28px;
                    text-align: center;
                    font-size: 12px;
                    color: rgba(255,255,255,0.2);
                    font-weight: 300;
                }

                /* Fade up */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(16px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                /* Responsive */
                @media (max-width: 720px) {
                    .al-left { display: none; }
                    .al-right { padding: 40px 24px; }
                }
            `}</style>

            <div className="al-root">
                <div className="al-blob al-blob-1" />
                <div className="al-blob al-blob-2" />
                <div className="al-noise" />

                {/* Left Panel */}
                <div className="al-left">
                    <div className="al-brand">
                        <div className="al-brand-icon">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/>
                            </svg>
                        </div>
                        <div className="al-brand-name">Her<span>Circle</span></div>
                    </div>

                    <div className="al-tagline">
                        Manage with<br /><em>clarity & care</em>
                    </div>

                    <p className="al-desc">
                        Your central hub for overseeing community health, user activity, and platform growth.
                    </p>

                    <div className="al-divider" />

                    <div className="al-stats">
                        <div>
                            <div className="al-stat-num">12k+</div>
                            <div className="al-stat-label">Members</div>
                        </div>
                        <div>
                            <div className="al-stat-num">98%</div>
                            <div className="al-stat-label">Uptime</div>
                        </div>
                        <div>
                            <div className="al-stat-num">24/7</div>
                            <div className="al-stat-label">Support</div>
                        </div>
                    </div>
                </div>

                {/* Right Panel */}
                <div className="al-right">
                    <div className="al-card">
                        <div className="al-card-header">
                            <div className="al-card-title">Admin Sign In</div>
                            <div className="al-card-subtitle">Access restricted to authorized personnel</div>
                        </div>

                        {error && (
                            <div className="al-error">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                                </svg>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="al-field">
                                <label className="al-label">Email Address</label>
                                <div className="al-input-wrap">
                                    <span className="al-input-icon">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                                        </svg>
                                    </span>
                                    <input
                                        className="al-input"
                                        type="email"
                                        placeholder="admin@hercircle.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                </div>
                            </div>

                            <div className="al-field">
                                <label className="al-label">Password</label>
                                <div className="al-input-wrap">
                                    <span className="al-input-icon">
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                        </svg>
                                    </span>
                                    <input
                                        className="al-input"
                                        type="password"
                                        placeholder="••••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        autoComplete="current-password"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="al-btn" disabled={loading}>
                                <div className="al-btn-inner">
                                    {loading ? (
                                        <>
                                            <div className="al-spinner" />
                                            Authenticating...
                                        </>
                                    ) : (
                                        <>
                                            Sign In
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M5 12h14M12 5l7 7-7 7"/>
                                            </svg>
                                        </>
                                    )}
                                </div>
                            </button>
                        </form>

                        <div className="al-footer">
                            © {new Date().getFullYear()} HerCircle · Admin Portal v2.0
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AdminLogin;