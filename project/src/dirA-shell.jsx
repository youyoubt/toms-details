// Direction A — Refined Enterprise
// Anchored in TOMS blue. Clean modernization of the current design:
// tighter grid, better hierarchy, softer cards, improved hover/click states.

const { useState: aUseState, useMemo: aUseMemo, useEffect: aUseEffect } = React;

const A_TOKENS = {
  bg: '#f6f7f9',
  cardBg: '#ffffff',
  border: '#e5e7eb',
  borderStrong: '#d1d5db',
  text: '#0f172a',
  textMuted: '#64748b',
  textFaint: '#94a3b8',
  accent: '#1d4ed8',
  accentHi: '#2563eb',
  accentSoft: '#eff4ff',
  brand: '#1e3a8a',
  success: '#16a34a',
  warn: '#d97706',
  danger: '#dc2626',
  gridline: 'rgba(15,23,42,.07)',
  tooltipBg: '#0f172a',
  tooltipFg: '#fff',
  font: '"Inter var", "Inter", -apple-system, system-ui, sans-serif',
  mono: '"JetBrains Mono", "SF Mono", ui-monospace, monospace',
};

function AChip({ children, tone = 'neutral', size = 'md' }) {
  const tones = {
    neutral: { bg: '#f1f5f9', fg: '#334155', bd: '#e2e8f0' },
    success: { bg: '#ecfdf5', fg: '#047857', bd: '#a7f3d0' },
    warn: { bg: '#fffbeb', fg: '#b45309', bd: '#fde68a' },
    danger: { bg: '#fef2f2', fg: '#b91c1c', bd: '#fecaca' },
    brand: { bg: A_TOKENS.accentSoft, fg: A_TOKENS.accent, bd: '#dbeafe' },
  };
  const t = tones[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'sm' ? '1px 6px' : '2px 8px',
      background: t.bg, color: t.fg,
      border: `1px solid ${t.bd}`, borderRadius: 4,
      fontSize: size === 'sm' ? 10.5 : 11.5, fontWeight: 500,
      letterSpacing: 0.1,
    }}>{children}</span>
  );
}

function ACard({ title, right, children, pad = 20, style }) {
  return (
    <div style={{
      background: A_TOKENS.cardBg,
      border: `1px solid ${A_TOKENS.border}`,
      borderRadius: 8,
      ...style,
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `14px ${pad}px 0`,
        }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: A_TOKENS.text, letterSpacing: -0.1 }}>{title}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{right}</div>
        </div>
      )}
      <div style={{ padding: title ? `12px ${pad}px ${pad}px` : pad }}>{children}</div>
    </div>
  );
}

function AButton({ kind = 'primary', children, onClick, size = 'md', icon }) {
  const sizes = {
    sm: { p: '4px 10px', f: 12 },
    md: { p: '6px 12px', f: 12.5 },
    lg: { p: '8px 16px', f: 13 },
  }[size];
  const kinds = {
    primary: { bg: A_TOKENS.accent, fg: '#fff', bd: A_TOKENS.accent, hover: A_TOKENS.accentHi },
    secondary: { bg: '#fff', fg: A_TOKENS.text, bd: A_TOKENS.border, hover: '#f8fafc' },
    ghost: { bg: 'transparent', fg: A_TOKENS.textMuted, bd: 'transparent', hover: '#f1f5f9' },
    danger: { bg: '#fff', fg: A_TOKENS.danger, bd: '#fecaca', hover: '#fef2f2' },
  }[kind];
  const [h, setH] = aUseState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: sizes.p, fontSize: sizes.f, fontWeight: 500,
        background: h ? kinds.hover : kinds.bg, color: kinds.fg,
        border: `1px solid ${kinds.bd}`, borderRadius: 6,
        cursor: 'pointer', fontFamily: 'inherit',
        transition: 'background .12s',
      }}>
      {icon}{children}
    </button>
  );
}

// Tiny icons
const AIcon = {
  check: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M2.5 6.5L5 9l4.5-5"/></svg>,
  alert: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M6 3v3.5M6 8.5v.01"/><circle cx="6" cy="6" r="5"/></svg>,
  x: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M3 3l6 6M9 3l-6 6"/></svg>,
  refresh: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M10 5a4 4 0 1 0-.5 2M10 2v3H7"/></svg>,
  download: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 1v7M3 5.5L6 8.5 9 5.5M2 10.5h8"/></svg>,
  search: <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><circle cx="5.5" cy="5.5" r="3.5"/><path d="M10.5 10.5L8.2 8.2"/></svg>,
  wifi: <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"><path d="M1 5a7 7 0 0 1 10 0M3 7a4 4 0 0 1 6 0M5.3 9a1 1 0 0 1 1.4 0"/></svg>,
  chev: <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 1.5l3 3.5-3 3.5"/></svg>,
  more: <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor"><circle cx="3.5" cy="7" r="1"/><circle cx="7" cy="7" r="1"/><circle cx="10.5" cy="7" r="1"/></svg>,
};

