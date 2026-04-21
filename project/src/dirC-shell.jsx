// Direction C — Dark Monitoring Console (NOC-style)

const C_TOKENS = {
  bg: '#07090d',
  panel: '#0d1117',
  panelLift: '#141a24',
  border: '#1f2633',
  borderStrong: '#2a3244',
  text: '#e6edf3',
  textMuted: '#7d8590',
  textFaint: '#484f58',
  accent: '#39d353',      // signal green
  accentSoft: 'rgba(57,211,83,.12)',
  info: '#58a6ff',
  warn: '#f0883e',
  danger: '#f85149',
  gridline: 'rgba(139,148,158,.12)',
  tooltipBg: '#1c2128',
  tooltipFg: '#e6edf3',
  font: '"Inter var", "Inter", system-ui, -apple-system, sans-serif',
  mono: '"JetBrains Mono", "IBM Plex Mono", ui-monospace, monospace',
};

function CDot({ tone = 'online', pulse }) {
  const c = { online: C_TOKENS.accent, warn: C_TOKENS.warn, offline: C_TOKENS.danger, idle: C_TOKENS.textMuted, info: C_TOKENS.info }[tone];
  return <span style={{
    display: 'inline-block', width: 7, height: 7, borderRadius: 4, background: c,
    boxShadow: `0 0 0 3px ${c}22, 0 0 10px ${c}`,
    animation: pulse ? 'cPulse 2s ease-in-out infinite' : 'none',
  }} />;
}

function CPanel({ title, right, children, pad = 16, glow }) {
  return (
    <div style={{
      background: C_TOKENS.panel,
      border: `1px solid ${C_TOKENS.border}`,
      borderRadius: 6,
      boxShadow: glow ? `0 0 0 1px ${C_TOKENS.accent}22, 0 0 20px ${C_TOKENS.accent}11` : 'none',
    }}>
      {title && (
        <div style={{
          padding: `10px ${pad}px`, display: 'flex',
          alignItems: 'center', justifyContent: 'space-between',
          borderBottom: `1px solid ${C_TOKENS.border}`,
        }}>
          <div style={{
            fontSize: 10.5, fontWeight: 600, color: C_TOKENS.textMuted,
            textTransform: 'uppercase', letterSpacing: 1.2, fontFamily: C_TOKENS.mono,
          }}>{title}</div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>{right}</div>
        </div>
      )}
      <div style={{ padding: pad }}>{children}</div>
    </div>
  );
}

function CChip({ children, tone = 'neutral' }) {
  const tones = {
    neutral: { bg: '#1c2128', fg: '#7d8590', bd: '#2a3244' },
    online: { bg: 'rgba(57,211,83,.12)', fg: '#56d364', bd: 'rgba(57,211,83,.3)' },
    warn: { bg: 'rgba(240,136,62,.12)', fg: '#f0883e', bd: 'rgba(240,136,62,.3)' },
    danger: { bg: 'rgba(248,81,73,.12)', fg: '#ff7b72', bd: 'rgba(248,81,73,.3)' },
    info: { bg: 'rgba(88,166,255,.12)', fg: '#58a6ff', bd: 'rgba(88,166,255,.3)' },
  }[tone];
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '1px 8px', background: tones.bg, color: tones.fg,
      border: `1px solid ${tones.bd}`, borderRadius: 3,
      fontSize: 10.5, fontWeight: 500, fontFamily: C_TOKENS.mono,
      textTransform: 'uppercase', letterSpacing: 0.6,
    }}>{children}</span>
  );
}

