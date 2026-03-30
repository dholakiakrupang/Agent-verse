import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import SubmitBtnSvg from './SubmitBtnSvg';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="navbar custom-navbar" style={{
      background: theme === 'dark' ? '#031713' : '#FFFFFF',
      borderBottom: theme === 'dark' ? '1px solid rgba(255,255,255,0.05)' : '1px solid #E5E7EB',
    }}>
      <div className="nav-content">
        <Link to="/" className="brand" aria-label="Agentverse Home">
          <Logo />
        </Link>
        
        <div className="nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              background: theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
              border: 'none',
              borderRadius: '50%',
              width: '42px',
              height: '42px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: theme === 'dark' ? '#07F258' : '#0B1F18',
              transition: 'background 0.2s, color 0.2s, transform 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            onMouseDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
          >
            {theme === 'dark' ? <Sun size={20} strokeWidth={2.5} /> : <Moon size={20} strokeWidth={2.5} />}
          </button>
          
          <Link to="/submit" className="submit-action" aria-label="Submit Agent">
            <SubmitBtnSvg />
          </Link>
        </div>
      </div>
    </header>
  );
}
