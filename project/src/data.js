// Shared mock data for the Terminal Detail prototype.
window.TERMINAL = {
  sn: 'NEC400084496',
  name: 'TestAppSigner121',
  model: 'N950K',
  manufacturer: 'Newland',
  deployment: 'N750PU Peripherals Test',
  group: 'DMB',
  pn: 'NFP-GCBLB06001',
  rootStatus: 'Not Rooted',
  pcVersion: 'PC17',
  createdAt: '2026-03-25 14:42:12',
  lastActive: '2026-04-14 14:43:34',
  localTime: '12:37:35',
  location: { lat: 26.03539, lng: 116.496805, label: 'Frankfurt · Warehouse B' },
  status: 'online',
  online: true,
  uptimeDays: 28,
  uptimePct: 99.72,
  battery: { pct: 87, temp: 32.4, health: 'Good', cycles: 184 },
  storage: { used: 33.75, total: 64, unit: 'GB' },
  cpu: 19,
  mem: 42,
  ip: '192.168.31.87',
  mac: '8860B0065963',
  wifi: { ssid: 'NLD-OPS-5G', signal: -52, band: '5GHz' },
  cellular: { apn: '-', carrier: '-', signal: -88 },
  tags: ['test-wifi', 'async-test', 'test—org'],
  firmware: { current: 'D1.0.04', latest: 'D1.0.06', updatedAt: '2026-04-15 11:36' },
};

window.PUSH_HISTORY = [
  { id: 'p-1812', task: 'Push Firmware · D1.0.06', status: 'in-progress', time: '2026-04-17 09:12', by: 'lyt' },
  { id: 'p-1809', task: 'Push App · TestApp 1.0.00', status: 'success', time: '2026-04-16 17:51', by: 'lyt' },
  { id: 'p-1806', task: 'Parameter sync', status: 'success', time: '2026-04-16 17:18', by: 'auto' },
  { id: 'p-1802', task: 'Push App · Yuka 4.42', status: 'failed', time: '2026-04-16 10:04', by: 'lyt' },
  { id: 'p-1798', task: 'Reboot command', status: 'success', time: '2026-04-15 22:30', by: 'ops-bot' },
  { id: 'p-1795', task: 'Push config bundle', status: 'success', time: '2026-04-15 11:38', by: 'lyt' },
  { id: 'p-1792', task: 'Install App · Yuka 4.40', status: 'success', time: '2026-04-14 16:02', by: 'lyt' },
  { id: 'p-1788', task: 'Wipe cache', status: 'success', time: '2026-04-14 09:15', by: 'ops-bot' },
];

window.EVENTS = [
  { when: '12:34', type: 'app', msg: 'TestApp v1.0.00 launched', severity: 'info' },
  { when: '09:02', type: 'net', msg: 'Wi-Fi reconnected · NLD-OPS-5G', severity: 'info' },
  { when: '06:47', type: 'pwr', msg: 'Charger disconnected · 98%', severity: 'info' },
  { when: '01:12', type: 'sys', msg: 'OTA check · up to date', severity: 'ok' },
  { when: 'Yst', type: 'app', msg: 'Yuka 4.42 install failed · SIG_MISMATCH', severity: 'warn' },
  { when: 'Yst', type: 'sys', msg: 'Reboot · scheduled', severity: 'info' },
  { when: '2d', type: 'net', msg: 'Cellular fallback triggered · 42s', severity: 'warn' },
];

window.APPS = [
  { name: 'TestApp', version: '1.0.00', size: '18.4 MB', status: 'installed', icon: '🟢' },
  { name: 'POS Terminal', version: '3.2.1', size: '42.1 MB', status: 'installed', icon: '🟦' },
  { name: 'Receipt Printer Svc', version: '1.14.0', size: '6.2 MB', status: 'installed', icon: '🖨️' },
  { name: 'Yuka', version: '4.42', size: '133.8 MB', status: 'pending', icon: '🥕' },
  { name: 'Inventory Sync', version: '2.0.3', size: '22.7 MB', status: 'installed', icon: '📦' },
];

window.PERIPHERALS = [
  { model: 'N750P', sn: 'NKD300017221', kind: 'Printer', status: 'online', lastSeen: '2026-04-17 11:50' },
  { model: 'NQ-X3', sn: 'NQX3-5529012', kind: 'Scanner', status: 'online', lastSeen: '2026-04-17 11:32' },
  { model: 'CR-408', sn: 'CR4087712', kind: 'Cash Drawer', status: 'idle', lastSeen: '2026-04-17 09:14' },
];

// 30d push frequency: [day, success, failed]
window.PUSH_SERIES = Array.from({ length: 30 }, (_, i) => {
  const base = [3, 2, 5, 4, 7, 6, 4, 3, 8, 9, 6, 5, 4, 7, 8, 12, 6, 5, 4, 9, 7, 6, 11, 8, 5, 4, 7, 9, 6, 8][i];
  const fail = i === 19 || i === 25 ? 2 : i % 7 === 3 ? 1 : 0;
  return { d: i + 1, ok: base, fail };
});

// Battery temperature 24h (°C)
window.BATT_SERIES = Array.from({ length: 24 }, (_, i) => ({
  h: i,
  temp: 28 + Math.sin(i / 3.2) * 3 + (i > 13 && i < 18 ? 3 : 0) + Math.random() * 0.5,
}));

// CPU/memory 60min
window.RES_SERIES = Array.from({ length: 60 }, (_, i) => ({
  t: i,
  cpu: 15 + Math.sin(i / 4) * 10 + (i > 40 && i < 48 ? 35 : 0) + Math.random() * 4,
  mem: 38 + Math.cos(i / 7) * 6 + Math.random() * 3,
}));
