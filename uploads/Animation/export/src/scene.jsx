// scene.jsx — main composition

// ── Helpers ─────────────────────────────────────────────────────────────────
function midpoint(fromPerson, toPerson, perpOffset = 0) {
  const dx = toPerson.x - fromPerson.x, dy = toPerson.y - fromPerson.y;
  const len = Math.hypot(dx, dy);
  const nx = dx / len, ny = dy / len;
  const px = -ny, py = nx;
  return {
    x: (fromPerson.x + toPerson.x) / 2 + px * perpOffset,
    y: (fromPerson.y + toPerson.y) / 2 + py * perpOffset,
  };
}

function avatarPad(personId) {
  return personId === 'owner' ? 80 : 140;
}

// ── Precompute lane offsets so no two arrows overlap ────────────────────────
// All arrows on a lane (undirected: maria↔pepe) share a single perpendicular
// fan. Reverse-direction arrows flip the perpOffset sign so they end up on
// the same physical side as expected.
const ARROW_OFFSETS = (() => {
  const lanes = new Map(); // sortedKey -> { canonical, arrows: [...] }
  STEPS.forEach((s, si) => {
    s.arrows.forEach((a, ai) => {
      const pair = [a.from, a.to].sort();
      const key = pair.join('|');
      if (!lanes.has(key)) lanes.set(key, { canonical: pair[0], arrows: [] });
      lanes.get(key).arrows.push({ si, ai, from: a.from, to: a.to });
    });
  });
  const map = new Map();
  const SPACING = 16;
  for (const [, lane] of lanes) {
    const n = lane.arrows.length;
    lane.arrows.forEach((ref, idx) => {
      const slot = idx - (n - 1) / 2;
      // physical perpendicular is reversed when going against canonical, so
      // flip sign to keep all arrows in the same physical fan.
      const sign = (ref.from === lane.canonical) ? 1 : -1;
      map.set(`${ref.si}:${ref.ai}`, sign * slot * SPACING);
    });
  }
  return map;
})();

function getOffset(si, ai) {
  return ARROW_OFFSETS.get(`${si}:${ai}`) ?? 0;
}

