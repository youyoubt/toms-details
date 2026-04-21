// Terminal List — Direction A style (Refined Enterprise)
// Parent page above "Terminal Detail". Matches the TMS > Terminal nav item.
// Features: KPI strip, filter bar, searchable/sortable table, row actions.

const { useState: aLUseState, useMemo: aLUseMemo } = React;

// Two independent status dimensions per terminal:
// (1) Connectivity: online | offline
// (2) Inventory: in_use | in_stock | transferring | locked | repair | lost | retired
const AL_INVENTORY = {
  in_use:       { label: 'In Use',       fg: '#047857', bg: '#ecfdf5', bd: '#a7f3d0', dot: '#10b981' },
  in_stock:     { label: 'In Stock',     fg: '#1d4ed8', bg: '#eff6ff', bd: '#bfdbfe', dot: '#3b82f6' },
  transferring: { label: 'Transferring', fg: '#7c3aed', bg: '#f5f3ff', bd: '#ddd6fe', dot: '#8b5cf6' },
  locked:       { label: 'Locked',       fg: '#334155', bg: '#f1f5f9', bd: '#cbd5e1', dot: '#475569' },
  repair:       { label: 'Repair',       fg: '#b45309', bg: '#fffbeb', bd: '#fde68a', dot: '#f59e0b' },
  lost:         { label: 'Lost',         fg: '#b91c1c', bg: '#fef2f2', bd: '#fecaca', dot: '#ef4444' },
  retired:      { label: 'Retired',      fg: '#64748b', bg: '#f8fafc', bd: '#e2e8f0', dot: '#94a3b8' },
};

// Generate a realistic fleet of terminals
const AL_ROWS = (() => {
  const models = ['N950K', 'N910', 'A920Pro', 'V20', 'P2Lite'];
  const mans = ['Newland', 'PAX', 'Verifone', 'Ingenico'];
  const groups = ['DMB', 'North-EU', 'APAC-2', 'LATAM', 'Test-Fleet'];
  const deployments = ['N750PU Peripherals Test', 'Prod · Store-0432', 'Prod · Berlin-HQ',
    'Staging · RC6', 'Prod · Madrid-04', 'Prod · Milan-17', 'Prod · Paris-11',
    'Prod · London-23', 'Prod · Lyon-02', 'Test · Sandbox'];
  const firmwares = ['D1.0.06', 'D1.0.05', 'D1.0.04', 'D1.0.03'];

  // weighted — most are in_use/in_stock, fewer extremes
  const invPool = [
    'in_use', 'in_use', 'in_use', 'in_use', 'in_use', 'in_use', 'in_use', 'in_use',
    'in_stock', 'in_stock', 'in_stock', 'in_stock', 'in_stock',
    'transferring', 'transferring',
    'repair', 'repair',
    'locked',
    'lost',
    'retired',
  ];

  const rnd = (seed) => {
    let s = seed;
    return () => (s = (s * 9301 + 49297) % 233280) / 233280;
  };
  const r = rnd(42);
  const pick = (arr) => arr[Math.floor(r() * arr.length)];

  const rows = Array.from({ length: 38 }, (_, i) => {
    const inv = pick(invPool);
    // Only in_use / locked / repair can plausibly be online.
    // in_stock / transferring / retired / lost are typically offline.
    let connectivity = 'online';
    if (['in_stock', 'transferring', 'retired', 'lost'].includes(inv)) {
      connectivity = 'offline';
    } else if (r() < 0.18) {
      connectivity = 'offline';
    }
    const batt = connectivity === 'offline' && inv !== 'in_stock' && inv !== 'transferring'
      ? (r() < 0.4 ? null : Math.floor(r() * 50) + 10)
      : connectivity === 'offline' ? Math.floor(r() * 80) + 20
      : Math.floor(r() * 70) + 30;
    return {
      sn: 'NEC' + (400084000 + Math.floor(r() * 99999)).toString(),
      name: ['TestAppSigner', 'StoreTerminal', 'POS-Bay', 'Counter', 'FrontDesk'][i % 5] + (100 + i),
      model: pick(models),
      manufacturer: pick(mans),
      group: pick(groups),
      deployment: inv === 'in_stock' ? 'Warehouse · Frankfurt'
        : inv === 'transferring' ? 'In transit → ' + pick(deployments)
        : inv === 'retired' ? '— retired —'
        : inv === 'lost' ? '— lost —'
        : pick(deployments),
      firmware: pick(firmwares),
      connectivity,
      inventory: inv,
      battery: batt,
      lastActive: connectivity === 'online' ? ['2s ago', '14s ago', '1m ago', '3m ago', 'just now'][Math.floor(r() * 5)]
        : inv === 'retired' ? '62d ago' : inv === 'lost' ? '14d ago'
        : inv === 'in_stock' ? '—' : inv === 'transferring' ? '42m ago'
        : ['2h ago', '6h ago', '1d ago', '3d ago'][Math.floor(r() * 4)],
      ip: '192.168.' + Math.floor(r() * 254) + '.' + Math.floor(r() * 254),
    };
  });
  // Pin the featured terminal at the top
  rows[0] = {
    sn: window.TERMINAL.sn, name: window.TERMINAL.name, model: window.TERMINAL.model,
    manufacturer: window.TERMINAL.manufacturer, group: window.TERMINAL.group,
    deployment: window.TERMINAL.deployment, firmware: window.TERMINAL.firmware.current,
    connectivity: 'online', inventory: 'in_use', battery: window.TERMINAL.battery.pct,
    lastActive: '2s ago', ip: window.TERMINAL.ip, pinned: true,
  };
  return rows;
})();

