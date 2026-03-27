import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';

export default function SubmitAgent() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dark = theme === 'dark';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    url: '',
    category: 'General Purpose',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setTimeout(() => {
      alert("Thank you! Your AI agent has been submitted for review.");
      window.scrollTo(0, 0);
      navigate('/');
    }, 500);
  };

  const bg = dark ? '#031713' : '#F7FDFB';
  const textColor = dark ? '#FFFFFF' : '#0B1F18';
  const textMuted = dark ? '#CCCCCC' : '#4E7362';
  const inputBg = dark ? '#031814' : '#F0F0F0';
  const inputBorder = dark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)';
  const focusBorder = dark ? '1px solid rgba(7,242,88,0.5)' : '1px solid rgba(0,0,0,0.3)';

  const inputStyle = {
    width: '100%', background: inputBg, border: inputBorder,
    borderRadius: '95px', padding: '0 24px', boxSizing: 'border-box',
    color: textColor, fontSize: '16px', outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color 0.2s',
  };
  
  return (
    <div className="animate-fade-in" style={{ background: bg, minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        /* ═══════════════════════════════════════════
           SUBMIT AGENT — Responsive Styles
           ═══════════════════════════════════════════ */

        .sa-spacer { height: 100px; }

        .sa-main {
          flex: 1;
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 2rem 176px 6rem;
          box-sizing: border-box;
        }

        .sa-wrapper {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 50px;
          width: 100%;
          max-width: 1302px;
        }

        .sa-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          width: 100%;
        }
        .sa-header h1 {
          font-size: 48px;
          font-weight: 700;
          margin: 0;
          letter-spacing: -0.02em;
          line-height: 1.2;
        }
        .sa-header p {
          font-size: 18px;
          margin: 0;
          line-height: 1.6;
        }

        .sa-form-card {
          box-sizing: border-box;
          width: 100%;
          border-radius: 20px;
          padding: 42px;
        }

        .sa-form {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 24px;
          width: 100%;
        }

        .sa-field {
          display: flex;
          flex-direction: column;
          gap: 12px;
          width: 100%;
        }
        .sa-field label {
          font-size: 16px;
          font-weight: 500;
        }

        .sa-input {
          height: 58px;
        }

        .sa-select-wrap {
          position: relative;
          width: 100%;
        }
        .sa-select-wrap svg {
          position: absolute;
          right: 24px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .sa-textarea {
          min-height: 140px;
          border-radius: 29px !important;
          padding: 18px 24px !important;
          resize: vertical;
        }

        .sa-submit-btn {
          margin-top: 24px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 0 24px;
          width: 166px;
          height: 54px;
          border-radius: 94px;
          font-weight: 600;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .sa-submit-btn:hover {
          opacity: 0.9;
        }

        /* ═══════════════════════════════════════════
           TABLET — max-width 1200
           ═══════════════════════════════════════════ */
        @media (max-width: 1200px) {
          .sa-main {
            padding: 2rem 60px 4rem;
          }
        }

        /* ═══════════════════════════════════════════
           TABLET — max-width 1024
           ═══════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .sa-main {
            padding: 2rem 40px 4rem;
          }
          .sa-header h1 {
            font-size: 36px;
          }
          .sa-form-card {
            padding: 32px;
          }
        }

        /* ═══════════════════════════════════════════
           MOBILE — max-width 768
           ═══════════════════════════════════════════ */
        @media (max-width: 768px) {
          .sa-spacer { height: 20px; }
          .sa-main {
            padding: 1.5rem 16px 3rem;
          }
          .sa-wrapper {
            gap: 28px;
          }
          .sa-header {
            gap: 14px;
          }
          .sa-header h1 {
            font-size: 28px;
            letter-spacing: -0.01em;
          }
          .sa-header p {
            font-size: 14px;
            line-height: 1.5;
          }
          .sa-form-card {
            padding: 20px;
            border-radius: 16px;
          }
          .sa-form {
            gap: 18px;
          }
          .sa-field {
            gap: 8px;
          }
          .sa-field label {
            font-size: 14px;
          }
          .sa-input {
            height: 48px;
          }
          .sa-textarea {
            min-height: 120px;
          }
          .sa-submit-btn {
            width: 100%;
            margin-top: 12px;
          }
        }

        /* ═══════════════════════════════════════════
           SMALL MOBILE — max-width 400
           ═══════════════════════════════════════════ */
        @media (max-width: 400px) {
          .sa-main {
            padding: 1rem 12px 2rem;
          }
          .sa-header h1 {
            font-size: 24px;
          }
          .sa-form-card {
            padding: 16px;
          }
          .sa-submit-btn {
            height: 48px;
            font-size: 14px;
          }
        }
      `}</style>
      
      <div className="sa-spacer" />

      <main className="sa-main">
        <div className="sa-wrapper">
          
          {/* Header */}
          <div className="sa-header">
            <h1 style={{ color: textColor }}>Submit Your AI Agent</h1>
            <p style={{ color: textMuted }}>
              Share your AI agent with our community. We'll review your submission and get back to you soon.
            </p>
          </div>

          {/* Form Container */}
          <div className="sa-form-card" style={{
            background: dark ? 'linear-gradient(180deg, #041B16 0%, #031713 100%)' : '#FFFFFF',
            border: dark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.1)',
          }}>
            
            <form className="sa-form" onSubmit={handleSubmit}>
              
              {/* Agent Name */}
              <div className="sa-field">
                <label style={{ color: textMuted }}>Agent Name</label>
                <input 
                  className="sa-input"
                  required 
                  type="text" 
                  placeholder="Enter your agent's name"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.border = focusBorder}
                  onBlur={e => e.target.style.border = inputBorder}
                />
              </div>

              {/* Website URL */}
              <div className="sa-field">
                <label style={{ color: textMuted }}>Website URL</label>
                <input 
                  className="sa-input"
                  required 
                  type="url" 
                  placeholder="https://"
                  value={formData.url}
                  onChange={e => setFormData({...formData, url: e.target.value})}
                  style={inputStyle}
                  onFocus={e => e.target.style.border = focusBorder}
                  onBlur={e => e.target.style.border = inputBorder}
                />
              </div>

              {/* Primary Category */}
              <div className="sa-field">
                <label style={{ color: textMuted }}>Primary Category</label>
                <div className="sa-select-wrap">
                  <select 
                    className="sa-input"
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                    onFocus={e => e.target.style.border = focusBorder}
                    onBlur={e => e.target.style.border = inputBorder}
                  >
                    {['Coding', 'AI Agent Builders', 'Productivity', 'Personal Assistant', 'General Purpose', 'Content Creation'].map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L7 7L13 1" stroke={dark ? "#CCCCCC" : "#4E7362"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Description */}
              <div className="sa-field">
                <label style={{ color: textMuted }}>Short Description</label>
                <textarea 
                  className="sa-textarea"
                  required 
                  rows={4}
                  placeholder="Briefly describe what this AI agent does..."
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  style={{ ...inputStyle, borderRadius: '29px', padding: '18px 24px', minHeight: '140px', resize: 'vertical' }}
                  onFocus={e => e.target.style.border = focusBorder}
                  onBlur={e => e.target.style.border = inputBorder}
                />
              </div>

              {/* Submit Button */}
              <button className="sa-submit-btn" type="submit" style={{
                background: dark ? 'linear-gradient(270deg, rgba(7, 242, 88, 0.1) 0%, rgba(7, 242, 88, 0.06) 100%)' : '#07F258',
                border: dark ? '1px solid rgba(7, 242, 88, 0.2)' : 'none',
                color: dark ? '#07F258' : '#031713',
              }}>
                Submit Agent
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
