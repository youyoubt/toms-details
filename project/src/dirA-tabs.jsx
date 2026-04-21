// Direction A — Tab content
const { useState: aTUseState } = React;

// ── OVERVIEW TAB ──────────────────────────────────────────────────────────
function AOverview({ term }) {
  const kpis = [
    { label: 'Uptime', value: `${term.uptimePct}%`, sub: `${term.uptimeDays}d`, tone: 'success' },
    { label: 'Battery', value: `${term.battery.pct}%`, sub: `${term.battery.temp}°C`, tone: 'success' },
    { label: 'Storage', value: `${term.storage.used} GB`, sub: `of ${term.storage.total} GB`, tone: 'neutral' },
    { label: 'Signal', value: `${term.wifi.signal} dBm`, sub: term.wifi.band, tone: 'success' },
  ];
  const resSeries = [
    { label: 'CPU', color: A_TOKENS.accent, values: window.RES_SERIES.map((r) => r.cpu) },
    { label: 'Memory', color: '#8b5cf6', values: window.RES_SERIES.map((r) => r.mem), fill: false },
  ];
  const tempSeries = [
    { label: 'Battery temp', color: '#f59e0b', values: window.BATT_SERIES.map((b) => b.temp) },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {kpis.map((k) => (
          <ACard key={k.label} pad={16}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</div>
              <AChip tone={k.tone} size="sm">● Normal</AChip>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <div style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.6, color: A_TOKENS.text }}>{k.value}</div>
              <div style={{ fontSize: 12, color: A_TOKENS.textMuted }}>{k.sub}</div>
            </div>
          </ACard>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        {/* Push activity */}
        <ACard title="Push Activity" right={
          <div style={{ display: 'flex', gap: 6 }}>
            <AChip tone="brand" size="sm">● Success</AChip>
            <AChip tone="danger" size="sm">● Failed</AChip>
            <AButton kind="ghost" size="sm">Last 30d {AIcon.chev}</AButton>
          </div>
        }>
          <BarChart data={window.PUSH_SERIES} height={170} tokens={A_TOKENS} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 11, color: A_TOKENS.textFaint, fontFamily: A_TOKENS.mono }}>
            <span>Mar 19</span><span>Mar 29</span><span>Apr 08</span><span>Apr 17</span>
          </div>
        </ACard>

        {/* Location */}
        <ACard title="Location" right={<AButton kind="ghost" size="sm">View</AButton>}>
          <AMapMini term={term} />
          <div style={{ marginTop: 10, fontSize: 12, color: A_TOKENS.textMuted }}>
            <div style={{ color: A_TOKENS.text, fontWeight: 500, marginBottom: 2 }}>{term.location.label}</div>
            <div style={{ fontFamily: A_TOKENS.mono, fontSize: 11 }}>
              {term.location.lat.toFixed(4)}, {term.location.lng.toFixed(4)}
            </div>
          </div>
        </ACard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {/* Resource usage */}
        <ACard title="Resource Usage" right={
          <div style={{ display: 'flex', gap: 10, fontSize: 11.5, color: A_TOKENS.textMuted }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 2, background: A_TOKENS.accent, borderRadius: 1 }} /> CPU {term.cpu}%
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ width: 8, height: 2, background: '#8b5cf6', borderRadius: 1 }} /> Mem {term.mem}%
            </span>
          </div>
        }>
          <LineChart series={resSeries} height={160} tokens={A_TOKENS}
            yMin={0} yMax={80} unit="%" xLabel={(i) => `${60 - i}m ago`} />
        </ACard>

        {/* Battery temperature */}
        <ACard title="Battery Temperature" right={
          <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted }}>Last 24h · Avg 30.1°C</div>
        }>
          <LineChart series={tempSeries} height={160} tokens={A_TOKENS}
            yMin={24} yMax={40} unit="°C" xLabel={(i) => `${String(i).padStart(2, '0')}:00`} />
        </ACard>
      </div>

      {/* Event timeline + shortcuts */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <ACard title="Recent Events" right={<AButton kind="ghost" size="sm">All events →</AButton>}>
          <AEventTimeline />
        </ACard>
        <ACard title="Quick Actions">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { l: 'Reboot', d: 'Restart terminal', icon: '↻' },
              { l: 'Locate', d: 'Ring + flash', icon: '⊙' },
              { l: 'Sync', d: 'Force check-in', icon: '⇅' },
              { l: 'Lock', d: 'Kiosk mode', icon: '◪' },
            ].map((a) => (
              <button key={a.l} style={{
                textAlign: 'left', padding: 12, fontFamily: 'inherit',
                background: '#f8fafc', border: `1px solid ${A_TOKENS.border}`,
                borderRadius: 6, cursor: 'pointer',
              }}
                onMouseEnter={(e) => { e.currentTarget.style.background = A_TOKENS.accentSoft; e.currentTarget.style.borderColor = '#dbeafe'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = A_TOKENS.border; }}>
                <div style={{ fontSize: 16, marginBottom: 4, color: A_TOKENS.accent }}>{a.icon}</div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: A_TOKENS.text }}>{a.l}</div>
                <div style={{ fontSize: 11, color: A_TOKENS.textMuted }}>{a.d}</div>
              </button>
            ))}
          </div>
        </ACard>
      </div>
    </div>
  );
}