// Connectivity pill — compact dot + label
function ALConnectivity({ value }) {
  const on = value === 'online';
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: 12, fontWeight: 500, color: on ? A_TOKENS.text : A_TOKENS.textMuted,
    }}>
      <span style={{
        width: 7, height: 7, borderRadius: 4,
        background: on ? A_TOKENS.success : '#94a3b8',
        boxShadow: on ? `0 0 0 3px ${A_TOKENS.success}26` : 'none',
        animation: on ? 'aPulseDot 2s ease-in-out infinite' : 'none',
      }} />
      {on ? 'Online' : 'Offline'}
    </span>
  );
}

// Inventory status badge — colored pill
function ALInventoryBadge({ value }) {
  const m = AL_INVENTORY[value] || AL_INVENTORY.in_stock;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 8px', background: m.bg, color: m.fg,
      border: `1px solid ${m.bd}`, borderRadius: 11,
      fontSize: 11.5, fontWeight: 500, letterSpacing: 0.1, whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: 3, background: m.dot }} />
      {m.label}
    </span>
  );
}

function ALKpi({ label, value, delta, sub, accent }) {
  return (
    <div style={{
      flex: 1, padding: '14px 18px',
      borderRight: `1px solid ${A_TOKENS.border}`,
    }}>
      <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, letterSpacing: 0.2, textTransform: 'uppercase', fontWeight: 500 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 5 }}>
        <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.6,
          color: accent || A_TOKENS.text, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
        {delta && (
          <div style={{ fontSize: 11.5, color: delta.startsWith('+') ? A_TOKENS.success : A_TOKENS.danger,
            fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{delta}</div>
        )}
      </div>
      <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, marginTop: 2 }}>{sub}</div>
    </div>
  );
}

function ALStatusDot({ status }) {
  const map = {
    online: { c: A_TOKENS.success, l: 'Online', pulse: true },
    offline: { c: '#94a3b8', l: 'Offline' },
    pending: { c: A_TOKENS.warn, l: 'Updating' },
    alert: { c: A_TOKENS.danger, l: 'Alert' },
  };
  const m = map[status];
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, fontWeight: 500, color: A_TOKENS.text }}>
      <span style={{
        width: 7, height: 7, borderRadius: 4, background: m.c,
        boxShadow: m.pulse ? `0 0 0 3px ${m.c}26` : 'none',
      }} />
      {m.l}
    </span>
  );
}