// ── LEFT NAV ───────────────────────────────────────────────────────────────
function ANav() {
  const items = [
    { label: 'Home', icon: '◨', key: 'home' },
    { label: 'TMS', icon: '▤', key: 'tms', open: true, children: [
      { label: 'Terminal', key: 'term', active: true },
      { label: 'Merchant', key: 'mer' },
      { label: 'Deployment', key: 'dep' },
      { label: 'Resources', key: 'res' },
      { label: 'Group', key: 'grp' },
      { label: 'Update Schedule', key: 'upd' },
    ]},
    { label: 'App Store', icon: '▦', key: 'app' },
    { label: 'Advanced Services', icon: '◈', key: 'adv' },
    { label: 'Data Center', icon: '◫', key: 'dat' },
    { label: 'Estate', icon: '◪', key: 'est' },
    { label: 'System', icon: '◉', key: 'sys' },
  ];
  return (
    <aside style={{
      width: 220, flexShrink: 0,
      background: '#fff',
      borderRight: `1px solid ${A_TOKENS.border}`,
      padding: '16px 10px', fontSize: 13,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '6px 8px 18px' }}>
        <TomsMark size={24} />
        <span style={{ fontWeight: 700, fontSize: 17, letterSpacing: -0.3, color: A_TOKENS.brand }}>TOMS</span>
      </div>
      {items.map((it) => (
        <div key={it.key}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '7px 10px',
            color: it.key === 'tms' ? A_TOKENS.text : A_TOKENS.textMuted,
            fontWeight: it.key === 'tms' ? 600 : 500, borderRadius: 5, cursor: 'pointer',
          }}>
            <span style={{ width: 14, textAlign: 'center', opacity: .75 }}>{it.icon}</span>
            <span>{it.label}</span>
            {it.children && <span style={{ marginLeft: 'auto', opacity: .4, transform: 'rotate(90deg)' }}>{AIcon.chev}</span>}
          </div>
          {it.children && (
            <div style={{ paddingLeft: 14, marginBottom: 8 }}>
              {it.children.map((c) => (
                <div key={c.key} style={{
                  padding: '6px 14px', fontSize: 12.5, borderRadius: 5, cursor: 'pointer',
                  color: c.active ? A_TOKENS.accent : A_TOKENS.textMuted,
                  background: c.active ? A_TOKENS.accentSoft : 'transparent',
                  fontWeight: c.active ? 600 : 500,
                  borderLeft: c.active ? `2px solid ${A_TOKENS.accent}` : '2px solid transparent',
                  marginLeft: -2,
                }}>{c.label}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}

// ── TOPBAR ────────────────────────────────────────────────────────────────
function ATopbar({ term }) {
  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 20px',
      borderBottom: `1px solid ${A_TOKENS.border}`, background: '#fff',
    }}>
      <span style={{ color: A_TOKENS.textFaint, cursor: 'pointer', fontSize: 16 }}>☰</span>
      <div style={{ fontSize: 13, color: A_TOKENS.textMuted }}>
        <span style={{ color: A_TOKENS.textFaint }}>TMS</span>
        <span style={{ margin: '0 8px', color: A_TOKENS.textFaint }}>/</span>
        <span style={{ color: A_TOKENS.textMuted }}>Terminals</span>
        <span style={{ margin: '0 8px', color: A_TOKENS.textFaint }}>/</span>
        <span style={{ color: A_TOKENS.text, fontWeight: 600, fontFamily: A_TOKENS.mono }}>{term.sn}</span>
      </div>
      <div style={{ flex: 1 }} />
      <button style={{
        padding: '5px 11px', fontSize: 12, border: `1px solid ${A_TOKENS.border}`,
        borderRadius: 5, background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
      }}>Back to Classic</button>
      {['⊘', '◯', '↓', '▤'].map((i, idx) => (
        <span key={idx} style={{ color: A_TOKENS.textFaint, cursor: 'pointer', fontSize: 15 }}>{i}</span>
      ))}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 6 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 13,
          background: 'linear-gradient(135deg, #60a5fa, #1e40af)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 11, fontWeight: 600,
        }}>LY</div>
        <span style={{ fontSize: 12.5, color: A_TOKENS.text, fontWeight: 500 }}>Appsigner</span>
      </div>
    </div>
  );
}

// ── HERO ──────────────────────────────────────────────────────────────────
function AHero({ term, onAction }) {
  return (
    <div style={{
      background: `linear-gradient(130deg, #0b1e5a 0%, #1e40af 55%, #2563eb 100%)`,
      borderRadius: 10, padding: 22,
      color: '#fff', position: 'relative', overflow: 'hidden',
    }}>
      {/* subtle circuit pattern */}
      <svg width="320" height="120" style={{ position: 'absolute', right: -20, top: -10, opacity: 0.13 }}>
        <g fill="none" stroke="#fff" strokeWidth="0.8">
          <path d="M0 60 H80 V20 H160 V100 H240 V60 H320" />
          <path d="M0 90 H120 V40 H200" />
          <circle cx="80" cy="20" r="2.5" fill="#fff" />
          <circle cx="160" cy="100" r="2.5" fill="#fff" />
          <circle cx="240" cy="60" r="2.5" fill="#fff" />
        </g>
      </svg>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, position: 'relative' }}>
        {/* Device avatar */}
        <div style={{
          width: 72, height: 72, borderRadius: 10,
          background: 'rgba(255,255,255,.1)',
          border: '1px solid rgba(255,255,255,.18)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          {/* Handheld POS device */}
          <svg width="40" height="48" viewBox="0 0 40 48" fill="none">
            <rect x="4" y="2" width="32" height="44" rx="4" stroke="#fff" strokeWidth="1.6" />
            <rect x="8" y="6" width="24" height="16" rx="1" fill="rgba(255,255,255,.22)" />
            <circle cx="11" cy="28" r="2" fill="#fff" opacity=".7" />
            <circle cx="20" cy="28" r="2" fill="#fff" opacity=".7" />
            <circle cx="29" cy="28" r="2" fill="#fff" opacity=".7" />
            <circle cx="11" cy="36" r="2" fill="#fff" opacity=".7" />
            <circle cx="20" cy="36" r="2" fill="#fff" opacity=".7" />
            <circle cx="29" cy="36" r="2" fill="#fff" opacity=".7" />
            <rect x="14" y="42" width="12" height="1.8" rx=".8" fill="#fff" opacity=".6" />
          </svg>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 8, height: 8, borderRadius: 4, background: '#4ade80',
              boxShadow: '0 0 0 3px rgba(74,222,128,.25)',
            }} />
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.4 }}>{term.name}</div>
            <span style={{
              fontSize: 11, padding: '2px 7px', borderRadius: 3,
              background: 'rgba(74,222,128,.18)', color: '#86efac',
              border: '1px solid rgba(74,222,128,.3)', fontWeight: 500,
            }}>Online</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12, opacity: .85 }}>
            <span><span style={{ opacity: .6 }}>SN</span> <span style={{ fontFamily: A_TOKENS.mono }}>{term.sn}</span></span>
            <span><span style={{ opacity: .6 }}>Model</span> {term.model}</span>
            <span><span style={{ opacity: .6 }}>Deployment</span> {term.deployment}</span>
            <span><span style={{ opacity: .6 }}>Group</span> {term.group}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
            {term.tags.map((t) => (
              <span key={t} style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 3,
                background: 'rgba(255,255,255,.12)', border: '1px solid rgba(255,255,255,.18)',
              }}>{t}</span>
            ))}
            <span style={{
              fontSize: 11, padding: '2px 8px', borderRadius: 3,
              background: 'rgba(255,255,255,.06)', border: '1px dashed rgba(255,255,255,.3)',
              cursor: 'pointer', color: 'rgba(255,255,255,.75)',
            }}>+ Edit Group</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onAction('reboot')} style={{
            padding: '7px 14px', fontSize: 12.5, fontWeight: 500,
            background: 'rgba(255,255,255,.12)', color: '#fff',
            border: '1px solid rgba(255,255,255,.2)', borderRadius: 6,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>Reboot</button>
          <button onClick={() => onAction('push')} style={{
            padding: '7px 14px', fontSize: 12.5, fontWeight: 600,
            background: '#fff', color: A_TOKENS.accent,
            border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
          }}>Push Firmware</button>
        </div>
      </div>
    </div>
  );
}

// ── TABS ──────────────────────────────────────────────────────────────────
function ATabs({ active, onChange }) {
  const tabs = ['Overview', 'Basic Info', 'App & Firmware', 'Settings', 'Remote Assistance'];
  return (
    <div style={{
      display: 'flex', gap: 4, borderBottom: `1px solid ${A_TOKENS.border}`,
      padding: '0 4px', marginTop: 16,
    }}>
      {tabs.map((t) => {
        const a = t === active;
        return (
          <button key={t} onClick={() => onChange(t)} style={{
            padding: '10px 14px', fontSize: 13, fontWeight: a ? 600 : 500,
            color: a ? A_TOKENS.accent : A_TOKENS.textMuted,
            background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
            borderBottom: a ? `2px solid ${A_TOKENS.accent}` : '2px solid transparent',
            marginBottom: -1,
          }}>{t}</button>
        );
      })}
    </div>
  );
}

Object.assign(window, { A_TOKENS, AChip, ACard, AButton, AIcon, ANav, ATopbar, AHero, ATabs });
