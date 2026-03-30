import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AGENTS } from '../data/agents';
import { getAllAgents } from '../utils/agentStore';
import Footer from '../components/Footer';
import AgentCard from '../components/AgentCard';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

const DetailLinkItem = ({ label, url, primary = false, textMuted }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="agd-link-item"
      title={url}
      onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        color: primary || hovered ? (textMuted === '#A0C0B0' ? '#07F258' : '#297F58') : textMuted,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        transition: 'color 0.2s',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transform: hovered ? 'translate(2px, -2px)' : 'translate(0,0)',
        transition: 'transform 0.2s cubic-bezier(0.34,1.56,0.64,1)',
      }}>
        <ArrowUpRight size={14} />
      </div>
      {label}
    </div>
  );
};

/**
 * Intelligently parses the user's longDesc and renders it
 * in the exact same 4-section template format used by built-in agents:
 *   1. Intro  2. Key Features  3. Getting Started  4. Why Choose
 */
function AutoFormatContent({ text, agent, textColor, contentText }) {
  // ── Parse raw text into typed blocks ───────────────────────────
  const allLines = text.split('\n').map(l => l.trim());

  const isBullet    = l => /^[-*â€¢]\s/.test(l);
  const isNumbered  = l => /^\d+[.)]\s/.test(l);
  const isHeading   = l => /^#{1,3}\s/.test(l) || (l.endsWith(':') && l.length < 70 && !l.includes('.'));
  const stripPrefix = l => l.replace(/^[-*â€¢]\s*/, '').replace(/^\d+[.)]\s*/, '').replace(/^#{1,3}\s*/, '').replace(/:$/, '').trim();

  // Group into logical paragraphs (split on blank lines)
  const paragraphs = [];
  let cur = [];
  for (const line of allLines) {
    if (!line) { if (cur.length) { paragraphs.push(cur); cur = []; } }
    else cur.push(line);
  }
  if (cur.length) paragraphs.push(cur);

  // Classify each paragraph
  const classified = paragraphs.map(lines => {
    if (lines.every(isBullet))   return { type: 'bullets',  lines };
    if (lines.every(isNumbered)) return { type: 'numbered', lines };
    if (lines.length === 1 && isHeading(lines[0])) return { type: 'heading', lines };
    return { type: 'prose', lines };
  });

  // ── Slot content into 4 named sections ─────────────────────────
  // Section 1: Intro â€” first prose paragraph
  const introBlock = classified.find(b => b.type === 'prose');

  // Section 2: Key Features â€” all bullet blocks
  const bulletBlocks = classified.filter(b => b.type === 'bullets');
  const allBullets = bulletBlocks.flatMap(b => b.lines.map(stripPrefix));

  // Section 3: Getting Started â€” numbered blocks or prose after bullets
  const numberedBlocks = classified.filter(b => b.type === 'numbered');
  const steps = numberedBlocks.flatMap(b => b.lines.map(stripPrefix));

  // Section 4: Why Choose â€” remaining prose paragraphs after intro
  const proseBlocks = classified.filter(b => b.type === 'prose' && b !== introBlock);

  // Fallback text if user didn't provide content for a section
  const introText = introBlock?.lines.join(' ')
    || `${agent.name} is a powerful AI agent built for ${agent.cat.toLowerCase()}, designed to help you work smarter and achieve more in less time.`;

  const features = allBullets.length > 0 ? allBullets : [
    `Intuitive ${agent.cat} interface optimized for productivity`,
    `Autonomous execution â€” set it up once and let it run`,
    'Seamless integrations with your existing tools',
    `Smart context-awareness tailored for ${agent.cat.toLowerCase()} tasks`,
  ];

  const gettingStartedSteps = steps.length > 0 ? steps : [
    `Visit ${agent.name} and create your account`,
    'Connect your tools and configure your preferences',
    'Define your goals and let the AI agent take action',
    'Review outputs, refine settings, and optimize results',
  ];

  const whyChoosePoints = proseBlocks.length > 0
    ? proseBlocks.flatMap(b => b.lines)
    : [
        `Purpose-built for ${agent.cat.toLowerCase()} workflows`,
        'Saves time by automating repetitive tasks intelligently',
        'Continuously improving with community and developer updates',
        'Trusted by teams of all sizes across industries',
      ];

  // ── Render ───────────────────────────────────────────────────────
  return (
    <>
      {/* 1. Intro */}
      <div className="agd-content-section">
        <h2 style={{ color: textColor }}>{agent.name}: Your {agent.cat} AI Companion</h2>
        <p style={{ color: contentText }}>{introText}</p>
      </div>

      {/* 2. Key Features */}
      <div className="agd-content-section">
        <h2 style={{ color: textColor }}>Key Features</h2>
        {features.map((f, i) => {
          // If feature has a colon, split into title + description
          const colonIdx = f.indexOf(':');
          if (colonIdx > 0 && colonIdx < 50) {
            const ftitle = f.slice(0, colonIdx).trim();
            const fdesc  = f.slice(colonIdx + 1).trim();
            return (
              <div key={i}>
                <h3 style={{ color: textColor }}>{ftitle}</h3>
                {fdesc && <p style={{ color: contentText }}>{fdesc}</p>}
              </div>
            );
          }
          return (
            <div key={i}>
              <h3 style={{ color: textColor }}>{f}</h3>
            </div>
          );
        })}
      </div>

      {/* 3. Getting Started */}
      <div className="agd-content-section">
        <h2 style={{ color: textColor }}>Getting Started</h2>
        {gettingStartedSteps.map((step, i) => {
          const colonIdx = step.indexOf(':');
          const hasTitle = colonIdx > 0 && colonIdx < 60;
          const stitle = hasTitle ? step.slice(0, colonIdx).trim() : `Step ${i + 1}`;
          const sdesc  = hasTitle ? step.slice(colonIdx + 1).trim() : step;
          return (
            <div key={i}>
              <h3 style={{ color: textColor, marginBottom: '0.5rem' }}>{stitle}</h3>
              {sdesc && <p style={{ color: contentText }}>{sdesc}</p>}
            </div>
          );
        })}
      </div>

      {/* 4. Why Choose */}
      <div className="agd-content-section">
        <h2 style={{ color: textColor }}>Why Choose {agent.name}?</h2>
        <ul className="agd-bullet-list">
          {whyChoosePoints.map((pt, i) => {
            const colonIdx = pt.indexOf(':');
            const hasLabel = colonIdx > 0 && colonIdx < 50;
            return (
              <li key={i} className="agd-bullet-item">
                <div className="agd-bullet-dot" />
                <div style={{ color: contentText }}>
                  {hasLabel && <strong style={{ color: textColor }}>{pt.slice(0, colonIdx).trim()}: </strong>}
                  {hasLabel ? pt.slice(colonIdx + 1).trim() : pt}
                </div>
              </li>
            );
          })}
        </ul>
        <p style={{ color: contentText, marginTop: '1rem' }}>
          <strong style={{ color: textColor }}>Explore More:</strong>{' '}
          Visit the{' '}
          <span
            style={{ color: textColor === '#FFFFFF' ? '#07F258' : '#297F58', cursor: 'pointer' }}
            onClick={() => window.open(agent.url, '_blank')}
          >
            Official Website
          </span>{' '}
          to get started today.
        </p>
      </div>
    </>
  );
}

