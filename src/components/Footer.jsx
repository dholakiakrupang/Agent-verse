import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';

export default function Footer() {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isTablet, setIsTablet] = useState(window.innerWidth >= 768 && window.innerWidth < 1200);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1200);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const textColor = dark ? '#FFFFFF' : '#0B1F18';

  const linkStyle = {
    fontSize: '0.9rem', color: '#CCCCCC', marginBottom: '1rem',
    cursor: 'pointer', transition: 'color 0.15s',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  };

  const handleLinkClick = (label) => {
    navigate('/?category=' + encodeURIComponent(label));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const LinkItem = ({ label }) => (
    <div
      onClick={() => handleLinkClick(label)}
      style={linkStyle}
      onMouseEnter={e => e.target.style.color = '#07F258'}
      onMouseLeave={e => e.target.style.color = '#CCCCCC'}
    >
      {label}
    </div>
  );

  const allLinks = [
    'Coding', 'AI Agent Builders', 'Productivity', 'Personal Assistant',
    'General Purpose', 'Content Creation', 'Research', 'Digital Workers',
    'Business Intelligence', 'Sales', 'Marketing', 'Finance',
    'Design', 'Data Analysis', 'Customer Service', 'Science', 'HR', 'Other',
  ];

  // ── MOBILE FOOTER ──────────────────────────────────────────────────────
  if (isMobile) {
    return (
      <footer style={{
        borderTop: dark ? '1px solid #0D1F18' : '1px solid #D8EDE4',
        background: dark ? '#031713' : '#EEF9F4',
        padding: '2.5rem 16px 1.5rem',
        width: '100%', boxSizing: 'border-box',
      }}>
        {/* Brand */}
        <div style={{ marginBottom: '2rem' }}>
          <Logo style={{ height: '32px', width: 'auto', marginBottom: '1rem' }} />
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500, fontSize: '14px', lineHeight: '24px', color: '#CCCCCC',
          }}>
            Discover the best AI agents from across the internet.
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          padding: '1.5rem',
          borderRadius: '16px',
          background: dark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
          border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
          marginBottom: '2rem',
        }}>
          <div style={{
            fontWeight: 600, fontSize: '1.2rem', color: textColor,
            marginBottom: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Unleash Your AI Assistant
          </div>
          <div style={{
            fontSize: '0.85rem', color: '#CCCCCC', lineHeight: 1.7,
            marginBottom: '1.25rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Empower your ideas with an intelligent AI agent designed to provide instant answers, streamline tasks, and deliver personalized support.
          </div>
          <button
            onClick={() => { navigate('/submit'); window.scrollTo(0, 0); }}
            style={{
              padding: '11px 24px', borderRadius: '999px',
              border: dark ? '1px solid #07F258' : '1px solid #041B16',
              background: dark ? 'rgba(7,242,88,0.06)' : 'transparent',
              color: textColor, fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            Submit →
          </button>
        </div>

        {/* Links — 2 columns */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{
            fontWeight: 600, fontSize: '1rem', color: textColor,
            marginBottom: '1rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Explore Agents
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1.5rem' }}>
            {allLinks.map(l => <LinkItem key={l} label={l} />)}
          </div>
        </div>

        {/* Copyright */}
        <div style={{
          fontSize: '0.8rem', color: '#666666',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          textAlign: 'center', paddingTop: '1rem',
          borderTop: dark ? '1px solid #0D1F18' : '1px solid #D8EDE4',
        }}>
          © 2025 Agentverse. All rights reserved.
        </div>
      </footer>
    );
  }

  // ── TABLET FOOTER ──────────────────────────────────────────────────────
  if (isTablet) {
    return (
      <footer style={{
        borderTop: dark ? '1px solid #0D1F18' : '1px solid #D8EDE4',
        background: dark ? '#031713' : '#EEF9F4',
        padding: '3rem 40px 2rem',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', width: '100%', boxSizing: 'border-box',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1fr 1fr',
          gap: '2rem', width: '100%', marginBottom: '2.5rem',
        }}>
          {/* Brand + CTA */}
          <div>
            <Logo style={{ height: '32px', width: 'auto', marginBottom: '1.2rem' }} />
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 500, fontSize: '14px', lineHeight: '24px', color: '#CCCCCC',
              marginBottom: '1.5rem',
            }}>
              Discover the best AI agents from across the internet.
            </div>
            <div style={{
              fontWeight: 600, fontSize: '1.15rem', color: textColor,
              marginBottom: '0.75rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Unleash Your AI Assistant
            </div>
            <div style={{
              fontSize: '0.85rem', color: '#CCCCCC', lineHeight: 1.7,
              marginBottom: '1.25rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Empower your ideas with an intelligent AI agent. Submit your AI agent now!
            </div>
            <button
              onClick={() => { navigate('/submit'); window.scrollTo(0, 0); }}
              style={{
                padding: '11px 24px', borderRadius: '999px',
                border: dark ? '1px solid #07F258' : '1px solid #041B16',
                background: dark ? 'rgba(7,242,88,0.06)' : 'transparent',
                color: textColor, fontWeight: 500, fontSize: '0.9rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              Submit →
            </button>
          </div>

          {/* Links col 1 */}
          <div>
            <div style={{
              fontWeight: 600, fontSize: '1rem', color: textColor,
              marginBottom: '1.2rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              Explore Agents
            </div>
            {allLinks.slice(0, 9).map(l => <LinkItem key={l} label={l} />)}
          </div>

          {/* Links col 2 */}
          <div style={{ paddingTop: '2.7rem' }}>
            {allLinks.slice(9).map(l => <LinkItem key={l} label={l} />)}
          </div>
        </div>

        <div style={{
          fontSize: '0.85rem', color: '#999999',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          width: '100%', textAlign: 'center',
          borderTop: dark ? '1px solid #0D1F18' : '1px solid #D8EDE4',
          paddingTop: '1.5rem',
        }}>
          © 2025 Agentverse. All rights reserved.
        </div>
      </footer>
    );
  }

  // ── DESKTOP FOOTER ─────────────────────────────────────────────────────
  return (
    <footer style={{
      borderTop: dark ? '1px solid #0D1F18' : '1px solid #D8EDE4',
      background: dark ? '#031713' : '#EEF9F4',
      padding: '5rem 176px 2rem',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', width: '100%', boxSizing: 'border-box',
    }}>
      {/* Main Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1.5fr)',
        gap: '2rem', width: '100%', maxWidth: '1568px', marginBottom: '80px',
      }}>
        {/* Brand column */}
        <div style={{ paddingRight: '1rem' }}>
          <Logo style={{ height: '36px', width: 'auto', marginBottom: '1.5rem' }} />
          <div style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 500, fontSize: '16px', lineHeight: '26px', color: '#CCCCCC',
          }}>
            Discover the best AI agents from across the internet.
          </div>
        </div>

        {/* Column 2: Explore Agents */}
        <div>
          <div style={{
            fontWeight: 600, fontSize: '1.1rem', color: textColor,
            marginBottom: '1.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Explore Agents
          </div>
          {['Coding', 'AI Agent Builders', 'Productivity', 'Personal Assistant', 'General Purpose', 'Content Creation'].map(l => (
            <LinkItem key={l} label={l} />
          ))}
        </div>

        {/* Column 3 */}
        <div style={{ paddingTop: '3.1rem' }}>
          {['Research', 'Digital Workers', 'Business Intelligence', 'Sales', 'Marketing', 'Finance'].map(l => (
            <LinkItem key={l} label={l} />
          ))}
        </div>

        {/* Column 4 */}
        <div style={{ paddingTop: '3.1rem' }}>
          {['Design', 'Data Analysis', 'Customer Service', 'Science', 'HR', 'Other'].map(l => (
            <LinkItem key={l} label={l} />
          ))}
        </div>

        {/* Right Side CTA */}
        <div style={{ paddingLeft: '1rem' }}>
          <div style={{
            fontWeight: 600, fontSize: '1.5rem', color: textColor,
            marginBottom: '1.5rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Unleash Your AI Assistant
          </div>
          <div style={{
            fontSize: '0.95rem', color: '#CCCCCC', lineHeight: 1.8,
            marginBottom: '2rem', fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Empower your ideas with an intelligent AI agent designed to provide instant answers, streamline tasks, and deliver personalized support. Submit your AI agent now and let innovation take the lead!
          </div>
          <button
            onClick={() => { navigate('/submit'); window.scrollTo(0, 0); }}
            style={{
              padding: '12px 28px', borderRadius: '999px',
              border: dark ? '1px solid #07F258' : '1px solid #041B16',
              background: dark ? 'rgba(7,242,88,0.06)' : 'transparent',
              color: textColor, fontWeight: 500, fontSize: '1rem', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px', width: 'fit-content',
            }}
          >
            Submit →
          </button>
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        fontSize: '0.85rem', color: '#999999',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        width: '100%', textAlign: 'center',
      }}>
        © 2025 Agentverse. All rights reserved.
      </div>
    </footer>
  );
}