function CBtn({ kind = 'secondary', children, onClick, danger }) {
  const [h, setH] = React.useState(false);
  const kinds = {
    primary: { bg: C_TOKENS.accent, fg: '#0a0f0c', bd: C_TOKENS.accent, hover: '#46de62' },
    secondary: { bg: 'transparent', fg: C_TOKENS.text, bd: C_TOKENS.borderStrong, hover: C_TOKENS.panelLift },
    ghost: { bg: 'transparent', fg: C_TOKENS.textMuted, bd: 'transparent', hover: C_TOKENS.panelLift },
    danger: { bg: 'transparent', fg: C_TOKENS.danger, bd: 'rgba(248,81,73,.4)', hover: 'rgba(248,81,73,.1)' },
  }[danger ? 'danger' : kind];
  return (
    <button onClick={onClick}
      onMouseEnter={() => setH(true)} onMouseLeave={() => setH(false)}
      style={{
        padding: '4px 10px', fontSize: 11.5, fontWeight: 500,
        background: h ? kinds.hover : kinds.bg, color: kinds.fg,
        border: `1px solid ${kinds.bd}`, borderRadius: 4,
        cursor: 'pointer', fontFamily: 'inherit', transition: 'all .12s',
      }}>{children}</button>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────
function DirectionC() {
  const [tab, setTab] = React.useState('overview');
  const [modal, setModal] = React.useState(null);
  const t = window.TERMINAL;

  const resSeries = [
    { label: 'cpu', color: C_TOKENS.info, values: window.RES_SERIES.map((r) => r.cpu) },
    { label: 'mem', color: '#d2a8ff', values: window.RES_SERIES.map((r) => r.mem), fill: false },
  ];

  return (
    <div style={{
      background: C_TOKENS.bg, color: C_TOKENS.text, minHeight: 900,
      fontFamily: C_TOKENS.font, fontSize: 13, display: 'flex', height: '100%',
    }}>
      <style>{`
        @keyframes cPulse { 0%,100% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.3); opacity: .7; } }
        @keyframes cBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        @keyframes cScan { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
      `}</style>

      {/* Sidebar */}
      <aside style={{
        width: 200, flexShrink: 0, background: '#050709',
        borderRight: `1px solid ${C_TOKENS.border}`, padding: '14px 10px',
      }}>
        <div style={{ padding: '4px 8px 18px', display: 'flex', alignItems: 'center', gap: 9 }}>
          <TomsMark size={26} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, fontFamily: C_TOKENS.mono, color: '#e6eaf0', letterSpacing: -0.2 }}>TOMS</div>
            <div style={{ fontSize: 9, color: C_TOKENS.textFaint, fontFamily: C_TOKENS.mono, letterSpacing: 1 }}>OPS · NOC</div>
          </div>
        </div>
        {[
          { k: 'home', l: 'Overview' },
          { k: 'term', l: 'Terminals', n: '1247', active: true },
          { k: 'dep', l: 'Deployments', n: '38' },
          { k: 'alert', l: 'Alerts', n: '3', tone: 'warn' },
          { k: 'app', l: 'Apps' },
          { k: 'mer', l: 'Merchants' },
          { k: 'data', l: 'Data center' },
          { k: 'sys', l: 'System' },
        ].map((i) => (
          <div key={i.k} style={{
            padding: '6px 10px', display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: i.active ? C_TOKENS.accent : C_TOKENS.textMuted,
            background: i.active ? C_TOKENS.accentSoft : 'transparent',
            borderLeft: i.active ? `2px solid ${C_TOKENS.accent}` : '2px solid transparent',
            marginLeft: -2, cursor: 'pointer', fontWeight: i.active ? 600 : 500,
            fontFamily: i.active ? C_TOKENS.mono : C_TOKENS.font,
          }}>
            <span>{i.l}</span>
            <span style={{ flex: 1 }} />
            {i.n && <span style={{
              fontSize: 10, fontFamily: C_TOKENS.mono,
              color: i.tone === 'warn' ? C_TOKENS.warn : C_TOKENS.textFaint,
            }}>{i.n}</span>}
          </div>
        ))}

        <div style={{ marginTop: 20, padding: '10px 12px', background: C_TOKENS.panel, border: `1px solid ${C_TOKENS.border}`, borderRadius: 5 }}>
          <div style={{ fontSize: 9.5, color: C_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 1, fontFamily: C_TOKENS.mono, marginBottom: 6 }}>Fleet status</div>
          <div style={{ fontFamily: C_TOKENS.mono, fontSize: 11, lineHeight: 1.6 }}>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><CDot tone="online" pulse /> <span style={{ color: C_TOKENS.text }}>1243</span> <span style={{ color: C_TOKENS.textMuted }}>online</span></div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><CDot tone="warn" /> <span style={{ color: C_TOKENS.text }}>12</span> <span style={{ color: C_TOKENS.textMuted }}>warn</span></div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}><CDot tone="offline" /> <span style={{ color: C_TOKENS.text }}>4</span> <span style={{ color: C_TOKENS.textMuted }}>offline</span></div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <div style={{
          height: 40, display: 'flex', alignItems: 'center', gap: 12,
          padding: '0 18px', borderBottom: `1px solid ${C_TOKENS.border}`,
          background: C_TOKENS.panel,
        }}>
          <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
            tms › terminals › <span style={{ color: C_TOKENS.text }}>{t.sn}</span>
          </span>
          <div style={{ flex: 1 }} />
          <span style={{ fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, display: 'flex', alignItems: 'center', gap: 6 }}>
            <CDot tone="online" pulse /> live · ping 42ms
          </span>
          <span style={{ fontSize: 11, color: C_TOKENS.textFaint, fontFamily: C_TOKENS.mono }}>2026-04-17 12:37:35 UTC</span>
          <div style={{
            width: 22, height: 22, borderRadius: 11,
            background: `linear-gradient(135deg, ${C_TOKENS.info}, ${C_TOKENS.accent})`,
            color: '#000', fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>LY</div>
        </div>

        <div style={{ padding: 16, overflow: 'auto', flex: 1 }}>
          {/* Hero strip — terminal identity + live status */}
          <div style={{
            background: `linear-gradient(120deg, ${C_TOKENS.panel} 0%, ${C_TOKENS.panelLift} 100%)`,
            border: `1px solid ${C_TOKENS.border}`,
            borderRadius: 6, padding: 18, marginBottom: 12,
            position: 'relative', overflow: 'hidden',
          }}>
            {/* scan line */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(90deg, transparent, ${C_TOKENS.accent}08, transparent)`,
              animation: 'cScan 6s linear infinite',
            }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 20, alignItems: 'center', position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 8,
                  background: 'rgba(57,211,83,.08)',
                  border: `1px solid rgba(57,211,83,.3)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `inset 0 0 20px rgba(57,211,83,.15)`,
                }}>
                  <svg width="28" height="34" viewBox="0 0 40 48" fill="none">
                    <rect x="4" y="2" width="32" height="44" rx="4" stroke={C_TOKENS.accent} strokeWidth="1.6" />
                    <rect x="8" y="6" width="24" height="14" rx="1" fill="rgba(57,211,83,.15)" />
                  </svg>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3 }}>{t.name}</div>
                    <CDot tone="online" pulse />
                    <CChip tone="online">online · {t.uptimeDays}d</CChip>
                  </div>
                  <div style={{ fontSize: 11.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <span>SN {t.sn}</span>
                    <span>{t.model} · {t.manufacturer}</span>
                    <span>{t.deployment}</span>
                    <span>{t.ip}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <CBtn onClick={() => setModal({ act: 'reboot', label: 'reboot' })}>Reboot</CBtn>
                <CBtn kind="primary" onClick={() => setModal({ act: 'push-fw', label: 'push firmware D1.0.06' })}>Push firmware ↑</CBtn>
              </div>
            </div>

            {/* live metric bars */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 18, marginTop: 18, position: 'relative' }}>
              {[
                { k: 'UPTIME', v: `${t.uptimePct}%`, s: window.RES_SERIES.map((r) => 60 + Math.sin(r.t / 5) * 2), color: C_TOKENS.accent },
                { k: 'BATTERY', v: `${t.battery.pct}%`, s: [60,62,64,66,68,72,76,80,84,86,87,87], color: C_TOKENS.accent },
                { k: 'CPU', v: `${t.cpu}%`, s: window.RES_SERIES.slice(-20).map((r) => r.cpu), color: C_TOKENS.info },
                { k: 'MEMORY', v: `${t.mem}%`, s: window.RES_SERIES.slice(-20).map((r) => r.mem), color: '#d2a8ff' },
                { k: 'SIGNAL', v: `${t.wifi.signal}`, s: [-55,-52,-50,-52,-53,-51,-50,-52,-51,-52], color: C_TOKENS.accent },
              ].map((m) => (
                <div key={m.k}>
                  <div style={{ fontSize: 9.5, color: C_TOKENS.textMuted, letterSpacing: 1.2, fontFamily: C_TOKENS.mono, marginBottom: 4 }}>{m.k}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 22, fontWeight: 600, letterSpacing: -0.5, fontFamily: C_TOKENS.mono, color: m.color }}>{m.v}</span>
                  </div>
                  <Sparkline values={m.s} color={m.color} width={160} height={22} />
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex', gap: 0, marginBottom: 12,
            borderBottom: `1px solid ${C_TOKENS.border}`,
          }}>
            {[
              ['overview', 'Overview'], ['basic', 'Basic Info'],
              ['apps', 'App & Firmware'], ['settings', 'Settings'], ['remote', 'Remote'],
            ].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: '9px 16px', fontSize: 12.5, fontWeight: tab === k ? 600 : 500,
                color: tab === k ? C_TOKENS.accent : C_TOKENS.textMuted,
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontFamily: 'inherit',
                borderBottom: `2px solid ${tab === k ? C_TOKENS.accent : 'transparent'}`,
                marginBottom: -1,
              }}>{l}</button>
            ))}
          </div>

          {tab === 'overview' && <COverview resSeries={resSeries} onCmd={(a, l) => setModal({ act: a, label: l })} />}
          {tab === 'basic' && <CBasicInfo />}
          {tab === 'apps' && <CAppFw onCmd={(a, l) => setModal({ act: a, label: l })} />}
          {tab === 'settings' && <CSettings />}
          {tab === 'remote' && <CRemote onCmd={(a, l) => setModal({ act: a, label: l })} />}
        </div>
      </div>

      {modal && <CCmdModal cmd={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// Dark map
function CMapMini() {
  const t = window.TERMINAL;
  return (
    <div style={{
      height: 150, borderRadius: 5, position: 'relative', overflow: 'hidden',
      background: '#070b10',
      border: `1px solid ${C_TOKENS.border}`,
    }}>
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="cmap" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0v20" fill="none" stroke="rgba(88,166,255,.15)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cmap)" />
        <path d="M0 90 Q 80 70, 130 110 T 260 90 T 400 110" stroke="rgba(88,166,255,.4)" strokeWidth="1.2" fill="none" />
        <path d="M0 30 L 260 50" stroke="rgba(125,133,144,.3)" strokeWidth="0.8" />
        <path d="M80 0 L 120 150" stroke="rgba(125,133,144,.3)" strokeWidth="0.8" />
      </svg>
      <div style={{ position: 'absolute', left: '50%', top: '45%', transform: 'translate(-50%, -50%)' }}>
        <div style={{
          width: 14, height: 14, borderRadius: 7, background: C_TOKENS.accent,
          boxShadow: `0 0 0 4px rgba(57,211,83,.2), 0 0 20px ${C_TOKENS.accent}`,
          animation: 'cPulse 2s infinite',
        }} />
      </div>
      <div style={{ position: 'absolute', bottom: 8, left: 10, fontSize: 10, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>
        {t.location.lat.toFixed(4)}, {t.location.lng.toFixed(4)}
      </div>
    </div>
  );
}

Object.assign(window, { C_TOKENS, CDot, CPanel, CChip, CBtn, CMapMini, DirectionC });
