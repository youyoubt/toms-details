// Direction A — Root assembly
const { useState: aRUseState } = React;

function ASettings() {
  const sections = [
    { title: 'General', items: [
      ['Display Name', 'TestAppSigner121', 'input'],
      ['Timezone', 'Europe/Berlin', 'select'],
      ['Auto-lock after', '5 minutes', 'select'],
      ['Kiosk mode', false, 'toggle'],
    ]},
    { title: 'Network', items: [
      ['Preferred connection', 'Wi-Fi', 'select'],
      ['Cellular fallback', true, 'toggle'],
      ['VPN', 'Off', 'select'],
    ]},
    { title: 'Security', items: [
      ['Remote wipe', true, 'toggle'],
      ['Require PIN on wake', true, 'toggle'],
      ['Certificate', 'TOMS-PROD-2026', 'select'],
    ]},
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 16 }}>
      <ACard pad={10}>
        {sections.map((s, i) => (
          <div key={s.title} style={{
            padding: '8px 10px', borderRadius: 5, fontSize: 13,
            fontWeight: i === 0 ? 600 : 500,
            color: i === 0 ? A_TOKENS.accent : A_TOKENS.textMuted,
            background: i === 0 ? A_TOKENS.accentSoft : 'transparent',
            cursor: 'pointer', marginBottom: 2,
          }}>{s.title}</div>
        ))}
      </ACard>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {sections.map((s) => (
          <ACard key={s.title} title={s.title}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {s.items.map(([k, v, type], idx) => (
                <div key={k} style={{
                  display: 'flex', alignItems: 'center',
                  padding: '12px 0',
                  borderBottom: idx < s.items.length - 1 ? `1px solid ${A_TOKENS.border}` : 'none',
                }}>
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 500, color: A_TOKENS.text }}>{k}</div>
                  {type === 'toggle' ? <ASettingToggle initial={v} /> : (
                    <div style={{
                      padding: '5px 10px', fontSize: 12.5, color: A_TOKENS.text,
                      border: `1px solid ${A_TOKENS.border}`, borderRadius: 5,
                      background: '#fff', minWidth: 160, textAlign: 'left',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>{v} <span style={{ color: A_TOKENS.textFaint }}>{AIcon.chev}</span></div>
                  )}
                </div>
              ))}
            </div>
          </ACard>
        ))}
      </div>
    </div>
  );
}

function ASettingToggle({ initial }) {
  const [on, setOn] = aRUseState(!!initial);
  return (
    <button onClick={() => setOn(!on)} style={{
      width: 36, height: 20, borderRadius: 10,
      background: on ? A_TOKENS.accent : '#e5e7eb',
      border: 'none', cursor: 'pointer', position: 'relative',
      transition: 'background .15s',
    }}>
      <span style={{
        position: 'absolute', top: 2, left: on ? 18 : 2,
        width: 16, height: 16, borderRadius: 8, background: '#fff',
        transition: 'left .15s', boxShadow: '0 1px 2px rgba(0,0,0,.2)',
      }} />
    </button>
  );
}

function ARemote({ onAction }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
      <ACard title="Remote Commands">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { l: 'Reboot Terminal', d: 'Graceful restart; user sees a countdown', act: 'reboot' },
            { l: 'Ring & Locate', d: 'Plays alarm tone for 30 seconds', act: 'locate' },
            { l: 'Screen Capture', d: 'Request a live screenshot', act: 'capture' },
            { l: 'Clear Cache', d: 'Wipe app caches (keeps data)', act: 'cache' },
            { l: 'Factory Reset', d: 'Destructive · requires approval', act: 'reset', danger: true },
          ].map((c) => (
            <div key={c.act} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: 12, borderRadius: 6,
              border: `1px solid ${A_TOKENS.border}`,
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: c.danger ? A_TOKENS.danger : A_TOKENS.text }}>{c.l}</div>
                <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted }}>{c.d}</div>
              </div>
              <AButton kind={c.danger ? 'danger' : 'secondary'} size="sm" onClick={() => onAction(c.act, c.l)}>
                Send
              </AButton>
            </div>
          ))}
        </div>
      </ACard>
      <ACard title="Live Session" right={<AChip tone="neutral">Idle</AChip>}>
        <div style={{
          background: '#0f172a', color: '#cbd5e1', borderRadius: 6, padding: 14,
          fontFamily: A_TOKENS.mono, fontSize: 11.5, lineHeight: 1.7,
          minHeight: 180,
        }}>
          <div style={{ color: '#64748b' }}>$ toms remote --sn {window.TERMINAL.sn}</div>
          <div><span style={{ color: '#60a5fa' }}>→</span> session ready · awaiting command</div>
          <div><span style={{ color: '#86efac' }}>✓</span> latency 42ms · last ping 2s ago</div>
          <div style={{ marginTop: 10, color: '#64748b' }}>───</div>
          <div style={{ color: '#64748b' }}>Type a command or use the buttons on the left.</div>
          <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: '#60a5fa' }}>›</span>
            <span style={{
              display: 'inline-block', width: 7, height: 13, background: '#cbd5e1',
              animation: 'aBlink 1s infinite',
            }} />
          </div>
        </div>
      </ACard>
    </div>
  );
}