// ── Day Progress Bar ────────────────────────────────────────────────────────
function DayProgressBar({ stepIdx, isOutro }) {
  const dayRanges = DAYS.map(d => {
    const steps = STEPS.map((s, i) => ({ s, i })).filter(x => x.s.day === d.n);
    return { day: d, firstIdx: steps[0].i, lastIdx: steps[steps.length - 1].i, count: steps.length };
  });
  const curDay = isOutro ? DAYS.length : (STEPS[stepIdx] ? STEPS[stepIdx].day : 1);

  return (
    <div style={{
      position: 'absolute',
      left: 160, right: 160, top: 60,
      fontFamily: 'Inter, system-ui, sans-serif',
      pointerEvents: 'none',
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${DAYS.length}, 1fr)`,
        gap: 14, marginBottom: 12,
      }}>
        {dayRanges.map((dr, i) => {
          const isPast    = curDay > dr.day.n;
          const isCurrent = curDay === dr.day.n;
          return (
            <div key={i} style={{
              display: 'flex', alignItems: 'baseline', gap: 12,
              opacity: isPast || isCurrent ? 1 : 0.35,
              transition: 'opacity 400ms',
            }}>
              <div style={{
                fontFamily: 'JetBrains Mono, ui-monospace, monospace',
                fontSize: 16, fontWeight: 600, letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: isCurrent ? 'oklch(55% 0.18 28)' : '#5a5249',
              }}>{dr.day.label}</div>
              <div style={{ fontSize: 16, color: '#7a7064', letterSpacing: '-0.005em' }}>{dr.day.sub}</div>
            </div>
          );
        })}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${DAYS.length}, 1fr)`,
        gap: 14, height: 8,
      }}>
        {dayRanges.map((dr, i) => {
          let fill;
          if (isOutro) fill = 1;
          else if (curDay > dr.day.n) fill = 1;
          else if (curDay < dr.day.n) fill = 0;
          else {
            const within = (stepIdx - dr.firstIdx + 1) / dr.count;
            fill = clamp(within, 0, 1);
          }
          return (
            <div key={i} style={{
              position: 'relative', borderRadius: 4,
              background: 'rgba(26,23,20,0.08)', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                width: `${fill * 100}%`,
                background: curDay === dr.day.n ? 'oklch(55% 0.18 28)' : '#1a1714',
                borderRadius: 4,
                transition: 'width 600ms ease-out',
              }}/>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Arrows Layer ────────────────────────────────────────────────────────────
// Renders every arrow from step 0 up to the current step. The current step's
// arrow is colored + animated drawing; past arrows are gray, full-length.
// Color & width tween smoothly so transitioning between steps doesn't pop.
const TRAIL_COLOR = 'oklch(72% 0.012 80)';

function ArrowsLayer({ currentStepIdx, currentLocalT, isOutro }) {
  const arrowProg = isOutro ? 1 : clamp((currentLocalT - 0.15) / 0.7, 0, 1);
  const lastIdx = isOutro ? STEPS.length - 1 : currentStepIdx;

  return (
    <>
      {STEPS.slice(0, lastIdx + 1).map((step, si) =>
        step.arrows.map((arr, ai) => {
          const isCurrent = !isOutro && si === currentStepIdx;
          const color = isCurrent ? CHANNELS[arr.channel].bg : TRAIL_COLOR;
          const width = isCurrent ? 6 : 3;
          const prog  = isCurrent ? arrowProg : 1;
          return (
            <Arrow key={`${si}-${ai}`}
              from={PEOPLE[arr.from]} to={PEOPLE[arr.to]}
              color={color}
              perpOffset={getOffset(si, ai)}
              progress={prog}
              dashed={arr.channel === 'missed'}
              width={width}
              padFrom={avatarPad(arr.from)}
              padTo={avatarPad(arr.to)}
              smoothColor={true}
            />
          );
        })
      )}
    </>
  );
}

// ── Step Scene (header + badge only — arrows live in ArrowsLayer) ───────────
function StepScene({ step, stepIdx }) {
  const { localTime, duration } = useSprite();

  const fadeIn  = clamp(localTime / 0.25, 0, 1);
  const fadeOut = clamp((duration - 0.20 - localTime) / 0.20, 0, 1);
  const overall = Math.min(fadeIn, fadeOut);

  const badgePop  = clamp((localTime - 0.65) / 0.3, 0, 1);
  const badgeFade = clamp((duration - 0.3 - localTime) / 0.3, 0, 1);
  const badgeOpacity = Math.min(badgePop, badgeFade);
  const badgeScale = Easing.easeOutBack(badgePop);

  return (
    <div style={{ opacity: overall }}>
      {/* Header */}
      <div style={{
        position: 'absolute',
        left: 0, right: 0, top: 180,
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center',
        transform: `translateY(${(1 - fadeIn) * 14}px)`,
        fontFamily: 'Inter, system-ui, sans-serif',
        padding: '0 120px',
      }}>
        <div style={{
          fontSize: 54, fontWeight: 700, color: '#1a1714',
          letterSpacing: '-0.025em', lineHeight: 1.05,
          maxWidth: 1500, textWrap: 'balance',
        }}>
          {step.title}
        </div>
        {step.detail && (
          <div style={{
            marginTop: 14, fontSize: 26, color: '#5a5249',
            maxWidth: 1100, lineHeight: 1.3, textWrap: 'balance',
          }}>
            {step.detail}
          </div>
        )}
      </div>

      {/* Channel badges — at midpoint of each current arrow */}
      {step.arrows.map((arr, i) => {
        const a = PEOPLE[arr.from], b = PEOPLE[arr.to];
        const off = getOffset(stepIdx, i);
        const mid = midpoint(a, b, off);
        const sameRoute = step.arrows.length > 1
          && step.arrows.every(x => x.from === step.arrows[0].from && x.to === step.arrows[0].to);
        const dx = b.x - a.x, dy = b.y - a.y;
        const L = Math.hypot(dx, dy);
        const along = sameRoute ? (i - (step.arrows.length - 1) / 2) * 110 : 0;
        return (
          <ChannelBadge key={i}
            x={mid.x + (dx / L) * along}
            y={mid.y + (dy / L) * along}
            channel={arr.channel}
            scale={badgeScale}
            opacity={badgeOpacity}
          />
        );
      })}
    </div>
  );
}

// ── Celebration & finale ────────────────────────────────────────────────────
function CelebrationRays({ level }) {
  const t = useTime();
  if (level <= 0) return null;
  const rays = 14;
  return (
    <svg style={{
      position: 'absolute',
      left: PEOPLE.maria.x - 400, top: PEOPLE.maria.y - 400,
      width: 800, height: 800, pointerEvents: 'none', overflow: 'visible',
    }}>
      {Array.from({length: rays}).map((_, i) => {
        const ang = (i / rays) * Math.PI * 2 + t * 0.4;
        const len = 280 + 30 * Math.sin(t * 2 + i);
        const x = 400 + Math.cos(ang) * len;
        const y = 400 + Math.sin(ang) * len;
        return (
          <line key={i}
            x1={400} y1={400} x2={x} y2={y}
            stroke="oklch(60% 0.16 145)"
            strokeWidth={3}
            opacity={0.18 * level}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

function PolicyStamp({ progress }) {
  if (progress <= 0) return null;
  const p = Easing.easeOutBack(clamp(progress, 0, 1));
  const opacity = clamp(progress * 2, 0, 1);
  return (
    <div style={{
      position: 'absolute',
      left: PEOPLE.maria.x, top: PEOPLE.maria.y + 260,
      transform: `translate(-50%, 0) scale(${0.6 + 0.4 * p}) rotate(${-4 + 4 * (1 - p)}deg)`,
      transformOrigin: 'center',
      opacity, pointerEvents: 'none',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 14,
        padding: '16px 30px',
        background: 'oklch(48% 0.16 145)',
        color: '#fff',
        borderRadius: 14,
        fontSize: 38, fontWeight: 800,
        letterSpacing: '0.04em', textTransform: 'uppercase',
        fontFamily: 'Inter, system-ui, sans-serif',
        boxShadow: '0 14px 36px rgba(30, 80, 50, 0.30), 0 4px 10px rgba(0,0,0,0.10)',
        border: '3px solid #fff',
        whiteSpace: 'nowrap',
      }}>
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="2"/>
          <path d="M7 12.5l3 3 7-7" stroke="#fff" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Policy Activated
      </div>
    </div>
  );
}

// ── Outro (2 frames) ────────────────────────────────────────────────────────
function Outro() {
  const { localTime, duration } = useSprite();

  // Solid scrim covers the canvas for the entire outro
  const scrimIn  = clamp(localTime / 0.4, 0, 1);
  const scrimOut = clamp((duration - 0.4 - localTime) / 0.4, 0, 1);
  const scrimOp  = Math.min(scrimIn, scrimOut);

  // Two parts, split evenly
  const half = duration / 2;
  const inT1  = clamp(localTime / 0.55, 0, 1);
  const outT1 = clamp((half - 0.35 - localTime) / 0.35, 0, 1);
  const op1 = Math.max(0, Math.min(Easing.easeOutCubic(inT1), outT1));

  const localT2 = localTime - half;
  const inT2  = clamp(localT2 / 0.55, 0, 1);
  const outT2 = clamp((half - 0.35 - localT2) / 0.35, 0, 1);
  const op2 = Math.max(0, Math.min(Easing.easeOutCubic(inT2), outT2));

  const centerStyle = {
    position: 'absolute', inset: 0,
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    textAlign: 'center',
    fontFamily: 'Inter, system-ui, sans-serif',
    padding: '0 120px',
    pointerEvents: 'none',
  };

  return (
    <>
      {/* Solid scrim — fully covers everything beneath */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, #fdfaf4 0%, #f3eee5 100%)',
        opacity: scrimOp,
        pointerEvents: 'none',
      }}/>

      {/* Frame 1 — the takeaway */}
      <div style={{
        ...centerStyle,
        opacity: op1,
        transform: `translateY(${(1 - inT1) * 18}px)`,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 18, fontWeight: 500,
          color: 'oklch(55% 0.18 28)', letterSpacing: '0.20em',
          textTransform: 'uppercase', marginBottom: 28,
        }}>
          The bottom line
        </div>
        <div style={{
          fontSize: 76, fontWeight: 700,
          color: '#1a1714', letterSpacing: '-0.03em', lineHeight: 1.05,
          maxWidth: 1500, textWrap: 'balance',
        }}>
          Every conversation passed through&nbsp;María.
        </div>
      </div>

      {/* Frame 2 — the count */}
      <div style={{
        ...centerStyle,
        opacity: op2,
        transform: `translateY(${(1 - inT2) * 18}px)`,
      }}>
        <div style={{
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: 18, fontWeight: 500,
          color: 'oklch(55% 0.18 28)', letterSpacing: '0.20em',
          textTransform: 'uppercase', marginBottom: 28,
        }}>
          The cost
        </div>
        <div style={{
          fontSize: 72, fontWeight: 700,
          color: '#1a1714', letterSpacing: '-0.03em', lineHeight: 1.1,
          maxWidth: 1500, textWrap: 'balance',
        }}>
          4 days.&nbsp; 17 handoffs.&nbsp; 4 channels.<br/>
          <span style={{ color: 'oklch(48% 0.16 28)' }}>One exhausted María.</span>
        </div>
      </div>
    </>
  );
}

// ── Background ──────────────────────────────────────────────────────────────
function Background() {
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'radial-gradient(ellipse at 50% 30%, #fdfaf4 0%, #f3eee5 100%)',
    }}/>
  );
}

// ── Stress curve ────────────────────────────────────────────────────────────
function stressLevel(stepIdx) {
  const peak = 9;
  if (stepIdx <= peak) return clamp(stepIdx / peak, 0, 1);
  const tail = STEPS.length - 1 - peak;
  const t = (stepIdx - peak) / tail;
  return clamp(1 - 0.85 * Easing.easeInOutCubic(t), 0, 1);
}

function getStepAt(time) {
  for (let i = 0; i < STEP_TIMES.length; i++) {
    if (time < STEP_TIMES[i].end) return { idx: i, start: STEP_TIMES[i].start, dur: STEP_TIMES[i].dur };
  }
  const last = STEP_TIMES.length - 1;
  return { idx: last, start: STEP_TIMES[last].start, dur: STEP_TIMES[last].dur };
}

// ── Main Scene ──────────────────────────────────────────────────────────────
function Scene() {
  const t = useTime();
  const stepsEnd = STEP_TIMES[STEP_TIMES.length - 1].end;
  const isOutro = t >= stepsEnd;
  const cur = getStepAt(Math.min(t, stepsEnd - 0.001));
  const stress = isOutro ? 0 : stressLevel(cur.idx);

  const step = STEPS[cur.idx];
  const localT = t - cur.start;
  const showHighlight = !isOutro && localT >= 0.15 && localT < cur.dur - 0.2;
  const senderId   = showHighlight ? step.arrows[0].from : null;
  const receiverId = showHighlight ? step.arrows[0].to   : null;
  const isCelebrating = !isOutro && step.celebrate;
  const celebrateProgress = isCelebrating
    ? clamp((localT - 1.0) / 0.5, 0, 1) * clamp((cur.dur - 0.3 - localT) / 0.3, 0, 1)
    : 0;
  const ownerVisible = isCelebrating && localT > 0.25;

  return (
    <>
      <Background/>
      {!isOutro && <DayProgressBar stepIdx={cur.idx} isOutro={isOutro}/>}
      <StressAura level={stress}/>
      {isCelebrating && <CelebrationRays level={celebrateProgress}/>}

      {/* All arrows (current colored, past gray) — under avatars */}
      <ArrowsLayer
        currentStepIdx={cur.idx}
        currentLocalT={localT}
        isOutro={isOutro}
      />

      {/* Three core avatars */}
      {['pepe', 'maria', 'juan'].map(id => (
        <Avatar key={id} person={PEOPLE[id]}
          stressLevel={id === 'maria' ? stress : 0}
          highlight={id === senderId ? 'send' : id === receiverId ? 'receive' : null}
          labelPosition={id === 'maria' ? 'above' : 'below'}
        />
      ))}

      {/* Owner cameo for finale */}
      {ownerVisible && (
        <div style={{ opacity: clamp((localT - 0.25) / 0.3, 0, 1) }}>
          <Avatar person={PEOPLE.owner}
            stressLevel={0}
            highlight={receiverId === 'owner' ? 'receive' : null}
            scale={0.55}
          />
        </div>
      )}

      {/* Per-step content (badge + header) */}
      {STEPS.map((step, i) => (
        <Sprite key={i} start={STEP_TIMES[i].start} end={STEP_TIMES[i].end}>
          <StepScene step={step} stepIdx={i}/>
        </Sprite>
      ))}

      {/* Outro */}
      <Sprite start={stepsEnd} end={TOTAL_DUR}>
        <Outro/>
      </Sprite>

      {isCelebrating && <PolicyStamp progress={celebrateProgress}/>}
      {!isOutro && <NotifBadge count={Math.min(STEPS.length, cur.idx + 1)}/>}
    </>
  );
}

Object.assign(window, { Scene, midpoint, stressLevel, ARROW_OFFSETS });
