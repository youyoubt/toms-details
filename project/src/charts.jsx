// Shared interactive chart primitives used by all three directions.
// Each chart accepts tokens (colors, font) so each direction can restyle.

const { useState, useMemo, useRef, useEffect } = React;

// ─── Bar chart (push history style) ────────────────────────────────────────
function BarChart({ data, height = 160, tokens }) {
  const T = tokens || {};
  const [hover, setHover] = useState(null);
  const max = Math.max(...data.map((d) => d.ok + d.fail), 1);
  const w = 100 / data.length;
  return (
    <div style={{ position: 'relative', width: '100%', height, fontFamily: T.font }}>
      <svg width="100%" height="100%" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none"
        onMouseLeave={() => setHover(null)}>
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1="0" x2="100" y1={height * (1 - f)} y2={height * (1 - f)}
            stroke={T.gridline || 'rgba(0,0,0,.06)'} strokeWidth="0.3" strokeDasharray="1,1" />
        ))}
        {data.map((d, i) => {
          const total = d.ok + d.fail;
          const h = (total / max) * (height - 14);
          const okH = (d.ok / max) * (height - 14);
          const failH = h - okH;
          const x = i * w;
          const barW = w * 0.62;
          const pad = (w - barW) / 2;
          const active = hover === i;
          return (
            <g key={i} onMouseEnter={() => setHover(i)} style={{ cursor: 'pointer' }}>
              <rect x={x} y={0} width={w} height={height} fill="transparent" />
              {d.fail > 0 && (
                <rect x={x + pad} y={height - h} width={barW} height={failH}
                  fill={T.danger || '#ef4444'} opacity={active ? 1 : 0.9} rx="0.3" />
              )}
              <rect x={x + pad} y={height - okH} width={barW} height={okH}
                fill={active ? (T.accentHi || T.accent || '#2563eb') : (T.accent || '#2563eb')} rx="0.3" />
            </g>
          );
        })}
      </svg>
      {hover !== null && (
        <div style={{
          position: 'absolute',
          left: `${(hover + 0.5) * w}%`,
          bottom: height + 4,
          transform: 'translateX(-50%)',
          background: T.tooltipBg || '#111827',
          color: T.tooltipFg || '#fff',
          padding: '6px 9px',
          borderRadius: 6,
          fontSize: 11,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,.18)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          Day {data[hover].d} · <b>{data[hover].ok}</b> ok
          {data[hover].fail > 0 && <> · <span style={{ color: T.dangerTooltip || '#fca5a5' }}>{data[hover].fail} failed</span></>}
        </div>
      )}
    </div>
  );
}

