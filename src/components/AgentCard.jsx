import { useState, useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

export default function AgentCard({ agent, onClick }) {
  const { theme } = useTheme();
  const dark = theme === 'dark';
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
          ? (dark ? 'linear-gradient(180deg, #07362D 0%, #05241E 100%)' : '#F9FAFB')
          : (dark ? 'linear-gradient(180deg, #041B16 0%, #031713 100%)' : '#FFFFFF'),
        boxShadow: hovered
          ? (dark ? 'inset 0 0 0 1px rgba(255,255,255,0.5)' : '0 4px 12px rgba(0,0,0,0.05), inset 0 0 0 1px #E5E7EB')
          : (dark ? 'inset 0 0 0 1px rgba(255,255,255,0.18)' : 'inset 0 0 0 1px #E5E7EB'),
        cursor: 'pointer',
        padding: isMobile ? '20px' : '28px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'background 0.18s, box-shadow 0.18s',
        height: isMobile ? 'auto' : '320px',
        minHeight: isMobile ? '280px' : '320px',
        boxSizing: 'border-box',
      }}
    >
      {/* Top Flex Wrapper to push footer down */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* Logo box */}
        <div style={{
          width: isMobile ? '48px' : '60px',
          height: isMobile ? '48px' : '60px',
          borderRadius: isMobile ? '8px' : '10px',
          background: dark ? '#041B16' : '#FFFFFF',
          boxShadow: dark ? 'inset 0 0 0 1px rgba(255,255,255,0.14)' : 'inset 0 0 0 1px #E5E7EB',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: isMobile ? '1.5rem' : '1.9rem',
          flexShrink: 0, overflow: 'hidden',
          marginBottom: isMobile ? '16px' : '24px'
        }}>
          {agent.logo ? (
            <img src={agent.logo} alt={agent.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            agent.emoji
          )}
        </div>

        {/* Agent name */}
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontWeight: 700,
          fontSize: isMobile ? '20px' : '24px',
          lineHeight: isMobile ? '28px' : '32px',
          marginBottom: isMobile ? '8px' : '12px',
          color: dark ? undefined : '#111827',
          background: dark ? 'linear-gradient(180deg, #FFFFFF 0%, #CCCCCC 100%)' : 'none',
          WebkitBackgroundClip: dark ? 'text' : 'border-box',
          WebkitTextFillColor: dark ? 'transparent' : 'initial',
          backgroundClip: dark ? 'text' : 'border-box',
        }}>
          {agent.name}
        </div>

        {/* Description — clamped to exactly 2 lines as per Figma layout */}
        <div style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: isMobile ? '14px' : '15px',
          color: dark ? '#CCCCCC' : '#4B5563', 
          lineHeight: isMobile ? '22px' : '24px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {agent.desc}
        </div>

      </div>

      {/* Divider */}
      <div style={{ 
        height: '1px', 
        background: dark ? '#1D2B28' : '#F3F4F6', 
        marginTop: isMobile ? '20px' : '24px', 
        marginBottom: isMobile ? '16px' : '20px' 
      }} />

      {/* Bottom row */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
      }}>
        {/* Category pill */}
        <span style={{
          padding: isMobile ? '4px 11px' : '6px 14px',
          borderRadius: '999px',
          background: dark ? '#041B16' : '#FFFFFF',
          boxShadow: dark ? 'inset 0 0 0 1px rgba(255,255,255,0.2)' : 'inset 0 0 0 1px #E5E7EB',
          color: dark ? '#CCCCCC' : '#4B5563',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}>
          {agent.cat}
        </span>

        {/* Pricing Badge */}
        <span style={{
          padding: isMobile ? '4px 11px' : '6px 14px',
          borderRadius: '999px',
          background: agent.tag === 'Paid' 
            ? (dark ? 'linear-gradient(270deg, rgba(255,193,7,0.06) 0%, rgba(255,193,7,0.10) 100%)' : '#FFFAEB')
            : (dark ? 'linear-gradient(270deg, rgba(7,242,88,0.06) 0%, rgba(7,242,88,0.10) 100%)' : '#ECFDF3'),
          boxShadow: agent.tag === 'Paid'
            ? (dark ? 'inset 0 0 0 1px rgba(255,193,7,0.35)' : 'inset 0 0 0 1px #FEDF89')
            : (dark ? 'inset 0 0 0 1px rgba(7,242,88,0.35)' : 'inset 0 0 0 1px #ABEFC6'),
          color: agent.tag === 'Paid'
            ? (dark ? '#FFC107' : '#B54708')
            : (dark ? '#07F258' : '#027A48'),
          fontFamily: "'Plus Jakarta Sans', sans-serif",
          fontSize: isMobile ? '11px' : '12px',
          fontWeight: 600, 
          whiteSpace: 'nowrap',
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
            width: isMobile ? '30px' : '36px',
            height: isMobile ? '30px' : '36px',
            borderRadius: '50%',
            background: dark ? '#041B16' : '#FFFFFF',
            boxShadow: dark ? 'inset 0 0 0 1px rgba(255,255,255,0.18)' : 'inset 0 0 0 1px #E5E7EB',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
            cursor: 'pointer',
          }}>
          <ExternalLink size={isMobile ? 14 : 16} color={dark ? "#CCCCCC" : "#4B5563"} />
        </div>
      </div>
    </div>
  );
}
