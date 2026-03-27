import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

// Pages
import Landing from './pages/Landing';
import AgentDetails from './pages/AgentDetails';
import SubmitAgent from './pages/SubmitAgent';

// Components
import Navbar from './components/Navbar';

function NotFound() {
  const { theme } = useTheme();
  const dark = theme === 'dark';
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
      minHeight: 'calc(100vh - 104px)', background: dark ? '#031713' : '#F7FDFB', 
      color: dark ? '#fff' : '#0B1F18', fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>404</h1>
      <p style={{ fontSize: '1.2rem', color: dark ? '#CCC' : '#4E7362' }}>Page not found.</p>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="app-layout">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/category" element={<Navigate to="/?category=All" replace />} />
              <Route path="/agent/:id" element={<AgentDetails />} />
              <Route path="/submit" element={<SubmitAgent />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
{/* Footer removed because SVGs contain their own footers */}
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
