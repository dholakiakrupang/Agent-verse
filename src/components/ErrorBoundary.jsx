import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', padding: '2rem', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif",
          color: '#4A7A64'
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '1rem', color: '#FF4D4D' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#fff' }}>Oops! Something went wrong.</h2>
          <p style={{ maxWidth: '400px', lineHeight: 1.6, color: '#ccc', marginBottom: '1.5rem' }}>
            We encountered an unexpected error while trying to display this page.
          </p>
          <button 
            onClick={() => window.location.href = '/'}
            style={{
              padding: '10px 24px', borderRadius: '8px', border: 'none', background: '#07F258', 
              color: '#031713', fontWeight: 600, cursor: 'pointer', fontSize: '1rem'
            }}
          >
            Return to Home
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
