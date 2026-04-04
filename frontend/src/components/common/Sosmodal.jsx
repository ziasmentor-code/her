import React, { useState, useEffect } from 'react';
import axios from 'axios';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');

  .sos-overlay {
    position: fixed; inset: 0;
    background: rgba(40,10,5,0.55);
    display: flex; align-items: center; justify-content: center;
    z-index: 9999;
    padding: 20px;
    font-family: 'DM Sans', sans-serif;
    animation: sosFadeIn 0.2s ease;
  }
  @keyframes sosFadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .sos-card {
    background: #faf7f4;
    border-radius: 14px;
    width: 100%; max-width: 450px;
    max-height: 90vh;
    overflow-y: auto;
    animation: sosSlideUp 0.25s cubic-bezier(0.16,1,0.3,1);
  }
  @keyframes sosSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .sos-header {
    background: #b93a2a;
    padding: 18px 22px 16px;
    display: flex; align-items: flex-start; justify-content: space-between;
    position: sticky;
    top: 0;
    z-index: 1;
  }
  .sos-badge {
    background: #fff; color: #b93a2a;
    font-size: 11px; font-weight: 600; letter-spacing: 0.8px;
    padding: 3px 9px; border-radius: 5px;
    display: inline-block;
  }
  .sos-title { color: #fff; font-size: 16px; font-weight: 500; margin-top: 6px; }
  .sos-sub { color: rgba(255,255,255,0.75); font-size: 12.5px; margin-top: 2px; }

  .sos-close {
    background: rgba(255,255,255,0.15); border: none;
    color: #fff; width: 26px; height: 26px;
    border-radius: 6px; cursor: pointer; font-size: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; transition: background 0.15s;
  }
  .sos-close:hover { background: rgba(255,255,255,0.28); }

  .sos-body { padding: 20px 22px 22px; }

  .sos-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .sos-field { margin-bottom: 14px; }
  .sos-field label {
    display: block; font-size: 12px; font-weight: 500;
    color: #6b3a28; margin-bottom: 5px; letter-spacing: 0.1px;
  }
  .sos-field input,
  .sos-field textarea {
    width: 100%; padding: 9px 12px;
    border: 0.5px solid #ddd0c5; border-radius: 8px;
    font-size: 13.5px; font-family: 'DM Sans', sans-serif;
    color: #3b1f14; background: #fff;
    outline: none; box-sizing: border-box;
    transition: border-color 0.15s;
  }
  .sos-field input:focus,
  .sos-field textarea:focus { border-color: #c4714a; }
  .sos-field textarea { resize: none; height: 80px; line-height: 1.5; }
  .sos-field input::placeholder,
  .sos-field textarea::placeholder { color: #c4a898; }
  .sos-field .sos-err { font-size: 11.5px; color: #b93a2a; margin-top: 4px; }

  .sos-contacts-section {
    margin: 16px 0;
    padding: 12px;
    background: #f7f0ee;
    border-radius: 10px;
  }
  .sos-contacts-title {
    font-size: 12px;
    font-weight: 600;
    color: #6b3a28;
    margin-bottom: 10px;
  }
  .contact-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid #ecddd4;
  }
  .contact-item:last-child {
    border-bottom: none;
  }
  .contact-info {
    flex: 1;
  }
  .contact-name {
    font-weight: 600;
    color: #3b1f14;
    font-size: 13px;
  }
  .contact-number {
    font-size: 11px;
    color: #9e7060;
  }
  .primary-badge {
    background: #20c997;
    color: white;
    padding: 2px 6px;
    border-radius: 10px;
    font-size: 9px;
    margin-left: 6px;
  }
  .call-btn {
    background: #c27a5f;
    color: white;
    border: none;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    cursor: pointer;
    text-decoration: none;
  }
  .call-btn:hover {
    background: #9e4a28;
  }

  .sos-send {
    width: 100%; padding: 10px;
    background: #b93a2a; color: #fff;
    border: none; border-radius: 8px;
    font-size: 13.5px; font-weight: 600; font-family: 'DM Sans', sans-serif;
    cursor: pointer; letter-spacing: 0.3px;
    transition: background 0.15s, transform 0.12s;
    margin-top: 4px;
  }
  .sos-send:hover { background: #9b2d1f; transform: translateY(-1px); }
  .sos-send:active { transform: scale(0.98); }
  .sos-send:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .sos-note { font-size: 11.5px; color: #b09080; text-align: center; margin-top: 10px; }

  .sos-success {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    padding: 40px 22px; text-align: center; gap: 10px;
  }
  .sos-check {
    width: 52px; height: 52px; border-radius: 50%;
    background: #f7ede6;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 4px;
  }
  .sos-success-title { font-size: 15px; font-weight: 500; color: #3b1f14; }
  .sos-success-sub { font-size: 13px; color: #9e7060; line-height: 1.5; max-width: 260px; }
  .sos-success-close {
    margin-top: 8px; padding: 8px 22px;
    background: transparent; color: #6b3a28;
    border: 0.5px solid #ddd0c5; border-radius: 7px;
    font-size: 13px; font-family: 'DM Sans', sans-serif;
    cursor: pointer; transition: background 0.15s;
  }
  .sos-success-close:hover { background: #f3ede7; }

  .sos-loading {
    text-align: center;
    padding: 20px;
    color: #9e7060;
  }
`;

function SOSModal({ onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [resources, setResources] = useState([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchEmergencyContacts();
    fetchEmergencyResources();
  }, []);

  const fetchEmergencyContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://127.0.0.1:8000/api/safety/emergency-contacts/', {
        headers: { 'Authorization': `Token ${token}` }
      });
      setEmergencyContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    }
  };

  const fetchEmergencyResources = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/safety/emergency-resources/');
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone.trim()) errs.phone = 'Phone is required';
    if (!form.message.trim()) errs.message = 'Please describe your situation';
    return errs;
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          },
          (error) => {
            console.error("Geolocation error:", error);
            reject(error);
          }
        );
      } else {
        reject(new Error("Geolocation not supported"));
      }
    });
  };

const handleSend = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    
    try {
        const token = localStorage.getItem('token');
        
        if (!token) {
            setErrors({ message: 'Please login first to send SOS alert' });
            setLoading(false);
            return;
        }

        let location = null;
        try {
            const coords = await getLocation();
            location = coords;
        } catch (locError) {
            console.log("Location not available:", locError);
        }

        const alertData = {
            message: form.message,
            location_address: `${form.name} - ${form.phone}`,
            latitude: location?.lat || null,
            longitude: location?.lng || null
        };

        console.log("Sending SOS alert:", alertData);

        // Make sure this is a POST request
        const response = await axios.post(  // ✅ This is POST, not GET
            'http://127.0.0.1:8000/api/safety/sos-alerts/create_alert/',
            alertData,
            {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log("SOS Response:", response.data);

        if (response.data.success) {
            setSent(true);
        } else {
            setErrors({ message: response.data.message || 'Failed to send SOS alert' });
        }
    } catch (error) {
        console.error("SOS Error:", error);
        
        if (error.response?.status === 401) {
            setErrors({ message: 'Session expired. Please login again.' });
        } else if (error.response?.status === 405) {
            setErrors({ message: 'Wrong request method. Please update the app.' });
        } else {
            setErrors({ message: 'Failed to send SOS alert. Please try again.' });
        }
    } finally {
        setLoading(false);
    }
};

  const handleOverlay = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sos-overlay" onClick={handleOverlay}>
        <div className="sos-card">

          <div className="sos-header">
            <div>
              <span className="sos-badge">SOS</span>
              <div className="sos-title">Send an alert</div>
              <div className="sos-sub">Our support team will respond immediately</div>
            </div>
            <button className="sos-close" onClick={onClose}>&#x2715;</button>
          </div>

          {!sent ? (
            <div className="sos-body">
              {errors.message && (
                <div style={{
                  background: '#fee',
                  color: '#b93a2a',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  fontSize: '12px',
                  marginBottom: '15px'
                }}>
                  {errors.message}
                </div>
              )}

              {/* Emergency Contacts Section */}
              {!fetching && emergencyContacts.length > 0 && (
                <div className="sos-contacts-section">
                  <div className="sos-contacts-title">
                    📞 Your Emergency Contacts
                  </div>
                  {emergencyContacts.map(contact => (
                    <div key={contact.id} className="contact-item">
                      <div className="contact-info">
                        <div className="contact-name">
                          {contact.name}
                          {contact.is_primary && <span className="primary-badge">Primary</span>}
                        </div>
                        <div className="contact-number">{contact.phone_number}</div>
                      </div>
                      <a href={`tel:${contact.phone_number}`} className="call-btn">
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              )}

              {/* Emergency Resources Section */}
              {!fetching && resources.length > 0 && (
                <div className="sos-contacts-section">
                  <div className="sos-contacts-title">
                    🚨 Emergency Helplines
                  </div>
                  {resources.slice(0, 4).map(resource => (
                    <div key={resource.id} className="contact-item">
                      <div className="contact-info">
                        <div className="contact-name">{resource.name}</div>
                        <div className="contact-number">{resource.phone}</div>
                      </div>
                      <a href={`tel:${resource.phone}`} className="call-btn">
                        Call
                      </a>
                    </div>
                  ))}
                </div>
              )}

              <div className="sos-row">
                <div className="sos-field">
                  <label htmlFor="sos-name">Your name</label>
                  <input
                    id="sos-name" name="name" type="text"
                    placeholder="Full name"
                    value={form.name} onChange={handleChange}
                  />
                  {errors.name && <div className="sos-err">{errors.name}</div>}
                </div>
                <div className="sos-field">
                  <label htmlFor="sos-phone">Phone number</label>
                  <input
                    id="sos-phone" name="phone" type="tel"
                    placeholder="+91 00000 00000"
                    value={form.phone} onChange={handleChange}
                  />
                  {errors.phone && <div className="sos-err">{errors.phone}</div>}
                </div>
              </div>

              <div className="sos-field">
                <label htmlFor="sos-message">What's happening?</label>
                <textarea
                  id="sos-message" name="message"
                  placeholder="Describe your situation briefly…"
                  value={form.message} onChange={handleChange}
                />
                {errors.message && !errors.message.includes('Failed') && 
                  <div className="sos-err">{errors.message}</div>
                }
              </div>

              <button className="sos-send" onClick={handleSend} disabled={loading}>
                {loading ? 'Sending…' : 'Send alert now'}
              </button>
              <div className="sos-note">
                🔒 Your location will be shared for emergency response
              </div>
            </div>
          ) : (
            <div className="sos-success">
              <div className="sos-check">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                  stroke="#b93a2a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="sos-success-title">Alert sent successfully</div>
              <div className="sos-success-sub">
                Help is on the way. Our team will contact you shortly.
                <br /><br />
                <strong>Emergency Helpline: 100</strong>
              </div>
              <button className="sos-success-close" onClick={onClose}>Close</button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

export default SOSModal;