// ─── Line chart with hover crosshair (temperature, cpu/mem) ────────────────
function LineChart({ series, height = 140, tokens, yMin, yMax, unit = '', xLabel }) {
  const T = tokens || {};
  const [hover, setHover] = useState(null);
  const ref = useRef(null);
  const flat = series.flatMap((s) => s.values);
  const lo = yMin != null ? yMin : Math.min(...flat) - 1;
  const hi = yMax != null ? yMax : Math.max(...flat) + 1;
  const N = series[0].values.length;

  const px = (i) => (i / (N - 1)) * 100;
  const py = (v) => ((hi - v) / (hi - lo)) * (height - 20) + 10;

  const onMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const i = Math.max(0, Math.min(N - 1, Math.round((x / 100) * (N - 1))));
    setHover(i);
  };

  return (
    <div style={{ position: 'relative', width: '100%', height, fontFamily: T.font }}>
      <svg ref={ref} width="100%" height="100%" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none"
        onMouseMove={onMove} onMouseLeave={() => setHover(null)}>
        {[0.25, 0.5, 0.75].map((f, i) => (
          <line key={i} x1="0" x2="100" y1={10 + (height - 20) * f} y2={10 + (height - 20) * f}
            stroke={T.gridline || 'rgba(0,0,0,.06)'} strokeWidth="0.3" strokeDasharray="1,1" />
        ))}
        {series.map((s, si) => {
          const path = s.values.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(v)}`).join(' ');
          const area = path + ` L100,${height - 10} L0,${height - 10} Z`;
          return (
            <g key={si}>
              {s.fill !== false && (
                <path d={area} fill={s.color} opacity="0.08" />
              )}
              <path d={path} fill="none" stroke={s.color} strokeWidth={s.width || 1.2}
                strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            </g>
          );
        })}
        {hover !== null && (
          <g>
            <line x1={px(hover)} x2={px(hover)} y1="10" y2={height - 10}
              stroke={T.crosshair || 'rgba(0,0,0,.25)'} strokeWidth="0.4" strokeDasharray="1,1" vectorEffect="non-scaling-stroke" />
            {series.map((s, si) => (
              <circle key={si} cx={px(hover)} cy={py(s.values[hover])} r="1.6" fill={s.color}
                stroke={T.cardBg || '#fff'} strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            ))}
          </g>
        )}
      </svg>
      {hover !== null && (
        <div style={{
          position: 'absolute',
          left: `${px(hover)}%`,
          top: 0,
          transform: `translateX(${hover > N * 0.75 ? '-100%' : '6px'})`,
          background: T.tooltipBg || '#111827',
          color: T.tooltipFg || '#fff',
          padding: '6px 9px',
          borderRadius: 6,
          fontSize: 11,
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          boxShadow: '0 4px 12px rgba(0,0,0,.18)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          <div style={{ opacity: .65, fontSize: 10, marginBottom: 2 }}>{xLabel ? xLabel(hover) : `#${hover}`}</div>
          {series.map((s) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span style={{ width: 6, height: 6, borderRadius: 3, background: s.color, display: 'inline-block' }} />
              <span style={{ opacity: .8 }}>{s.label}</span>
              <b style={{ marginLeft: 'auto' }}>{s.values[hover].toFixed(1)}{unit}</b>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sparkline (small inline trend) ────────────────────────────────────────
function Sparkline({ values, color, height = 28, width = 80, fill = true }) {
  const lo = Math.min(...values);
  const hi = Math.max(...values);
  const px = (i) => (i / (values.length - 1)) * width;
  const py = (v) => ((hi - v) / Math.max(hi - lo, 0.001)) * (height - 4) + 2;
  const path = values.map((v, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(v)}`).join(' ');
  const area = path + ` L${width},${height} L0,${height} Z`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {fill && <path d={area} fill={color} opacity="0.12" />}
      <path d={path} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Radial gauge (battery, storage) ───────────────────────────────────────
function RadialGauge({ value, max = 100, size = 88, stroke = 7, color, trackColor, label, sublabel, font }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(1, value / max));
  return (
    <div style={{ position: 'relative', width: size, height: size, fontFamily: font }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke={trackColor || 'rgba(0,0,0,.08)'} strokeWidth={stroke} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none"
          strokeDasharray={`${c * pct} ${c}`} strokeLinecap="round" style={{ transition: 'stroke-dasharray .6s' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 2 }}>
        <div style={{ fontSize: size * 0.24, fontWeight: 600, letterSpacing: -0.4, lineHeight: 1 }}>{label}</div>
        {sublabel && <div style={{ fontSize: 10, opacity: .6 }}>{sublabel}</div>}
      </div>
    </div>
  );
}

// ─── Signal bars ───────────────────────────────────────────────────────────
function SignalBars({ level, color = 'currentColor', size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14">
      {[2, 5, 8, 11].map((h, i) => (
        <rect key={i} x={i * 3 + 0.5} y={14 - h} width="2" height={h} rx="0.3"
          fill={color} opacity={level > i ? 1 : 0.22} />
      ))}
    </svg>
  );
}

Object.assign(window, { BarChart, LineChart, Sparkline, RadialGauge, SignalBars });
