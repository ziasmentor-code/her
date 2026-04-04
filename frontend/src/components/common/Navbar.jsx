import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SOSModal from './SOSModal';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;1,9..40,400&display=swap');

  .nb-root {
    font-family: 'DM Sans', sans-serif;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #faf7f4;
    border-bottom: 0.5px solid #ecddd4;
  }

  .nb-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 24px;
    height: 54px;
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .nb-logo {
    display: flex; align-items: center; gap: 8px;
    text-decoration: none; flex-shrink: 0;
  }
  .nb-logo-mark {
    width: 28px; height: 28px; border-radius: 8px;
    background: linear-gradient(135deg, #c4714a, #9e4a28);
    display: flex; align-items: center; justify-content: center;
  }
  .nb-logo-mark svg { width: 14px; height: 14px; fill: #fff; }
  .nb-logo-name {
    font-size: 16px; font-weight: 500;
    color: #3b1f14; letter-spacing: -0.2px;
    font-style: italic;
  }

  .nb-space { flex: 1; }

  .nb-search { position: relative; display: flex; align-items: center; }
  .nb-search-icon {
    position: absolute; left: 9px;
    color: #b09080; font-size: 13px; pointer-events: none;
  }
  .nb-search input {
    padding: 6px 12px 6px 30px;
    border: 0.5px solid #ddd0c5;
    border-radius: 7px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    color: #3b1f14; background: #f3ede7;
    outline: none; width: 180px;
    transition: width 0.25s, border-color 0.15s, background 0.15s;
  }
  .nb-search input::placeholder { color: #c4a898; }
  .nb-search input:focus {
    width: 230px;
    border-color: #c4714a;
    background: #fff;
  }

  .nb-actions { display: flex; align-items: center; gap: 3px; }
  .nb-sep { width: 0.5px; height: 18px; background: #ddd0c5; margin: 0 5px; }

  .nb-btn {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 5px 13px; border-radius: 6px;
    font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
    cursor: pointer; text-decoration: none; border: 0.5px solid transparent;
    transition: background 0.15s, border-color 0.15s, transform 0.12s, color 0.15s;
    white-space: nowrap;
  }

  .nb-signin {
    background: transparent; color: #6b3a28; border-color: #ddd0c5;
  }
  .nb-signin:hover {
    background: #f3ede7; border-color: #c4a898;
    color: #3b1f14; transform: translateY(-1px);
  }

  .nb-logout {
    background: transparent; color: #9e7060; border-color: #ddd0c5;
  }
  .nb-logout:hover {
    background: #fff0ed; border-color: #f4a090;
    color: #c0392b; transform: translateY(-1px);
  }

  .nb-donate {
    background: transparent; color: #c4714a; border-color: #ddd0c5;
  }
  .nb-donate:hover {
    background: #f7ede6; border-color: #c4714a;
    transform: translateY(-1px);
  }

  .nb-exit {
    background: transparent; color: #9e7060;
    border-color: transparent; padding: 5px 9px; font-size: 12.5px;
  }
  .nb-exit:hover {
    background: #f3ede7; color: #6b3a28;
    transform: translateY(-1px);
  }

  .nb-sos {
    background: #b93a2a; color: #fff;
    border-color: transparent;
    font-weight: 600; font-size: 12px; letter-spacing: 0.7px;
    padding: 5px 14px;
  }
  .nb-sos:hover { background: #9b2d1f; transform: translateY(-1px); }

  .nb-user {
    font-size: 12.5px; color: #9e7060; padding: 0 4px;
  }
  .nb-user strong { color: #3b1f14; font-weight: 500; }

  @media (max-width: 768px) {
    .nb-inner { padding: 0 16px; gap: 10px; }
    .nb-search input { width: 120px; }
    .nb-search input:focus { width: 160px; }
    .nb-btn { padding: 5px 10px; font-size: 12px; }
    .nb-user { display: none; }
  }
`;

function Navbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [showSOS, setShowSOS] = useState(false);

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  const isLoggedIn = !!token;

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleExit = () => {
    window.location.href = 'https://www.google.com';
  };

  return (
    <>
      <style>{styles}</style>
      <nav className="nb-root">
        <div className="nb-inner">

          <Link to="/" className="nb-logo">
            <div className="nb-logo-mark">
              <svg viewBox="0 0 16 16">
                <path d="M8 2C5.2 2 3 4.2 3 7c0 2 1.1 3.7 2.8 4.6L8 14l2.2-2.4C11.9 10.7 13 9 13 7c0-2.8-2.2-5-5-5z"/>
              </svg>
            </div>
            <span className="nb-logo-name">HerCircle</span>
          </Link>

          <div className="nb-space" />

          <div className="nb-search">
            <span className="nb-search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="nb-actions">
            <Link to="/donate" className="nb-btn nb-donate">Donate</Link>

            <div className="nb-sep" />

            {isLoggedIn ? (
              <>
                {user?.username && (
                  <span className="nb-user">Hi, <strong>{user.username}</strong></span>
                )}
                <button className="nb-btn nb-logout" onClick={handleLogout}>Log Out</button>
              </>
            ) : (
              <Link to="/login" className="nb-btn nb-signin">Sign In</Link>
            )}

            <div className="nb-sep" />

            <button className="nb-btn nb-exit" onClick={handleExit}>&#x2715; Exit</button>
            <button className="nb-btn nb-sos" onClick={() => setShowSOS(true)}>SOS</button>
          </div>

        </div>
      </nav>

      {showSOS && <SOSModal onClose={() => setShowSOS(false)} />}
    </>
  );
}

export default Navbar;
