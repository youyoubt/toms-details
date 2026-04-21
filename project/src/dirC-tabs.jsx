// Direction C — Tabs

function COverview({ resSeries, onCmd }) {
  const t = window.TERMINAL;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CPanel title="PUSH ACTIVITY · 30 DAYS" right={<span style={{ fontSize: 10, fontFamily: C_TOKENS.mono, color: C_TOKENS.textMuted }}>185 OK · 3 FAILED</span>}>
          <BarChart data={window.PUSH_SERIES} height={140} tokens={{
            ...C_TOKENS, accent: C_TOKENS.accent, accentHi: '#56d364',
            danger: C_TOKENS.danger, cardBg: C_TOKENS.panel,
          }} />
        </CPanel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <CPanel title="RESOURCES · 60M">
            <LineChart series={resSeries} height={130} tokens={{ ...C_TOKENS, cardBg: C_TOKENS.panel }} yMin={0} yMax={80} unit="%" xLabel={(i) => `${60 - i}m`} />
          </CPanel>
          <CPanel title="BATTERY TEMP · 24H">
            <LineChart series={[{ label: 'temp', color: C_TOKENS.warn, values: window.BATT_SERIES.map((b) => b.temp) }]}
              height={130} tokens={{ ...C_TOKENS, cardBg: C_TOKENS.panel }} yMin={24} yMax={40} unit="°C" xLabel={(i) => `${String(i).padStart(2, '0')}:00`} />
          </CPanel>
        </div>
        <CPanel title="EVENT STREAM" right={<CBtn kind="ghost">↻</CBtn>} pad={0}>
          <div style={{ maxHeight: 240, overflow: 'auto' }}>
            {window.EVENTS.map((e, i) => (
              <div key={i} style={{
                padding: '8px 16px', display: 'flex', gap: 12, alignItems: 'center',
                borderBottom: i < window.EVENTS.length - 1 ? `1px solid ${C_TOKENS.border}` : 'none',
                fontFamily: C_TOKENS.mono, fontSize: 11.5,
              }}>
                <span style={{ color: C_TOKENS.textFaint, width: 48 }}>{e.when}</span>
                <CChip tone={e.severity === 'warn' ? 'warn' : e.severity === 'ok' ? 'online' : 'info'}>{e.type}</CChip>
                <span style={{ flex: 1, color: C_TOKENS.text, fontFamily: C_TOKENS.font, fontSize: 12 }}>{e.msg}</span>
              </div>
            ))}
          </div>
        </CPanel>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CPanel title="LOCATION">
          <CMapMini />
          <div style={{ marginTop: 10, fontSize: 12 }}>{t.location.label}</div>
        </CPanel>
        <CPanel title="QUICK COMMANDS" pad={0}>
          {[
            ['reboot', 'Reboot'], ['locate', 'Ring & locate'], ['capture', 'Screen capture'],
            ['cache', 'Clear cache'], ['push-fw', 'Push firmware'],
          ].map(([a, l], i) => (
            <div key={a} onClick={() => onCmd(a, l.toLowerCase())} style={{
              padding: '10px 16px', display: 'flex', alignItems: 'center', cursor: 'pointer',
              borderBottom: i < 4 ? `1px solid ${C_TOKENS.border}` : 'none',
              fontSize: 12.5, color: C_TOKENS.text, fontFamily: C_TOKENS.mono,
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = C_TOKENS.panelLift)}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ flex: 1 }}>{l}</span>
              <span style={{ color: C_TOKENS.accent }}>→</span>
            </div>
          ))}
          <div onClick={() => onCmd('reset', 'factory reset')} style={{
            padding: '10px 16px', display: 'flex', alignItems: 'center', cursor: 'pointer',
            borderTop: `1px solid ${C_TOKENS.border}`,
            fontSize: 12.5, color: C_TOKENS.danger, fontFamily: C_TOKENS.mono,
          }}>
            <span style={{ flex: 1 }}>Factory reset</span>
            <span>⚠</span>
          </div>
        </CPanel>
        <CPanel title="PERIPHERALS" pad={0}>
          {window.PERIPHERALS.map((p, i) => (
            <div key={p.sn} style={{
              padding: '10px 16px', display: 'flex', gap: 10, alignItems: 'center',
              borderBottom: i < window.PERIPHERALS.length - 1 ? `1px solid ${C_TOKENS.border}` : 'none',
            }}>
              <CDot tone={p.status === 'online' ? 'online' : 'idle'} pulse={p.status === 'online'} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{p.kind} · {p.model}</div>
                <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>{p.sn}</div>
              </div>
            </div>
          ))}
        </CPanel>
      </div>
    </div>
  );
}

