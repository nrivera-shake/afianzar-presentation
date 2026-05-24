// Icon set — stroked, 1.6px, 24x24 viewBox. Single source of truth.

const Icon = ({ d, fill = 'none', stroke = 'currentColor', size = 20, sw = 1.6, children, vb = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={vb} fill={fill} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round">
    {d ? <path d={d} /> : children}
  </svg>
);

const IcHome = (p) => <Icon {...p}><path d="M3 11l9-7 9 7v9a2 2 0 01-2 2h-4v-7h-6v7H5a2 2 0 01-2-2v-9z"/></Icon>;
const IcPlus = (p) => <Icon {...p}><path d="M12 5v14M5 12h14"/></Icon>;
const IcBell = (p) => <Icon {...p}><path d="M6 8a6 6 0 0112 0c0 7 3 9 3 9H3s3-2 3-9z"/><path d="M10 21a2 2 0 004 0"/></Icon>;
const IcUser = (p) => <Icon {...p}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0116 0"/></Icon>;
const IcArrowRight = (p) => <Icon {...p}><path d="M5 12h14M13 6l6 6-6 6"/></Icon>;
const IcArrowLeft = (p) => <Icon {...p}><path d="M19 12H5M11 6l-6 6 6 6"/></Icon>;
const IcCheck = (p) => <Icon {...p}><path d="M5 13l4 4L19 7"/></Icon>;
const IcWarn = (p) => <Icon {...p}><path d="M12 9v4M12 17h.01"/><path d="M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/></Icon>;
const IcUpload = (p) => <Icon {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12"/></Icon>;
const IcDoc = (p) => <Icon {...p}><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></Icon>;
const IcBriefcase = (p) => <Icon {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></Icon>;
const IcFreelance = (p) => <Icon {...p}><path d="M12 2L4 7v5c0 5 3.5 9 8 10 4.5-1 8-5 8-10V7l-8-5z"/><path d="M9 12l2 2 4-4"/></Icon>;
const IcSelfemp = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IcBuilding = (p) => <Icon {...p}><path d="M3 21V8l9-5 9 5v13"/><path d="M9 21V12h6v9M3 21h18"/></Icon>;
const IcCalendar = (p) => <Icon {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></Icon>;
const IcClock = (p) => <Icon {...p}><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></Icon>;
const IcMessage = (p) => <Icon {...p}><path d="M21 11a8 8 0 11-3-6L21 4l-1 5a8 8 0 011 2z"/></Icon>;
const IcChevDown = (p) => <Icon {...p}><path d="M6 9l6 6 6-6"/></Icon>;
const IcChevRight = (p) => <Icon {...p}><path d="M9 6l6 6-6 6"/></Icon>;
const IcDownload = (p) => <Icon {...p}><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></Icon>;
const IcSearch = (p) => <Icon {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></Icon>;
const IcSparkle = (p) => <Icon {...p}><path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5z"/></Icon>;
const IcRefresh = (p) => <Icon {...p}><path d="M21 12a9 9 0 11-3-6.7M21 4v5h-5"/></Icon>;
const IcShield = (p) => <Icon {...p}><path d="M12 2l8 4v6c0 5-3.5 9-8 10-4.5-1-8-5-8-10V6l8-4z"/></Icon>;

Object.assign(window, {
  IcHome, IcPlus, IcBell, IcUser, IcArrowRight, IcArrowLeft, IcCheck, IcWarn,
  IcUpload, IcDoc, IcBriefcase, IcFreelance, IcSelfemp, IcBuilding,
  IcCalendar, IcClock, IcMessage, IcChevDown, IcChevRight, IcDownload,
  IcSearch, IcSparkle, IcRefresh, IcShield,
});
