import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

import { AGENTS } from '../data/agents';
import { getAllAgents } from '../utils/agentStore';
import AgentCard from '../components/AgentCard';
import Footer from '../components/Footer';

// ── SVG Icon Imports ──────────────────────────────────────────────────────────
import IconAll from '../assets/all.svg';
import IconCoding from '../assets/code.svg';
import IconAIAgent from '../assets/ai_agent.svg';
import IconProductivity from '../assets/productivity.svg';
import IconPersonalAssistant from '../assets/personal assistant .svg';
import IconGeneralPurpose from '../assets/general_urpose.svg';
import IconContentCreation from '../assets/content _creation.svg';
import IconResearch from '../assets/research.svg';
import IconBusinessIntelligence from '../assets/business_intelligence.svg';
import IconDigitalWorker from '../assets/digital_worker.svg';
import IconSales from '../assets/sales.svg';
import IconMarketing from '../assets/marketing.svg';
import IconFinance from '../assets/finance.svg';
import IconDesign from '../assets/design.svg';
import IconDataAnalysis from '../assets/data_analysis.svg';
import IconCustomerService from '../assets/customer_service.svg';
import IconScience from '../assets/science.svg';
import IconHR from '../assets/hr.svg';
import IconOthers from '../assets/others.svg';

// ── Data ──────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { label: 'All',                   icon: IconAll               },
  { label: 'Coding',                icon: IconCoding            },
  { label: 'AI Agent Builders',     icon: IconAIAgent           },
  { label: 'Productivity',          icon: IconProductivity      },
  { label: 'Personal Assistant',    icon: IconPersonalAssistant },
  { label: 'General Purpose',       icon: IconGeneralPurpose    },
  { label: 'Content Creation',      icon: IconContentCreation   },
  { label: 'Research',              icon: IconResearch          },
  { label: 'Business Intelligence', icon: IconBusinessIntelligence },
  { label: 'Digital Workers',       icon: IconDigitalWorker     },
  { label: 'Sales',                 icon: IconSales             },
  { label: 'Marketing',             icon: IconMarketing         },
  { label: 'Finance',               icon: IconFinance           },
  { label: 'Design',                icon: IconDesign            },
  { label: 'Data Analysis',         icon: IconDataAnalysis      },
  { label: 'Customer Service',      icon: IconCustomerService   },
  { label: 'Science',               icon: IconScience           },
  { label: 'HR',                    icon: IconHR                },
  { label: 'Others',                icon: IconOthers            },
];

// ── Typewriter placeholder ────────────────────────────────────────
const PLACEHOLDERS = [
  'Search for coding AI agents...',
  'Find the best productivity tools...',
  'Discover AI for data analysis...',
  'Explore research AI agents...',
  'Your AI guide awaits – ask anything!',
];

