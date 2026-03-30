import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import Footer from '../components/Footer';
import { saveCustomAgent } from '../utils/agentStore';

const ALL_CATEGORIES = [
  'Coding', 'AI Agent Builders', 'Productivity', 'Personal Assistant',
  'General Purpose', 'Content Creation', 'Research', 'Business Intelligence',
  'Digital Workers', 'Sales', 'Marketing', 'Finance',
  'Design', 'Data Analysis', 'Customer Service', 'Science', 'HR', 'Others',
];

const PRICING_TAGS = ['Free', 'Free / Paid', 'Paid'];

export default function SubmitAgent() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const dark = theme === 'dark';

  useEffect(() => { window.scrollTo(0, 0); }, []);

  // ── Form state ────────────────────────────────────────────────
  const [form, setForm] = useState({
    name: '',
    url: '',
    category: 'General Purpose',
    tag: 'Free',
    description: '',
    longDesc: '',
    links: [{ title: '', url: '' }],
  });
  const [logoFile, setLogoFile] = useState(null);      // { preview, base64 }
  const [screenshot, setScreenshot] = useState(null);  // { preview, base64 }
  const [error, setError] = useState({ field: '', message: '' }); // one error at a time
  const [submitting, setSubmitting] = useState(false);

  const fieldRefs = {
    name: useRef(null),
    url: useRef(null),
    description: useRef(null),
    longDesc: useRef(null),
  };

  // ── Image helpers ─────────────────────────────────────────────
  const readFile = (file) =>
    new Promise((res) => {
      const reader = new FileReader();
      reader.onload = (e) => res({ preview: e.target.result, base64: e.target.result });
      reader.readAsDataURL(file);
    });

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await readFile(file);
    setLogoFile(data);
  };

  const handleScreenshotChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const data = await readFile(file);
    setScreenshot(data);
  };

  // ── One-by-one validation ─────────────────────────────────────
  const SHORT_DESC_LIMIT = 75;
  const validate = () => {
    if (!form.name.trim()) return { field: 'name', message: 'Agent name is required.' };
    if (!form.url.trim()) return { field: 'url', message: 'Website URL is required.' };
    try { new URL(form.url); } catch {
      return { field: 'url', message: 'Please enter a valid URL (e.g. https://example.com).' };
    }
    if (!form.description.trim()) return { field: 'description', message: 'Short description is required.' };
    if (form.description.trim().length > SHORT_DESC_LIMIT) return { field: 'description', message: `Short description must be ${SHORT_DESC_LIMIT} characters or less.` };
    if (!form.longDesc.trim()) return { field: 'longDesc', message: 'Detailed description is required.' };
    
    // Validate custom links if they are partially filled
    for (let i = 0; i < form.links.length; i++) {
      const link = form.links[i];
      if (link.title.trim() && !link.url.trim()) {
        return { field: `link_url_${i}`, message: 'URL is required for this link.' };
      }
      if (!link.title.trim() && link.url.trim()) {
        return { field: `link_title_${i}`, message: 'Title is required for this URL.' };
      }
      if (link.url.trim()) {
        try { new URL(link.url); } catch {
          return { field: `link_url_${i}`, message: 'Please enter a valid URL.' };
        }
      }
    }
    return null;
  };

  // ── Submit ────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      const el = fieldRefs[err.field]?.current;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setError({ field: '', message: '' });
    setSubmitting(true);

    saveCustomAgent({
      name: form.name.trim(),
      url: form.url.trim(),
      cat: form.category,
      tag: form.tag,
      desc: form.description.trim(),
      longDesc: form.longDesc.trim(),
      links: form.links.filter(l => l.title.trim() && l.url.trim()),
      logo: logoFile?.base64 || null,
      screenshot: screenshot?.base64 || null,
      color: '#07F258',
    });

    setTimeout(() => {
      setSubmitting(false);
      navigate('/');
    }, 600);
  };

  // ── Theme tokens ──────────────────────────────────────────────
  const bg           = dark ? '#031713' : '#FFFFFF';
  const textColor    = dark ? '#FFFFFF' : '#111827';
  const textMuted    = dark ? '#CCCCCC' : '#4B5563';
  const inputBg      = dark ? '#031814' : '#FFFFFF';
  const borderNormal = dark ? 'rgba(255,255,255,0.1)' : '#E5E7EB';
  const borderFocus  = dark ? 'rgba(7,242,88,0.5)'   : '#BBF7D0';
  const borderError  = 'rgba(255,80,80,0.8)';

  const getInputStyle = (field, extra = {}) => ({
    width: '100%',
    background: inputBg,
    border: `1px solid ${error.field === field ? borderError : borderNormal}`,
    borderRadius: '95px',
    padding: '0 24px',
    height: '58px',
    boxSizing: 'border-box',
    color: textColor,
    fontSize: '16px',
    outline: 'none',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    transition: 'border-color 0.2s',
    ...extra,
  });

  const label = (text, required = false) => (
    <label style={{ fontSize: '15px', fontWeight: 600, color: textMuted, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {text}{required && <span style={{ color: '#FF4D4D', marginLeft: 4 }}>*</span>}
    </label>
  );

  const ErrorMsg = ({ field }) =>
    error.field === field ? (
      <div style={{ fontSize: '13px', color: '#FF6B6B', paddingLeft: 14, marginTop: 2, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        ⚠ {error.message}
      </div>
    ) : null;

  return (
    <div style={{ background: bg, minHeight: '100vh', width: '100%', display: 'flex', flexDirection: 'column', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        .sa-spacer { height: 32px; }
        .sa-main { flex:1; display:flex; justify-content:center; padding: 2rem 8% 6rem; box-sizing:border-box; }
        .sa-wrapper { display:flex; flex-direction:column; gap:40px; width:100%; max-width:900px; }
        .sa-card { border-radius:20px; padding:40px; box-sizing:border-box; }
        .sa-form { display:flex; flex-direction:column; gap:28px; }
        .sa-field { display:flex; flex-direction:column; gap:10px; }
        .sa-row { display:grid; grid-template-columns:1fr 1fr; gap:24px; }
        .sa-upload-box {
          width:100%; border-radius:16px; border:2px dashed ${dark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'};
          background:${dark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.02)'};
          display:flex; flex-direction:column; align-items:center; justify-content:center;
          cursor:pointer; transition:border-color 0.2s, background 0.2s; overflow:hidden; position:relative;
        }
        .sa-upload-box:hover { border-color:rgba(7,242,88,0.5); background:${dark ? 'rgba(7,242,88,0.04)' : 'rgba(7,242,88,0.03)'}; }
        .sa-upload-box input[type=file] { position:absolute; inset:0; opacity:0; cursor:pointer; }
        .sa-submit-btn {
          display:flex; align-items:center; justify-content:center; gap:10px;
          padding:0 36px; height:54px; border-radius:94px;
          font-size:16px; font-weight:700; cursor:pointer;
          font-family:'Plus Jakarta Sans', sans-serif;
          transition:all 0.2s cubic-bezier(0.34,1.56,0.64,1); outline:none;
        }
        .sa-submit-btn:hover { transform:translateY(-2px); filter:drop-shadow(0 0 12px rgba(7,242,88,0.35)); }
        .sa-submit-btn:active { transform:scale(0.97); }
        .sa-select { appearance:none; cursor:pointer; }
        textarea.sa-textarea { resize:vertical; border-radius:20px !important; height:auto !important; }
        @media(max-width:768px) {
          .sa-spacer { height:20px; }
          .sa-main { padding:1.5rem 16px 4rem; }
          .sa-card { padding:24px; border-radius:16px; }
          .sa-row { grid-template-columns:1fr; gap:20px; }
          .sa-form { gap:20px; }
          .sa-submit-btn { width:100%; }
        }
        @media(max-width:400px) {
          .sa-main { padding:1rem 12px 3rem; }
          .sa-card { padding:16px; }
        }
      `}</style>

      <div className="sa-spacer" />

      <main className="sa-main">
        <div className="sa-wrapper">

          {/* ── Header ─────────────────────────── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700, letterSpacing: '-0.02em', color: textColor }}>
              Submit Your AI Agent
            </h1>
            <p style={{ margin: 0, fontSize: 16, lineHeight: 1.6, color: textMuted }}>
              Fill in the details below. Your agent will appear on the Landing page immediately after submission.
            </p>
          </div>

          {/* ── Form Card ──────────────────────── */}
          <div className="sa-card" style={{
            background: dark ? 'linear-gradient(180deg,#041B16 0%,#031713 100%)' : '#FFFFFF',
            border: dark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.08)',
            boxShadow: dark ? '0 20px 60px rgba(0,0,0,0.15)' : 'none',
          }}>
            <form className="sa-form" onSubmit={handleSubmit} noValidate>

              {/* Row 1: Name + URL */}
              <div className="sa-row">
                <div className="sa-field" ref={fieldRefs.name}>
                  {label('Agent Name', true)}
                  <input
                    type="text"
                    placeholder="e.g. SuperBot AI"
                    value={form.name}
                    onChange={e => { setForm({ ...form, name: e.target.value }); if (error.field === 'name') setError({}); }}
                    style={getInputStyle('name')}
                    onFocus={e => e.target.style.borderColor = borderFocus}
                    onBlur={e => e.target.style.borderColor = error.field === 'name' ? borderError : borderNormal}
                  />
                  <ErrorMsg field="name" />
                </div>

                <div className="sa-field" ref={fieldRefs.url}>
                  {label('Website URL', true)}
                  <input
                    type="text"
                    placeholder="https://youragent.com"
                    value={form.url}
                    onChange={e => { setForm({ ...form, url: e.target.value }); if (error.field === 'url') setError({}); }}
                    style={getInputStyle('url')}
                    onFocus={e => e.target.style.borderColor = borderFocus}
                    onBlur={e => e.target.style.borderColor = error.field === 'url' ? borderError : borderNormal}
                  />
                  <ErrorMsg field="url" />
                </div>
              </div>

              {/* Row 2: Category + Pricing */}
              <div className="sa-row">
                <div className="sa-field">
                  {label('Primary Category', true)}
                  <div style={{ position: 'relative' }}>
                    <select
                      className="sa-select"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      style={getInputStyle('category')}
                      onFocus={e => e.target.style.borderColor = borderFocus}
                      onBlur={e => e.target.style.borderColor = borderNormal}
                    >
                      {ALL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M1 1L7 7L13 1" stroke={dark ? "rgba(255,255,255,0.7)" : "#111827"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>

                <div className="sa-field">
                  {label('Pricing', true)}
                  <div style={{ position: 'relative' }}>
                    <select
                      className="sa-select"
                      value={form.tag}
                      onChange={e => setForm({ ...form, tag: e.target.value })}
                      style={getInputStyle('tag')}
                      onFocus={e => e.target.style.borderColor = borderFocus}
                      onBlur={e => e.target.style.borderColor = borderNormal}
                    >
                      {PRICING_TAGS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <svg style={{ position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} width="14" height="8" viewBox="0 0 14 8" fill="none"><path d="M1 1L7 7L13 1" stroke={dark ? "rgba(255,255,255,0.7)" : "#111827"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="sa-field" ref={fieldRefs.description}>
                {label('Short Description', true)}
                <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Shown on the agent card. Max 75 characters.
                </p>
                <textarea
                  className="sa-textarea"
                  rows={2}
                  maxLength={75}
                  placeholder="One-liner: what this agent does and who it's for..."
                  value={form.description}
                  onChange={e => { setForm({ ...form, description: e.target.value }); if (error.field === 'description') setError({}); }}
                  style={{ ...getInputStyle('description', { borderRadius: '20px', height: 'auto', padding: '16px 24px' }) }}
                  onFocus={e => e.target.style.borderColor = borderFocus}
                  onBlur={e => e.target.style.borderColor = error.field === 'description' ? borderError : borderNormal}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <ErrorMsg field="description" />
                  <span style={{ fontSize: 12, marginLeft: 'auto', paddingRight: 4, color: form.description.length > 60 ? '#FF6B6B' : (dark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)'), fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {form.description.length}/75
                  </span>
                </div>
              </div>

              {/* Long Description */}
              <div className="sa-field" ref={fieldRefs.longDesc}>
                {label('Detailed Description', true)}
                <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Describe your agent in detail — what it does, its key features, and why users should choose it. Write multiple paragraphs for best results. This content will be auto-formatted on the agent details page.
                </p>
                <textarea
                  className="sa-textarea"
                  rows={10}
                  placeholder={`Describe your agent in detail. For example:\n\n${form.name || 'Your Agent'} is an AI-powered platform that helps teams...\n\nKey features include:\n- Feature 1\n- Feature 2\n\nGetting started is easy. Simply...`}
                  value={form.longDesc}
                  onChange={e => { setForm({ ...form, longDesc: e.target.value }); if (error.field === 'longDesc') setError({}); }}
                  style={{ ...getInputStyle('longDesc', { borderRadius: '20px', height: 'auto', padding: '16px 24px', lineHeight: '1.7' }) }}
                  onFocus={e => e.target.style.borderColor = borderFocus}
                  onBlur={e => e.target.style.borderColor = error.field === 'longDesc' ? borderError : borderNormal}
                />
                <ErrorMsg field="longDesc" />
              </div>

              {/* Row 3: Logo + Screenshot uploads */}
              <div className="sa-row">
                {/* Logo Upload */}
                <div className="sa-field">
                  {label('Agent Logo')}
                  <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Square image recommended (PNG/SVG/JPG)
                  </p>
                  <div className="sa-upload-box" style={{ height: 140 }}>
                    <input type="file" accept="image/*" onChange={handleLogoChange} />
                    {logoFile ? (
                      <img src={logoFile.preview} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 16, boxSizing: 'border-box' }} />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20, pointerEvents: 'none' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="4" stroke={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} strokeWidth="1.5"/><path d="M3 15l5-5 4 4 3-3 6 6" stroke={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} strokeWidth="1.5" strokeLinecap="round"/><circle cx="8" cy="8" r="1.5" fill={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}/></svg>
                        <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Click to upload logo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Screenshot Upload */}
                <div className="sa-field">
                  {label('Interface Screenshot')}
                  <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    Shown on the agent details page
                  </p>
                  <div className="sa-upload-box" style={{ height: 140 }}>
                    <input type="file" accept="image/*" onChange={handleScreenshotChange} />
                    {screenshot ? (
                      <img src={screenshot.preview} alt="Screenshot" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: 20, pointerEvents: 'none' }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><rect x="2" y="4" width="20" height="16" rx="3" stroke={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} strokeWidth="1.5"/><path d="M2 9h20" stroke={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'} strokeWidth="1.5"/><circle cx="6" cy="6.5" r="1" fill={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}/><circle cx="9" cy="6.5" r="1" fill={dark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)'}/></svg>
                        <span style={{ fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.35)', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Click to upload screenshot</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dynamic Links Section */}
              <div className="sa-field">
                {label('Additional Links (Optional)')}
                <p style={{ margin: 0, fontSize: 13, color: dark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  Add links to your GitHub, Twitter, Documentation, or Discord.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {form.links.map((link, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <input
                          type="text"
                          placeholder="Link Name (e.g. GitHub)"
                          value={link.title}
                          onChange={e => {
                            const newLinks = [...form.links];
                            newLinks[idx].title = e.target.value;
                            setForm({ ...form, links: newLinks });
                            if (error.field === `link_title_${idx}`) setError({});
                          }}
                          style={getInputStyle(`link_title_${idx}`, { height: '52px', borderRadius: '16px' })}
                          onFocus={e => e.target.style.borderColor = borderFocus}
                          onBlur={e => e.target.style.borderColor = error.field === `link_title_${idx}` ? borderError : borderNormal}
                        />
                        <ErrorMsg field={`link_title_${idx}`} />
                      </div>
                      <div style={{ flex: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input
                            type="text"
                            placeholder="https://"
                            value={link.url}
                            onChange={e => {
                              const newLinks = [...form.links];
                              newLinks[idx].url = e.target.value;
                              setForm({ ...form, links: newLinks });
                              if (error.field === `link_url_${idx}`) setError({});
                            }}
                            style={{ ...getInputStyle(`link_url_${idx}`, { height: '52px', borderRadius: '16px' }), flex: 1 }}
                            onFocus={e => e.target.style.borderColor = borderFocus}
                            onBlur={e => e.target.style.borderColor = error.field === `link_url_${idx}` ? borderError : borderNormal}
                          />
                          {form.links.length > 1 && (
                            <button
                              type="button"
                              onClick={() => setForm({ ...form, links: form.links.filter((_, i) => i !== idx) })}
                              style={{ width: '52px', height: '52px', borderRadius: '16px', border: 'none', background: dark ? 'rgba(255,80,80,0.1)' : 'rgba(255,80,80,0.05)', color: '#FF6B6B', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                              title="Remove Link"
                            >
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                          )}
                        </div>
                        <ErrorMsg field={`link_url_${idx}`} />
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, links: [...form.links, { title: '', url: '' }] })}
                    style={{ background: 'transparent', border: `1px dashed ${borderNormal}`, borderRadius: '16px', padding: '14px', color: dark ? '#07F258' : '#058E38', fontWeight: 600, cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    + Add Another Link
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <div style={{ marginTop: 10 }}>
                <button
                  type="submit"
                  className="sa-submit-btn"
                  disabled={submitting}
                  style={{
                    background: dark
                      ? submitting ? 'rgba(7,242,88,0.05)' : 'linear-gradient(135deg,rgba(7,242,88,0.15) 0%,rgba(7,242,88,0.08) 100%)'
                      : submitting ? '#D1FADF' : '#ECFDF3',
                    border: dark ? '1px solid rgba(7,242,88,0.3)' : '1px solid #D1FADF',
                    color: dark ? '#07F258' : '#027A48',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'wait' : 'pointer',
                  }}
                >
                  {submitting ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ animation: 'spin 1s linear infinite' }}>
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="40" strokeDashoffset="10"/>
                      </svg>
                      Submitting…
                    </>
                  ) : (
                    <>
                      Submit Agent →
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
