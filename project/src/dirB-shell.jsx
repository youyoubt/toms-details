// Direction B — Dense Ops Console
// Linear/Vercel-style: tight density, monospace accents, restrained palette.

const { useState: bUseState, useEffect: bUseEffect } = React;

const B_TOKENS = {
  bg: '#fbfbfa',
  cardBg: '#ffffff',
  border: '#ececec',
  borderStrong: '#dcdcdc',
  text: '#18181b',
  textMuted: '#71717a',
  textFaint: '#a1a1aa',
  accent: '#18181b',     // use near-black as accent; true accent for charts
  chartAccent: '#5b5bd6',
  soft: '#f4f4f5',
  success: '#0d9f6e',
  warn: '#c2410c',
  danger: '#b91c1c',
  gridline: 'rgba(0,0,0,.05)',
  tooltipBg: '#18181b',
  tooltipFg: '#fff',
  font: '"Inter var", "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", "SF Mono", ui-monospace, monospace',
};

function BDot({ tone = 'success', pulse }) {
  const c = { success: '#10b981', warn: '#f59e0b', danger: '#ef4444', info: '#6366f1', neutral: '#a1a1aa' }[tone];
  return <span style={{
    display: 'inline-block', width: 6, height: 6, borderRadius: 3,
    background: c, boxShadow: pulse ? `0 0 0 3px ${c}22` : 'none',
    animation: pulse ? 'bPulse 1.8s ease-in-out infinite' : 'none',
  }} />;
}

function BChip({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: '#f4f4f5', fg: '#52525b' },
    success: { bg: '#ecfdf5', fg: '#047857' },
    warn: { bg: '#fffbeb', fg: '#b45309' },
    danger: { bg: '#fef2f2', fg: '#b91c1c' },
    info: { bg: '#eef2ff', fg: '#4338ca' },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '1px 7px', background: tones.bg, color: tones.fg,
      borderRadius: 3, fontSize: 10.5, fontWeight: 500,
      fontFamily: B_TOKENS.mono, textTransform: 'uppercase', letterSpacing: 0.4,
    }}>{children}</span>
  );
}

function BPanel({ title, right, children, mono, pad = 14 }) {
  return (
    <div style={{
      background: B_TOKENS.cardBg,
      border: `1px solid ${B_TOKENS.border}`,
      borderRadius: 6,
    }}>
      {title && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: `10px ${pad}px`,
          borderBottom: `1px solid ${B_TOKENS.border}`,
        }}>
          <div style={{
            fontSize: 11, fontWeight: 600, color: B_TOKENS.text,
            textTransform: 'uppercase', letterSpacing: 0.8,
            fontFamily: mono ? B_TOKENS.mono : B_TOKENS.font,
          }}>{title}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{right}</div>
        </div>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </div>
  );
}

function BBtn({ kind = 'ghost', children, onClick, size = 'sm' }) {
  const [h, setH] = bUseState(false);
  const sizes = { xs: { p: '2px 7px', f: 11 }, sm: { p: '4px 9px', f: 11.5 } }[size];
  const kinds = {
    primary: { bg: B_TOKENS.text, fg: '#fff', bd: B_TOKENS.text, hover: '#27272a' },
    secondary: { bg: '#fff', fg: B_TOKENS.text, bd: B_TOKENS.border, hover: B_TOKENS.soft },
    ghost: { bg: 'transparent', fg: B_TOKENS.textMuted, bd: 'transparent', hover: B_TOKENS.soft },
    danger: { bg: '#fff', fg: B_TOKENS.danger, bd: '#fecaca', hover: '#fef2f2' },
  }[kind];
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: sizes.p, fontSize: sizes.f, fontWeight: 500,
        background: h ? kinds.hover : kinds.bg, color: kinds.fg,
        border: `1px solid ${kinds.bd}`, borderRadius: 4,
        cursor: 'pointer', fontFamily: 'inherit', transition: 'background .1s',
      }}>{children}</button>
  );
}

