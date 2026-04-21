// Direction B — Tab content

function BOverview({ resSeries, onCmd }) {
  const t = window.TERMINAL;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
      <BPanel title="Push activity · 30d" mono right={<span style={{ fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>185 total · 3 failed</span>}>
        <BarChart data={window.PUSH_SERIES} height={130} tokens={{ ...B_TOKENS, accent: B_TOKENS.chartAccent, accentHi: '#4f46d3' }} />
      </BPanel>
      <BPanel title="Resources · 60m" mono right={<div style={{ display: 'flex', gap: 8, fontSize: 10.5, fontFamily: B_TOKENS.mono, color: B_TOKENS.textMuted }}>
        <span style={{ color: B_TOKENS.chartAccent }}>● cpu {t.cpu}%</span>
        <span style={{ color: '#0d9f6e' }}>● mem {t.mem}%</span>
      </div>}>
        <LineChart series={resSeries} height={130} tokens={B_TOKENS} yMin={0} yMax={80} unit="%" xLabel={(i) => `${60 - i}m`} />
      </BPanel>
      <BPanel title="Battery temp · 24h" mono right={<span style={{ fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>avg 30.1°c</span>}>
        <LineChart series={[{ label: 'temp', color: '#c2410c', values: window.BATT_SERIES.map((b) => b.temp) }]}
          height={130} tokens={B_TOKENS} yMin={24} yMax={40} unit="°C" xLabel={(i) => `${String(i).padStart(2, '0')}:00`} />
      </BPanel>

      <BPanel title="Events" mono right={<BBtn>refresh</BBtn>} pad={0}>
        <div style={{ maxHeight: 260, overflow: 'auto' }}>
          {window.EVENTS.map((e, i) => (
            <div key={i} style={{
              padding: '7px 14px', display: 'flex', gap: 8, alignItems: 'center',
              borderBottom: i < window.EVENTS.length - 1 ? `1px solid ${B_TOKENS.border}` : 'none',
              fontFamily: B_TOKENS.mono, fontSize: 11,
            }}>
              <span style={{ color: B_TOKENS.textFaint, width: 36 }}>{e.when}</span>
              <BChip tone={e.severity === 'warn' ? 'warn' : e.severity === 'ok' ? 'success' : 'neutral'}>{e.type}</BChip>
              <span style={{ flex: 1, color: B_TOKENS.text, fontFamily: B_TOKENS.font, fontSize: 12 }}>{e.msg}</span>
            </div>
          ))}
        </div>
      </BPanel>

      <BPanel title="Location" mono>
        <AMapMini term={t} />
        <div style={{ marginTop: 8, fontSize: 11, fontFamily: B_TOKENS.mono, color: B_TOKENS.textMuted }}>
          {t.location.lat.toFixed(4)}, {t.location.lng.toFixed(4)}
        </div>
        <div style={{ fontSize: 12, marginTop: 2 }}>{t.location.label}</div>
      </BPanel>

      <BPanel title="Quick commands" mono>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          {[
            ['reboot', 'Reboot'],
            ['locate', 'Ring'],
            ['capture', 'Capture'],
            ['cache', 'Clear cache'],
            ['push-fw', 'Push firmware'],
            ['reset', 'Factory reset'],
          ].map(([act, label]) => (
            <button key={act} onClick={() => onCmd(act, label.toLowerCase())} style={{
              padding: '8px 10px', textAlign: 'left', fontSize: 12,
              background: '#fff', border: `1px solid ${B_TOKENS.border}`,
              borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
              color: act === 'reset' ? B_TOKENS.danger : B_TOKENS.text,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}
              onMouseEnter={(e) => (e.currentTarget.style.background = B_TOKENS.soft)}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}>
              <span>{label}</span>
              <span style={{ color: B_TOKENS.textFaint, fontFamily: B_TOKENS.mono, fontSize: 10.5 }}>→</span>
            </button>
          ))}
        </div>
      </BPanel>
    </div>
  );
}

function BBasicInfo() {
  const t = window.TERMINAL;
  const rows = [
    ['model', t.model], ['manufacturer', t.manufacturer], ['root', t.rootStatus],
    ['pn', t.pn], ['local_time', t.localTime], ['coords', `${t.location.lat}, ${t.location.lng}`],
    ['created', t.createdAt], ['last_active', t.lastActive], ['pc_version', t.pcVersion],
    ['mac', t.mac], ['ip', t.ip], ['ssid', t.wifi.ssid],
    ['signal', `${t.wifi.signal} dBm`], ['apn', '—'], ['sim', '—'],
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10 }}>
      <BPanel title="Device" mono>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: B_TOKENS.mono, fontSize: 12 }}>
          <tbody>
            {rows.map(([k, v], i) => (
              <tr key={k} style={{ borderBottom: i < rows.length - 1 ? `1px solid ${B_TOKENS.border}` : 'none' }}>
                <td style={{ padding: '7px 0', color: B_TOKENS.textMuted, width: 140, textTransform: 'uppercase', fontSize: 10.5, letterSpacing: 0.5 }}>{k}</td>
                <td style={{ padding: '7px 0', color: B_TOKENS.text, fontWeight: 500 }}>{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </BPanel>
      <BPanel title="Battery" mono>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <RadialGauge value={t.battery.pct} size={96} stroke={7}
            color="#0d9f6e" trackColor={B_TOKENS.soft}
            label={`${t.battery.pct}%`} sublabel="charge" font={B_TOKENS.font} />
          <div style={{ flex: 1, fontFamily: B_TOKENS.mono, fontSize: 11.5 }}>
            <div style={{ marginBottom: 6 }}><span style={{ color: B_TOKENS.textMuted }}>temp</span> · {t.battery.temp}°C</div>
            <div style={{ marginBottom: 6 }}><span style={{ color: B_TOKENS.textMuted }}>cycles</span> · {t.battery.cycles}</div>
            <div style={{ marginBottom: 6 }}><span style={{ color: B_TOKENS.textMuted }}>health</span> · {t.battery.health}</div>
            <div><span style={{ color: B_TOKENS.textMuted }}>state</span> · <span style={{ color: B_TOKENS.success }}>charging</span></div>
          </div>
        </div>
        <div style={{ marginTop: 12, fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono, textTransform: 'uppercase', letterSpacing: 0.6 }}>Trend · 24h</div>
        <LineChart series={[{ label: 'temp', color: '#c2410c', values: window.BATT_SERIES.map((b) => b.temp) }]}
          height={80} tokens={B_TOKENS} yMin={24} yMax={40} unit="°C" xLabel={(i) => `${String(i).padStart(2, '0')}:00`} />
      </BPanel>
    </div>
  );
}

function BAppFw({ onCmd }) {
  const t = window.TERMINAL;
  const [q, setQ] = React.useState('');
  const filtered = window.PUSH_HISTORY.filter((p) => p.task.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BPanel title="Firmware" mono right={<BBtn kind="primary" onClick={() => onCmd('push-fw', 'push firmware')}>Push ↑</BBtn>}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: B_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: B_TOKENS.mono }}>current</div>
              <div style={{ fontSize: 20, fontWeight: 600, fontFamily: B_TOKENS.mono, letterSpacing: -0.3 }}>{t.firmware.current}</div>
              <div style={{ fontSize: 10.5, color: B_TOKENS.textFaint, fontFamily: B_TOKENS.mono }}>installed {t.firmware.updatedAt}</div>
            </div>
            <div style={{ fontSize: 18, color: B_TOKENS.textFaint }}>→</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 10, color: B_TOKENS.warn, textTransform: 'uppercase', letterSpacing: 0.6, fontFamily: B_TOKENS.mono }}>available</div>
              <div style={{ fontSize: 20, fontWeight: 600, fontFamily: B_TOKENS.mono, letterSpacing: -0.3, color: B_TOKENS.warn }}>{t.firmware.latest}</div>
              <div style={{ fontSize: 10.5, color: B_TOKENS.textFaint, fontFamily: B_TOKENS.mono }}>security · drivers</div>
            </div>
          </div>
        </BPanel>

        <BPanel title="Applications" mono right={<div style={{ display: 'flex', gap: 4 }}><BBtn>sync</BBtn><BBtn kind="primary" onClick={() => onCmd('push-app', 'push app')}>push</BBtn></div>} pad={0}>
          {window.APPS.map((a, i) => (
            <div key={a.name} style={{
              padding: '8px 14px', display: 'grid',
              gridTemplateColumns: '28px 1fr auto auto auto', gap: 10, alignItems: 'center',
              borderBottom: i < window.APPS.length - 1 ? `1px solid ${B_TOKENS.border}` : 'none',
            }}>
              <div style={{
                width: 26, height: 26, borderRadius: 4, background: B_TOKENS.soft,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13,
              }}>{a.icon}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{a.name}</div>
                <div style={{ fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>v{a.version} · {a.size}</div>
              </div>
              <BChip tone={a.status === 'pending' ? 'warn' : 'success'}>{a.status}</BChip>
              <span style={{ fontSize: 10.5, color: B_TOKENS.textFaint, fontFamily: B_TOKENS.mono }}>{a.size}</span>
              <span style={{ color: B_TOKENS.textFaint, cursor: 'pointer' }}>⋯</span>
            </div>
          ))}
        </BPanel>

        <BPanel title="Peripherals" mono pad={0}>
          {window.PERIPHERALS.map((p, i) => (
            <div key={p.sn} style={{
              padding: '8px 14px', display: 'grid',
              gridTemplateColumns: '14px 1fr auto auto', gap: 10, alignItems: 'center',
              borderBottom: i < window.PERIPHERALS.length - 1 ? `1px solid ${B_TOKENS.border}` : 'none',
            }}>
              <BDot tone={p.status === 'online' ? 'success' : 'neutral'} />
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600 }}>{p.kind} · {p.model}</div>
                <div style={{ fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>{p.sn}</div>
              </div>
              <span style={{ fontSize: 10.5, color: B_TOKENS.textFaint, fontFamily: B_TOKENS.mono }}>{p.lastSeen}</span>
              <span style={{ color: B_TOKENS.textFaint, cursor: 'pointer' }}>⋯</span>
            </div>
          ))}
        </BPanel>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <BPanel title="Push history" mono right={<div style={{ display: 'flex', gap: 4 }}><BBtn>↓</BBtn><BBtn>↻</BBtn></div>}>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="filter…"
            style={{
              width: '100%', padding: '5px 8px', fontSize: 11.5, fontFamily: B_TOKENS.mono,
              background: B_TOKENS.soft, border: `1px solid ${B_TOKENS.border}`, borderRadius: 4,
              outline: 'none', marginBottom: 8, color: B_TOKENS.text,
            }} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {filtered.map((p, i) => (
              <div key={p.id} style={{
                display: 'grid', gridTemplateColumns: '16px 1fr auto', gap: 8, alignItems: 'center',
                padding: '7px 0',
                borderBottom: i < filtered.length - 1 ? `1px solid ${B_TOKENS.border}` : 'none',
              }}>
                <BDot tone={p.status === 'success' ? 'success' : p.status === 'failed' ? 'danger' : 'info'} pulse={p.status === 'in-progress'} />
                <div>
                  <div style={{ fontSize: 12 }}>{p.task}</div>
                  <div style={{ fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>{p.time} · {p.by}</div>
                </div>
                <span style={{ fontSize: 10, fontFamily: B_TOKENS.mono, color: p.status === 'failed' ? B_TOKENS.danger : B_TOKENS.textFaint, textTransform: 'uppercase', letterSpacing: 0.6 }}>{p.status}</span>
              </div>
            ))}
          </div>
        </BPanel>
      </div>
    </div>
  );
}

function BSettings() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
      {[
        ['General', [['Display name', 'TestAppSigner121'], ['Timezone', 'Europe/Berlin'], ['Kiosk mode', 'off'], ['Auto-lock', '5 min']]],
        ['Network', [['Preferred', 'Wi-Fi'], ['Cellular fallback', 'on'], ['VPN', 'Off']]],
        ['Security', [['Remote wipe', 'on'], ['PIN on wake', 'on'], ['Certificate', 'TOMS-PROD-2026']]],
        ['Telemetry', [['Report interval', '30s'], ['Crash reports', 'on'], ['Debug logs', 'off']]],
      ].map(([title, items]) => (
        <BPanel key={title} title={title} mono pad={0}>
          {items.map(([k, v], i) => (
            <div key={k} style={{
              padding: '9px 14px', display: 'flex', alignItems: 'center',
              borderBottom: i < items.length - 1 ? `1px solid ${B_TOKENS.border}` : 'none',
              fontFamily: B_TOKENS.mono, fontSize: 12,
            }}>
              <span style={{ flex: 1, color: B_TOKENS.text }}>{k}</span>
              <span style={{ color: B_TOKENS.textMuted }}>{v}</span>
              <span style={{ marginLeft: 8, color: B_TOKENS.textFaint, cursor: 'pointer' }}>edit</span>
            </div>
          ))}
        </BPanel>
      ))}
    </div>
  );
}

function BRemote({ onCmd }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
      <BPanel title="Commands" mono pad={0}>
        {[
          ['reboot', 'Reboot'],
          ['locate', 'Ring & locate'],
          ['capture', 'Screen capture'],
          ['cache', 'Clear cache'],
          ['push-fw', 'Push firmware'],
          ['reset', 'Factory reset', true],
        ].map(([a, l, dg], i) => (
          <div key={a} onClick={() => onCmd(a, l.toLowerCase())} style={{
            padding: '10px 14px', display: 'flex', alignItems: 'center', cursor: 'pointer',
            borderBottom: i < 5 ? `1px solid ${B_TOKENS.border}` : 'none',
            fontFamily: B_TOKENS.mono, fontSize: 12.5, color: dg ? B_TOKENS.danger : B_TOKENS.text,
          }}
            onMouseEnter={(e) => (e.currentTarget.style.background = B_TOKENS.soft)}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#fff')}>
            <span style={{ flex: 1 }}>{l}</span>
            <span style={{ color: B_TOKENS.textFaint }}>→</span>
          </div>
        ))}
      </BPanel>
      <BPanel title="Session · live" mono right={<BChip tone="info"><span style={{ animation: 'bPulse 1.8s infinite', display: 'inline-block', width: 4, height: 4, background: '#6366f1', borderRadius: 2 }} /> 42ms</BChip>}>
        <div style={{
          background: '#0a0a0b', color: '#d4d4d8',
          borderRadius: 4, padding: 12, fontFamily: B_TOKENS.mono, fontSize: 11.5, lineHeight: 1.75,
          minHeight: 220,
        }}>
          <div style={{ color: '#71717a' }}>$ toms remote --sn {window.TERMINAL.sn}</div>
          <div><span style={{ color: '#818cf8' }}>›</span> connected · {window.TERMINAL.ip}</div>
          <div><span style={{ color: '#34d399' }}>✓</span> terminal.online · 28d uptime</div>
          <div><span style={{ color: '#34d399' }}>✓</span> battery 87% · 32.4°C</div>
          <div><span style={{ color: '#34d399' }}>✓</span> 3 peripherals attached</div>
          <div style={{ color: '#71717a', marginTop: 8 }}>// enter a command or use the list →</div>
          <div style={{ marginTop: 8 }}>
            <span style={{ color: '#818cf8' }}>›</span>
            <span style={{ display: 'inline-block', width: 7, height: 13, background: '#d4d4d8', marginLeft: 4, animation: 'bBlink 1s infinite', verticalAlign: 'middle' }} />
          </div>
        </div>
      </BPanel>
    </div>
  );
}

