import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { AGENTS } from '../data/agents';
import Footer from '../components/Footer';
import AgentCard from '../components/AgentCard';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export default function AgentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const dark = theme === 'dark';
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  const agentId = parseInt(id) || 1;
  const agent = AGENTS.find(a => a.id === agentId) || AGENTS[0];
  // Show only agents from the same category
  const relatedAgents = AGENTS.filter(a => a.id !== agent.id && a.cat === agent.cat).slice(0, 3);

  const bg = dark ? '#031713' : '#F7FDFB';
  const textColor = dark ? '#FFFFFF' : '#0B1F18';
  const textMuted = dark ? '#A0C0B0' : '#4E7362';
  const contentText = dark ? '#E2E8F0' : '#4E7362';
  const cardBorder = dark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.08)';

  return (
    <div className="animate-fade-in" style={{ background: bg, minHeight: '100vh', width: '100%', paddingBottom: 0, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        /* ═══════════════════════════════════════════
           AGENT DETAILS — Responsive Styles
           ═══════════════════════════════════════════ */

        .ad-spacer { height: 50px; }

        .ad-main {
          max-width: 1568px;
          margin: 0 auto;
          padding: 0 176px;
          box-sizing: border-box;
        }

        /* Breadcrumb */
        .ad-breadcrumb {
          display: flex;
          gap: 8px;
          align-items: center;
          margin-bottom: 24px;
          font-size: 16px;
          font-weight: 400;
          line-height: 22px;
        }
        .ad-breadcrumb span { cursor: pointer; color: #999999; }
        .ad-breadcrumb .active { color: #07F258; cursor: default; }

        /* Hero Card */
        .ad-hero {
          box-sizing: border-box;
          border-radius: 20px;
          padding: 40px;
          display: grid;
          grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
          gap: 4rem;
          margin-bottom: 3rem;
        }

        /* Agent info header */
        .ad-agent-header {
          display: flex;
          align-items: center;
          gap: 24px;
          margin-bottom: 24px;
        }
        .ad-logo-box {
          width: 80px;
          height: 80px;
          border-radius: 16px;
          background: #020E0B;
          border: 1px solid rgba(255,255,255,0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          padding: 10px;
          flex-shrink: 0;
        }
        .ad-logo-box img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .ad-agent-name {
          font-size: 2.4rem;
          font-weight: 800;
          margin: 0;
          line-height: 1.1;
        }
        .ad-agent-sub {
          font-size: 0.95rem;
          margin-top: 8px;
        }
        .ad-agent-desc {
          font-size: 1.05rem;
          line-height: 1.8;
          margin-bottom: 3rem;
          flex: 1;
        }

        /* Visit Button */
        .ad-visit-btn {
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
        .ad-visit-btn:hover {
          transform: translateY(-2px);
          filter: drop-shadow(0 0 10px rgba(7,242,88,0.4));
          opacity: 0.92;
        }
        .ad-visit-btn::after {
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
        .ad-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .ad-link-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          cursor: pointer;
        }

        /* Details pills */
        .ad-details-pills {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .ad-pill {
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
        .ad-screenshot {
          width: 100%;
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 4rem;
          background: #020E0B;
          min-height: 200px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-top: 1px solid rgba(255,255,255,0.05);
        }
        .ad-screenshot img {
          width: 100%;
          height: auto;
          display: block;
          object-fit: cover;
        }

        /* Content sections */
        .ad-content {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 60px;
          margin-bottom: 6rem;
          max-width: 1000px;
          width: 100%;
        }
        .ad-content-section {
          display: flex;
          flex-direction: column;
          gap: 24px;
          width: 100%;
        }
        .ad-content h2 {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
        }
        .ad-content h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0 0 0.75rem 0;
        }
        .ad-content p, .ad-content li {
          font-size: 1.05rem;
          line-height: 1.8;
          margin: 0;
        }
        .ad-content ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .ad-bullet-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .ad-bullet-item {
          display: flex;
          gap: 10px;
        }
        .ad-bullet-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #07F258;
          margin-top: 10px;
          flex-shrink: 0;
        }

        /* Related agents */
        .ad-related-section {
          padding-bottom: 4rem;
        }
        .ad-related-title {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 2.5rem;
          letter-spacing: -0.02em;
        }
        .ad-related-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        /* ═══════════════════════════════════════════
           TABLET — max-width 1200
           ═══════════════════════════════════════════ */
        @media (max-width: 1200px) {
          .ad-main {
            padding: 0 60px;
          }
        }

        /* ═══════════════════════════════════════════
           TABLET — max-width 1024
           ═══════════════════════════════════════════ */
        @media (max-width: 1024px) {
          .ad-main {
            padding: 0 40px;
          }
          .ad-hero {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 32px;
          }
          .ad-agent-name {
            font-size: 2rem;
          }
          .ad-related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
          .ad-content h2 {
            font-size: 1.6rem;
          }
          .ad-content {
            gap: 40px;
            margin-bottom: 4rem;
          }
        }

        /* ═══════════════════════════════════════════
           MOBILE — max-width 768
           ═══════════════════════════════════════════ */
        @media (max-width: 768px) {
          .ad-spacer { height: 20px; }
          .ad-main {
            padding: 0 16px;
          }
          .ad-breadcrumb {
            font-size: 13px;
            margin-bottom: 16px;
            flex-wrap: wrap;
          }
          .ad-hero {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            padding: 20px;
            border-radius: 16px;
            margin-bottom: 2rem;
          }
          .ad-agent-header {
            gap: 14px;
            margin-bottom: 16px;
          }
          .ad-logo-box {
            width: 56px;
            height: 56px;
            border-radius: 12px;
            padding: 8px;
          }
          .ad-agent-name {
            font-size: 1.5rem;
          }
          .ad-agent-sub {
            font-size: 0.82rem;
          }
          .ad-agent-desc {
            font-size: 0.9rem;
            line-height: 1.7;
            margin-bottom: 1.5rem;
          }
          .ad-visit-btn {
            padding: 11px 20px;
            font-size: 0.9rem;
          }
          .ad-links-grid {
            grid-template-columns: 1fr;
            gap: 0.75rem;
            margin-bottom: 2rem;
          }
          .ad-screenshot {
            border-radius: 16px;
            margin-bottom: 2.5rem;
          }
          .ad-content {
            gap: 36px;
            margin-bottom: 3rem;
          }
          .ad-content h2 {
            font-size: 1.4rem;
          }
          .ad-content h3 {
            font-size: 1.05rem;
          }
          .ad-content p, .ad-content li {
            font-size: 0.9rem;
            line-height: 1.7;
          }
          .ad-related-section {
            padding-bottom: 2.5rem;
          }
          .ad-related-title {
            font-size: 1.4rem;
            margin-bottom: 1.5rem;
          }
          .ad-related-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }
          .ad-pill {
            padding: 6px 14px;
            font-size: 0.78rem;
          }
        }

        /* ═══════════════════════════════════════════
           SMALL MOBILE — max-width 400
           ═══════════════════════════════════════════ */
        @media (max-width: 400px) {
          .ad-main {
            padding: 0 12px;
          }
          .ad-hero {
            padding: 16px;
          }
          .ad-agent-name {
            font-size: 1.3rem;
          }
          .ad-agent-desc {
            font-size: 0.85rem;
          }
          .ad-content h2 {
            font-size: 1.25rem;
          }
        }
      `}</style>

      <div className="ad-spacer" />

      <main className="ad-main">
        
        {/* Breadcrumb */}
        <div className="ad-breadcrumb">
          <span onClick={() => navigate('/')}>Home</span>
          <span>&gt;</span>
          <span onClick={() => navigate('/?category=' + encodeURIComponent(agent.cat))}>{agent.cat}</span>
          <span>&gt;</span>
          <span className="active">{agent.name}</span>
        </div>

        {/* Hero Card */}
        <div className="ad-hero" style={{
          background: dark ? 'linear-gradient(180deg, #041B16 0%, #031713 100%)' : '#FFFFFF',
          border: cardBorder, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
        }}>
          
          {/* Left: Info */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ad-agent-header">
              <div className="ad-logo-box">
                {agent.logo && <img src={agent.logo} alt={agent.name} />}
              </div>
              <div>
                <h1 className="ad-agent-name" style={{ color: textColor }}>{agent.name}</h1>
                <div className="ad-agent-sub" style={{ color: textMuted }}>Build and deploy robust AI solutions for {agent.cat}</div>
              </div>
            </div>
            
            <p className="ad-agent-desc" style={{ color: '#E2E8F0' }}>
              {agent.desc} It features robust capabilities designed specifically for {agent.cat}, empowering users to automate workflows and rapidly deploy intelligent solutions.
            </p>
            
            <button className="ad-visit-btn" onClick={() => window.open(agent.url, '_blank', 'noopener,noreferrer')} style={{
              background: dark ? 'linear-gradient(270deg, rgba(7, 242, 88, 0.1) 0%, rgba(7, 242, 88, 0.06) 100%)' : 'rgba(7, 242, 88, 0.1)',
              color: '#07F258',
            }}>
              <span>Visit {agent.name}</span> <ArrowRight size={16} />
            </button>
          </div>

          {/* Right: Links & Details */}
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '1.2rem' }}>Links</h3>
            <div className="ad-links-grid">
              <div
                className="ad-link-item"
                style={{ color: '#07F258', cursor: 'pointer' }}
                onClick={() => window.open(agent.url, '_blank', 'noopener,noreferrer')}
              >
                <ArrowUpRight size={14} /> Website
              </div>
              {['GitHub', 'Twitter', 'Discord', 'LinkedIn'].map(link => (
                <div key={link} className="ad-link-item" style={{ color: textMuted }}>
                  <ArrowUpRight size={14} /> {link}
                </div>
              ))}
            </div>

            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: textColor, marginBottom: '1.2rem' }}>Details</h3>
            <div className="ad-details-pills">
              <span className="ad-pill" style={{
                background: dark ? 'linear-gradient(270deg, rgba(7, 242, 88, 0.1) 0%, rgba(7, 242, 88, 0.06) 100%)' : 'rgba(7, 242, 88, 0.1)',
                color: '#07F258',
              }}>{agent.tag}</span>
              <span className="ad-pill" style={{
                background: 'rgba(66, 199, 255, 0.08)',
                border: '1px solid #42C7FF',
                color: '#42C7FF',
              }}>Open Source</span>
            </div>
          </div>
        </div>

        {/* Screenshot / Preview */}
        <div className="ad-screenshot" style={{ border: cardBorder }}>
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
        </div>

        {/* Extended Details Content */}
        <div className="ad-content">
          
          {/* Intro Section */}
          <div className="ad-content-section">
            <h2 style={{ color: textColor }}>{agent.name}: Transform Your {agent.cat} Workflow</h2>
            <p style={{ color: contentText }}>
              {agent.name} is an innovative platform offering powerful AI capabilities tailored for {agent.cat.toLowerCase()}. Combining a seamless interface with robust technology, {agent.name} is transforming the landscape of how professionals approach tasks in this domain, enabling faster execution and smarter outcomes.
            </p>
          </div>

          {/* Key Features */}
          <div className="ad-content-section">
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
          <div className="ad-content-section">
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

          {/* Key Tools & Features */}
          <div className="ad-content-section">
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
          <div className="ad-content-section">
            <h2 style={{ color: textColor }}>Why Choose {agent.name}?</h2>
            <ul className="ad-bullet-list">
              {[
                { label: 'Intuitive Design:', text: 'Simplify your operations with an easy-to-use interface.' },
                { label: 'Powerful Backend:', text: 'Leverage robust AI models that ensure uninterrupted and accurate operations.' },
                { label: 'Domain Specificity:', text: `Highly tuned solutions explicitly built for ${agent.cat.toLowerCase()} use cases.` },
                { label: 'Continuous Updates:', text: 'Benefit from rapid product iterations and a thriving ecosystem of users.' },
              ].map(item => (
                <li key={item.label} className="ad-bullet-item">
                  <div className="ad-bullet-dot" />
                  <div style={{ color: contentText }}><strong style={{ color: textColor }}>{item.label}</strong> {item.text}</div>
                </li>
              ))}
            </ul>
            <p style={{ color: contentText, marginTop: '1rem' }}>
              {agent.name} is reshaping how we work by equipping you with tools to delegate complex {agent.cat.toLowerCase()} tasks to intelligent systems seamlessly. Start building your automated solutions today!
            </p>
            <p style={{ color: contentText }}>
              <strong style={{ color: textColor }}>Explore More:</strong> Visit the <span style={{ color: '#07F258', cursor: 'pointer' }} onClick={() => window.open(agent.url, '_blank')}>Official Website</span> for deeper documentation.
            </p>
          </div>
          
        </div>

        {/* Similar Agents Grid */}
        <section className="ad-related-section">
          <h2 className="ad-related-title" style={{ color: textColor }}>
            Discover Similar Agents
          </h2>
          <div className="ad-related-grid">
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