// ── Command palette (kbar style) ──────────────────────────────────────────
function BCmdK({ onClose, onRun }) {
  const [q, setQ] = bUseState('');
  const cmds = [
    { act: 'reboot', label: 'Reboot terminal', kbd: 'R' },
    { act: 'push-fw', label: 'Push firmware D1.0.06', kbd: 'F' },
    { act: 'push-app', label: 'Push app…', kbd: 'A' },
    { act: 'locate', label: 'Ring & locate', kbd: 'L' },
    { act: 'capture', label: 'Screen capture' },
    { act: 'cache', label: 'Clear cache' },
    { act: 'reset', label: 'Factory reset', kbd: '⇧⌘R', danger: true },
  ].filter((c) => c.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.3)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 100, zIndex: 50,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 540, background: '#fff', borderRadius: 8,
        border: `1px solid ${B_TOKENS.border}`, boxShadow: '0 20px 50px rgba(0,0,0,.2)',
        overflow: 'hidden', fontFamily: B_TOKENS.font,
      }}>
        <div style={{ padding: '12px 14px', borderBottom: `1px solid ${B_TOKENS.border}` }}>
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Run a command…"
            style={{ width: '100%', border: 'none', outline: 'none', fontSize: 14, fontFamily: 'inherit' }} />
        </div>
        <div style={{ maxHeight: 300, overflow: 'auto' }}>
          {cmds.map((c, i) => (
            <div key={c.act} onClick={() => { onRun(c.act, c.label); onClose(); }}
              style={{
                padding: '8px 14px', display: 'flex', alignItems: 'center', gap: 8,
                fontSize: 13, color: c.danger ? B_TOKENS.danger : B_TOKENS.text,
                cursor: 'pointer', background: i === 0 ? B_TOKENS.soft : 'transparent',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = B_TOKENS.soft)}
              onMouseLeave={(e) => (e.currentTarget.style.background = i === 0 ? B_TOKENS.soft : 'transparent')}>
              <span style={{ flex: 1 }}>{c.label}</span>
              {c.kbd && <kbd style={{
                padding: '1px 6px', borderRadius: 3, background: '#fff',
                border: `1px solid ${B_TOKENS.border}`, fontFamily: B_TOKENS.mono,
                fontSize: 10, color: B_TOKENS.textMuted,
              }}>{c.kbd}</kbd>}
            </div>
          ))}
        </div>
        <div style={{
          padding: '8px 14px', borderTop: `1px solid ${B_TOKENS.border}`,
          background: B_TOKENS.soft, fontSize: 11, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono,
          display: 'flex', gap: 14,
        }}>
          <span>↵ run</span><span>esc close</span><span style={{ marginLeft: 'auto' }}>{window.TERMINAL.sn}</span>
        </div>
      </div>
    </div>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
