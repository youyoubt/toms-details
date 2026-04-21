// Shared TOMS brand logo — SVG component, no image dependency.
// Cloud crown over an infinity/loop, cyan→blue→indigo gradient matching brand.

function TomsMark({ size = 24, withWordmark = false, wordColor, style }) {
  const id = 'toms-grad-' + (TomsMark._n = (TomsMark._n || 0) + 1);
  const w = withWordmark ? size * 3.1 : size;
  return (
    <svg width={w} height={size} viewBox={withWordmark ? '0 0 124 40' : '0 0 40 40'}
      fill="none" style={{ display: 'block', ...style }}>
      <defs>
        <linearGradient id={id} x1="4" y1="8" x2="36" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#22D3EE" />
          <stop offset="0.55" stopColor="#2563EB" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      {/* cloud crown */}
      <path
        d="M13 14 A8.5 8.5 0 0 1 27 14"
        stroke={`url(#${id})`} strokeWidth="3.4" strokeLinecap="round" fill="none"
      />
      {/* infinity / loop */}
      <path
        d="M20 22
           C 16 16, 8 16, 8 22
           C 8 28, 16 28, 20 22
           C 24 16, 32 16, 32 22
           C 32 28, 24 28, 20 22 Z"
        fill={`url(#${id})`}
      />
      {/* small cyan highlight on the cloud crown */}
      <path
        d="M14.5 13.5 A7 7 0 0 1 25.5 13.5"
        stroke="#67E8F9" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.75"
      />
      {withWordmark && (
        <text x="46" y="27" fontFamily="Inter, system-ui, sans-serif"
          fontWeight="700" fontSize="20" letterSpacing="-0.5"
          fill={wordColor || '#1e3a8a'}>TOMS</text>
      )}
    </svg>
  );
}

Object.assign(window, { TomsMark });
