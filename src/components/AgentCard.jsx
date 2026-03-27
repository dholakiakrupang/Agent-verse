import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';

export default function AgentCard({ agent, onClick }) {
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        borderRadius: isMobile ? '16px' : '20px',
        background: hovered
          ? 'linear-gradient(180deg, #07362D 0%, #05241E 100%)'
          : 'linear-gradient(180deg, #041B16 0%, #031713 100%)',
        boxShadow: hovered
          ? 'inset 0 0 0 1px rgba(255,255,255,0.5)'
          : 'inset 0 0 0 1px rgba(255,255,255,0.18)',
        cursor: 'pointer',
        padding: isMobile ? '20px 18px 16px' : '30px 30px 22px',
        display: 'flex',
        flexDirection: 'column',
        gap: isMobile ? '10px' : '14px',
        transition: 'background 0.18s, box-shadow 0.18s',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Logo box */}
      <div style={{
        width: isMobile ? '48px' : '60px',
        height: isMobile ? '48px' : '60px',
        borderRadius: isMobile ? '8px' : '10px',
        background: '#041B16',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.14)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isMobile ? '1.5rem' : '1.9rem',
        flexShrink: 0, overflow: 'hidden',
      }}>
        {agent.logo ? (
          <img src={agent.logo} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          agent.emoji
        )}
      </div>

      {/* Agent name */}
      <div style={{
        fontWeight: 800,
        fontSize: isMobile ? '1.3rem' : '1.65rem',
        lineHeight: 1.1,
        background: 'linear-gradient(180deg, #FFFFFF 0%, #CCCCCC 100%)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
      }}>
        {agent.name}
      </div>

      {/* Description */}
      <div style={{
        fontSize: isMobile ? '0.78rem' : '0.8rem',
        color: '#CCCCCC', lineHeight: 1.65, flexGrow: 1,
      }}>
        {agent.desc}
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#1D2B28' }} />

      {/* Bottom row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        {/* Category pill */}
        <span style={{
          padding: isMobile ? '4px 11px' : '5px 14px',
          borderRadius: '999px',
          background: '#041B16',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
          color: '#CCCCCC',
          fontSize: isMobile ? '0.68rem' : '0.72rem',
          whiteSpace: 'nowrap',
        }}>
          {agent.cat}
        </span>

        {/* Free badge */}
        <span style={{
          padding: isMobile ? '4px 11px' : '5px 14px',
          borderRadius: '999px',
          background: 'linear-gradient(270deg, rgba(7,242,88,0.06) 0%, rgba(7,242,88,0.10) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(7,242,88,0.35)',
          color: '#07F258',
          fontSize: isMobile ? '0.68rem' : '0.72rem',
          fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          {agent.tag}
        </span>

        <div style={{ flex: 1 }} />

        {/* External link circle */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            if (agent.url) window.open(agent.url, '_blank', 'noopener,noreferrer');
          }}
          style={{
            width: isMobile ? '30px' : '34px',
            height: isMobile ? '30px' : '34px',
            borderRadius: '50%',
            background: '#041B16',
            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
          }}>
          <ExternalLink size={isMobile ? 11 : 13} color="#CCCCCC" />
        </div>
      </div>
    </div>
  );
}