function CBasicInfo() {
  const t = window.TERMINAL;
  const rows = [
    ['MODEL', t.model], ['MFG', t.manufacturer], ['ROOT', t.rootStatus],
    ['PN', t.pn], ['PC_VER', t.pcVersion], ['LOCAL_TIME', t.localTime],
    ['CREATED', t.createdAt], ['LAST_ACTIVE', t.lastActive], ['STATE', 'normal'],
    ['IP', t.ip], ['MAC', t.mac], ['SSID', t.wifi.ssid],
    ['SIGNAL', `${t.wifi.signal} dBm`], ['APN', '—'], ['SIM', '—'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
      <CPanel title="DEVICE">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: C_TOKENS.mono, fontSize: 12 }}>
          <tbody>
            {rows.map(([k, v], i) => (
              <tr key={k} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${C_TOKENS.border}` : 'none' }}>
                <td style={{ padding: '8px 0', color: C_TOKENS.textMuted, width: 140, letterSpacing: 0.6, fontSize: 10.5 }}>{k}</td>
                <td style={{ padding: '8px 0', color: C_TOKENS.text, fontWeight: 500 }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CPanel>
      <CPanel title="BATTERY">
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <RadialGauge value={t.battery.pct} size={92} stroke={6}
            color={C_TOKENS.accent} trackColor={C_TOKENS.border}
            label={`${t.battery.pct}%`} sublabel="charge" font={C_TOKENS.mono} />
          <div style={{ flex: 1, fontFamily: C_TOKENS.mono, fontSize: 11.5, color: C_TOKENS.text }}>
            <div style={{ marginBottom: 4 }}><span style={{ color: C_TOKENS.textMuted }}>temp </span>{t.battery.temp}°C</div>
            <div style={{ marginBottom: 4 }}><span style={{ color: C_TOKENS.textMuted }}>cycles </span>{t.battery.cycles}</div>
            <div style={{ marginBottom: 4 }}><span style={{ color: C_TOKENS.textMuted }}>health </span>{t.battery.health}</div>
            <div><span style={{ color: C_TOKENS.textMuted }}>state </span><span style={{ color: C_TOKENS.accent }}>charging</span></div>
          </div>
        </div>
        <LineChart series={[{ label: 'temp', color: C_TOKENS.warn, values: window.BATT_SERIES.map((b) => b.temp) }]}
          height={70} tokens={{ ...C_TOKENS, cardBg: C_TOKENS.panel }} yMin={24} yMax={40} unit="°C" xLabel={(i) => `${String(i).padStart(2, '0')}:00`} />
      </CPanel>
    </div>
  );
}

function CAppFw({ onCmd }) {
  const t = window.TERMINAL;
  const [q, setQ] = React.useState('');
  const filtered = window.PUSH_HISTORY.filter((p) => p.task.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <CPanel title="FIRMWARE" right={<CBtn kind="primary" onClick={() => onCmd('push-fw', 'push firmware')}>Push ↑</CBtn>} glow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9.5, color: C_TOKENS.textMuted, letterSpacing: 1.2, fontFamily: C_TOKENS.mono }}>CURRENT</div>
              <div style={{ fontSize: 22, fontWeight: 600, fontFamily: C_TOKENS.mono, letterSpacing: -0.4 }}>{t.firmware.current}</div>
              <div style={{ fontSize: 10.5, color: C_TOKENS.textFaint, fontFamily: C_TOKENS.mono }}>installed {t.firmware.updatedAt}</div>
            </div>
            <div style={{ fontSize: 18, color: C_TOKENS.accent }}>→</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9.5, color: C_TOKENS.accent, letterSpacing: 1.2, fontFamily: C_TOKENS.mono }}>AVAILABLE</div>
              <div style={{ fontSize: 22, fontWeight: 600, fontFamily: C_TOKENS.mono, letterSpacing: -0.4, color: C_TOKENS.accent }}>{t.firmware.latest}</div>
              <div style={{ fontSize: 10.5, color: C_TOKENS.textFaint, fontFamily: C_TOKENS.mono }}>security · drivers</div>
            </div>
          </div>
        </CPanel>
        <CPanel title="APPLICATIONS" right={<div style={{ display: 'flex', gap: 4 }}><CBtn>sync</CBtn><CBtn kind="primary" onClick={() => onCmd('push-app', 'push app')}>push</CBtn></div>} pad={0}>
          {window.APPS.map((a, i) => (
            <div key={a.name} style={{
              padding: '10px 16px', display: 'grid',
              gridTemplateColumns: '32px 1fr auto auto', gap: 12, alignItems: 'center',
              borderBottom: i < window.APPS.length - 1 ? `1px solid ${C_TOKENS.border}` : 'none',
            }}>
              <div style={{
                width: 30, height: 30, borderRadius: 5, background: C_TOKENS.panelLift,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14,
                border: `1px solid ${C_TOKENS.border}`,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>v{a.version} · {a.size}</div>
              </div>
              <CChip tone={a.status === 'pending' ? 'warn' : 'online'}>{a.status}</CChip>
              <span style={{ color: C_TOKENS.textFaint, cursor: 'pointer' }}>⋯</span>
            </div>
          ))}
        </CPanel>
      </div>
      <CPanel title="PUSH HISTORY" right={<div style={{ display: 'flex', gap: 4 }}><CBtn kind="ghost">↓</CBtn><CBtn kind="ghost">↻</CBtn></div>}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="filter…"
          style={{
            width: '100%', padding: '6px 10px', fontSize: 12, fontFamily: C_TOKENS.mono,
            background: C_TOKENS.bg, border: `1px solid ${C_TOKENS.border}`, borderRadius: 4,
            outline: 'none', marginBottom: 10, color: C_TOKENS.text,
          }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {filtered.map((p, i) => (
            <div key={p.id} style={{
              display: 'grid', gridTemplateColumns: '16px 1fr auto', gap: 10, alignItems: 'center',
              padding: '9px 0',
              borderBottom: i < filtered.length - 1 ? `1px solid ${C_TOKENS.border}` : 'none',
            }}>
              <CDot tone={p.status === 'success' ? 'online' : p.status === 'failed' ? 'offline' : 'info'} pulse={p.status === 'in-progress'} />
              <div>
                <div style={{ fontSize: 12 }}>{p.task}</div>
                <div style={{ fontSize: 10.5, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>{p.time} · {p.by}</div>
              </div>
              <span style={{
                fontSize: 10, fontFamily: C_TOKENS.mono, textTransform: 'uppercase', letterSpacing: 0.6,
                color: p.status === 'failed' ? C_TOKENS.danger : p.status === 'in-progress' ? C_TOKENS.info : C_TOKENS.textFaint,
              }}>{p.status}</span>
            </div>
          ))}
        </div>
      </CPanel>
    </div>
  );
}

function CSettings() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[
        ['GENERAL', [['Display name', 'TestAppSigner121'], ['Timezone', 'Europe/Berlin'], ['Kiosk mode', 'off'], ['Auto-lock', '5 min']]],
        ['NETWORK', [['Preferred', 'Wi-Fi'], ['Cellular fallback', 'on'], ['VPN', 'Off']]],
        ['SECURITY', [['Remote wipe', 'on'], ['PIN on wake', 'on'], ['Certificate', 'TOMS-PROD-2026']]],
        ['TELEMETRY', [['Report interval', '30s'], ['Crash reports', 'on'], ['Debug logs', 'off']]],
      ].map(([title, items]) => (
        <CPanel key={title} title={title} pad={0}>
          {items.map(([k, v], i) => (
            <div key={k} style={{
              padding: '10px 16px', display: 'flex', alignItems: 'center',
              borderBottom: i < items.length - 1 ? `1px solid ${C_TOKENS.border}` : 'none',
              fontFamily: C_TOKENS.mono, fontSize: 12,
            }}>
              <span style={{ flex: 1, color: C_TOKENS.text }}>{k}</span>
              <span style={{ color: C_TOKENS.textMuted }}>{v}</span>
              <span style={{ marginLeft: 10, color: C_TOKENS.accent, cursor: 'pointer', fontSize: 11 }}>edit →</span>
            </div>
          ))}
        </CPanel>
      ))}
    </div>
  );
}

function CRemote({ onCmd }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
      <CPanel title="COMMANDS" pad={0}>
        {[
          ['reboot', 'Reboot'],
          ['locate', 'Ring & locate'],
          ['capture', 'Screen capture'],
          ['cache', 'Clear cache'],
          ['push-fw', 'Push firmware'],
          ['reset', 'Factory reset', true],
        ].map(([a, l, dg], i) => (
          <div key={a} onClick={() => onCmd(a, l.toLowerCase())} style={{
            padding: '11px 16px', display: 'flex', alignItems: 'center', cursor: 'pointer',
            borderBottom: i < 5 ? `1px solid ${C_TOKENS.border}` : 'none',
            fontFamily: C_TOKENS.mono, fontSize: 12, color: dg ? C_TOKENS.danger : C_TOKENS.text,
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = C_TOKENS.panelLift)}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
            <span style={{ flex: 1 }}>{l}</span>
            <span style={{ color: dg ? C_TOKENS.danger : C_TOKENS.accent }}>→</span>
          </div>
        ))}
      </CPanel>
      <CPanel title="TERMINAL · LIVE" right={<CChip tone="online"><CDot tone="online" pulse /> 42MS</CChip>} glow>
        <div style={{
          background: '#020305', color: C_TOKENS.text, border: `1px solid ${C_TOKENS.border}`,
          borderRadius: 4, padding: 14, fontFamily: C_TOKENS.mono, fontSize: 11.5, lineHeight: 1.8,
          minHeight: 240,
        }}>
          <div style={{ color: C_TOKENS.textFaint }}>$ toms remote --sn {window.TERMINAL.sn}</div>
          <div><span style={{ color: C_TOKENS.info }}>›</span> handshake · tls1.3 · cert TOMS-PROD-2026</div>
          <div><span style={{ color: C_TOKENS.accent }}>✓</span> connected · {window.TERMINAL.ip}</div>
          <div><span style={{ color: C_TOKENS.accent }}>✓</span> terminal.online · uptime 28d</div>
          <div><span style={{ color: C_TOKENS.accent }}>✓</span> battery 87% · 32.4°C · charging</div>
          <div><span style={{ color: C_TOKENS.accent }}>✓</span> peripherals 3/3 attached</div>
          <div style={{ color: C_TOKENS.textFaint, marginTop: 10 }}>// use the commands list or type below</div>
          <div style={{ marginTop: 10 }}>
            <span style={{ color: C_TOKENS.accent }}>›</span>
            <span style={{ display: 'inline-block', width: 7, height: 13, background: C_TOKENS.accent, marginLeft: 4, animation: 'cBlink 1s infinite', verticalAlign: 'middle' }} />
          </div>
        </div>
      </CPanel>
    </div>
  );
}

function CCmdModal({ cmd, onClose }) {
  const [step, setStep] = React.useState('confirm');
  const [p, setP] = React.useState(0);
  React.useEffect(() => {
    if (step !== 'running') return;
    setP(0);
    const id = setInterval(() => setP((x) => {
      if (x >= 100) { clearInterval(id); setStep('done'); return 100; }
      return x + 5;
    }), 50);
    return () => clearInterval(id);
  }, [step]);
  const dg = cmd.act === 'reset';
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.7)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60,
      fontFamily: C_TOKENS.font,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 420, background: C_TOKENS.panel, border: `1px solid ${dg ? C_TOKENS.danger : C_TOKENS.border}`,
        borderRadius: 6, padding: 22, color: C_TOKENS.text,
        boxShadow: `0 20px 60px rgba(0,0,0,.6), 0 0 0 1px ${dg ? C_TOKENS.danger : C_TOKENS.accent}22`,
      }}>
        {step === 'confirm' && (<>
          <div style={{ fontSize: 10, color: dg ? C_TOKENS.danger : C_TOKENS.accent, fontFamily: C_TOKENS.mono, letterSpacing: 1.2, marginBottom: 8 }}>
            {dg ? '⚠ DESTRUCTIVE COMMAND' : '▸ CONFIRM COMMAND'}
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 10, letterSpacing: -0.2 }}>{cmd.label}</div>
          <div style={{ fontSize: 11.5, color: C_TOKENS.textMuted, marginBottom: 16, fontFamily: C_TOKENS.mono }}>
            target · <span style={{ color: C_TOKENS.text }}>{window.TERMINAL.sn}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <CBtn kind="ghost" onClick={onClose}>Cancel</CBtn>
            <CBtn kind={dg ? 'primary' : 'primary'} danger={dg} onClick={() => setStep('running')}>Send →</CBtn>
          </div>
        </>)}
        {step === 'running' && (<>
          <div style={{ fontSize: 10, color: C_TOKENS.info, fontFamily: C_TOKENS.mono, letterSpacing: 1.2, marginBottom: 8 }}>▸ IN FLIGHT</div>
          <div style={{ fontSize: 14, marginBottom: 12, fontFamily: C_TOKENS.mono }}>{cmd.label}…</div>
          <div style={{ height: 3, background: C_TOKENS.border, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${p}%`, background: C_TOKENS.accent, transition: 'width .15s', boxShadow: `0 0 8px ${C_TOKENS.accent}` }} />
          </div>
          <div style={{ marginTop: 10, fontSize: 11, color: C_TOKENS.textMuted, fontFamily: C_TOKENS.mono }}>{p}% · awaiting ack</div>
        </>)}
        {step === 'done' && (<>
          <div style={{ fontSize: 10, color: C_TOKENS.accent, fontFamily: C_TOKENS.mono, letterSpacing: 1.2, marginBottom: 8 }}>✓ DELIVERED</div>
          <div style={{ fontSize: 14, marginBottom: 14, fontFamily: C_TOKENS.mono }}>{cmd.label} · ack from terminal</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><CBtn kind="primary" onClick={onClose}>Close</CBtn></div>
        </>)}
      </div>
    </div>
  );
}

Object.assign(window, { COverview, CBasicInfo, CAppFw, CSettings, CRemote, CCmdModal });
