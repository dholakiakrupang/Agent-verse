import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Logo from './Logo';
import SubmitBtnSvg from './SubmitBtnSvg';

export default function Navbar() {
  const { theme } = useTheme();

  return (
    <header className="navbar custom-navbar">
      <div className="nav-content">
        <Link to="/" className="brand" aria-label="Agentverse Home">
          <Logo />
        </Link>
        
        <div className="nav-actions">
          <Link to="/submit" className="submit-action" aria-label="Submit Agent">
            <SubmitBtnSvg />
          </Link>
        </div>
      </div>
    </header>
  );
}