function ALBatteryCell({ pct }) {
  if (pct == null) return <span style={{ color: A_TOKENS.textFaint, fontSize: 12 }}>—</span>;
  const color = pct > 50 ? A_TOKENS.success : pct > 20 ? A_TOKENS.warn : A_TOKENS.danger;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ position: 'relative', width: 34, height: 12, border: `1.2px solid ${A_TOKENS.borderStrong}`, borderRadius: 2 }}>
        <div style={{ position: 'absolute', top: 1, left: 1, bottom: 1, width: `${Math.max(2, pct * 0.3)}px`, background: color, borderRadius: 1 }} />
        <div style={{ position: 'absolute', right: -3, top: 3, width: 2, height: 6, background: A_TOKENS.borderStrong, borderRadius: '0 1px 1px 0' }} />
      </div>
      <span style={{ fontSize: 12, fontVariantNumeric: 'tabular-nums', color: A_TOKENS.text, fontWeight: 500 }}>{pct}%</span>
    </div>
  );
}

function ALRowActions({ onOpen }) {
  const [open, setOpen] = aLUseState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{
        padding: '4px 6px', border: 'none', background: 'transparent', cursor: 'pointer',
        color: A_TOKENS.textFaint, borderRadius: 4,
      }}>{AIcon.more}</button>
      {open && (
        <>
          <div onClick={(e) => { e.stopPropagation(); setOpen(false); }} style={{ position: 'fixed', inset: 0, zIndex: 10 }} />
          <div style={{
            position: 'absolute', right: 0, top: 26, zIndex: 11,
            background: '#fff', border: `1px solid ${A_TOKENS.border}`, borderRadius: 6,
            boxShadow: '0 8px 24px rgba(0,0,0,.1)', minWidth: 170, padding: 4,
          }}>
            {[
              { l: 'Open details', act: () => { setOpen(false); onOpen(); } },
              { l: 'Push firmware' },
              { l: 'Push app' },
              { l: 'Reboot' },
              { l: 'Edit group' },
              { l: 'Unassign', danger: true },
            ].map((i) => (
              <div key={i.l} onClick={(e) => { e.stopPropagation(); i.act && i.act(); }} style={{
                padding: '7px 10px', fontSize: 12.5, borderRadius: 4, cursor: 'pointer',
                color: i.danger ? A_TOKENS.danger : A_TOKENS.text,
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                {i.l}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ATerminalList({ onOpenDetail }) {
  const [query, setQuery] = aLUseState('');
  const [connFilter, setConnFilter] = aLUseState('all');
  const [invFilter, setInvFilter] = aLUseState('all');
  const [groupFilter, setGroupFilter] = aLUseState('all');
  const [sort, setSort] = aLUseState({ key: 'lastActive', dir: 'desc' });
  const [selected, setSelected] = aLUseState(new Set());
  const [detailRow, setDetailRow] = aLUseState(null);

  const filtered = aLUseMemo(() => {
    let r = AL_ROWS;
    if (query) {
      const q = query.toLowerCase();
      r = r.filter((row) => row.sn.toLowerCase().includes(q) || row.name.toLowerCase().includes(q)
        || row.model.toLowerCase().includes(q) || row.deployment.toLowerCase().includes(q));
    }
    if (connFilter !== 'all') r = r.filter((row) => row.connectivity === connFilter);
    if (invFilter !== 'all') r = r.filter((row) => row.inventory === invFilter);
    if (groupFilter !== 'all') r = r.filter((row) => row.group === groupFilter);
    return r;
  }, [query, connFilter, invFilter, groupFilter]);

  const counts = aLUseMemo(() => {
    const c = { online: 0, offline: 0 };
    const inv = {};
    AL_ROWS.forEach((r) => {
      c[r.connectivity]++;
      inv[r.inventory] = (inv[r.inventory] || 0) + 1;
    });
    return { conn: c, inv };
  }, []);

  const groups = aLUseMemo(() => ['all', ...new Set(AL_ROWS.map((r) => r.group))], []);

  const openDetail = (row) => {
    if (onOpenDetail) onOpenDetail(row);
    else setDetailRow(row);
  };

  const toggleSel = (sn) => {
    const n = new Set(selected);
    n.has(sn) ? n.delete(sn) : n.add(sn);
    setSelected(n);
  };

  // Render the detail view instead of the list when a row is open.
  // All hooks above run unconditionally; this branch is safe.
  if (detailRow) {
    return <ALDetailView row={detailRow} onBack={() => setDetailRow(null)} />;
  }

  const cols = [
    { k: 'sel', w: 36, sort: false },
    { k: 'name', l: 'Terminal', w: 240 },
    { k: 'conn', l: 'Connectivity', w: 120 },
    { k: 'inventory', l: 'Inventory Status', w: 140 },
    { k: 'model', l: 'Model', w: 130 },
    { k: 'group', l: 'Group', w: 110 },
    { k: 'deployment', l: 'Deployment', w: 220 },
    { k: 'firmware', l: 'Firmware', w: 110 },
    { k: 'battery', l: 'Battery', w: 110 },
    { k: 'lastActive', l: 'Last active', w: 100 },
    { k: 'act', l: '', w: 40, sort: false },
  ];

  return (
    <div style={{
      fontFamily: A_TOKENS.font, background: A_TOKENS.bg, color: A_TOKENS.text,
      display: 'flex', height: '100%', minHeight: 900, fontSize: 13.5, letterSpacing: -0.05,
    }}>
      <ANav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ATopbarList />
        <style>{`
          @keyframes aPulseDot { 0%,100% { box-shadow: 0 0 0 3px ${A_TOKENS.success}26; } 50% { box-shadow: 0 0 0 5px ${A_TOKENS.success}15; } }
        `}</style>
        <div style={{ padding: '20px 24px 28px', overflow: 'auto', flex: 1 }}>
          {/* Title row */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: -0.4 }}>Terminals</div>
              <div style={{ fontSize: 12.5, color: A_TOKENS.textMuted, marginTop: 2 }}>
                {AL_ROWS.length} terminals across {groups.length - 1} groups · updated 2 seconds ago
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              <AButton kind="secondary" icon={AIcon.download} size="md">Export CSV</AButton>
              <AButton kind="secondary" size="md">Import</AButton>
              <AButton kind="primary" size="md">+ Register Terminal</AButton>
            </div>
          </div>

          {/* KPI strip — two rows: connectivity + inventory breakdown */}
          <div style={{
            background: '#fff', border: `1px solid ${A_TOKENS.border}`,
            borderRadius: 8, marginBottom: 16, overflow: 'hidden',
          }}>
            {/* Row 1 — connectivity + battery */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${A_TOKENS.border}` }}>
              <div style={{ flex: '0 0 auto', padding: '10px 18px', display: 'flex', alignItems: 'center',
                background: '#fafbfc', borderRight: `1px solid ${A_TOKENS.border}`,
                fontSize: 11, fontWeight: 600, color: A_TOKENS.textMuted,
                letterSpacing: 0.4, textTransform: 'uppercase', minWidth: 140,
              }}>Connectivity</div>
              <ALKpi label="Online" value={counts.conn.online} delta="+12" sub={`of ${AL_ROWS.length} total`} accent={A_TOKENS.success} />
              <ALKpi label="Offline" value={counts.conn.offline} sub="last seen avg 4h" />
              <ALKpi label="Avg battery" value="72%" sub="across online fleet" />
              <div style={{ flex: 1, padding: '14px 18px' }}>
                <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, letterSpacing: 0.2, textTransform: 'uppercase', fontWeight: 500 }}>Fleet health</div>
                <div style={{ display: 'flex', gap: 2, marginTop: 10 }}>
                  {[A_TOKENS.success, A_TOKENS.success, A_TOKENS.success, A_TOKENS.success, A_TOKENS.success,
                    A_TOKENS.success, A_TOKENS.success, A_TOKENS.success, A_TOKENS.warn, A_TOKENS.danger, '#cbd5e1', '#cbd5e1'].map((c, i) => (
                    <div key={i} style={{ flex: 1, height: 14, background: c, borderRadius: 2 }} />
                  ))}
                </div>
                <div style={{ fontSize: 11.5, color: A_TOKENS.textMuted, marginTop: 6 }}>97% healthy</div>
              </div>
            </div>
            {/* Row 2 — inventory breakdown (clickable filter chips) */}
            <div style={{ display: 'flex', alignItems: 'center', padding: '10px 18px', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: A_TOKENS.textMuted,
                letterSpacing: 0.4, textTransform: 'uppercase', minWidth: 122,
              }}>Inventory</div>
              {Object.entries(AL_INVENTORY).map(([k, m]) => {
                const n = counts.inv[k] || 0;
                const active = invFilter === k;
                return (
                  <button key={k} onClick={() => setInvFilter(active ? 'all' : k)} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '5px 10px', borderRadius: 14,
                    background: active ? m.bg : '#fff',
                    border: `1px solid ${active ? m.dot : A_TOKENS.border}`,
                    color: active ? m.fg : A_TOKENS.text,
                    fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all .12s',
                  }}>
                    <span style={{ width: 7, height: 7, borderRadius: 4, background: m.dot }} />
                    {m.label}
                    <span style={{
                      fontVariantNumeric: 'tabular-nums',
                      color: active ? m.fg : A_TOKENS.textMuted, fontWeight: 600,
                      padding: '0 6px', minWidth: 18, textAlign: 'center',
                      background: active ? 'rgba(255,255,255,.6)' : A_TOKENS.bg,
                      borderRadius: 8, fontSize: 11,
                    }}>{n}</span>
                  </button>
                );
              })}
              {invFilter !== 'all' && (
                <button onClick={() => setInvFilter('all')} style={{
                  marginLeft: 4, fontSize: 11.5, color: A_TOKENS.textMuted, background: 'transparent',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline',
                }}>Clear</button>
              )}
            </div>
          </div>

          {/* Toolbar */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: '#fff', border: `1px solid ${A_TOKENS.border}`,
            borderTopLeftRadius: 8, borderTopRightRadius: 8,
            padding: '10px 12px', borderBottom: 'none',
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 10px', background: A_TOKENS.bg,
              border: `1px solid ${A_TOKENS.border}`, borderRadius: 6, minWidth: 280,
            }}>
              <span style={{ color: A_TOKENS.textFaint }}>{AIcon.search}</span>
              <input value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="Search SN, name, model, deployment…"
                style={{
                  border: 'none', background: 'transparent', outline: 'none',
                  fontSize: 12.5, fontFamily: 'inherit', color: A_TOKENS.text, flex: 1,
                }} />
              {query && <span onClick={() => setQuery('')} style={{ color: A_TOKENS.textFaint, cursor: 'pointer' }}>{AIcon.x}</span>}
            </div>
            {/* Connectivity pills */}
            <div style={{ display: 'flex', gap: 2, padding: 3, background: A_TOKENS.bg, borderRadius: 6, border: `1px solid ${A_TOKENS.border}` }}>
              {[['all', 'All'], ['online', 'Online'], ['offline', 'Offline']].map(([k, l]) => (
                <button key={k} onClick={() => setConnFilter(k)} style={{
                  padding: '4px 10px', fontSize: 12, fontWeight: 500,
                  background: connFilter === k ? '#fff' : 'transparent',
                  color: connFilter === k ? A_TOKENS.text : A_TOKENS.textMuted,
                  border: 'none', borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit',
                  boxShadow: connFilter === k ? '0 1px 2px rgba(0,0,0,.06)' : 'none',
                }}>{l}</button>
              ))}
            </div>
            <select value={invFilter} onChange={(e) => setInvFilter(e.target.value)} style={{
              padding: '6px 10px', fontSize: 12.5, border: `1px solid ${A_TOKENS.border}`,
              borderRadius: 6, background: '#fff', fontFamily: 'inherit', color: A_TOKENS.text, cursor: 'pointer',
            }}>
              <option value="all">All inventory</option>
              {Object.entries(AL_INVENTORY).map(([k, m]) => (
                <option key={k} value={k}>{m.label}</option>
              ))}
            </select>
            <select value={groupFilter} onChange={(e) => setGroupFilter(e.target.value)} style={{
              padding: '6px 10px', fontSize: 12.5, border: `1px solid ${A_TOKENS.border}`,
              borderRadius: 6, background: '#fff', fontFamily: 'inherit', color: A_TOKENS.text, cursor: 'pointer',
            }}>
              {groups.map((g) => <option key={g} value={g}>{g === 'all' ? 'All groups' : g}</option>)}
            </select>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
              {selected.size > 0 && (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '4px 10px', background: A_TOKENS.accentSoft,
                  border: `1px solid #dbeafe`, borderRadius: 6,
                  fontSize: 12, color: A_TOKENS.accent, fontWeight: 500,
                }}>
                  {selected.size} selected
                  <span style={{ color: A_TOKENS.border }}>·</span>
                  <span style={{ cursor: 'pointer' }}>Push app</span>
                  <span style={{ color: A_TOKENS.border }}>·</span>
                  <span style={{ cursor: 'pointer' }}>Reboot</span>
                  <span style={{ color: A_TOKENS.border }}>·</span>
                  <span onClick={() => setSelected(new Set())} style={{ cursor: 'pointer', color: A_TOKENS.textMuted }}>Clear</span>
                </div>
              )}
              <span style={{ fontSize: 12, color: A_TOKENS.textMuted }}>{filtered.length} of {AL_ROWS.length}</span>
            </div>
          </div>

          {/* Table */}
          <div style={{
            background: '#fff', border: `1px solid ${A_TOKENS.border}`,
            borderBottomLeftRadius: 8, borderBottomRightRadius: 8, overflow: 'hidden',
          }}>
            <div style={{
              display: 'grid', gridTemplateColumns: cols.map((c) => `${c.w}px`).join(' ').replace(/240px/, '1fr').replace(/220px/, 'minmax(180px, 1.2fr)'),
              alignItems: 'center', padding: '8px 12px', background: '#f8fafc',
              borderBottom: `1px solid ${A_TOKENS.border}`, fontSize: 11.5, fontWeight: 600,
              color: A_TOKENS.textMuted, textTransform: 'uppercase', letterSpacing: 0.3,
            }}>
              {cols.map((c) => (
                <div key={c.k} onClick={() => c.sort !== false && setSort({ key: c.k, dir: sort.key === c.k && sort.dir === 'asc' ? 'desc' : 'asc' })}
                  style={{ cursor: c.sort === false ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
                  {c.k === 'sel' ? (
                    <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0}
                      onChange={(e) => setSelected(e.target.checked ? new Set(filtered.map((r) => r.sn)) : new Set())}
                      style={{ margin: 0, cursor: 'pointer' }} />
                  ) : c.l}
                  {sort.key === c.k && <span style={{ fontSize: 9 }}>{sort.dir === 'asc' ? '▲' : '▼'}</span>}
                </div>
              ))}
            </div>
            {filtered.map((row, i) => (
              <div key={row.sn} onClick={() => openDetail(row)}
                style={{
                  display: 'grid',
                  gridTemplateColumns: cols.map((c) => `${c.w}px`).join(' ').replace(/240px/, '1fr').replace(/220px/, 'minmax(180px, 1.2fr)'),
                  alignItems: 'center', padding: '11px 12px',
                  borderBottom: i < filtered.length - 1 ? `1px solid ${A_TOKENS.border}` : 'none',
                  fontSize: 13, cursor: 'pointer',
                  background: selected.has(row.sn) ? A_TOKENS.accentSoft : row.pinned ? '#fcfdff' : '#fff',
                  transition: 'background .1s',
                }}
                onMouseEnter={(e) => { if (!selected.has(row.sn)) e.currentTarget.style.background = '#f8fafc'; }}
                onMouseLeave={(e) => { if (!selected.has(row.sn)) e.currentTarget.style.background = row.pinned ? '#fcfdff' : '#fff'; }}>
                <input type="checkbox" checked={selected.has(row.sn)} onClick={(e) => e.stopPropagation()}
                  onChange={() => toggleSel(row.sn)} style={{ margin: 0, cursor: 'pointer' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                  <div style={{
                    width: 30, height: 30, borderRadius: 6, flexShrink: 0,
                    background: 'linear-gradient(135deg, #dbeafe, #eff6ff)',
                    border: `1px solid #dbeafe`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
                      <rect x="1" y="1" width="12" height="16" rx="1.5" stroke={A_TOKENS.accent} strokeWidth="1.2" />
                      <rect x="3" y="3" width="8" height="5" rx="0.5" fill={A_TOKENS.accent} opacity="0.25" />
                      <circle cx="4" cy="11" r="0.8" fill={A_TOKENS.accent} />
                      <circle cx="7" cy="11" r="0.8" fill={A_TOKENS.accent} />
                      <circle cx="10" cy="11" r="0.8" fill={A_TOKENS.accent} />
                      <circle cx="4" cy="14" r="0.8" fill={A_TOKENS.accent} />
                      <circle cx="7" cy="14" r="0.8" fill={A_TOKENS.accent} />
                      <circle cx="10" cy="14" r="0.8" fill={A_TOKENS.accent} />
                    </svg>
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 600, color: A_TOKENS.text, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.name}</span>
                      {row.pinned && <span style={{ fontSize: 9, padding: '1px 5px', background: A_TOKENS.accentSoft, color: A_TOKENS.accent, borderRadius: 3, fontWeight: 600, letterSpacing: 0.3 }}>PINNED</span>}
                    </div>
                    <div style={{ fontSize: 11, color: A_TOKENS.textMuted, fontFamily: A_TOKENS.mono, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.sn}</div>
                  </div>
                </div>
                <ALConnectivity value={row.connectivity} />
                <ALInventoryBadge value={row.inventory} />
                <div style={{ color: A_TOKENS.text }}>
                  {row.model}
                  <div style={{ fontSize: 11, color: A_TOKENS.textMuted }}>{row.manufacturer}</div>
                </div>
                <div><AChip tone="neutral">{row.group}</AChip></div>
                <div style={{ fontSize: 12, color: A_TOKENS.text, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.deployment}</div>
                <div style={{ fontFamily: A_TOKENS.mono, fontSize: 12, color: A_TOKENS.text }}>
                  {row.firmware}
                  {row.firmware !== 'D1.0.06' && (
                    <div style={{ fontSize: 10, color: A_TOKENS.warn }}>↑ update available</div>
                  )}
                </div>
                <ALBatteryCell pct={row.battery} />
                <div style={{ fontSize: 12, color: A_TOKENS.textMuted, fontVariantNumeric: 'tabular-nums' }}>{row.lastActive}</div>
                <ALRowActions onOpen={() => openDetail(row)} />
              </div>
            ))}
            {/* Pagination */}
            <div style={{
              padding: '10px 14px', borderTop: `1px solid ${A_TOKENS.border}`,
              background: '#fafbfc', display: 'flex', alignItems: 'center',
              fontSize: 12, color: A_TOKENS.textMuted,
            }}>
              <div>Showing 1–{filtered.length} of {filtered.length}</div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 4 }}>
                {['‹', '1', '2', '3', '…', '8', '›'].map((p, i) => (
                  <button key={i} style={{
                    minWidth: 26, height: 26, fontSize: 12,
                    background: p === '1' ? A_TOKENS.accent : '#fff',
                    color: p === '1' ? '#fff' : A_TOKENS.text,
                    border: `1px solid ${p === '1' ? A_TOKENS.accent : A_TOKENS.border}`,
                    borderRadius: 4, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
                  }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ATopbarList({ onBack, crumb }) {
  return (
    <div style={{
      height: 52, display: 'flex', alignItems: 'center', gap: 14,
      padding: '0 20px', borderBottom: `1px solid ${A_TOKENS.border}`, background: '#fff',
    }}>
      <span style={{ color: A_TOKENS.textFaint, cursor: 'pointer', fontSize: 16 }}>☰</span>
      <div style={{ fontSize: 13, color: A_TOKENS.textMuted, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ color: A_TOKENS.textFaint }}>TMS</span>
        <span style={{ color: A_TOKENS.textFaint }}>/</span>
        {onBack ? (
          <>
            <span onClick={onBack} style={{ color: A_TOKENS.accent, fontWeight: 500, cursor: 'pointer' }}>Terminals</span>
            <span style={{ color: A_TOKENS.textFaint }}>/</span>
            <span style={{ color: A_TOKENS.text, fontWeight: 600, fontFamily: A_TOKENS.mono }}>{crumb}</span>
          </>
        ) : (
          <span style={{ color: A_TOKENS.text, fontWeight: 600 }}>Terminals</span>
        )}
      </div>
      <div style={{ flex: 1 }} />
      {onBack && (
        <button onClick={onBack} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '5px 11px', fontSize: 12, border: `1px solid ${A_TOKENS.border}`,
          borderRadius: 5, background: '#fff', cursor: 'pointer', fontFamily: 'inherit',
          color: A_TOKENS.text, fontWeight: 500,
        }}>
          <span style={{ transform: 'rotate(180deg)', display: 'inline-block' }}>{AIcon.chev}</span>
          Back to list
        </button>
      )}
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

// ── DETAIL VIEW (opened when a row is clicked) ────────────────────────────
// Renders the full Direction A detail page for the clicked terminal, with a
// back-aware topbar that replaces the one inside DirectionA's own shell.
function ALDetailView({ row, onBack }) {
  // Merge the row's data into a detail object matching window.TERMINAL's shape
  const termForDetail = aLUseMemo(() => {
    const base = window.TERMINAL;
    return {
      ...base,
      sn: row.sn, name: row.name, model: row.model,
      manufacturer: row.manufacturer, group: row.group,
      deployment: row.deployment,
      firmware: { ...base.firmware, current: row.firmware },
      battery: { ...base.battery, pct: row.battery ?? base.battery.pct },
      status: row.connectivity, online: row.connectivity === 'online',
      inventory: row.inventory,
    };
  }, [row]);

  return (
    <div style={{
      fontFamily: A_TOKENS.font, background: A_TOKENS.bg, color: A_TOKENS.text,
      display: 'flex', height: '100%', minHeight: 900, fontSize: 13.5, letterSpacing: -0.05,
    }}>
      <style>{`
        @keyframes aPulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        @keyframes aBlink { 0%,49% { opacity: 1; } 50%,100% { opacity: 0; } }
        @keyframes aPulseDot { 0%,100% { box-shadow: 0 0 0 3px ${A_TOKENS.success}26; } 50% { box-shadow: 0 0 0 5px ${A_TOKENS.success}15; } }
      `}</style>
      <ANav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <ATopbarList onBack={onBack} crumb={row.sn} />
        <ALDetailBody term={termForDetail} onBack={onBack} />
      </div>
    </div>
  );
}

// Separate component so hooks live at the top level
function ALDetailBody({ term, onBack }) {
  const [tab, setTab] = aLUseState('Overview');
  const [modal, setModal] = aLUseState(null);
  const openCmd = (act, label) => setModal({ act, label });

  // Patch window.TERMINAL while this detail view is mounted so all the
  // existing detail components (which read window.TERMINAL) see the
  // selected row. Restore on unmount.
  React.useEffect(() => {
    const prev = window.TERMINAL;
    window.TERMINAL = term;
    return () => { window.TERMINAL = prev; };
  }, [term]);

  return (
    <div style={{ padding: '20px 24px', overflow: 'auto', flex: 1 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span onClick={onBack} style={{ color: A_TOKENS.textFaint, cursor: 'pointer', transform: 'rotate(180deg)', display: 'inline-block' }}>{AIcon.chev}</span>
        <span onClick={onBack} style={{ fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Terminal</span>
        <span style={{ fontSize: 13, color: A_TOKENS.textMuted }}>·</span>
        <span style={{ fontSize: 13, fontFamily: A_TOKENS.mono, color: A_TOKENS.textMuted }}>SN: {term.sn}</span>
        <span style={{ fontSize: 13, color: A_TOKENS.textMuted }}>·</span>
        <span style={{ fontSize: 13, color: A_TOKENS.textMuted }}>Deployment: {term.deployment}</span>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 8 }}>
          <ALInventoryBadge value={term.inventory || 'in_use'} />
          <ALConnectivity value={term.status} />
        </div>
      </div>
      <AHero term={term} onAction={(a) => openCmd(a)} />
      <ATabs active={tab} onChange={setTab} />
      <div style={{ marginTop: 16 }}>
        {tab === 'Overview' && <AOverview term={term} />}
        {tab === 'Basic Info' && <ABasicInfo term={term} />}
        {tab === 'App & Firmware' && <AAppFw term={term} onAction={(a) => openCmd(a)} />}
        {tab === 'Settings' && <ASettings />}
        {tab === 'Remote Assistance' && <ARemote onAction={(a, l) => openCmd(a, l)} />}
      </div>
      {modal && <ACommandModal cmd={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

Object.assign(window, { ATerminalList });