function DirectionB() {
  const [tab, setTab] = bUseState('overview');
  const [cmdk, setCmdk] = bUseState(false);
  const [modal, setModal] = bUseState(null);
  const t = window.TERMINAL;

  bUseEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setCmdk(true); }
      if (e.key === 'Escape') { setCmdk(false); setModal(null); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const resSeries = [
    { label: 'cpu', color: B_TOKENS.chartAccent, values: window.RES_SERIES.map((r) => r.cpu) },
    { label: 'mem', color: '#0d9f6e', values: window.RES_SERIES.map((r) => r.mem), fill: false },
  ];

  return (
    <div style={{
      fontFamily: B_TOKENS.font, background: B_TOKENS.bg,
      color: B_TOKENS.text, fontSize: 13, minHeight: 900,
      display: 'flex', height: '100%',
    }}>
      <style>{`
        @keyframes bPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.4); } }
        @keyframes bBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
      `}</style>

      {/* LEFT SIDEBAR */}
      <aside style={{
        width: 180, flexShrink: 0, background: '#fff',
        borderRight: `1px solid ${B_TOKENS.border}`, padding: '12px 10px',
      }}>
        <div style={{
          padding: '4px 8px 16px', display: 'flex', alignItems: 'center', gap: 8,
          fontFamily: B_TOKENS.mono, fontSize: 13, fontWeight: 700,
        }}>
          <TomsMark size={20} />
          <span style={{ letterSpacing: -0.2 }}>toms</span>
        </div>
        {[
          { key: 'home', label: 'Home', kbd: 'H' },
          { key: 'term', label: 'Terminals', kbd: 'T', active: true, count: 1247 },
          { key: 'dep', label: 'Deployments', kbd: 'D', count: 38 },
          { key: 'app', label: 'Apps', kbd: 'A' },
          { key: 'mer', label: 'Merchants', kbd: 'M' },
          { key: 'res', label: 'Resources' },
          { key: 'data', label: 'Data' },
          { key: 'sys', label: 'System' },
        ].map((i) => (
          <div key={i.key} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '5px 8px', fontSize: 12.5,
            color: i.active ? B_TOKENS.text : B_TOKENS.textMuted,
            background: i.active ? B_TOKENS.soft : 'transparent',
            fontWeight: i.active ? 600 : 500,
            borderRadius: 4, cursor: 'pointer', marginBottom: 1,
          }}>
            <span>{i.label}</span>
            <span style={{ flex: 1 }} />
            {i.count && <span style={{ fontSize: 10.5, color: B_TOKENS.textFaint, fontFamily: B_TOKENS.mono }}>{i.count}</span>}
            {i.kbd && <kbd style={{
              padding: '0 4px', borderRadius: 2, background: '#fff',
              border: `1px solid ${B_TOKENS.border}`, fontFamily: B_TOKENS.mono,
              fontSize: 9.5, color: B_TOKENS.textFaint,
            }}>{i.kbd}</kbd>}
          </div>
        ))}
        <div style={{ height: 16 }} />
        <div style={{
          padding: '8px', background: B_TOKENS.soft, borderRadius: 5,
          fontSize: 11, color: B_TOKENS.textMuted,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
            <BDot tone="success" /> <span style={{ fontWeight: 600, color: B_TOKENS.text, fontFamily: B_TOKENS.mono, fontSize: 10.5 }}>1,243 ONLINE</span>
          </div>
          <div style={{ fontFamily: B_TOKENS.mono, fontSize: 10.5 }}>4 offline · 12 warning</div>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Topbar */}
        <div style={{
          height: 44, display: 'flex', alignItems: 'center', gap: 10,
          padding: '0 16px', borderBottom: `1px solid ${B_TOKENS.border}`, background: '#fff',
        }}>
          <span style={{ fontSize: 12, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>tms / terminals /</span>
          <span style={{ fontSize: 12.5, color: B_TOKENS.text, fontFamily: B_TOKENS.mono, fontWeight: 600 }}>{t.sn}</span>
          <div style={{ flex: 1 }} />
          <button onClick={() => setCmdk(true)} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '3px 8px 3px 10px', fontSize: 11.5,
            background: B_TOKENS.soft, border: `1px solid ${B_TOKENS.border}`,
            borderRadius: 5, color: B_TOKENS.textMuted, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            <span>Run command…</span>
            <kbd style={{
              padding: '0 5px', borderRadius: 3, background: '#fff', fontFamily: B_TOKENS.mono,
              fontSize: 10, border: `1px solid ${B_TOKENS.border}`,
            }}>⌘K</kbd>
          </button>
          <div style={{
            width: 22, height: 22, borderRadius: 11,
            background: '#18181b', color: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600,
          }}>LY</div>
        </div>

        {/* Content */}
        <div style={{ padding: 16, overflow: 'auto', flex: 1 }}>
          {/* Terminal header strip */}
          <div style={{
            background: '#fff', border: `1px solid ${B_TOKENS.border}`,
            borderRadius: 6, padding: 16, marginBottom: 12,
            display: 'grid', gridTemplateColumns: '1fr auto auto auto auto auto auto',
            gap: 28, alignItems: 'center',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 8, background: B_TOKENS.soft,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1px solid ${B_TOKENS.border}`,
              }}>
                <svg width="20" height="24" viewBox="0 0 40 48" fill="none">
                  <rect x="4" y="2" width="32" height="44" rx="4" stroke={B_TOKENS.text} strokeWidth="1.6" />
                  <rect x="8" y="6" width="24" height="12" rx="1" fill={B_TOKENS.soft} stroke={B_TOKENS.border} strokeWidth=".8" />
                </svg>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: -0.2 }}>{t.name}</div>
                  <BDot tone="success" pulse />
                  <span style={{ fontSize: 11, color: B_TOKENS.success, fontWeight: 600, fontFamily: B_TOKENS.mono, textTransform: 'uppercase' }}>Online</span>
                </div>
                <div style={{ fontSize: 11.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono, marginTop: 2 }}>
                  {t.sn} · {t.model} · {t.deployment}
                </div>
              </div>
            </div>
            {[
              { k: 'uptime', v: `${t.uptimePct}%`, s: `${t.uptimeDays}d`, tone: 'success' },
              { k: 'battery', v: `${t.battery.pct}%`, s: `${t.battery.temp}°C`, tone: 'success' },
              { k: 'storage', v: `${t.storage.used}`, s: `/${t.storage.total} GB`, tone: 'neutral' },
              { k: 'cpu', v: `${t.cpu}%`, s: 'avg 24h', tone: 'neutral' },
              { k: 'signal', v: `${t.wifi.signal}`, s: 'dBm · 5G', tone: 'success' },
            ].map((m) => (
              <div key={m.k}>
                <div style={{ fontSize: 10, color: B_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 0.8, fontFamily: B_TOKENS.mono, marginBottom: 2 }}>{m.k}</div>
                <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, fontFamily: B_TOKENS.mono }}>{m.v}</div>
                <div style={{ fontSize: 10.5, color: B_TOKENS.textFaint, fontFamily: B_TOKENS.mono }}>{m.s}</div>
              </div>
            ))}
            <div style={{ display: 'flex', gap: 4 }}>
              <BBtn kind="secondary" onClick={() => setModal({ act: 'reboot', label: 'reboot' })}>Reboot</BBtn>
              <BBtn kind="primary" onClick={() => setModal({ act: 'push-fw', label: 'push firmware' })}>Push ↑</BBtn>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 12,
            borderBottom: `1px solid ${B_TOKENS.border}`,
          }}>
            {[
              ['overview', 'Overview'],
              ['basic', 'Basic Info'],
              ['apps', 'App & Firmware'],
              ['settings', 'Settings'],
              ['remote', 'Remote'],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: '8px 14px', fontSize: 12.5, fontWeight: tab === k ? 600 : 500,
                color: tab === k ? B_TOKENS.text : B_TOKENS.textMuted,
                background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                borderBottom: `2px solid ${tab === k ? B_TOKENS.text : 'transparent'}`, marginBottom: -1,
              }}>{l}</button>
            ))}
          </div>

          {tab === 'overview' && <BOverview resSeries={resSeries} onCmd={(a, l) => setModal({ act: a, label: l })} />}
          {tab === 'basic' && <BBasicInfo />}
          {tab === 'apps' && <BAppFw onCmd={(a, l) => setModal({ act: a, label: l })} />}
          {tab === 'settings' && <BSettings />}
          {tab === 'remote' && <BRemote onCmd={(a, l) => setModal({ act: a, label: l })} />}
        </div>
      </div>

      {cmdk && <BCmdK onClose={() => setCmdk(false)} onRun={(a, l) => setModal({ act: a, label: l })} />}
      {modal && <BCmdModal cmd={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

Object.assign(window, { B_TOKENS, BDot, BChip, BPanel, BBtn, BCmdK, DirectionB });