export default function Landing() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dark = theme === 'dark';

  // Merge static + localStorage-submitted agents (refresh on mount)
  const [allAgents, setAllAgents] = useState(() => getAllAgents(AGENTS));
  useEffect(() => { setAllAgents(getAllAgents(AGENTS)); }, []);

  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isExpandedCategories, setIsExpandedCategories] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const gridRef = useRef(null);

  const [typedText, setTypedText] = useState('');
  const [phIndex, setPhIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const full = PLACEHOLDERS[phIndex];
    let timeout;
    if (!isDeleting && typedText.length < full.length) {
      timeout = setTimeout(() => setTypedText(full.slice(0, typedText.length + 1)), 60);
    } else if (!isDeleting && typedText.length === full.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && typedText.length > 0) {
      timeout = setTimeout(() => setTypedText(full.slice(0, typedText.length - 1)), 30);
    } else if (isDeleting && typedText.length === 0) {
      setIsDeleting(false);
      setPhIndex((phIndex + 1) % PLACEHOLDERS.length);
    }
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, phIndex]);

  // Read ?category= from URL to pre-select a category filter
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      const match = CATEGORIES.find(c => c.label === cat);
      if (match) {
        setActiveCat(match.label);
        setSearch('');       // clear search when arriving from a URL category link
        setCurrentPage(1);   // reset pagination
      }
    } else {
      setActiveCat('All');
    }
  }, [searchParams]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Performance optimization: only recompute filtered array if dependencies change
  const filtered = useMemo(() => {
    return allAgents.filter(a => {
      const matchCat = activeCat === 'All' || a.cat === activeCat;
      if (!matchCat) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase().trim();
      return a.name.toLowerCase().includes(q); // search by name only
    });
  }, [allAgents, activeCat, search]);

  const categoriesToDisplay = isMobile && !isExpandedCategories ? CATEGORIES.slice(0, 7) : CATEGORIES;


  const ITEMS_PER_PAGE = 12;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);

  const paginatedAgents = useMemo(() => {
    return filtered.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
  }, [filtered, currentPage]);

  const bg = dark ? '#031713' : '#F7FDFB';

  return (
    <div className="landing-page-container" style={{ minHeight: '100vh', background: bg, fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <style>
        {`
          /* ═══════════════════════════════════════════
             DESKTOP — pixel-perfect from Figma
             ═══════════════════════════════════════════ */

          /* ── HERO ───────────────────────────── */
          .responsive-hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 74px 0 32px;
            text-align: center;
          }

          /* Announcement pill — Figma: 454×54, 18px, letter-spacing 1px */
          .announcement-pill {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 13px 24px;
            gap: 10px;
            height: 54px;
            border-radius: 94px;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 500;
            font-size: 18px;
            line-height: 28px;
            letter-spacing: 1px;
            color: #FFFFFF;
            background: linear-gradient(0deg, rgba(255,255,255,0.1) -10.19%, rgba(255,255,255,0.02) 100%);
            backdrop-filter: blur(7px);
            border: none;
            box-sizing: border-box;
          }

          /* Heading — Figma: 80px/112px bold 700, 864px wide, gradient text */
          .responsive-h1 {
            width: 864px;
            max-width: 100%;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 700;
            font-size: 80px;
            line-height: 112px;
            text-align: center;
            background: linear-gradient(180deg, #FFFFFF 11.38%, #CCCCCC 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
          }

          /* Subtitle — Figma: 24px/40px 500, 715px wide, gradient text */
          .responsive-p {
            width: 715px;
            max-width: 100%;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 500;
            font-size: 24px;
            line-height: 40px;
            text-align: center;
            background: linear-gradient(180deg, #FFFFFF 17.5%, #CCCCCC 91.87%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin: 0;
          }

          /* Hero content wrapper — Figma: 864×414, gap 32px */
          .hero-content {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 32px;
            width: 864px;
            max-width: 90vw;
          }

          /* Text block — Figma: gap 24px */
          .hero-text-block {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 24px;
            width: 100%;
          }

          /* Search bar — Figma: 600×58, radius 95px */
          .search-bar-wrap {
            display: flex;
            align-items: center;
            gap: 12px;
            width: 600px;
            max-width: 90vw;
            height: 58px;
            padding: 0 18px;
            border-radius: 95px;
            background: #031713;
            border: 1px solid rgba(255, 255, 255, 0.15);
            box-sizing: border-box;
            transition: border-color 0.25s ease, box-shadow 0.25s ease;
          }
          .search-bar-wrap input {
            flex: 1;
            background: transparent;
            border: none;
            outline: none;
            color: #FFFFFF;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 500;
            font-size: 16px;
            line-height: 23px;
            caret-color: #07F258;
          }
          .search-bar-wrap input::placeholder {
            color: #CCCCCC;
          }

          /* ── CATEGORIES ────────────────────── */
          /* Container — Figma: 1920 wide, 236px tall, bg #031713 */
          .cat-section {
            background: #031713;
            padding: 18px 0;
            width: 100%;
          }

          /* Inner — Figma: 1580px centered, gap 18px between rows */
          .cat-inner {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
            max-width: 1580px;
            margin: 0 auto;
            padding: 0 20px;
          }

          /* Pills wrap — Figma: gap 14px */
          .cat-pills-wrap {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
            justify-content: center;
          }

          /* Each pill — Figma: height 54px, padding 12px 14px, gap 10px, radius 100px */
          .cat-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 12px 14px;
            gap: 10px;
            height: 54px;
            border-radius: 100px;
            background: #041B16;
            backdrop-filter: blur(7.44681px);
            border: none;
            cursor: pointer;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-weight: 500;
            font-size: 20px;
            line-height: 28px;
            color: #CCCCCC;
            white-space: nowrap;
            transition: all 0.17s;
            box-sizing: border-box;
          }
          .cat-btn:hover { opacity: 0.85; }

          /* Icon circle inside pill — Figma: 36.17px, rounded */
          .cat-btn-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            flex-shrink: 0;
            object-fit: cover;
          }

          /* Active pill state */
          .cat-btn.active {
            background: #07F258;
            color: #031713;
            font-weight: 700;
          }
          .cat-btn.active .cat-btn-icon {
            filter: brightness(0.3);
          }

          /* View All button */
          .view-all-cat-btn {
            margin-top: 4px;
            width: 100%;
            padding: 14px;
            border-radius: 12px;
            background: transparent;
            border: 1px solid rgba(255,255,255,0.12);
            color: #FFFFFF;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.2s;
          }
          .view-all-cat-btn:hover {
            background: rgba(255,255,255,0.04);
          }

          /* ── CARDS GRID ────────────────────── */
          /* Figma: 3-col, 176px side padding, 30px gap */
          .responsive-grid-container {
            padding: 40px 176px 60px;
            min-height: 60vh;
          }
          .responsive-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 30px;
            align-items: stretch;
            max-width: 1568px;
            margin: 0 auto;
          }

          /* View More button */
          .view-more-wrap {
            text-align: center;
            margin-top: 40px;
          }
          .view-more-btn {
            padding: 13px 40px;
            border-radius: 94px;
            border: 1px solid #07F258;
            background: rgba(7,242,88,0.07);
            color: #07F258;
            font-family: 'Plus Jakarta Sans', sans-serif;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: background 0.18s;
          }
          .view-more-btn:hover {
            background: rgba(7,242,88,0.15);
          }

          /* ═══════════════════════════════════════════
             TABLET — max-width 1024
             ═══════════════════════════════════════════ */
          @media (max-width: 1200px) {
            .responsive-grid-container {
              padding: 32px 60px 48px;
            }
          }
          @media (max-width: 1024px) {
            .responsive-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
            .responsive-grid-container {
              padding: 28px 40px 40px;
            }
            .responsive-h1 {
              font-size: 56px;
              line-height: 72px;
              width: 100%;
            }
            .responsive-p {
              font-size: 20px;
              line-height: 34px;
              width: 100%;
            }
            .cat-btn {
              height: 48px;
              font-size: 17px;
              padding: 10px 12px;
            }
            .cat-btn-icon {
              width: 32px;
              height: 32px;
            }
            .responsive-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 24px;
            }
          }

          /* ── Pagination UI ── */
          .pagination-wrap {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            margin-top: 60px;
            flex-wrap: wrap;
          }
          .page-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 44px;
            height: 44px;
            border-radius: 12px;
            border: 1px solid rgba(136, 136, 136, 0.2);
            background: transparent;
            color: #888888;
            font-size: 1rem;
            font-weight: 600;
            font-family: 'Inter', sans-serif;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          .page-btn:hover:not(:disabled) {
            border-color: #07F258;
            color: #07F258;
            background: rgba(7, 242, 88, 0.05);
          }
          .page-btn.active {
            background: #07F258;
            color: #031713;
            border-color: #07F258;
          }
          .page-btn:disabled {
            opacity: 0.3;
            cursor: not-allowed;
          }

          /* ═══════════════════════════════════════════
             MOBILE — max-width 768
             ═══════════════════════════════════════════ */
          @media (max-width: 768px) {
            .responsive-hero {
              padding: 28px 20px 24px;
            }
            .announcement-pill {
              height: 40px;
              padding: 8px 16px;
              font-size: 12px;
              line-height: 20px;
              letter-spacing: 0.5px;
            }
            .hero-content {
              gap: 20px;
              width: 100%;
              max-width: 100%;
            }
            .hero-text-block {
              gap: 16px;
            }
            .responsive-h1 {
              font-size: 32px;
              line-height: 44px;
              width: 100%;
            }
            .responsive-p {
              font-size: 14px;
              line-height: 24px;
              width: 100%;
              padding: 0 8px;
            }
            .search-bar-wrap {
              width: calc(100% - 24px);
              max-width: 100%;
              height: 48px;
              padding: 0 14px;
            }
            .search-bar-wrap input {
              font-size: 14px;
              line-height: 20px;
            }

            .cat-section {
              padding: 14px 0;
            }
            .cat-inner {
              gap: 12px;
              padding: 0 16px;
            }
            .cat-pills-wrap {
              gap: 8px;
              justify-content: flex-start;
            }
            .cat-btn {
              height: 38px;
              padding: 6px 10px;
              gap: 6px;
              font-size: 13px;
              line-height: 20px;
            }
            .cat-btn-icon {
              width: 26px;
              height: 26px;
            }

            .responsive-grid-container {
              padding: 20px 16px 32px;
            }
            .responsive-grid {
              grid-template-columns: 1fr;
              gap: 14px;
            }

            .view-more-btn {
              width: 100%;
              padding: 14px;
            }
          }

          /* ═══════════════════════════════════════════
             SMALL MOBILE — max-width 400
             ═══════════════════════════════════════════ */
          @media (max-width: 400px) {
            .responsive-hero {
              padding: 20px 12px 16px;
            }
            .responsive-h1 {
              font-size: 26px;
              line-height: 36px;
            }
            .responsive-p {
              font-size: 13px;
              line-height: 22px;
            }
            .announcement-pill {
              font-size: 11px;
              padding: 6px 12px;
              height: 36px;
            }
            .cat-btn {
              height: 34px;
              font-size: 12px;
              padding: 5px 8px;
              gap: 5px;
            }
            .cat-btn-icon {
              width: 24px;
              height: 24px;
            }
          }
          /* ═══════════════════════════════════════════
             ANIMATIONS & MICRO-INTERACTIONS
             ═══════════════════════════════════════════ */

          /* ── Keyframes ─────────────────────────────── */
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(28px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeInDown {
            from { opacity: 0; transform: translateY(-20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes scaleIn {
            from { opacity: 0; transform: scale(0.88); }
            to   { opacity: 1; transform: scale(1); }
          }
          @keyframes orbFloat {
            0%,100% { transform: translate(0, 0) scale(1); }
            33%      { transform: translate(30px, -40px) scale(1.08); }
            66%      { transform: translate(-20px, 20px) scale(0.96); }
          }
          @keyframes shimmer {
            0%   { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          @keyframes cardReveal {
            from { opacity: 0; transform: translateY(36px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0) scale(1); }
          }
          @keyframes glowPulse {
            0%,100% { box-shadow: 0 0 0 0 rgba(7,242,88,0.0); }
            50%      { box-shadow: 0 0 22px 4px rgba(7,242,88,0.18); }
          }
          @keyframes searchGlow {
            from { box-shadow: 0 0 0 0 rgba(255,255,255,0.0); }
            to   { box-shadow: 0 0 0 3px rgba(255,255,255,0.3); }
          }
          @keyframes announceSpin {
            from { transform: rotate(0deg); }
            to   { transform: rotate(360deg); }
          }

          /* ── Hero entrance animations (staggered) ── */
          .hero-pill-animate {
            animation: fadeInDown 0.6s cubic-bezier(0.22,1,0.36,1) both;
            animation-delay: 0.05s;
          }
          .hero-h1-animate {
            animation: fadeInUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
            animation-delay: 0.18s;
          }
          .hero-p-animate {
            animation: fadeInUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
            animation-delay: 0.3s;
          }
          .hero-search-animate {
            animation: scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both;
            animation-delay: 0.44s;
          }

          /* ── Search bar glow on focus ───────────── */
          .search-bar-wrap:focus-within {
            border-color: rgba(255,255,255,0.45);
            box-shadow: 0 0 0 3px rgba(255,255,255,0.18);
          }

          /* ── Category pill active pop (fires once on selection) ─── */
          .cat-btn.active { /* active state styling only, no animation here */ }

          /* Staggered form & card animations */
          .cat-pill-stagger {
            animation: scaleIn 0.45s cubic-bezier(0.34,1.56,0.64,1) both;
          }
          .card-reveal-animate {
            animation: cardReveal 0.4s cubic-bezier(0.22,1,0.36,1) forwards;
          }

          .view-all-cat-btn::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
            background-size: 200% auto;
            animation: shimmer 2.8s linear infinite;
            border-radius: 12px;
            pointer-events: none;
          }
          .view-all-cat-btn {
            position: relative;
            overflow: hidden;
          }

          /* ── Floating ambient orbs ──────────────── */
          .landing-orb {
            position: absolute;
            border-radius: 50%;
            pointer-events: none;
            filter: blur(70px);
            animation: orbFloat 9s ease-in-out infinite;
          }
          .landing-orb-1 {
            width: 420px; height: 420px;
            background: radial-gradient(circle, rgba(7,242,88,0.09) 0%, transparent 70%);
            top: -80px; left: -60px;
            animation-delay: 0s;
          }
          .landing-orb-2 {
            width: 320px; height: 320px;
            background: radial-gradient(circle, rgba(7,242,88,0.06) 0%, transparent 70%);
            top: 120px; right: -80px;
            animation-delay: 3s;
            animation-duration: 12s;
          }
        `}
      </style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="responsive-hero" style={{ background: bg, position: 'relative' }}>
        <div className="hero-content">

          {/* Text block with 24px gap */}
          <div className="hero-text-block">
            {/* Announcement pill */}
            <div className="announcement-pill hero-pill-animate">
              🔥 &nbsp;Added 38 New AI Agents Just Last Week!
            </div>

            {/* Heading */}
            <h1 className="responsive-h1 hero-h1-animate">
              Uncover Your Ultimate<br />AI Productivity Suite
            </h1>

            {/* Subtitle */}
            <p className="responsive-p hero-p-animate">
              Discover our curated selection of AI agents and create your digital team effortlessly in no time.
            </p>
          </div>

          {/* Search bar — 600×58 */}
          <div className="search-bar-wrap hero-search-animate">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="10.0833" cy="10.0833" r="7.33333" stroke="#CCCCCC" strokeWidth="1.375"/>
              <path d="M18.3333 18.3333L15.5833 15.5833" stroke="#CCCCCC" strokeWidth="1.375" strokeLinecap="round"/>
            </svg>
          <input
              type="text"
              placeholder={search ? '' : typedText}
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                if (e.target.value) {
                  // when user types, reset to All so search runs across all agents
                  setActiveCat('All');
                  setCurrentPage(1);
                }
              }}
            />
          </div>

        </div>
      </section>

      {/* ── CATEGORIES ────────────────────────────────────────────────────── */}
      <div className="cat-section">
        <div className="cat-inner">

          <div className="cat-pills-wrap">
            {categoriesToDisplay.map(({ label, icon }, idx) => {
              const active = activeCat === label;
              return (
                <button
                  key={label}
                  className={`cat-btn${active ? ' active' : ''} cat-pill-stagger`}
                  style={{ animationDelay: `${idx * 0.04}s` }}
                  onClick={() => {
                    if (active) return; // no toggle — stay on selected category
                    setActiveCat(label);
                    setSearch('');
                    setCurrentPage(1);
                  }}
                >
                  <img src={icon} alt={label} className="cat-btn-icon" />
                  {label}
                </button>
              );
            })}
          </div>

          {isMobile && !isExpandedCategories && (
            <button
              className="view-all-cat-btn"
              onClick={() => setIsExpandedCategories(true)}
            >
              View All Categories
            </button>
          )}

          {isMobile && isExpandedCategories && (
            <button
              className="view-all-cat-btn"
              onClick={() => setIsExpandedCategories(false)}
            >
              Show Less
            </button>
          )}

        </div>
      </div>

      {/* ── CARDS GRID ────────────────────────────────────────────────────── */}
      <main ref={gridRef} className="responsive-grid-container" style={{ background: bg, scrollMarginTop: '104px' }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#4A7A64', padding: '80px 0', fontSize: '18px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            No AI agents found.
          </div>
        ) : (
          <>
            <div className="responsive-grid">
              {paginatedAgents.map((a, idx) => {
                return (
                  <div
                    key={`${currentPage}-${a.id}`} // Force re-render/animation on page change
                    className="card-reveal-animate"
                    style={{ 
                      height: '100%',
                      animationDelay: `${(idx % ITEMS_PER_PAGE) * 0.05}s` 
                    }}
                  >
                    <AgentCard agent={a} onClick={() => navigate('/agent/' + a.id)} />
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="pagination-wrap">
                <button 
                  className="page-btn" 
                  disabled={currentPage === 1}
                  onClick={() => { 
                    setCurrentPage(prev => prev - 1); 
                    gridRef.current?.scrollIntoView({ behavior: 'smooth' }); 
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                
                {Array.from({ length: totalPages }).map((_, i) => {
                  const pageNum = i + 1;
                  // Simple responsive pagination: show first, last, current, and adjacent
                  if (
                    totalPages > 5 && 
                    pageNum !== 1 && 
                    pageNum !== totalPages && 
                    Math.abs(pageNum - currentPage) > 1
                  ) {
                    if (pageNum === 2 || pageNum === totalPages - 1) {
                      return <span key={pageNum} style={{ color: '#888' }}>...</span>;
                    }
                    return null;
                  }

                  return (
                    <button
                      key={pageNum}
                      className={`page-btn ${pageNum === currentPage ? 'active' : ''}`}
                      onClick={() => { 
                        setCurrentPage(pageNum); 
                        gridRef.current?.scrollIntoView({ behavior: 'smooth' }); 
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button 
                  className="page-btn" 
                  disabled={currentPage === totalPages}
                  onClick={() => { 
                    setCurrentPage(prev => prev + 1); 
                    gridRef.current?.scrollIntoView({ behavior: 'smooth' }); 
                  }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
}