export default function AgentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const agentId = parseInt(id, 10);
  const allAgents = (() => { try { return getAllAgents(AGENTS); } catch { return AGENTS; } })();
  const agent = (agentId && allAgents.find(a => a.id === agentId)) || AGENTS[0] || {};
  const safeCat = agent.cat || 'General Purpose';
  // Show only agents from the same category
  const relatedAgents = allAgents.filter(a => a.id !== agent.id && a.cat === safeCat).slice(0, 3);

  const bg = dark ? '#031713' : '#FFFFFF';
  const textColor = dark ? '#FFFFFF' : '#0B1F18';
  const textMuted = dark ? '#A0C0B0' : '#4E7362';
  const contentText = dark ? '#E2E8F0' : '#4E7362';
  const cardBorder = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)';

  return (
    <div className="animate-fade-in" style={{ background: bg, minHeight: '100vh', width: '100%', paddingBottom: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        /* ═══════════════════════════════════════════
           AGENT DETAILS â€” Responsive Styles
           ═══════════════════════════════════════════ */

        .agd-spacer { height: 50px; }

        .agd-main {
          max-width: 1568px;
          margin: 0 auto;
          padding: 0 176px;
          box-sizing: border-box;
        }

        /* Breadcrumb */
        .agd-breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 24px;
          font-size: 16px;
          font-weight: 400;
          line-height: 22px;
        }
        .agd-breadcrumb span { cursor: pointer; color: #999999; }
        .agd-breadcrumb .active { color: ${dark ? '#07F258' : '#297F58'}; cursor: default; }

        /* Hero Card */
        .agd-hero {
          box-sizing: border-box;
          border-radius: 20px;
          padding: 40px;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 4rem;
          margin-bottom: 3rem;
        }

        /* Agent info header */
        .agd-agent-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }
        .agd-logo-box {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: ${dark ? '#020E0B' : '#FFFFFF'};
          border: 1px solid ${dark ? 'rgba(255,255,255,0.1)' : '#E5E7EB'};
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 10px;
          flex-shrink: 0;
        }
        .agd-logo-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .agd-agent-name {
          font-size: 2.4rem;
          font-weight: 800;
          margin: 0;
          line-height: 1.1;
        }
        .agd-agent-sub {
          font-size: 0.95rem;
          margin-top: 8px;
        }
        .agd-agent-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 3rem;
          flex: 1;
        }

        /* Visit Button */
        .agd-visit-btn {
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 13px 24px;
          gap: 10px;
          border-radius: 94px;
          border: none;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          width: fit-content;
          font-family: 'Inter', sans-serif;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1),
                      filter 0.2s ease,
                      opacity 0.2s;
        }
        .agd-visit-btn:hover {
          transform: translateY(-2px);
          filter: drop-shadow(0 0 10px rgba(7,242,88,0.4));
          opacity: 0.92;
        }
        .agd-visit-btn::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.2) 50%,
            transparent 100%
          );
          background-size: 200% auto;
          animation: shimmer 2.5s linear infinite;
          border-radius: 94px;
          pointer-events: none;
        }

        /* Links grid */
        .agd-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .agd-link-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        /* Details pills */
        .agd-details-pills {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .agd-pill {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px 20px;
          gap: 10px;
          border-radius: 94px;
          font-size: 0.85rem;
          font-weight: 600;
          border: none;
        }

        /* Screenshot */
        .agd-screenshot {
          width: 100%;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 4rem;
          background: ${dark ? '#020E0B' : '#F9FAFB'};
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-top: 1px solid ${dark ? 'rgba(255,255,255,0.05)' : '#E5E7EB'};
        }
        .agd-screenshot img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* Content sections */
        .agd-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 60px;
          margin-bottom: 6rem;
          max-width: 1000px;
          width: 100%;
        }
        .agd-content-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }
        .agd-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }
        .agd-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
        }
        .agd-content p, .agd-content li {
          font-size: 1.05rem;
          line-height: 1.8;
          margin: 0;
        }
        .agd-content ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .agd-bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .agd-bullet-item {
          display: flex;
          gap: 10px;
        }
        .agd-bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: ${dark ? '#07F258' : '#297F58'};
          margin-top: 10px;
          flex-shrink: 0;
        }

        /* Related agents */
        .agd-related-section {
          padding-bottom: 4rem;
        }
        .agd-related-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2.5rem;
          letter-spacing: -0.02em;
        }
        .agd-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        /* ═══════════════════════════════════════════
           TABLET â€” max-width 1200
           ═══════════════════════════════════════════ */
        @media (max-width: 1200px) {
          .agd-main {
            padding: 0 60px;
          }
        }

        /* ═══════════════════════════════════════════
           TABLET â€” max-width 1024
           ═══════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .agd-main {
            padding: 0 40px;
          }
          .agd-hero {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 32px;
          }
          .agd-agent-name {
            font-size: 2rem;
          }
          .agd-related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .agd-content h2 {
            font-size: 1.6rem;
          }
          .agd-content {
            gap: 40px;
            margin-bottom: 4rem;
          }
        }

        /* ═══════════════════════════════════════════
           MOBILE â€” max-width 768
           ═══════════════════════════════════════════ */
        @media (max-width: 768px) {
          .agd-spacer { height: 20px; }
          .agd-main {
            padding: 0 16px;
          }
          .agd-breadcrumb {
            font-size: 13px;
            margin-bottom: 16px;
            flex-wrap: wrap;
          }
          .agd-hero {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 20px;
            border-radius: 16px;
            margin-bottom: 2rem;
          }
          .agd-agent-header {
            gap: 14px;
            margin-bottom: 16px;
          }
          .agd-logo-box {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            padding: 8px;
          }
          .agd-agent-name {
            font-size: 1.5rem;
          }
          .agd-agent-sub {
            font-size: 0.82rem;
          }
          .agd-agent-desc {
            font-size: 0.9rem;
            line-height: 1.7;
            margin-bottom: 1.5rem;
          }
          .agd-visit-btn {
            padding: 11px 20px;
            font-size: 0.9rem;
          }
          .agd-links-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 2rem;
          }
          .agd-screenshot {
            border-radius: 16px;
            margin-bottom: 2.5rem;
          }
          .agd-content {
            gap: 36px;
            margin-bottom: 3rem;
          }
          .agd-content h2 {
            font-size: 1.4rem;
          }
          .agd-content h3 {
            font-size: 1.05rem;
          }
          .agd-content p, .agd-content li {
            font-size: 0.9rem;
            line-height: 1.7;
          }
          .agd-related-section {
            padding-bottom: 2.5rem;
          }
          .agd-related-title {
            font-size: 1.4rem;
            margin-bottom: 1.5rem;
          }
          .agd-related-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .agd-pill {
            padding: 6px 14px;
            font-size: 0.78rem;
          }
        }

        /* ═══════════════════════════════════════════
           SMALL MOBILE â€” max-width 400
           ═══════════════════════════════════════════ */
        @media (max-width: 400px) {
          .agd-main {
            padding: 0 12px;
          }
          .agd-hero {
            padding: 16px;
          }
          .agd-agent-name {
            font-size: 1.3rem;
          }
          .agd-agent-desc {
            font-size: 0.85rem;
          }
          .agd-content h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="agd-spacer" />

      <main className="agd-main">
        
        {/* Breadcrumb */}
        <div className="agd-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span>&gt;</span>
          <span onClick={() => navigate('/?category=' + encodeURIComponent(agent.cat))}>{agent.cat}</span>
          <span>&gt;</span>
          <span className="active">{agent.name}</span>
        </div>

        {/* Hero Card */}
        <div className="agd-hero" style={{
          background: dark ? 'linear-gradient(180deg, #041B16 0%, #031713 100%)' : '#FFFFFF',
          border: cardBorder, 
          boxShadow: dark ? '0 20px 40px rgba(0,0,0,0.2)' : 'none',
        }}>
          
          {/* Left: Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="agd-agent-header">
              <div className="agd-logo-box">
                {agent.logo && <img src={agent.logo} alt={agent.name} />}
              </div>
              <div>
                <h1 className="agd-agent-name" style={{ color: textColor }}>{agent.name}</h1>
                <div className="agd-agent-sub" style={{ color: textMuted }}>Build and deploy robust AI solutions for {agent.cat}</div>
              </div>
            </div>
            
            <p className="agd-agent-desc" style={{ color: dark ? '#E2E8F0' : '#111827' }}>
              {agent.desc} It features robust capabilities designed specifically for {agent.cat}, empowering users to automate workflows and rapidly deploy intelligent solutions.
            </p>
            
            <button className="agd-visit-btn" onClick={() => window.open(agent.url, '_blank', 'noopener,noreferrer')} style={{
              background: dark ? 'linear-gradient(270deg, rgba(7, 242, 88, 0.1) 0%, rgba(7, 242, 88, 0.06) 100%)' : '#ECFDF3',
              border: dark ? 'none' : '1px solid #D1FADF',
              color: dark ? '#07F258' : '#027A48',
            }}>
              <span>Visit {agent.name}</span> <ArrowRight size={16} />
            </button>
          </div>

          {/* Right: Links & Details */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '1.2rem' }}>Links</h3>
            <div className="agd-links-grid">
              <DetailLinkItem label="Website" url={agent.url} textMuted={textMuted} />
              {agent.links && agent.links.length > 0 ? (
                agent.links.map((link, idx) => (
                  <DetailLinkItem key={idx} label={link.title} url={link.url} textMuted={textMuted} />
                ))
              ) : (
                ['GitHub', 'Twitter', 'Discord', 'LinkedIn'].map(link => (
                  <DetailLinkItem key={link} label={link} url="#" textMuted={textMuted} />
                ))
              )}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '1.2rem' }}>Details</h3>
            <div className="agd-details-pills">
              {!dark && agent.tag?.toLowerCase() === 'free' ? (
                <svg width="70" height="34" viewBox="0 0 70 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 0.5H53C62.1127 0.5 69.5 7.8873 69.5 17C69.5 26.1127 62.1127 33.5 53 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17C0.5 7.8873 7.8873 0.5 17 0.5Z" fill="url(#paint0_linear_40_3960)"/>
                  <path d="M17 0.5H53C62.1127 0.5 69.5 7.8873 69.5 17C69.5 26.1127 62.1127 33.5 53 33.5H17C7.8873 33.5 0.5 26.1127 0.5 17C0.5 7.8873 7.8873 0.5 17 0.5Z" stroke="url(#paint1_linear_40_3960)"/>
                  <path d="M21.162 22.5V12.07H27.77V13.33H22.534V16.704H27.28V17.964H22.534V22.5H21.162ZM28.7463 22.5V14.954H30.0203V16.34L29.8803 16.144C30.0576 15.7147 30.3283 15.3973 30.6923 15.192C31.0563 14.9773 31.4996 14.87 32.0223 14.87H32.4843V16.102H31.8263C31.2943 16.102 30.8649 16.27 30.5383 16.606C30.2116 16.9327 30.0483 17.3993 30.0483 18.006V22.5H28.7463ZM37.1128 22.668C36.3848 22.668 35.7361 22.4953 35.1668 22.15C34.5975 21.8047 34.1495 21.3333 33.8228 20.736C33.4961 20.1293 33.3328 19.4527 33.3328 18.706C33.3328 17.95 33.4915 17.278 33.8088 16.69C34.1355 16.102 34.5741 15.64 35.1248 15.304C35.6848 14.9587 36.3101 14.786 37.0008 14.786C37.5608 14.786 38.0555 14.8887 38.4848 15.094C38.9235 15.29 39.2921 15.5607 39.5908 15.906C39.8988 16.242 40.1321 16.6293 40.2908 17.068C40.4588 17.4973 40.5428 17.9453 40.5428 18.412C40.5428 18.5147 40.5335 18.6313 40.5148 18.762C40.5055 18.8833 40.4915 19 40.4728 19.112H34.2848V17.992H39.7168L39.1008 18.496C39.1848 18.0107 39.1381 17.5767 38.9608 17.194C38.7835 16.8113 38.5221 16.508 38.1768 16.284C37.8315 16.06 37.4395 15.948 37.0008 15.948C36.5621 15.948 36.1608 16.06 35.7968 16.284C35.4328 16.508 35.1481 16.83 34.9428 17.25C34.7468 17.6607 34.6675 18.1507 34.7048 18.72C34.6675 19.2707 34.7515 19.756 34.9568 20.176C35.1715 20.5867 35.4701 20.9087 35.8528 21.142C36.2448 21.366 36.6695 21.478 37.1268 21.478C37.6308 21.478 38.0555 21.3613 38.4008 21.128C38.7461 20.8947 39.0261 20.596 39.2408 20.232L40.3328 20.792C40.1835 21.1373 39.9501 21.4547 39.6328 21.744C39.3248 22.024 38.9561 22.248 38.5268 22.416C38.1068 22.584 37.6355 22.668 37.1128 22.668ZM45.7124 22.668C44.9844 22.668 44.3358 22.4953 43.7664 22.15C43.1971 21.8047 42.7491 21.3333 42.4224 20.736C42.0958 20.1293 41.9324 19.4527 41.9324 18.706C41.9324 17.95 42.0911 17.278 42.4084 16.69C42.7351 16.102 43.1738 15.64 43.7244 15.304C44.2844 14.9587 44.9098 14.786 45.6004 14.786C46.1604 14.786 46.6551 14.8887 47.0844 15.094C47.5231 15.29 47.8918 15.5607 48.1904 15.906C48.4984 16.242 48.7318 16.6293 48.8904 17.068C49.0584 17.4973 49.1424 17.9453 49.1424 18.412C49.1424 18.5147 49.1331 18.6313 49.1144 18.762C49.1051 18.8833 49.0911 19 49.0724 19.112H42.8844V17.992H48.3164L47.7004 18.496C47.7844 18.0107 47.7378 17.5767 47.5604 17.194C47.3831 16.8113 47.1218 16.508 46.7764 16.284C46.4311 16.06 46.0391 15.948 45.6004 15.948C45.1618 15.948 44.7604 16.06 44.3964 16.284C44.0324 16.508 43.7478 16.83 43.5424 17.25C43.3464 17.6607 43.2671 18.1507 43.3044 18.72C43.2671 19.2707 43.3511 19.756 43.5564 20.176C43.7711 20.5867 44.0698 20.9087 44.4524 21.142C44.8444 21.366 45.2691 21.478 45.7264 21.478C46.2304 21.478 46.6551 21.3613 47.0004 21.128C47.3458 20.8947 47.6258 20.596 47.8404 20.232L48.9324 20.792C48.7831 21.1373 48.5498 21.4547 48.2324 21.744C47.9244 22.024 47.5558 22.248 47.1264 22.416C46.7064 22.584 46.2351 22.668 45.7124 22.668Z" fill="#017649"/>
                  <defs>
                  <linearGradient id="paint0_linear_40_3960" x1="70" y1="17" x2="0" y2="17" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#017649" stopOpacity="0.06"/>
                  <stop offset="1" stopColor="#017649" stopOpacity="0.06"/>
                  </linearGradient>
                  <linearGradient id="paint1_linear_40_3960" x1="70" y1="17" x2="0" y2="17" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#017649" stopOpacity="0.2"/>
                  <stop offset="1" stopColor="#017649" stopOpacity="0.5"/>
                  </linearGradient>
                  </defs>
                </svg>
              ) : (
                <span className="agd-pill" style={{
                  background: dark ? 'linear-gradient(270deg, rgba(7, 242, 88, 0.1) 0%, rgba(7, 242, 88, 0.06) 100%)' : '#ECFDF3',
                  border: dark ? 'none' : '1px solid #D1FADF',
                  color: dark ? '#07F258' : '#027A48',
                }}>{agent.tag}</span>
              )}
              <span className="agd-pill" style={{
                background: 'rgba(66, 199, 255, 0.08)',
                border: '1px solid #42C7FF',
                color: '#42C7FF',
              }}>Open Source</span>
            </div>
          </div>
        </div>

        {/* Screenshot / Preview */}
        <div className="agd-screenshot" style={{ border: cardBorder }}>
          {agent.isCustom && agent.screenshot ? (
            <img src={agent.screenshot} alt={`${agent.name} Screenshot`} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
          ) : (
            <>
              <img
                src={`https://image.thum.io/get/width/1280/crop/800/noanimate/${agent.url}`}
                alt={`${agent.name} Dashboard`}
                loading="lazy"
                onError={(e) => {
                   e.target.style.display = 'none';
                   if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div style={{ display: 'none', padding: '4rem 2rem', color: contentText, alignItems: 'center', justifyContent: 'center', gap: '10px', flexDirection: 'column', width: '100%', textAlign: 'center' }}>
                <div style={{ fontSize: '1.2rem', color: textColor }}>[ Agent Screenshot ]</div>
                <div style={{ fontSize: '0.9rem', color: contentText, opacity: 0.8 }}>Screenshot could not be loaded for this agent.</div>
              </div>
            </>
          )}
        </div>

        {/* Extended Details Content */}
        <div className="agd-content">

          {agent.isCustom && agent.longDesc ? (
            /* ── Auto-formatted user description ── */
            <AutoFormatContent text={agent.longDesc} agent={agent} textColor={textColor} contentText={contentText} />
          ) : (
            /* ── Template-generated content for built-in agents ── */
            <>
              {/* Intro Section */}
              <div className="agd-content-section">
                <h2 style={{ color: textColor }}>{agent.name}: Transform Your {agent.cat} Workflow</h2>
                <p style={{ color: contentText }}>
                  {agent.name} is an innovative platform offering powerful AI capabilities tailored for {agent.cat.toLowerCase()}. Combining a seamless interface with robust technology, {agent.name} is transforming the landscape of how professionals approach tasks in this domain, enabling faster execution and smarter outcomes.
                </p>
              </div>

              {/* Key Features */}
              <div className="agd-content-section">
                <h2 style={{ color: textColor }}>Key Features</h2>
                <div>
                  <h3 style={{ color: textColor }}>{agent.name} Workspace</h3>
                  <p style={{ color: contentText }}>
                    Experience an intuitive, streamlined interface designed to maximize your productivity. Effortlessly set up custom environments, integrations, and workflows specific to {agent.cat.toLowerCase()}. This user-friendly visual approach caters to both beginners and seasoned experts.
                  </p>
                </div>
                <div>
                  <h3 style={{ color: textColor }}>Autonomous Execution Engine</h3>
                  <p style={{ color: contentText }}>
                    The powerhouse of {agent.name} ensures seamless operation. Once configured, your AI workflows can run continuously and can be triggered by external sources, guaranteeing smooth and uninterrupted automation.
                  </p>
                </div>
                <div>
                  <h3 style={{ color: textColor }}>Versatile Applications</h3>
                  <p style={{ color: contentText, marginBottom: '1rem' }}>
                    {agent.name}'s adaptability enables diverse use cases, including:
                  </p>
                  <ul>
                    <li style={{ color: contentText }}><strong style={{ color: textColor }}>Intelligent Process Automation:</strong> Identifies and responds to triggers autonomously, eliminating repetitive manual work.</li>
                    <li style={{ color: contentText }}><strong style={{ color: textColor }}>Context-Aware Generation:</strong> Processes complex inputs to deliver highly optimized outputs perfectly suited for {agent.cat.toLowerCase()}.</li>
                  </ul>
                </div>
              </div>

              {/* Getting Started */}
              <div className="agd-content-section">
                <h2 style={{ color: textColor }}>Getting Started</h2>
                {[
                  { title: `Set Up ${agent.name}`, desc: `Follow the standard onboarding documentation to connect your accounts and initialize the primary workspace.` },
                  { title: 'Design Your Custom Workflow', desc: `Determine your core objectives for ${agent.cat.toLowerCase()} and configure the AI parameters to align with your specific needs.` },
                  { title: 'Deploy & Monitor', desc: `Launch your configuration and let the AI handle the execution over time.` },
                  { title: 'Optimize for Success', desc: `Keep track of your AI's performance via the dashboard, make necessary adjustments, and optimize for improved results.` },
                ].map(item => (
                  <div key={item.title}>
                    <h3 style={{ color: textColor, marginBottom: '0.5rem' }}>{item.title}</h3>
                    <p style={{ color: contentText }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Platform Offerings */}
              <div className="agd-content-section">
                <h2 style={{ color: textColor }}>Platform Offerings</h2>
                {[
                  { title: 'Templates & Blueprints', desc: `Plug-and-play configurations designed to streamline the adoption of AI in ${agent.cat.toLowerCase()}. Eliminate repetitive setup tasks and concentrate on high-level strategy.` },
                  { title: 'Performance Metrics', desc: 'A robust tracking framework to evaluate and fine-tune AI performance, ensuring outputs meet the demands of real-world scenarios.' },
                  { title: 'Seamless Integrations', desc: 'A sleek ecosystem of APIs and webhooks that easily connect to external software, ensuring your AI operations are fully integrated into your existing tech stack.' },
                ].map(item => (
                  <div key={item.title}>
                    <h3 style={{ color: textColor, marginBottom: '0.5rem' }}>{item.title}</h3>
                    <p style={{ color: contentText }}>{item.desc}</p>
                  </div>
                ))}
              </div>

              {/* Why Choose */}
              <div className="agd-content-section">
                <h2 style={{ color: textColor }}>Why Choose {agent.name}?</h2>
                <ul className="agd-bullet-list">
                  {[
                    { label: 'Intuitive Design:', text: 'Simplify your operations with an easy-to-use interface.' },
                    { label: 'Powerful Backend:', text: 'Leverage robust AI models that ensure uninterrupted and accurate operations.' },
                    { label: 'Domain Specificity:', text: `Highly tuned solutions explicitly built for ${agent.cat.toLowerCase()} use cases.` },
                    { label: 'Continuous Updates:', text: 'Benefit from rapid product iterations and a thriving ecosystem of users.' },
                  ].map(item => (
                    <li key={item.label} className="agd-bullet-item">
                      <div className="agd-bullet-dot" />
                      <div style={{ color: contentText }}><strong style={{ color: textColor }}>{item.label}</strong> {item.text}</div>
                    </li>
                  ))}
                </ul>
                <p style={{ color: contentText, marginTop: '1rem' }}>
                  {agent.name} is reshaping how we work by equipping you with tools to delegate complex {agent.cat.toLowerCase()} tasks to intelligent systems seamlessly. Start building your automated solutions today!
                </p>
                <p style={{ color: contentText }}>
                  <strong style={{ color: textColor }}>Explore More:</strong> Visit the <span style={{ color: dark ? '#07F258' : '#297F58', cursor: 'pointer' }} onClick={() => window.open(agent.url, '_blank')}>Official Website</span> for deeper documentation.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Similar Agents Grid */}
        <section className="agd-related-section">
          <h2 className="agd-related-title" style={{ color: textColor }}>
            Discover Similar Agents
          </h2>
          <div className="agd-related-grid">
            {relatedAgents.map(a => (
              <AgentCard key={a.id} agent={a} onClick={() => {
                navigate('/agent/' + a.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