// ── Command modal ─────────────────────────────────────────────────────────
function BCmdModal({ cmd, onClose }) {
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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,.4)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60,
      fontFamily: B_TOKENS.font,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 420, background: '#fff', border: `1px solid ${B_TOKENS.border}`,
        borderRadius: 6, padding: 20, boxShadow: '0 20px 50px rgba(0,0,0,.25)',
      }}>
        {step === 'confirm' && (<>
          <div style={{ fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
            {dg ? 'destructive command' : 'confirm command'}
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, letterSpacing: -0.2 }}>{cmd.label}</div>
          <div style={{ fontSize: 12, color: B_TOKENS.textMuted, marginBottom: 14, fontFamily: B_TOKENS.mono }}>
            target: <span style={{ color: B_TOKENS.text }}>{window.TERMINAL.sn}</span>
          </div>
          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
            <BBtn kind="secondary" onClick={onClose}>Cancel</BBtn>
            <BBtn kind={dg ? 'danger' : 'primary'} onClick={() => setStep('running')}>Send →</BBtn>
          </div>
        </>)}
        {step === 'running' && (<>
          <div style={{ fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>running</div>
          <div style={{ fontSize: 14, marginBottom: 10 }}>{cmd.label}…</div>
          <div style={{ height: 4, background: B_TOKENS.soft, borderRadius: 2, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${p}%`, background: B_TOKENS.text, transition: 'width .15s' }} />
          </div>
          <div style={{ marginTop: 8, fontSize: 10.5, color: B_TOKENS.textMuted, fontFamily: B_TOKENS.mono }}>{p}% · awaiting ack</div>
        </>)}
        {step === 'done' && (<>
          <div style={{ fontSize: 10.5, color: B_TOKENS.success, fontFamily: B_TOKENS.mono, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>✓ delivered</div>
          <div style={{ fontSize: 14, marginBottom: 14 }}>{cmd.label} · ack from terminal</div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}><BBtn kind="primary" onClick={onClose}>Close</BBtn></div>
        </>)}
      </div>
    </div>
  );
}

Object.assign(window, { BOverview, BBasicInfo, BAppFw, BSettings, BRemote, BCmdModal });
