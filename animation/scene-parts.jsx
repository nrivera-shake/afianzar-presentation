// scene-parts.jsx — Avatar, Arrow, ChannelBadge, StressAura, NotifBadges

// ── Avatar ──────────────────────────────────────────────────────────────────
function OwnerSilhouette() {
  return (
    <svg width="100%" height="100%" viewBox="0 0 100 100">
      <rect x="0" y="0" width="100" height="100" fill="oklch(92% 0.01 80)"/>
      <circle cx="50" cy="40" r="15" fill="oklch(70% 0.02 80)"/>
      <path d="M20 95 Q20 65 50 65 Q80 65 80 95 Z" fill="oklch(70% 0.02 80)"/>
    </svg>
  );
}

function Avatar({ person, stressLevel = 0, highlight = null, scale = 1, labelPosition = 'below' }) {
  const t = useTime();
  // María shakes a little when she's stressed
  const isMaria = person.id === 'maria';
  const stressShake = isMaria ? stressLevel : 0;
  const wobble = stressShake * Math.sin(t * 13) * 3;
  const wobbleY = stressShake * Math.sin(t * 17 + 1) * 2;

  const baseSize = 240 * scale;
  const halfW = 140 * scale;
  const nameSize = 34 * scale;
  const roleSize = 22 * scale;

  const ringColor = highlight === 'send'
    ? 'oklch(60% 0.18 255)'
    : highlight === 'receive'
    ? 'oklch(65% 0.16 145)'
    : null;
  const ringOpacity = highlight ? 1 : 0;

  return (
    <div style={{
      position: 'absolute',
      left: person.x, top: person.y,
      width: 0, height: 0,
      transform: `translate(${wobble}px, ${wobbleY}px) rotate(${wobble * 0.25}deg)`,
      willChange: 'transform',
    }}>
      {/* Soft glow when highlighted */}
      {ringColor && (
        <div style={{
          position: 'absolute',
          left: -halfW - 14 * scale,
          top:  -halfW - 14 * scale,
          width: baseSize + 28 * scale, height: baseSize + 28 * scale,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${ringColor} 60%, transparent 72%)`,
          opacity: 0.18,
          pointerEvents: 'none',
        }}/>
      )}
      {/* Photo — centered on person, with colored border when highlighted */}
      <div style={{
        position: 'absolute',
        left: -halfW, top: -halfW,
        width: baseSize, height: baseSize,
        borderRadius: '50%',
        background: '#fff',
        overflow: 'hidden',
        border: `${7 * scale}px solid ${ringColor || '#fff'}`,
        boxShadow: '0 8px 28px rgba(20,18,15,0.10), 0 2px 6px rgba(20,18,15,0.06)',
        boxSizing: 'border-box',
        transition: 'border-color 200ms',
      }}>
        {person.img
          ? <img src={person.img} alt={person.name}
              style={{width:'100%', height:'100%', objectFit:'cover', display:'block'}}/>
          : <OwnerSilhouette/>
        }
      </div>
      {/* Label — above or below the photo */}
      <div style={{
        position: 'absolute',
        left: -200, width: 400,
        textAlign: 'center',
        top: labelPosition === 'above'
          ? -halfW - 14 * scale - (person.role ? roleSize * 1.3 : 0) - nameSize * 1.1
          :  halfW + 14 * scale,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
      }}>
        <div style={{
          fontWeight: 700, fontSize: nameSize, color: '#1a1714',
          letterSpacing: '-0.01em', lineHeight: 1.1,
        }}>{person.name}</div>
        {person.role && (
          <div style={{ fontSize: roleSize, color: '#6b6458', marginTop: 4 * scale, lineHeight: 1.2 }}>{person.role}</div>
        )}
      </div>
    </div>
  );
}

// ── Arrow (SVG) ─────────────────────────────────────────────────────────────
function Arrow({ from, to, color = '#1a1714', perpOffset = 0, progress = 1, dashed = false, width = 5, padFrom = 145, padTo = 145, smoothColor = false }) {
  const dx = to.x - from.x, dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  const nx = dx / len, ny = dy / len;
  const px = -ny, py = nx;
  const x1 = from.x + nx * padFrom + px * perpOffset;
  const y1 = from.y + ny * padFrom + py * perpOffset;
  const x2 = to.x   - nx * padTo   + px * perpOffset;
  const y2 = to.y   - ny * padTo   + py * perpOffset;
  const segLen = Math.hypot(x2 - x1, y2 - y1);

  const cx = x1 + (x2 - x1) * progress;
  const cy = y1 + (y2 - y1) * progress;
  const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

  const tween = smoothColor
    ? 'stroke 500ms ease, stroke-width 500ms ease, fill 500ms ease'
    : 'none';

  return (
    <svg style={{
      position: 'absolute', left: 0, top: 0,
      width: STAGE_W, height: STAGE_H,
      pointerEvents: 'none', overflow: 'visible',
    }}>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        style={{
          stroke: color,
          strokeWidth: width,
          transition: tween,
        }}
        strokeLinecap="round"
        strokeDasharray={dashed ? '14 10' : segLen}
        strokeDashoffset={dashed ? 0 : segLen * (1 - progress)}
        opacity={dashed ? Math.min(1, progress * 2) : 1}
      />
      {progress > 0.04 && (
        <polygon
          points="0,-10 20,0 0,10"
          style={{ fill: color, transition: tween }}
          transform={`translate(${cx},${cy}) rotate(${angle})`}
        />
      )}
    </svg>
  );
}

// ── Channel Badge ───────────────────────────────────────────────────────────
function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="#fff" strokeWidth="2"/>
      <path d="M3 7l9 7 9-7" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z"
        fill="#fff"/>
    </svg>
  );
}
function WhatsAppIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 3a9 9 0 0 0-7.7 13.7L3 21l4.4-1.2A9 9 0 1 0 12 3z"
        stroke="#fff" strokeWidth="2" fill="none" strokeLinejoin="round"/>
      <path d="M8.5 8.5c0 3.5 3.5 7 7 7l1.2-1.6-2.4-1.2-1 .8c-1.3-.5-2.3-1.5-2.8-2.8l.8-1L9.9 7.3 8.5 8.5z"
        fill="#fff"/>
    </svg>
  );
}
function MissedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A15 15 0 0 1 3 6a2 2 0 0 1 2-2z" fill="#fff"/>
      <line x1="15" y1="3" x2="22" y2="10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
      <line x1="22" y1="3" x2="15" y2="10" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

function ContractIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6 3h9l3 3v15H6z" fill="#fff" stroke="#fff" strokeWidth="1" strokeLinejoin="round"/>
      <path d="M9 11h7M9 14h5" stroke="oklch(48% 0.16 145)" strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="15" cy="18" r="3.5" fill="#fff" stroke="oklch(48% 0.16 145)" strokeWidth="1.2"/>
      <path d="M13.5 18l1 1 2-2" stroke="oklch(48% 0.16 145)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function ApprovedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" fill="#fff"/>
      <path d="M7 12.5l3 3 7-7" stroke="oklch(48% 0.16 145)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChannelBadge({ x, y, channel, scale = 1, opacity = 1 }) {
  const ch = CHANNELS[channel];
  const Icon = channel === 'email'    ? EmailIcon
            : channel === 'whatsapp' ? WhatsAppIcon
            : channel === 'missed'   ? MissedIcon
            : channel === 'contract' ? ContractIcon
            : channel === 'approved' ? ApprovedIcon
            : PhoneIcon;
  return (
    <div style={{
      position: 'absolute',
      left: x, top: y,
      transform: `translate(-50%, -50%) scale(${scale})`,
      opacity,
      pointerEvents: 'none',
      willChange: 'transform, opacity',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 18px 10px 14px',
        background: ch.bg,
        color: '#fff',
        borderRadius: 999,
        fontSize: 20, fontWeight: 600,
        boxShadow: '0 8px 22px rgba(20,18,15,0.22), 0 2px 6px rgba(20,18,15,0.12)',
        whiteSpace: 'nowrap',
        letterSpacing: '-0.005em',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>
        <Icon/>
        {ch.label}
      </div>
    </div>
  );
}

// ── Stress Aura around María ────────────────────────────────────────────────
function StressAura({ level }) {
  const t = useTime();
  if (level <= 0) return null;
  const pulse = 0.5 + 0.5 * Math.sin(t * 3.5);
  const rings = [0, 1, 2];
  return (
    <>
      {rings.map(i => {
        const phase = (t * 0.7 + i / 3) % 1;
        const size = 280 + phase * 220;
        const op = (1 - phase) * 0.32 * level;
        return (
          <div key={i} style={{
            position: 'absolute',
            left: PEOPLE.maria.x - size / 2,
            top:  PEOPLE.maria.y - size / 2,
            width: size, height: size,
            borderRadius: '50%',
            border: `${2 + level * 2}px solid oklch(60% ${0.10 + level * 0.10} 28)`,
            opacity: op,
            pointerEvents: 'none',
          }}/>
        );
      })}
      <div style={{
        position: 'absolute',
        left: PEOPLE.maria.x - 150,
        top:  PEOPLE.maria.y - 150,
        width: 300, height: 300,
        borderRadius: '50%',
        background: `radial-gradient(circle, oklch(65% 0.18 28 / ${0.10 * level * (0.7 + 0.3 * pulse)}) 0%, transparent 70%)`,
        pointerEvents: 'none',
      }}/>
    </>
  );
}

// ── Notification counter on María ───────────────────────────────────────────
function NotifBadge({ count }) {
  const t = useTime();
  if (count <= 0) return null;
  const size = 64 + Math.min(40, count * 4);
  const bounce = 1 + 0.08 * Math.sin(t * 6);
  return (
    <div style={{
      position: 'absolute',
      left: PEOPLE.maria.x + 70,
      top:  PEOPLE.maria.y - 130,
      width: size, height: size,
      borderRadius: '50%',
      background: 'oklch(58% 0.22 28)',
      color: '#fff',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 800,
      fontSize: 28 + Math.min(12, count * 1.2),
      fontFamily: 'Inter, system-ui, sans-serif',
      letterSpacing: '-0.02em',
      boxShadow: '0 6px 18px rgba(180, 60, 30, 0.35), 0 2px 4px rgba(0,0,0,0.1)',
      border: '4px solid #faf7f2',
      transform: `scale(${bounce})`,
      transformOrigin: 'center',
    }}>
      {count}
    </div>
  );
}

Object.assign(window, {
  Avatar, Arrow, ChannelBadge, StressAura, NotifBadge,
  EmailIcon, PhoneIcon, WhatsAppIcon, MissedIcon, ContractIcon, ApprovedIcon,
  OwnerSilhouette,
});