// ── BASIC INFO TAB ────────────────────────────────────────────────────────
function ABasicInfo({ term }) {
  const info = [
    ['Model', term.model], ['Manufacturer', term.manufacturer],
    ['Root Status', term.rootStatus], ['Product PN', term.pn],
    ['Local Time', term.localTime], ['Coordinates', `${term.location.lat}, ${term.location.lng}`],
    ['MCC', '—'], ['Custodian', '—'],
    ['Mgmt Password', '—'], ['State', 'Normal'],
    ['Created', term.createdAt], ['Last Active', term.lastActive],
    ['PC Version', term.pcVersion], ['Security', 'Normal'],
  ];
  const net = [
    ['SIM Status', '—'], ['Carrier', '—'], ['APN', '—'],
    ['MAC', term.mac], ['IP', term.ip], ['Wi-Fi SSID', term.wifi.ssid],
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <ACard title="Terminal Information">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', rowGap: 18, columnGap: 24 }}>
          {info.map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: A_TOKENS.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{k}</div>
              <div style={{ fontSize: 13, color: A_TOKENS.text, fontWeight: 500, fontFamily: typeof v === 'string' && /[0-9\-:]/.test(v) && !/\s/.test(v) ? A_TOKENS.mono : 'inherit' }}>{v}</div>
            </div>
          ))}
        </div>
      </ACard>
      <ACard title="Network">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', rowGap: 18, columnGap: 24 }}>
          {net.map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 11, color: A_TOKENS.textMuted, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.4 }}>{k}</div>
              <div style={{ fontSize: 13, color: A_TOKENS.text, fontWeight: 500, fontFamily: A_TOKENS.mono }}>{v}</div>
            </div>
          ))}
        </div>
      </ACard>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16 }}>
        <ACard title="Battery">
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <RadialGauge value={term.battery.pct} size={110} stroke={9}
              color="#16a34a" trackColor="#ecfdf5"
              label={`${term.battery.pct}%`} sublabel="charge" font={A_TOKENS.font} />
            <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', rowGap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: A_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>Temperature</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{term.battery.temp}°C</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: A_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>Health</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{term.battery.health}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: A_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>Cycles</div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{term.battery.cycles}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: A_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>State</div>
                <AChip tone="success">Charging</AChip>
              </div>
            </div>
          </div>
        </ACard>
        <ACard title="Battery Temperature · 24h" right={<AButton kind="ghost" size="sm">Export {AIcon.download}</AButton>}>
          <LineChart series={[{ label: term.sn, color: '#f59e0b', values: window.BATT_SERIES.map((b) => b.temp) }]}
            height={140} tokens={A_TOKENS} yMin={24} yMax={40} unit="°C"
            xLabel={(i) => `${String(i).padStart(2, '0')}:00`} />
        </ACard>
      </div>
    </div>
  );
}