// ── COMMAND MODAL ─────────────────────────────────────────────────────────
function ACommandModal({ cmd, onClose }) {
  const [step, setStep] = aRUseState('confirm');
  const [progress, setProgress] = aRUseState(0);

  React.useEffect(() => {
    if (step !== 'running') return;
    setProgress(0);
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(id); setStep('done'); return 100; }
        return p + 4;
      });
    }, 60);
    return () => clearInterval(id);
  }, [step]);

  const tone = cmd.act === 'reset' ? 'danger' : 'primary';
  const labelMap = { reboot: 'reboot', 'push-fw': 'push firmware', push: 'push firmware', locate: 'ring & locate', capture: 'screen capture', cache: 'clear cache', reset: 'factory reset' };
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(15,23,42,.55)',
      backdropFilter: 'blur(6px)', zIndex: 50,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: A_TOKENS.font,
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 460, background: '#fff', borderRadius: 10,
        boxShadow: '0 24px 60px rgba(0,0,0,.25)', padding: 24,
      }}>
        {step === 'confirm' && (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: 22,
              background: tone === 'danger' ? '#fef2f2' : A_TOKENS.accentSoft,
              color: tone === 'danger' ? A_TOKENS.danger : A_TOKENS.accent,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 20, marginBottom: 14,
            }}>{tone === 'danger' ? '⚠' : '↻'}</div>
            <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: -0.3, marginBottom: 6 }}>
              Confirm: {cmd.label || labelMap[cmd.act]}
            </div>
            <div style={{ fontSize: 13, color: A_TOKENS.textMuted, lineHeight: 1.5, marginBottom: 18 }}>
              This command will be sent immediately to <b style={{ fontFamily: A_TOKENS.mono, color: A_TOKENS.text }}>{window.TERMINAL.sn}</b>.
              {cmd.act === 'reset' && <> The terminal will be wiped. This cannot be undone.</>}
            </div>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <AButton kind="secondary" onClick={onClose}>Cancel</AButton>
              <AButton kind={tone === 'danger' ? 'danger' : 'primary'} onClick={() => setStep('running')}>
                Send command
              </AButton>
            </div>
          </>
        )}
        {step === 'running' && (
          <>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Sending…</div>
            <div style={{ fontSize: 13, color: A_TOKENS.textMuted, marginBottom: 16 }}>Command in flight. Waiting for ack from terminal.</div>
            <div style={{ height: 6, borderRadius: 3, background: A_TOKENS.border, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${progress}%`, background: A_TOKENS.accent, transition: 'width .2s' }} />
            </div>
            <div style={{ marginTop: 10, fontSize: 11.5, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono }}>{progress}% · ack window 30s</div>
          </>
        )}
        {step === 'done' && (
          <>
            <div style={{
              width: 44, height: 44, borderRadius: 22, background: '#ecfdf5',
              color: A_TOKENS.success, display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, marginBottom: 14,
            }}>✓</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Command delivered</div>
            <div style={{ fontSize: 13, color: A_TOKENS.textMuted, marginBottom: 18 }}>
              Acknowledged by terminal · {new Date().toLocaleTimeString()}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <AButton kind="primary" onClick={onClose}>Done</AButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── ROOT ──────────────────────────────────────────────────────────────────
function DirectionA() {
  const [tab, setTab] = aRUseState('Overview');
  const [modal, setModal] = aRUseState(null);

  const openCmd = (act, label) => setModal({ act, label });

  return (
    <div style={{
      fontFamily: A_TOKENS.font, background: A_TOKENS.bg, color: A_TOKENS.text,
      display: 'flex', height: '100%', minHeight: 900,
      fontSize: 13.5, letterSpacing: -0.05,
    }}>
      <style>{`
        @keyframes aPulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        @keyframes aBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
      `}</style>
      <ANav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ATopbar term={window.TERMINAL} />
        <div style={{ padding: '20px 24px', overflow: 'auto', flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ color: A_TOKENS.textFaint, cursor: 'pointer', transform: 'rotate(180deg)', display: 'inline-block' }}>{AIcon.chev}</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Terminal</span>
            <span style={{ fontSize: 13, color: A_TOKENS.textMuted }}>·</span>
            <span style={{ fontSize: 13, fontFamily: A_TOKENS.mono, color: A_TOKENS.textMuted }}>SN: {window.TERMINAL.sn}</span>
            <span style={{ fontSize: 13, color: A_TOKENS.textMuted }}>·</span>
            <span style={{ fontSize: 13, color: A_TOKENS.textMuted }}>Deployment: {window.TERMINAL.deployment}</span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 4, color: A_TOKENS.success, fontSize: 12, fontWeight: 500 }}>
                {AIcon.wifi} {window.TERMINAL.group}
              </span>
              <AChip tone="success">Online</AChip>
              <AButton kind="ghost" size="sm">{AIcon.more}</AButton>
            </div>
          </div>
          <AHero term={window.TERMINAL} onAction={(a) => openCmd(a)} />
          <ATabs active={tab} onChange={setTab} />
          <div style={{ marginTop: 16 }}>
            {tab === 'Overview' && <AOverview term={window.TERMINAL} />}
            {tab === 'Basic Info' && <ABasicInfo term={window.TERMINAL} />}
            {tab === 'App & Firmware' && <AAppFw term={window.TERMINAL} onAction={(a) => openCmd(a)} />}
            {tab === 'Settings' && <ASettings />}
            {tab === 'Remote Assistance' && <ARemote onAction={(a, l) => openCmd(a, l)} />}
          </div>
        </div>
      </div>
      {modal && <ACommandModal cmd={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

Object.assign(window, { DirectionA });
