import React from 'react';

export default function AnnouncementBadgeSvg() {
  return (
    <div style={{
      backdropFilter: 'blur(14px)',
      background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.02) 100%)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '26.5px',
      padding: '8px 20px',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: 'white',
      fontFamily: 'sans-serif',
      fontSize: '0.9rem',
      fontWeight: '500',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    }}>
      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>🔥</span>
      <span>Added 38 New AI Agents Just Last Week!</span>
    </div>
  );
}