// ── APP & FIRMWARE TAB ────────────────────────────────────────────────────
function AAppFw({ term, onAction }) {
  const [q, setQ] = aTUseState('');
  const filtered = window.PUSH_HISTORY.filter((p) => p.task.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ACard title="Deployment" right={<AButton kind="ghost" size="sm">Detach</AButton>}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 8, background: A_TOKENS.accentSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: A_TOKENS.accent, fontWeight: 600,
            }}>D</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{term.deployment}</div>
              <div style={{ fontSize: 12, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono }}>Assigned · 2026-04-15 11:38 by lyt</div>
            </div>
            <AChip tone="success">Synced</AChip>
          </div>
        </ACard>

        <ACard title="Firmware" right={
          <AButton kind="primary" size="sm" onClick={() => onAction('push-fw')}>Push Update</AButton>
        }>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 11, color: A_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 0.4 }}>Current Version</div>
              <div style={{ fontSize: 20, fontWeight: 600, fontFamily: A_TOKENS.mono, letterSpacing: -0.3 }}>
                {term.firmware.current}
                <span style={{ marginLeft: 10, fontSize: 11, color: A_TOKENS.warn, fontFamily: A_TOKENS.font }}>
                  ↑ {term.firmware.latest} available
                </span>
              </div>
              <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, marginTop: 4, fontFamily: A_TOKENS.mono }}>Installed {term.firmware.updatedAt}</div>
            </div>
            <div style={{
              padding: '10px 14px', borderRadius: 8, background: '#fffbeb',
              border: `1px solid #fde68a`, fontSize: 12, color: '#92400e',
              maxWidth: 220,
            }}>
              <b>Update available</b> · Security patch, peripheral driver fixes
            </div>
          </div>
        </ACard>

        <ACard title="Applications" right={
          <div style={{ display: 'flex', gap: 6 }}>
            <AButton kind="secondary" size="sm">Sync</AButton>
            <AButton kind="primary" size="sm">Push App</AButton>
          </div>
        }>
          <div style={{ display: 'flex', gap: 2, borderBottom: `1px solid ${A_TOKENS.border}`, marginBottom: 10 }}>
            {['Deployment', 'Third Party App', 'System', 'Parameter', 'App Parameter'].map((t, i) => (
              <div key={t} style={{
                padding: '8px 12px', fontSize: 12,
                color: i === 0 ? A_TOKENS.accent : A_TOKENS.textMuted,
                borderBottom: i === 0 ? `2px solid ${A_TOKENS.accent}` : '2px solid transparent',
                marginBottom: -1, cursor: 'pointer', fontWeight: i === 0 ? 600 : 500,
              }}>{t}</div>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {window.APPS.map((a) => (
              <div key={a.name} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 6,
                background: a.status === 'pending' ? '#fffbeb' : '#fafbfc',
                border: `1px solid ${a.status === 'pending' ? '#fde68a' : A_TOKENS.border}`,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 6,
                  background: '#fff', border: `1px solid ${A_TOKENS.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16,
                }}>{a.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{a.name}</div>
                  <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono }}>v{a.version} · {a.size}</div>
                </div>
                {a.status === 'pending' ? (
                  <AChip tone="warn">Pending install</AChip>
                ) : (
                  <AChip tone="success">Installed</AChip>
                )}
                <span style={{ color: A_TOKENS.textFaint, cursor: 'pointer' }}>{AIcon.more}</span>
              </div>
            ))}
          </div>
        </ACard>

        <ACard title="Peripherals">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {window.PERIPHERALS.map((p) => (
              <div key={p.sn} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 6, background: '#fafbfc',
                border: `1px solid ${A_TOKENS.border}`,
              }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14,
                  background: p.status === 'online' ? '#ecfdf5' : '#f1f5f9',
                  color: p.status === 'online' ? A_TOKENS.success : A_TOKENS.textMuted,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700,
                }}>●</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.kind} · {p.model}</div>
                  <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono }}>SN {p.sn}</div>
                </div>
                <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono }}>
                  {p.lastSeen}
                </div>
                <AButton kind="ghost" size="sm">{AIcon.more}</AButton>
              </div>
            ))}
          </div>
        </ACard>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <ACard title="Push History" right={
          <div style={{ display: 'flex', gap: 4 }}>
            <AButton kind="ghost" size="sm">{AIcon.download}</AButton>
            <AButton kind="ghost" size="sm">{AIcon.refresh}</AButton>
          </div>
        }>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', border: `1px solid ${A_TOKENS.border}`,
            borderRadius: 6, marginBottom: 10,
          }}>
            <span style={{ color: A_TOKENS.textFaint }}>{AIcon.search}</span>
            <input value={q} onChange={(e) => setQ(e.target.value)}
              placeholder="Search tasks…"
              style={{ border: 'none', outline: 'none', flex: 1, fontSize: 12, fontFamily: 'inherit', background: 'transparent' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map((p) => (
              <div key={p.id} style={{
                padding: '10px 2px', borderBottom: `1px solid ${A_TOKENS.border}`,
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: 3,
                  background: p.status === 'success' ? A_TOKENS.success
                    : p.status === 'failed' ? A_TOKENS.danger
                    : A_TOKENS.accent,
                  animation: p.status === 'in-progress' ? 'aPulse 1.4s infinite' : 'none',
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: A_TOKENS.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {p.task}
                  </div>
                  <div style={{ fontSize: 11, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono }}>
                    {p.time} · {p.by}
                  </div>
                </div>
                {p.status === 'failed' && <AChip tone="danger" size="sm">failed</AChip>}
                {p.status === 'in-progress' && <AChip tone="brand" size="sm">running</AChip>}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 11.5, color: A_TOKENS.textMuted, textAlign: 'center' }}>
            Showing {filtered.length} of {window.PUSH_HISTORY.length}
          </div>
        </ACard>

        <ACard title="Device Event Log" right={<AButton kind="ghost" size="sm">{AIcon.refresh}</AButton>}>
          <AEventTimeline compact />
        </ACard>
      </div>
    </div>
  );
}

function AEventTimeline({ compact }) {
  const sev = {
    info: A_TOKENS.accent, ok: A_TOKENS.success, warn: A_TOKENS.warn, err: A_TOKENS.danger,
  };
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: compact ? 6 : 10 }}>
      {window.EVENTS.slice(0, compact ? 5 : 7).map((e, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 14, flexShrink: 0,
            background: '#f1f5f9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, color: A_TOKENS.textMuted, fontWeight: 600,
            textTransform: 'uppercase',
          }}>{e.type}</div>
          <div style={{ flex: 1, paddingTop: 4 }}>
            <div style={{ fontSize: 12.5, color: A_TOKENS.text }}>{e.msg}</div>
            <div style={{ fontSize: 11, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono }}>{e.when}</div>
          </div>
          <div style={{
            width: 6, height: 6, borderRadius: 3,
            background: sev[e.severity] || A_TOKENS.textFaint,
            marginTop: 11,
          }} />
        </div>
      ))}
    </div>
  );
}

// ── Mini map (placeholder) ────────────────────────────────────────────────
function AMapMini({ term }) {
  return (
    <div style={{
      height: 170, borderRadius: 6, position: 'relative', overflow: 'hidden',
      background: 'linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 50%, #ecfdf5 100%)',
    }}>
      {/* Fake map grid */}
      <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
        <defs>
          <pattern id="mapA" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0v24" fill="none" stroke="rgba(148,163,184,.25)" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mapA)" />
        {/* Fake river */}
        <path d="M0 110 Q 80 90, 130 130 T 260 100 T 400 120" stroke="#bae6fd" strokeWidth="10" fill="none" />
        {/* roads */}
        <path d="M0 40 L 260 60" stroke="rgba(148,163,184,.45)" strokeWidth="1" />
        <path d="M80 0 L 120 170" stroke="rgba(148,163,184,.45)" strokeWidth="1" />
        <path d="M180 0 L 220 170" stroke="rgba(148,163,184,.45)" strokeWidth="1" />
      </svg>
      {/* Pin */}
      <div style={{
        position: 'absolute', left: '52%', top: '48%', transform: 'translate(-50%, -100%)',
      }}>
        <div style={{
          position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
          width: 24, height: 8, borderRadius: 12, background: 'rgba(37,99,235,.25)', filter: 'blur(2px)',
        }} />
        <svg width="28" height="36" viewBox="0 0 28 36" fill="none">
          <path d="M14 0 C 6 0, 0 6, 0 14 C 0 22, 14 36, 14 36 C 14 36, 28 22, 28 14 C 28 6, 22 0, 14 0 Z" fill={A_TOKENS.accent} />
          <circle cx="14" cy="14" r="5" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}

Object.assign(window, { AOverview, ABasicInfo, AAppFw });
