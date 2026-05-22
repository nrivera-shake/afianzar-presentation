// scene-data.jsx — constants for the María/Pepe/Juan process animation

const STAGE_W = 1920;
const STAGE_H = 1080;

const PEOPLE = {
  maria: { id: 'maria', x: 960,  y: 540, img: window.__resources.maria, name: 'María', role: 'Real Estate Agent' },
  pepe:  { id: 'pepe',  x: 320,  y: 800, img: window.__resources.pepe,  name: 'Pepe',  role: 'Tenant' },
  juan:  { id: 'juan',  x: 1600, y: 800, img: window.__resources.juan,  name: 'Juan',  role: 'Afianzar Analyst' },
  owner: { id: 'owner', x: 1760, y: 200, img: null,                name: 'Property Owner', role: '' },
};

const CHANNELS = {
  email:    { bg: 'oklch(55% 0.18 255)', label: 'Email' },
  whatsapp: { bg: '#25D366',             label: 'WhatsApp' },
  phone:    { bg: 'oklch(58% 0.20 30)',  label: 'Call' },
  missed:   { bg: 'oklch(50% 0.22 25)',  label: 'No answer' },
  contract: { bg: 'oklch(48% 0.16 145)', label: 'Signed contract' },
  approved: { bg: 'oklch(48% 0.16 145)', label: 'Approval email' },
};

const DAYS = [
  { n: 1, label: 'Day 1', sub: 'Document Collection' },
  { n: 2, label: 'Day 2', sub: 'Chasing for status' },
  { n: 3, label: 'Day 3', sub: 'Resubmission of application' },
  { n: 4, label: 'Day 4', sub: 'Approval & Contract Signing' },
];

// Each step: arrows + day grouping
const STEPS = [
  // ─── DAY 1: document collection ─────────────────────────────────────────
  { n: 1, day: 1, arrows: [{ from:'maria', to:'pepe',  channel:'email' }],
    title: 'María emails Pepe',
    detail: 'requesting the documents she needs from him' },
  { n: 2, day: 1, arrows: [{ from:'pepe', to:'maria', channel:'email' }, { from:'pepe', to:'maria', channel:'whatsapp' }],
    title: 'Pepe sends multiple files',
    detail: 'over Email AND WhatsApp — at the same time' },
  { n: 3, day: 1, arrows: [{ from:'maria', to:'juan',  channel:'email' }],
    title: 'María emails Juan',
    detail: 'gathering everything Pepe sent into one message' },

  // ─── DAY 2: chasing for status ──────────────────────────────────────────
  { n: 4, day: 2, arrows: [{ from:'pepe', to:'maria', channel:'phone' }],
    title: 'Pepe calls María',
    detail: '"Any update on my application?"' },
  { n: 5, day: 2, arrows: [{ from:'maria', to:'juan', channel:'missed' }],
    title: 'María tries to call Juan',
    detail: 'no answer — she has no visibility into the process' },
  { n: 6, day: 2, arrows: [{ from:'juan', to:'maria', channel:'email' }],
    title: 'Juan emails María',
    detail: 'one document is missing from the package' },
  { n: 7, day: 3, arrows: [{ from:'maria', to:'pepe', channel:'phone' }],
    title: 'María calls Pepe',
    detail: 'asking for the missing document' },
  { n: 8, day: 3, arrows: [{ from:'pepe', to:'maria', channel:'email' }],
    title: 'Pepe emails the document',
    detail: 'finally — the missing piece' },
  { n: 9, day: 3, arrows: [{ from:'maria', to:'juan', channel:'email' }],
    title: 'María forwards it to Juan',
    detail: 'resubmitting the complete application' },

  // ─── DAY 3: the cycle drags on, then approval comes through ─────────────
  { n: 10, day: 3, repeat: true,
    arrows: [
      { from:'pepe',  to:'maria', channel:'phone' },
      { from:'maria', to:'juan',  channel:'missed' },
    ],
    title: 'Pepe calls again, María still can\u2019t reach Juan',
    detail: 'the chase continues — phone tag, no answers, no updates to share' },
  { n: 11, day: 3, arrows: [{ from:'juan', to:'maria', channel:'approved' }],
    title: 'Juan emails María: APPROVED \u2713',
    detail: 'Pepe has been approved' },
  { n: 12, day: 4, arrows: [{ from:'maria', to:'pepe', channel:'phone' }],
    title: 'María calls Pepe',
    detail: 'sharing the good news' },
  { n: 13, day: 4, arrows: [{ from:'maria', to:'pepe', channel:'email' }],
    title: 'María emails Pepe the contracts',
    detail: 'ready for signature' },

  // ─── DAY 4: signing and activation ──────────────────────────────────────
  { n: 14, day: 4, arrows: [{ from:'pepe', to:'maria', channel:'contract' }],
    title: 'Pepe sends the signed contract',
    detail: '' },
  { n: 15, day: 4, arrows: [{ from:'maria', to:'juan', channel:'contract' }],
    title: 'María forwards the signed contract',
    detail: 'sending it on to Juan' },
  { n: 16, day: 4, arrows: [{ from:'juan', to:'maria', channel:'contract' }],
    title: 'Juan sends the contract back',
    detail: 'fully countersigned' },
  { n: 17, day: 4, celebrate: true,
    arrows: [{ from:'maria', to:'owner', channel:'contract' }],
    title: 'Policy activated',
    detail: 'María finally sends the contract to the property owner' },
];

const STEP_DUR = 4.0;
const FINALE_DUR = 5.5;
const OUTRO_DUR = 6.0;

const STEP_TIMES = (() => {
  let t = 0;
  return STEPS.map(s => {
    const start = t;
    const dur = s.celebrate ? FINALE_DUR : STEP_DUR;
    t += dur;
    return { start, end: t, dur };
  });
})();
const TOTAL_DUR = STEP_TIMES[STEP_TIMES.length - 1].end + OUTRO_DUR;

Object.assign(window, {
  STAGE_W, STAGE_H, PEOPLE, CHANNELS, DAYS, STEPS,
  STEP_DUR, FINALE_DUR, OUTRO_DUR, STEP_TIMES, TOTAL_DUR,
});
