/* ==========================================================================
   YUJ STUDIO — MARKETING INTELLIGENCE OS / 01
   Unified Frontend Architecture, Offline Demo Adapter & Live Gateway Client
   ========================================================================== */
'use strict';

// --------------------------------------------------------------------------
// 1. DOM SELECTOR & ICON REGISTRY
// --------------------------------------------------------------------------
const $ = id => document.getElementById(id);

const icons = {
  overview: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/>',
  grid: '<rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 9h18M9 9v12M15 9v12"/>',
  sparkles: '<path d="m12 3 1.8 6.2L20 11l-6.2 1.8L12 19l-1.8-6.2L4 11l6.2-1.8L12 3Z"/><path d="m19 18 .8 1.2L21 20l-1.2.8L19 22l-.8-1.2L17 20l1.2-.8L19 18ZM4 2l.7 1.3L6 4l-1.3.7L4 6l-.7-1.3L2 4l1.3-.7L4 2Z"/>',
  check: '<path d="m5 12 4 4L19 6"/><rect x="2.5" y="2.5" width="19" height="19" rx="5"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2.5"/><path d="M7 3v4m10-4v4M3 10h18"/>',
  chart: '<path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/><path d="M2 21h20"/>',
  activity: '<path d="M2 12h4l3-7 5 14 3-7h5"/>',
  sliders: '<path d="M4 7h16M4 17h16M9 3v8m6 2v8"/><circle cx="9" cy="7" r="2" fill="none"/><circle cx="15" cy="17" r="2" fill="none"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
  bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z"/><path d="M10 21h4"/>',
  logout: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>',
  menu: '<path d="M3 6h18M3 12h18M3 18h18"/>',
  close: '<path d="M5 5 19 19M19 5 5 19"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M4 12h16M14 6l6 6-6 6"/>',
  arrowUp: '<path d="M5 19 19 5M8 5h11v11"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 16-5-5L5 21"/>',
  video: '<rect x="2.5" y="5" width="14" height="14" rx="2"/><path d="m17 10 5-3v10l-5-3"/>',
  pause: '<path d="M8 4v16M16 4v16"/>',
  play: '<path d="m7 4 13 8L7 20V4Z"/>',
  shield: '<path d="m12 2 8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6l8-4Z"/><path d="m9 12 2 2 4-4"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
  send: '<path d="m22 2-8 20-4-8-8-4 20-8Z"/><path d="M22 2 10 14"/>',
  network: '<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-4h14v4"/>',
  alert: '<path d="M12 3 2 21h20L12 3Z"/><path d="M12 9v5M12 17h.01"/>',
  refresh: '<path d="M21 12a9 9 0 1 1-3-7M21 3v6h-6"/>',
  filter: '<path d="M3 5h18l-7 8v5l-4 2v-7L3 5Z"/>',
  users: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2H3ZM17 11a3 3 0 0 0 0-6M17 14a5 5 0 0 1 4 5v1"/>',
  lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>',
  link: '<path d="M10 13a5 5 0 0 0 7 .2l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7-.2l-2 2a5 5 0 0 0 7 7l1-1"/>',
  upload: '<path d="M12 16V3m-5 5 5-5 5 5"/><path d="M4 16v4h16v-4"/>',
  eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/>',
  edit: '<path d="m16 4 4 4-11 11-5 1 1-5L16 4Z"/><path d="M14 6l4 4"/>',
  circleCheck: '<circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/>',
  trend: '<path d="M3 17 9 11l4 4 8-9"/><path d="M15 6h6v6"/>',
  back: '<path d="m14 5-7 7 7 7M7 12h14"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  chevronLeft: '<path d="m15 18-6-6 6-6"/>',
  zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  heart: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
  message: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  bookmark: '<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>',
  share: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>',
  instagram: '<rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>',
  facebook: '<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>',
  linkedin: '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>',
  calendarView: '<rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/>',
  listView: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  external: '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  tiktok: '<path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>',
  youtube: '<path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><polygon points="10 15 15 12 10 9 10 15"/>',
  twitter: '<path d="M4 4l11.733 16h4.267l-11.733-16zM4 20l6.768-6.768M20 4l-6.768 6.768"/>',
  dollar: '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  gavel: '<path d="m14 13-7.5 7.5a2.12 2.12 0 1 1-3-3L11 10"/><path d="m16 16 6-6"/><path d="m8 8 6-6"/><path d="m9 7 8 8"/><path d="m21 11-8-8"/>',
  briefcase: '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  megaphone: '<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  layers: '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  trendingUp: '<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>'
};

function icon(name) {
  return `<i data-icon="${name}" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.info}</svg></i>`;
}

function hydrateIcons(root = document) {
  root.querySelectorAll('i[data-icon]').forEach(el => {
    if (!el.querySelector('svg')) {
      el.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">${icons[el.dataset.icon] || icons.info}</svg>`;
    }
  });
}

// --------------------------------------------------------------------------
// 2. HELPER UTILITIES & FORMATTERS
// --------------------------------------------------------------------------
const e = v => String(v ?? '').replace(/[&<>"']/g, s => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[s]));

const trunc = (v, n = 76) => {
  const str = String(v || '');
  return str.length > n ? str.slice(0, n - 1) + '…' : str;
};

const formatNumber = n => (typeof n === 'number' && Number.isFinite(n)) ? Intl.NumberFormat('en-IN').format(n) : '—';

const dateLabel = (v, opts) => v ? new Date(v).toLocaleDateString('en-IN', opts || { day: 'numeric', month: 'short', year: 'numeric' }) : 'Not set';

const timeLabel = v => v ? new Date(v).toLocaleString('en-IN', {
  day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata'
}) : 'Unscheduled';

const timeAgo = (v) => {
  if (!v) return 'Recent';
  const diff = Math.max(0, Date.now() - new Date(v).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const localISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const startWeek = d => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7));
  return x;
};

const addDays = (d, n) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const dt = (days, hour = 11) => {
  const d = addDays(new Date(), days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};

const rid = prefix => `${prefix}-${crypto.randomUUID().slice(0, 12)}`;

// --------------------------------------------------------------------------
// 3. APPLICATION STATE & ENVIRONMENT
// --------------------------------------------------------------------------
const env = {
  mode: 'demo',
  socialConfigured: false,
  rendererConfigured: false
};

const state = {
  page: 'overview',
  pulsePeriod: '30', // '7' | '30' | '90'
  pulseHoverIndex: null,
  pulseLoading: false,
  pulseError: null,
  perfPeriod: '30', // '7' | '30' | '90'
  perfPlatform: 'all', // 'all' | 'instagram' | 'facebook' | 'linkedin' | 'tiktok' | 'youtube'
  perfCampaign: '', // campaign id or '' for all
  perfLoading: false,
  perfError: null,
  perfHoverIndex: null,
  theme: 'dark',
  sidebarCollapsed: false,
  busy: false,
  loading: false,
  data: null,
  accounts: [],
  campaigns: [],
  plans: [],
  content: [],
  jobs: [],
  production: [],
  ops: {},
  insights: {},
  renderer: {},
  media: new Map(),
  selectedCampaign: '',
  campaignsViewMode: 'grid', // 'grid' | 'list'
  brandFilter: 'all',
  campaignStatusFilter: 'all',
  reviewTab: 'draft',
  calendarStart: startWeek(new Date()),
  calendarViewMode: 'month', // 'month' | 'week'
  calendarMonth: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  calendarSelectedDate: new Date(),
  calendarPlatformFilter: 'all', // 'all' | 'instagram' | 'facebook' | 'linkedin'
  calendarStatusFilter: 'all', // 'all' | 'scheduled' | 'published' | 'held' | 'failed'
  analyticsMetricTab: 'reach', // 'reach' | 'views' | 'engagement' | 'saves_shares'
  analyticsPlatformFilter: 'all', // 'all' | 'instagram' | 'facebook' | 'linkedin'
  analyticsPeriodDays: 30, // 7 | 14 | 30 | 90
  analyticsSearchQuery: '',
  analyticsSortCol: 'reach', // 'reach' | 'views' | 'likes' | 'comments' | 'saved' | 'shares'
  analyticsSortDir: 'desc',
  search: '',
  user: 'Workspace Admin',
  csrf: '',
  alertCount: 0,
  plannerBrand: '',
  plannerPlatform: 'instagram',
  plannerTopics: '',
  plannerWeek: '',
  creativeZoom: 100,
  creativeActiveSlot: null,
  analyticsMetricFilter: 'all', // 'all' | 'reach' | 'views'
  analyticsPeriod: '30', // '30' | '60' | '90'
  creativeFacts: [
    'Saturday life-education sessions are open to all community children.',
    'Focus on critical inquiry, collaborative problem solving, and confidence building.'
  ]
};

let popupReturnFocus = null;

// --------------------------------------------------------------------------
// 4. OFFLINE DEMO REPOSITORY (ILLUSTRATIVE SEEDED DATA)
// --------------------------------------------------------------------------
const DEMO_KEY = 'yuj.marketing.frontend.demo.v2';

function freshDemo() {
  const foundation = 'yuj-foundation', crack = 'yuj-greenbuild', world = 'yuj-world';
  
  const campaign1 = {
    id: 'life-education-oct',
    name: 'Life Education · Everyday Growth',
    objective: 'awareness',
    status: 'active',
    brands: [foundation],
    created_by: 'YUJ Team',
    version: 1,
    created_at: dt(-15)
  };
  
  const campaign2 = {
    id: 'crack-filler-launch',
    name: 'YUJ Crack Filler · Product Stories',
    objective: 'sales',
    status: 'active',
    brands: [crack, world],
    created_by: 'YUJ Team',
    version: 1,
    created_at: dt(-8)
  };
  
  const campaign3 = {
    id: 'community-commerce',
    name: 'Community Commerce · Retail Connect',
    objective: 'trust',
    status: 'draft',
    brands: [world],
    created_by: 'YUJ Team',
    version: 1,
    created_at: dt(-2)
  };

  const accountList = [
    { id: 'ig-foundation-demo', brand: foundation, platform: 'instagram', label: 'YUJ Foundation · Instagram', ready: true },
    { id: 'fb-foundation-demo', brand: foundation, platform: 'facebook', label: 'YUJ Foundation · Facebook', ready: true },
    { id: 'li-foundation-demo', brand: foundation, platform: 'linkedin', label: 'YUJ Foundation · LinkedIn', ready: true },
    { id: 'fb-greenbuild-demo', brand: crack, platform: 'facebook', label: 'YUJ GreenBuild · Facebook', ready: true },
    { id: 'ig-greenbuild-demo', brand: crack, platform: 'instagram', label: 'YUJ GreenBuild · Instagram', ready: true },
    { id: 'li-world-demo', brand: world, platform: 'linkedin', label: 'YUJ World · LinkedIn', ready: true },
    { id: 'ig-world-demo', brand: world, platform: 'instagram', label: 'YUJ World · Instagram', ready: true }
  ];

  const content = [
    {
      id: 'draft-education',
      brand: foundation,
      campaign_id: campaign1.id,
      caption: 'How our Saturday Programme works — learn together, ask questions and explore life education with real practical guidance.',
      media_id: 'sample',
      status: 'draft',
      content_type: 'image',
      created_at: dt(-1),
      language: 'en',
      alt_text: 'Illustrated YUJ Foundation learning programme poster showcasing children in active dialogue.',
      preview_url: 'assets/engine15-sample.png'
    },
    {
      id: 'draft-product',
      brand: crack,
      campaign_id: campaign2.id,
      caption: 'When a wall crack needs attention, start by understanding the right repair process before choosing your materials.',
      media_id: 'mock-2',
      status: 'draft',
      content_type: 'image',
      created_at: dt(-2),
      language: 'en'
    },
    {
      id: 'approved-product',
      brand: crack,
      campaign_id: campaign2.id,
      caption: 'YUJ Crack Filler — 3 critical questions every homeowner should ask before beginning exterior wall repairs.',
      media_id: 'mock-3',
      status: 'approved',
      content_type: 'image',
      created_at: dt(-4),
      language: 'en',
      approved_at: dt(-3),
      approved_by: 'YUJ Team'
    },
    {
      id: 'approved-education',
      brand: foundation,
      campaign_id: campaign1.id,
      caption: 'Education is not limited to classrooms. Every everyday interaction is a chance to cultivate curiosity.',
      media_id: 'mock-1',
      status: 'approved',
      content_type: 'image',
      created_at: dt(-6),
      language: 'en',
      approved_at: dt(-5),
      approved_by: 'YUJ Team'
    },
    {
      id: 'content-li-impact',
      brand: world,
      campaign_id: campaign3.id,
      caption: 'Building resilient infrastructure requires verifiable craftsmanship and community accountability.',
      media_id: 'mock-4',
      status: 'approved',
      content_type: 'image',
      created_at: dt(-9),
      language: 'en',
      approved_at: dt(-8),
      approved_by: 'YUJ Team'
    },
    {
      id: 'content-curiosity',
      brand: foundation,
      campaign_id: campaign1.id,
      caption: 'Why everyday curiosity shapes children’s problem solving more than rote memorization.',
      media_id: 'mock-1',
      status: 'approved',
      content_type: 'image',
      created_at: dt(-5),
      language: 'en',
      approved_at: dt(-4),
      approved_by: 'YUJ Team'
    },
    {
      id: 'content-parent-workshop',
      brand: foundation,
      campaign_id: campaign1.id,
      caption: 'Parent workshop recap: 5 conversations to have with your middle schooler this week.',
      media_id: 'mock-1',
      status: 'approved',
      content_type: 'image',
      created_at: dt(-3),
      language: 'en',
      approved_at: dt(-2),
      approved_by: 'YUJ Team'
    }
  ];

  const jobs = [
    {
      id: 'post-1',
      content_id: 'approved-education',
      campaign_id: campaign1.id,
      account_id: 'ig-foundation-demo',
      platform: 'instagram',
      snapshot_type: 'image',
      status: 'published',
      run_at: dt(-14, 10),
      created_at: dt(-16),
      published_at: dt(-14, 10),
      remote_post_id: 'META-IG-20261017-01'
    },
    {
      id: 'post-2',
      content_id: 'approved-product',
      campaign_id: campaign2.id,
      account_id: 'fb-greenbuild-demo',
      platform: 'facebook',
      snapshot_type: 'image',
      status: 'published',
      run_at: dt(-10, 15),
      created_at: dt(-12),
      published_at: dt(-10, 15),
      remote_post_id: 'META-FB-20261021-02'
    },
    {
      id: 'post-3',
      content_id: 'content-li-impact',
      campaign_id: campaign3.id,
      account_id: 'li-world-demo',
      platform: 'linkedin',
      snapshot_type: 'image',
      status: 'published',
      run_at: dt(-7, 11),
      created_at: dt(-9),
      published_at: dt(-7, 11),
      remote_post_id: 'LI-POST-20261024-03'
    },
    {
      id: 'post-4',
      content_id: 'content-curiosity',
      campaign_id: campaign1.id,
      account_id: 'ig-foundation-demo',
      platform: 'instagram',
      snapshot_type: 'image',
      status: 'published',
      run_at: dt(-4, 11),
      created_at: dt(-6),
      published_at: dt(-4, 11),
      remote_post_id: 'META-IG-20261027-04'
    },
    {
      id: 'post-5',
      content_id: 'content-parent-workshop',
      campaign_id: campaign1.id,
      account_id: 'fb-foundation-demo',
      platform: 'facebook',
      snapshot_type: 'image',
      status: 'published',
      run_at: dt(-2, 14),
      created_at: dt(-4),
      published_at: dt(-2, 14),
      remote_post_id: 'META-FB-20261029-05'
    },
    {
      id: 'post-6',
      content_id: 'approved-education',
      campaign_id: campaign1.id,
      account_id: 'ig-foundation-demo',
      platform: 'instagram',
      snapshot_type: 'image',
      status: 'scheduled',
      run_at: dt(0, 11),
      created_at: dt(-1)
    },
    {
      id: 'post-7',
      content_id: 'approved-product',
      campaign_id: campaign2.id,
      account_id: 'fb-greenbuild-demo',
      platform: 'facebook',
      snapshot_type: 'image',
      status: 'scheduled',
      run_at: dt(1, 18),
      created_at: dt(-1)
    },
    {
      id: 'post-8',
      content_id: 'content-li-impact',
      campaign_id: campaign3.id,
      account_id: 'li-world-demo',
      platform: 'linkedin',
      snapshot_type: 'image',
      status: 'scheduled',
      run_at: dt(2, 11),
      created_at: dt(-2)
    },
    {
      id: 'post-9',
      content_id: 'approved-product',
      campaign_id: campaign2.id,
      account_id: 'ig-greenbuild-demo',
      platform: 'instagram',
      snapshot_type: 'image',
      status: 'scheduled',
      run_at: dt(4, 16),
      created_at: dt(-1)
    },
    {
      id: 'post-10',
      content_id: 'approved-product',
      campaign_id: campaign2.id,
      account_id: 'fb-greenbuild-demo',
      platform: 'facebook',
      snapshot_type: 'image',
      status: 'held',
      run_at: dt(6, 12),
      created_at: dt(-2)
    },
    {
      id: 'post-11',
      content_id: 'approved-education',
      campaign_id: campaign1.id,
      account_id: 'ig-foundation-demo',
      platform: 'instagram',
      snapshot_type: 'image',
      status: 'scheduled',
      run_at: dt(8, 10),
      created_at: dt(-1)
    },
    {
      id: 'post-12',
      content_id: 'content-li-impact',
      campaign_id: campaign3.id,
      account_id: 'li-world-demo',
      platform: 'linkedin',
      snapshot_type: 'image',
      status: 'failed',
      run_at: dt(11, 17),
      created_at: dt(-2)
    }
  ];

  const base = startWeek(new Date());
  const slots = [
    'Why attention matters in daily learning',
    'How practical education builds confidence',
    'Questions families can ask about life skills'
  ].map((topic, i) => ({
    id: 'slot-education-' + i,
    campaign_id: campaign1.id,
    brand: foundation,
    platform: 'instagram',
    topic,
    scheduled_at: dt(i + 1, 11),
    state: 'proposed',
    evidence: 'verified_curriculum_guide',
    position: i
  }));

  return {
    accounts: accountList,
    campaigns: [campaign1, campaign2, campaign3],
    plans: [{
      id: 'plan-education-demo',
      campaign_id: campaign1.id,
      start_date: localISO(base),
      timezone: 'Asia/Kolkata',
      created_at: dt(-1),
      slots
    }],
    content,
    jobs,
    production: [{
      id: 'prod-demo-1',
      slot_id: 'slot-education-0',
      campaign_id: campaign1.id,
      brand: foundation,
      platform: 'instagram',
      engine: 'yuj-design',
      status: 'imported',
      content_id: 'draft-education',
      generation_id: 'gen-engine15-001',
      variant_id: 'default',
      created_at: dt(-1)
    }]
  };
}

function loadDemo() {
  try {
    const data = localStorage.getItem(DEMO_KEY);
    const parsed = data ? JSON.parse(data) : null;
    if (parsed?.accounts && parsed?.campaigns && parsed.campaigns.length >= 3) {
      return parsed;
    }
  } catch {}
  return freshDemo();
}

function saveDemo() {
  if (env.mode === 'demo') {
    try {
      localStorage.setItem(DEMO_KEY, JSON.stringify(state.data));
    } catch {}
  }
}

function makeDemoOps() {
  const d = state.data;
  const brands = {};
  for (const a of d.accounts) {
    const b = brands[a.brand] || (brands[a.brand] = { content: {}, jobs: {}, accounts: 0 });
    b.accounts++;
  }
  for (const c of d.content) {
    const b = brands[c.brand] || (brands[c.brand] = { content: {}, jobs: {}, accounts: 0 });
    b.content[c.status] = (b.content[c.status] || 0) + 1;
  }
  for (const j of d.jobs) {
    const c = d.content.find(x => x.id === j.content_id);
    if (!c) continue;
    const b = brands[c.brand];
    b.jobs[j.status] = (b.jobs[j.status] || 0) + 1;
  }
  return {
    brands,
    campaigns: Object.fromEntries(['draft', 'active', 'paused', 'completed'].map(k => [k, d.campaigns.filter(c => c.status === k).length])),
    production: Object.fromEntries(['queued', 'imported', 'waiting_import', 'dead', 'uncertain'].map(k => [k, d.production.filter(p => p.status === k).length])),
    plan_slots: { proposed: d.plans.flatMap(x => x.slots).filter(s => s.state === 'proposed').length },
    awaiting_approval: d.content.filter(x => x.status === 'draft').length,
    alerts: [],
    creative_imports: d.production.filter(x => x.status === 'imported').length,
    outbox: { pending: 0 }
  };
}

function demoInsights() {
  return {
    period_days: state.analyticsPeriodDays || 30,
    published_posts: 5,
    posts_with_insights: 5,
    groups: [
      {
        brand: 'yuj-foundation',
        account_id: 'ig-foundation-demo',
        platform: 'instagram',
        published_posts: 2,
        posts_with_insights: 2,
        metrics: {
          reach: { total_observed: 7700, observed_posts: 2, published_posts: 2 },
          views: { total_observed: 9810, observed_posts: 2, published_posts: 2 },
          likes: { total_observed: 520, observed_posts: 2, published_posts: 2 },
          comments: { total_observed: 66, observed_posts: 2, published_posts: 2 },
          saved: { total_observed: 166, observed_posts: 2, published_posts: 2 },
          shares: { total_observed: 109, observed_posts: 2, published_posts: 2 }
        }
      },
      {
        brand: 'yuj-greenbuild',
        account_id: 'fb-greenbuild-demo',
        platform: 'facebook',
        published_posts: 2,
        posts_with_insights: 2,
        metrics: {
          reach: { total_observed: 5660, observed_posts: 2, published_posts: 2 },
          views: { total_observed: 6880, observed_posts: 2, published_posts: 2 },
          likes: { total_observed: 327, observed_posts: 2, published_posts: 2 },
          comments: { total_observed: 35, observed_posts: 2, published_posts: 2 },
          saved: { total_observed: 75, observed_posts: 2, published_posts: 2 },
          shares: { total_observed: 50, observed_posts: 2, published_posts: 2 }
        }
      },
      {
        brand: 'yuj-world',
        account_id: 'li-world-demo',
        platform: 'linkedin',
        published_posts: 1,
        posts_with_insights: 1,
        metrics: {
          reach: { total_observed: 2890, observed_posts: 1, published_posts: 1 },
          views: { total_observed: 3420, observed_posts: 1, published_posts: 1 },
          likes: { total_observed: 245, observed_posts: 1, published_posts: 1 },
          comments: { total_observed: 36, observed_posts: 1, published_posts: 1 },
          saved: { total_observed: 52, observed_posts: 1, published_posts: 1 },
          shares: { total_observed: 39, observed_posts: 1, published_posts: 1 }
        }
      }
    ],
    time_series: [
      { date: 'Oct 17', reach: 4120, views: 5600, likes: 310, comments: 42, saved: 98, shares: 64 },
      { date: 'Oct 21', reach: 3250, views: 3980, likes: 185, comments: 19, saved: 44, shares: 28 },
      { date: 'Oct 24', reach: 2890, views: 3420, likes: 245, comments: 36, saved: 52, shares: 39 },
      { date: 'Oct 27', reach: 3580, views: 4210, likes: 210, comments: 24, saved: 68, shares: 45 },
      { date: 'Oct 29', reach: 2410, views: 2900, likes: 142, comments: 16, saved: 31, shares: 22 }
    ],
    posts: [
      {
        id: 'post-1',
        title: 'Education is not limited to classrooms. Every everyday interaction is a chance to cultivate curiosity.',
        campaign: 'Life Education · Everyday Growth',
        brand: 'yuj-foundation',
        platform: 'instagram',
        published_at: dt(-14, 10),
        reach: 4120,
        views: 5600,
        likes: 310,
        comments: 42,
        saved: 98,
        shares: 64,
        remote_post_id: 'META-IG-20261017-01',
        preview_url: 'assets/engine15-sample.png'
      },
      {
        id: 'post-2',
        title: 'YUJ Crack Filler — 3 critical questions every homeowner should ask before beginning exterior wall repairs.',
        campaign: 'YUJ Crack Filler · Product Stories',
        brand: 'yuj-greenbuild',
        platform: 'facebook',
        published_at: dt(-10, 15),
        reach: 3250,
        views: 3980,
        likes: 185,
        comments: 19,
        saved: 44,
        shares: 28,
        remote_post_id: 'META-FB-20261021-02'
      },
      {
        id: 'post-3',
        title: 'Building resilient infrastructure requires verifiable craftsmanship and community accountability.',
        campaign: 'Community Commerce · Retail Connect',
        brand: 'yuj-world',
        platform: 'linkedin',
        published_at: dt(-7, 11),
        reach: 2890,
        views: 3420,
        likes: 245,
        comments: 36,
        saved: 52,
        shares: 39,
        remote_post_id: 'LI-POST-20261024-03'
      },
      {
        id: 'post-4',
        title: 'Why everyday curiosity shapes children’s problem solving more than rote memorization.',
        campaign: 'Life Education · Everyday Growth',
        brand: 'yuj-foundation',
        platform: 'instagram',
        published_at: dt(-4, 11),
        reach: 3580,
        views: 4210,
        likes: 210,
        comments: 24,
        saved: 68,
        shares: 45,
        remote_post_id: 'META-IG-20261027-04'
      },
      {
        id: 'post-5',
        title: 'Parent workshop recap: 5 conversations to have with your middle schooler this week.',
        campaign: 'Life Education · Everyday Growth',
        brand: 'yuj-foundation',
        platform: 'facebook',
        published_at: dt(-2, 14),
        reach: 2410,
        views: 2900,
        likes: 142,
        comments: 16,
        saved: 31,
        shares: 22,
        remote_post_id: 'META-FB-20261029-05'
      }
    ],
    source: 'VERIFIED META GRAPH & LINKEDIN TELEMETRY'
  };
}

// --------------------------------------------------------------------------
// 5. GATEWAY CLIENT (LIVE REST / CORS ISOLATION)
// --------------------------------------------------------------------------
const API_BASE_URL = (() => {
  if (typeof window !== 'undefined' && window.location?.hostname) {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') return '';
  }
  if (typeof location !== 'undefined' && location.hostname) {
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') return '';
  }
  return 'https://yujstudio.onrender.com';
})();

async function gatewayFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  if (options.method && options.method !== 'GET' && typeof state !== 'undefined' && state.csrf) {
    headers['X-CSRF-Token'] = state.csrf;
  }

  // Pass admin key to authenticate gateway proxy requests
  headers['X-YUJ-Social-Key'] = 'yuj_admin_secret_key_1234567890_v05';

  let res;
  try {
    const targetUrl = path.startsWith('http')
      ? path
      : `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;

    res = await fetch(targetUrl, {
      ...options,
      headers,
      credentials: 'include',
      cache: 'no-store'
    });
  } catch {
    throw new Error('Cannot reach the YUJ console gateway. Check that the server is running.');
  }

  // Handle 401 Unauthorized without crashing the script
  if (res.status === 401) {
    $('loginOverlay')?.classList.remove('hidden');
    return null;
  }

  // Handle 404 Not Found gracefully
  if (res.status === 404) {
    console.warn(`Gateway 404 Not Found for: ${path}`);
    return null;
  }

  let body = null;
  const type = res.headers?.get('content-type') || '';
  try {
    body = type.includes('json') ? await res.json() : await res.text();
  } catch {
    body = null;
  }

  if (!res.ok) {
    let message = body?.detail || body?.error || body?.message || `Request failed (${res.status})`;
    if (typeof message !== 'string') message = JSON.stringify(message);
    throw new Error(message);
  }

  return body;
}

const service = (path, options = {}) => gatewayFetch('/api/social' + path, options);

// --------------------------------------------------------------------------
// 6. BOOTSTRAP & DATA RECONCILIATION
// --------------------------------------------------------------------------
async function boot() {
  hydrateIcons();
  
  // Theme initialization
  try {
    const savedTheme = localStorage.getItem('yuj_theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
    const savedCollapsed = localStorage.getItem('yuj_sidebar_collapsed');
    if (savedCollapsed === 'true') {
      $('appShell')?.classList.add('sidebar-collapsed');
    }
  } catch {}

  try {
    if (typeof location !== 'undefined' && location.protocol !== 'file:') {
      const configUrl = (typeof API_BASE_URL !== 'undefined' && API_BASE_URL)
        ? `${API_BASE_URL}/api/config`
        : '/api/config';
      const res = await fetch(configUrl, { credentials: 'include', cache: 'no-store' });
      if (res.ok) {
        const v = await res.json();
        env.mode = v.mode === 'live' ? 'live' : 'demo';
        env.socialConfigured = !!v.social_configured;
        env.rendererConfigured = !!v.renderer_configured;
      }
    }
  } catch {}

  if (env.mode === 'live') {
    try {
      const ses = await gatewayFetch('/api/session');
      state.csrf = ses?.csrf || '';
      if (!ses?.authenticated) {
        $('loginOverlay')?.classList.remove('hidden');
        return;
      }
      state.user = ses.user || state.user;
    } catch {
      $('loginOverlay')?.classList.remove('hidden');
      return;
    }
  }
  await refreshAll();
}

async function refreshAll(quiet = false) {
  state.loading = true;
  try {
    if (env.mode === 'demo') {
      state.data = loadDemo();
      applyDemoData();
    } else {
      const requests = {
        accounts: '/v1/accounts',
        campaigns: '/v1/campaigns?limit=200',
        plans: '/v1/plans?limit=100',
        content: '/v1/content?limit=200',
        jobs: '/v1/jobs?limit=250',
        production: '/v1/production/jobs?limit=200',
        ops: '/v1/ops/overview',
        insights: '/v1/analytics/overview?days=30',
        productionStatus: '/v1/production/status'
      };
      const settled = await Promise.allSettled(Object.entries(requests).map(async ([name, path]) => [name, await service(path)]));
      const failed = [];
      for (let i = 0; i < settled.length; i++) {
        const item = settled[i];
        if (item.status === 'fulfilled') {
          state[item.value[0]] = item.value[1];
        } else {
          failed.push(Object.keys(requests)[i]);
        }
      }
      if (failed.includes('accounts') || failed.includes('content')) {
        throw new Error('Core Social Studio endpoints unavailable: ' + failed.join(', '));
      }
      if (failed.length && !quiet) {
        toast('Some live modules are unavailable: ' + failed.join(', '), 'error');
      }
      if (env.rendererConfigured) {
        try {
          state.renderer = await gatewayFetch('/api/renderer/v1/capabilities');
        } catch {
          state.renderer = { error: 'Renderer health unavailable' };
        }
      }
      await resolveMedia();
    }

    if (!state.selectedCampaign || !state.campaigns.some(c => c.id === state.selectedCampaign)) {
      state.selectedCampaign = state.campaigns[0]?.id || '';
    }
    state.alertCount = (state.ops.alerts || []).length + state.content.filter(c => c.status === 'draft').length;
    render();
  } catch (err) {
    if (!quiet) toast(err.message, 'error');
    if (!state.data && env.mode === 'live') renderError(err.message);
  } finally {
    state.loading = false;
  }
}

function applyDemoData() {
  const d = state.data;
  state.accounts = d.accounts;
  state.campaigns = d.campaigns;
  state.plans = d.plans;
  state.content = d.content;
  state.jobs = d.jobs;
  state.production = d.production;
  state.ops = makeDemoOps();
  state.insights = demoInsights();
  state.productionStatus = { renderer_configured: true, counts: state.ops.production };
  state.renderer = {
    engine: 'yuj-design',
    engine_version: '2.5',
    brands: ['yuj-foundation'],
    human_approval_required: true,
    diffusion_enabled: false
  };
}

async function resolveMedia() {
  const needed = [...new Set(state.content.map(c => c.thumbnail_id || c.media_id).filter(Boolean))].slice(0, 24);
  const pending = needed.filter(id => !state.media.has(id));
  await Promise.allSettled(pending.map(async id => {
    try {
      const asset = await service('/v1/assets/' + encodeURIComponent(id));
      state.media.set(id, asset.preview_url || '');
    } catch {
      state.media.set(id, '');
    }
  }));
}

function previewUrl(item) {
  if (env.mode === 'demo') {
    return item?.preview_url || (item?.brand === 'yuj-foundation' && item?.media_id === 'sample' ? 'assets/engine15-sample.png' : '');
  }
  const id = item?.thumbnail_id || item?.media_id;
  return id ? state.media.get(id) || '' : '';
}

function brandName(v) {
  return ({
    'yuj-foundation': 'YUJ Foundation',
    'yuj-world': 'YUJ World',
    'yuj-greenbuild': 'YUJ GreenBuild',
    'yuj-ahaar': 'YUJ Ahaar'
  })[v] || String(v || 'YUJ Brand').replaceAll('-', ' ');
}

function accountName(id) {
  return state.accounts.find(a => a.id === id)?.label || id || 'Account';
}

function campaignName(id) {
  return state.campaigns.find(c => c.id === id)?.name || id || 'No campaign';
}

function tag(status) {
  const value = String(status || 'unknown');
  const good = ['active', 'published', 'approved', 'imported', 'ready', 'completed', 'success', 'delivered'].includes(value);
  const danger = ['dead', 'failed', 'uncertain', 'suspended'].includes(value);
  const warn = ['draft', 'pending', 'queued', 'waiting_import', 'paused', 'held', 'retry', 'scheduled'].includes(value);
  return `<span class="tag ${danger ? 'danger' : good ? 'good' : warn ? 'warn' : ''}">${e(value.replaceAll('_', ' '))}</span>`;
}

function isDemo() {
  return env.mode === 'demo';
}

function countBy(list, field, key) {
  return list.filter(x => x[field] === key).length;
}

function sumNumbers(list) {
  return list.reduce((a, v) => a + (Number(v) || 0), 0);
}

function setTheme(theme) {
  state.theme = theme;
  if (typeof document !== 'undefined' && document.documentElement?.setAttribute) {
    document.documentElement.setAttribute('data-theme', theme);
  }
  try {
    localStorage.setItem('yuj_theme', theme);
  } catch {}
}

function toggleTheme() {
  const current = (typeof document !== 'undefined' && document.documentElement?.getAttribute?.('data-theme')) || state.theme || 'dark';
  setTheme(current === 'dark' ? 'light' : 'dark');
}

// --------------------------------------------------------------------------
// 7. CORE UI RENDER ENGINE
// --------------------------------------------------------------------------
function render() {
  const pages = {
    overview: renderOverview,
    campaigns: renderCampaigns,
    planner: renderPlanner,
    creative: renderCreative,
    reviews: renderReviews,
    calendar: renderCalendar,
    analytics: renderAnalytics,
    operations: renderOperations,
    settings: renderSettings
  };
  
  const names = {
    overview: 'Command Center',
    campaigns: 'Campaigns',
    planner: 'Content Planner',
    creative: 'Creative Lab',
    reviews: 'Review Queue',
    calendar: 'Publishing Calendar',
    analytics: 'Performance',
    operations: 'Pipeline Health',
    settings: 'Connections & Settings'
  };

  const breadcrumb = $('breadcrumbCurrent');
  if (breadcrumb) breadcrumb.textContent = names[state.page] || 'Command Center';

  const revCount = $('sidebarReviewCount');
  if (revCount) revCount.textContent = state.content.filter(c => c.status === 'draft').length;

  const sideMode = $('sidebarMode');
  if (sideMode) sideMode.textContent = isDemo() ? 'Preview Workspace' : 'Connected Workspace';

  const banner = $('modeBanner');
  if (banner) {
    banner.classList.toggle('live-mode', !isDemo());
    const bannerText = $('modeBannerText');
    if (bannerText) {
      bannerText.innerHTML = isDemo()
        ? '<b>Preview Mode:</b> Offline seeded demonstration data and simulated local workflows. No real accounts or Meta channels will be published.'
        : '<b>Connected Mode:</b> Live Social Studio data. Publication strictly requires explicit human approval and scheduling.';
    }
  }

  const dot = $('notificationDot');
  if (dot) dot.style.display = state.alertCount ? 'block' : 'none';

  document.querySelectorAll('.nav-item').forEach(x => {
    const active = x.dataset.page === state.page;
    x.classList.toggle('active', active);
    if (active) x.setAttribute('aria-current', 'page');
    else x.removeAttribute('aria-current');
  });

  const appView = $('appView');
  if (appView) {
    appView.innerHTML = (pages[state.page] || renderOverview)();
    hydrateIcons(appView);
  }

  if (typeof document !== 'undefined') {
    document.title = `${names[state.page]} · YUJ Studio`;
  }
}

function renderError(msg) {
  const appView = $('appView');
  if (!appView) return;
  appView.innerHTML = `
    <div class="empty-state">
      <div class="empty-icon">${icon('alert')}</div>
      <h3>Unable to connect to gateway services</h3>
      <p>${e(msg)}</p>
      <button class="btn btn-subtle" data-action="refresh">${icon('refresh')} Retry Gateway Connection</button>
    </div>
  `;
  hydrateIcons(appView);
}

function pageHead(label, title, subtitle, actions = '', raw = false) {
  return `
    <div class="page-heading">
      <div>
        <div class="eyebrow">${raw ? label : e(label)}</div>
        <h1>${raw ? title : e(title)}</h1>
        <p>${raw ? subtitle : e(subtitle)}</p>
      </div>
      <div class="heading-actions">${actions}</div>
    </div>
  `;
}

function empty(title, subtitle, action = '') {
  return `
    <div class="empty-state">
      <div class="empty-icon">${icon('image')}</div>
      <h3>${e(title)}</h3>
      <p>${e(subtitle)}</p>
      ${action}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 8. SCREEN 1: COMMAND CENTER (FLAGSHIP DASHBOARD)
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// DYNAMIC SVG SPLINE & ANALYTICAL AGGREGATION
// --------------------------------------------------------------------------
function makeSvgPath(pts) {
  if (!pts || pts.length === 0) return '';
  if (pts.length === 1) return `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  let path = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i === 0 ? i : i - 1];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

    const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
    const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
    const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
    const cp2y = p2[1] - (p3[1] - p1[1]) / 6;

    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return path;
}

function getAggregatedAnalytics() {
  const isDemoMode = isDemo();
  const days = Number(state.perfPeriod || state.analyticsPeriodDays || 30);
  const platformFilter = (state.perfPlatform || 'all').toLowerCase();
  const campaignFilter = state.perfCampaign || '';

  const insight = state.insights || {};
  let rawGroups = Array.isArray(insight.groups) ? insight.groups : [];
  let rawTimeSeries = Array.isArray(insight.time_series) ? insight.time_series : [];
  let rawPosts = Array.isArray(insight.posts) ? insight.posts : [];

  if (!isDemoMode && rawTimeSeries.length === 0 && Array.isArray(state.jobs)) {
    const nowMs = Date.now();
    const cutoffMs = nowMs - days * 24 * 60 * 60 * 1000;
    const dailyMap = new Map();

    state.jobs.forEach(j => {
      if (j.status === 'published' && j.published_at) {
        const postTime = new Date(j.published_at).getTime();
        if (postTime >= cutoffMs) {
          const dateStr = new Date(j.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          if (!dailyMap.has(dateStr)) {
            dailyMap.set(dateStr, { date: dateStr, reach: 0, views: 0, engagements: 0, count: 0 });
          }
          const item = dailyMap.get(dateStr);
          item.count++;
          if (j.metrics) {
            item.reach += Number(j.metrics.reach) || 0;
            item.views += Number(j.metrics.views) || 0;
            item.engagements += (Number(j.metrics.likes) || 0) + (Number(j.metrics.comments) || 0) + (Number(j.metrics.shares) || 0) + (Number(j.metrics.saved) || 0);
          }
        }
      }
    });
    rawTimeSeries = Array.from(dailyMap.values());
  }

  let filteredGroups = rawGroups;
  if (platformFilter !== 'all') {
    filteredGroups = filteredGroups.filter(g => (g.platform || '').toLowerCase() === platformFilter);
  }
  if (campaignFilter) {
    const targetCampaign = state.campaigns.find(c => c.id === campaignFilter);
    if (targetCampaign && Array.isArray(targetCampaign.brands)) {
      filteredGroups = filteredGroups.filter(g => targetCampaign.brands.includes(g.brand));
    }
  }

  let totalViews = 0;
  let totalReach = 0;
  let totalLikes = 0;
  let totalComments = 0;
  let totalSaved = 0;
  let totalShares = 0;
  let hasObservedViews = false;
  let hasObservedReach = false;

  filteredGroups.forEach(g => {
    const m = g.metrics || {};
    if (m.views?.total_observed != null) {
      totalViews += m.views.total_observed;
      hasObservedViews = true;
    }
    if (m.reach?.total_observed != null) {
      totalReach += m.reach.total_observed;
      hasObservedReach = true;
    }
    if (m.likes?.total_observed != null) totalLikes += m.likes.total_observed;
    if (m.comments?.total_observed != null) totalComments += m.comments.total_observed;
    if (m.saved?.total_observed != null) totalSaved += m.saved.total_observed;
    if (m.shares?.total_observed != null) totalShares += m.shares.total_observed;
  });

  const totalEngagements = totalLikes + totalComments + totalSaved + totalShares;
  const engagementRate = (hasObservedViews && totalViews > 0)
    ? ((totalEngagements / totalViews) * 100).toFixed(2) + '%'
    : (hasObservedViews ? '0.00%' : '—');

  let timeSeries = rawTimeSeries;
  if (days <= 7) {
    timeSeries = timeSeries.slice(-4);
  } else if (days <= 30) {
    timeSeries = timeSeries.slice(-8);
  }

  let filteredPosts = rawPosts;
  if (platformFilter !== 'all') {
    filteredPosts = filteredPosts.filter(p => (p.platform || '').toLowerCase() === platformFilter);
  }
  if (campaignFilter) {
    const targetCampaign = state.campaigns.find(c => c.id === campaignFilter);
    if (targetCampaign) {
      filteredPosts = filteredPosts.filter(p => p.campaign_id === campaignFilter || (targetCampaign.brands || []).includes(p.brand));
    }
  }

  const allCaptions = (state.content || []).map(c => c.caption || '').join(' ');
  const hashtagMatches = allCaptions.match(/#[a-zA-Z0-9_]+/g) || [];
  const hashtagCounts = new Map();
  hashtagMatches.forEach(tag => {
    hashtagCounts.set(tag, (hashtagCounts.get(tag) || 0) + 1);
  });
  const topHashtags = Array.from(hashtagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([tag, count]) => ({ tag, count }));

  const platformMap = new Map();
  filteredGroups.forEach(g => {
    const p = (g.platform || 'other').toLowerCase();
    const reach = Number(g.metrics?.reach?.total_observed) || 0;
    const posts = Number(g.published_posts) || 0;
    const prev = platformMap.get(p) || { reach: 0, posts: 0 };
    platformMap.set(p, { reach: prev.reach + reach, posts: prev.posts + posts });
  });

  const platformBreakdown = Array.from(platformMap.entries()).map(([platform, data]) => {
    const pct = (hasObservedReach && totalReach > 0) ? ((data.reach / totalReach) * 100).toFixed(1) : '0';
    return { platform, reach: data.reach, posts: data.posts, percentage: pct };
  });

  const brandMap = new Map();
  (state.content || []).forEach(c => {
    const b = c.brand || 'other';
    brandMap.set(b, (brandMap.get(b) || 0) + 1);
  });
  const totalContentCount = state.content?.length || 1;
  const brandBreakdown = Array.from(brandMap.entries()).map(([brand, count]) => ({
    brand,
    count,
    percentage: ((count / totalContentCount) * 100).toFixed(1)
  })).sort((a, b) => b.count - a.count);

  return {
    days,
    platformFilter,
    campaignFilter,
    totalViews: hasObservedViews ? totalViews : null,
    totalReach: hasObservedReach ? totalReach : null,
    totalEngagements,
    engagementRate,
    totalLikes,
    totalComments,
    totalSaved,
    totalShares,
    groups: filteredGroups,
    timeSeries,
    posts: filteredPosts,
    topHashtags,
    platformBreakdown,
    brandBreakdown
  };
}

function renderPulseChart() {
  const analytics = getAggregatedAnalytics();
  const pts = analytics.timeSeries || [];

  if (state.pulseLoading) {
    return `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:200px; gap:12px; color:var(--text-dim);">
        <div style="width:28px; height:28px; border:2.5px solid #232C3A; border-top-color:#FF873E; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
        <span style="font-size:13px;">Fetching real-time operations telemetry...</span>
      </div>
    `;
  }

  if (state.pulseError) {
    return `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:200px; gap:10px; color:#F15B66; text-align:center; padding:16px;">
        <span style="font-size:14px; font-weight:600;">${e(state.pulseError)}</span>
        <button class="btn btn-sm btn-subtle" data-action="refresh">${icon('refresh')} Retry Connection</button>
      </div>
    `;
  }

  if (pts.length === 0) {
    return `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:200px; gap:8px; color:var(--text-dim); text-align:center; padding:20px;">
        <span style="font-size:14px; font-weight:600; color:var(--text);">No Telemetry Recorded</span>
        <span style="font-size:13px; max-width:440px;">No performance records observed for the selected ${state.pulsePeriod || 30}-day window. New posts will show reach and views once published and measured.</span>
      </div>
    `;
  }

  const maxReach = Math.max(...pts.map(p => Number(p.reach) || 0), 0);
  const maxViews = Math.max(...pts.map(p => Number(p.views) || 0), 0);
  const peak = Math.max(maxReach, maxViews, 100);
  const factor = Math.pow(10, Math.floor(Math.log10(peak)));
  const maxVal = Math.ceil((peak * 1.15) / factor) * factor;

  const yTicks = [
    { val: maxVal, label: maxVal >= 1000 ? (maxVal / 1000).toFixed(maxVal % 1000 === 0 ? 0 : 1) + 'k' : String(maxVal), y: 20 },
    { val: Math.round(maxVal * 0.66), label: Math.round(maxVal * 0.66) >= 1000 ? (Math.round(maxVal * 0.66) / 1000).toFixed(1) + 'k' : String(Math.round(maxVal * 0.66)), y: 70 },
    { val: Math.round(maxVal * 0.33), label: Math.round(maxVal * 0.33) >= 1000 ? (Math.round(maxVal * 0.33) / 1000).toFixed(1) + 'k' : String(Math.round(maxVal * 0.33)), y: 120 },
    { val: 0, label: '0', y: 170 }
  ];

  const plotLeft = 60;
  const plotRight = 970;
  const plotWidth = plotRight - plotLeft;
  const baseY = 170;
  const topY = 20;
  const plotHeight = baseY - topY;

  const coords = pts.map((p, i) => {
    const x = pts.length === 1 ? (plotLeft + plotRight) / 2 : plotLeft + (i / (pts.length - 1)) * plotWidth;
    const yReach = baseY - ((Number(p.reach) || 0) / maxVal) * plotHeight;
    const yViews = baseY - ((Number(p.views) || 0) / maxVal) * plotHeight;
    return { ...p, x, yReach, yViews, index: i };
  });

  const reachLine = coords.length === 1 ? `M ${coords[0].x - 20} ${coords[0].yReach} L ${coords[0].x + 20} ${coords[0].yReach}` : makeSvgPath(coords.map(c => [c.x, c.yReach]));
  const viewsLine = coords.length === 1 ? `M ${coords[0].x - 20} ${coords[0].yViews} L ${coords[0].x + 20} ${coords[0].yViews}` : makeSvgPath(coords.map(c => [c.x, c.yViews]));

  const reachArea = coords.length === 1
    ? `M ${coords[0].x - 20} ${coords[0].yReach} L ${coords[0].x + 20} ${coords[0].yReach} L ${coords[0].x + 20} ${baseY} L ${coords[0].x - 20} ${baseY} Z`
    : `${reachLine} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`;
  const viewsArea = coords.length === 1
    ? `M ${coords[0].x - 20} ${coords[0].yViews} L ${coords[0].x + 20} ${coords[0].yViews} L ${coords[0].x + 20} ${baseY} L ${coords[0].x - 20} ${baseY} Z`
    : `${viewsLine} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`;

  const activeIdx = (state.pulseHoverIndex != null && state.pulseHoverIndex >= 0 && state.pulseHoverIndex < coords.length)
    ? state.pulseHoverIndex
    : Math.max(0, coords.length - 2);
  const activePt = coords[activeIdx] || coords[0];
  const tooltipLeftPct = Math.max(12, Math.min(88, (activePt.x / 1000) * 100));

  return `
    <div class="pulse-tooltip-box" id="pulseTooltipBox" style="left:${tooltipLeftPct}%; top:${Math.max(12, Math.min(activePt.yReach, activePt.yViews) - 48)}px; transform:translateX(-50%); transition:left 0.15s ease, top 0.15s ease;">
      <div class="pulse-tooltip-date" id="pulseTooltipDate">${e(activePt.date)}</div>
      <div class="pulse-tooltip-row"><span class="legend-bullet" style="background:#FF873E;"></span> Reach: <b id="pulseTooltipReach">${formatNumber(activePt.reach)}</b></div>
      <div class="pulse-tooltip-row"><span class="legend-bullet" style="background:#27C7C1;"></span> Views: <b id="pulseTooltipViews">${formatNumber(activePt.views)}</b></div>
    </div>

    <svg viewBox="0 0 1000 200" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible;">
      <defs>
        <linearGradient id="pulseGradOrange" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#FF873E" stop-opacity="0.30" />
          <stop offset="100%" stop-color="#FF873E" stop-opacity="0.0" />
        </linearGradient>
        <linearGradient id="pulseGradTeal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#27C7C1" stop-opacity="0.25" />
          <stop offset="100%" stop-color="#27C7C1" stop-opacity="0.0" />
        </linearGradient>
        <filter id="glowOrange" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="glowTeal" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      ${yTicks.map(t => `
        <line x1="${plotLeft}" y1="${t.y}" x2="${plotRight}" y2="${t.y}" stroke="#232C3A" stroke-dasharray="${t.y === baseY ? 'none' : '3,3'}" />
        <text x="${plotLeft - 15}" y="${t.y + 4}" fill="#818D9D" font-size="11" text-anchor="end">${e(t.label)}</text>
      `).join('')}

      ${coords.map(c => `
        <text x="${c.x}" y="194" fill="#818D9D" font-size="11" text-anchor="middle">${e(c.date)}</text>
      `).join('')}

      <path d="${reachArea}" fill="url(#pulseGradOrange)" />
      <path d="${viewsArea}" fill="url(#pulseGradTeal)" />

      <path d="${reachLine}" fill="none" stroke="#FF873E" stroke-width="2.6" filter="url(#glowOrange)" />
      <path d="${viewsLine}" fill="none" stroke="#27C7C1" stroke-width="2.6" filter="url(#glowTeal)" />

      ${coords.map((c, i) => `
        <g class="pulse-point-group" data-action="pulse-hover-point" data-index="${i}" data-date="${e(c.date)}" data-reach="${c.reach}" data-views="${c.views}" data-x="${c.x}" data-y="${Math.min(c.yReach, c.yViews)}" style="cursor:pointer;">
          <circle cx="${c.x}" cy="${c.yReach}" r="${i === activeIdx ? '6' : '4'}" fill="${i === activeIdx ? '#FF873E' : '#0B0E13'}" stroke="#FF873E" stroke-width="${i === activeIdx ? '3' : '2.5'}" />
          <circle cx="${c.x}" cy="${c.yViews}" r="${i === activeIdx ? '6' : '4'}" fill="${i === activeIdx ? '#27C7C1' : '#0B0E13'}" stroke="#27C7C1" stroke-width="${i === activeIdx ? '3' : '2.5'}" />
          <rect x="${c.x - 24}" y="10" width="48" height="170" fill="transparent" />
        </g>
      `).join('')}
    </svg>
  `;
}

function renderPerformanceTrendChart(analytics) {
  const pts = analytics.timeSeries || [];

  if (state.perfLoading) {
    return `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:160px; gap:10px; color:#818D9D;">
        <div style="width:24px; height:24px; border:2.5px solid #202834; border-top-color:#FF793D; border-radius:50%; animation:spin 0.8s linear infinite;"></div>
        <span style="font-size:12px;">Updating performance telemetry...</span>
      </div>
    `;
  }

  if (pts.length === 0) {
    return `
      <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:160px; gap:6px; color:#6C7A8D; text-align:center; padding:16px;">
        <span style="font-size:13px; font-weight:600; color:#F3F5F7;">No Daily Insights Recorded</span>
        <span style="font-size:12px;">Publish and measure posts to view daily engagement trends.</span>
      </div>
    `;
  }

  const maxEng = Math.max(...pts.map(p => Number(p.engagements || (p.likes + p.comments + p.saved + p.shares)) || 0), 0);
  const maxViews = Math.max(...pts.map(p => Number(p.views) || 0), 0);
  const peak = Math.max(maxEng, maxViews, 100);
  const factor = Math.pow(10, Math.floor(Math.log10(peak)));
  const maxVal = Math.ceil((peak * 1.15) / factor) * factor;

  const yTicks = [
    { val: maxVal, label: maxVal >= 1000 ? (maxVal / 1000).toFixed(maxVal % 1000 === 0 ? 0 : 1) + 'k' : String(maxVal), y: 20 },
    { val: Math.round(maxVal * 0.66), label: Math.round(maxVal * 0.66) >= 1000 ? (Math.round(maxVal * 0.66) / 1000).toFixed(1) + 'k' : String(Math.round(maxVal * 0.66)), y: 55 },
    { val: Math.round(maxVal * 0.33), label: Math.round(maxVal * 0.33) >= 1000 ? (Math.round(maxVal * 0.33) / 1000).toFixed(1) + 'k' : String(Math.round(maxVal * 0.33)), y: 95 },
    { val: 0, label: '0', y: 135 }
  ];

  const plotLeft = 40;
  const plotRight = 515;
  const plotWidth = plotRight - plotLeft;
  const baseY = 135;
  const topY = 20;
  const plotHeight = baseY - topY;

  const coords = pts.map((p, i) => {
    const x = pts.length === 1 ? (plotLeft + plotRight) / 2 : plotLeft + (i / (pts.length - 1)) * plotWidth;
    const engVal = Number(p.engagements || (p.likes + p.comments + p.saved + p.shares)) || 0;
    const yEng = baseY - (engVal / maxVal) * plotHeight;
    const yViews = baseY - ((Number(p.views) || 0) / maxVal) * plotHeight;
    return { ...p, engVal, x, yEng, yViews, index: i };
  });

  const engLine = coords.length === 1 ? `M ${coords[0].x - 15} ${coords[0].yEng} L ${coords[0].x + 15} ${coords[0].yEng}` : makeSvgPath(coords.map(c => [c.x, c.yEng]));
  const viewsLine = coords.length === 1 ? `M ${coords[0].x - 15} ${coords[0].yViews} L ${coords[0].x + 15} ${coords[0].yViews}` : makeSvgPath(coords.map(c => [c.x, c.yViews]));

  const engArea = coords.length === 1
    ? `M ${coords[0].x - 15} ${coords[0].yEng} L ${coords[0].x + 15} ${coords[0].yEng} L ${coords[0].x + 15} ${baseY} L ${coords[0].x - 15} ${baseY} Z`
    : `${engLine} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`;
  const viewsArea = coords.length === 1
    ? `M ${coords[0].x - 15} ${coords[0].yViews} L ${coords[0].x + 15} ${coords[0].yViews} L ${coords[0].x + 15} ${baseY} L ${coords[0].x - 15} ${baseY} Z`
    : `${viewsLine} L ${coords[coords.length - 1].x} ${baseY} L ${coords[0].x} ${baseY} Z`;

  const activeIdx = (state.perfHoverIndex != null && state.perfHoverIndex >= 0 && state.perfHoverIndex < coords.length)
    ? state.perfHoverIndex
    : Math.max(0, coords.length - 2);
  const activePt = coords[activeIdx] || coords[0];
  const tooltipLeftPct = Math.max(14, Math.min(86, (activePt.x / 540) * 100));

  return `
    <div style="position:relative; width:100%; height:160px;">
      <div id="perfTrendTooltip" style="position:absolute; left:${tooltipLeftPct}%; top:${Math.max(6, Math.min(activePt.yEng, activePt.yViews) - 38)}px; transform:translateX(-50%); background:#151B26; border:1px solid #293444; border-radius:6px; padding:6px 10px; font-size:11px; box-shadow:0 6px 20px rgba(0,0,0,0.6); pointer-events:none; z-index:10; white-space:nowrap; transition:left 0.15s ease, top 0.15s ease;">
        <div style="color:#6C7A8D; font-weight:700; margin-bottom:2px;">${e(activePt.date)}</div>
        <div style="color:#FF793D; font-weight:700;">● Eng: ${formatNumber(activePt.engVal)}</div>
        <div style="color:#16B8E8; font-weight:700;">● Views: ${formatNumber(activePt.views)}</div>
      </div>

      <svg viewBox="0 0 540 160" preserveAspectRatio="none" style="width:100%; height:100%; overflow:visible;">
        <defs>
          <linearGradient id="trendGradOrange" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF793D" stop-opacity="0.30" />
            <stop offset="100%" stop-color="#FF793D" stop-opacity="0.0" />
          </linearGradient>
          <linearGradient id="trendGradCyan" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#16B8E8" stop-opacity="0.25" />
            <stop offset="100%" stop-color="#16B8E8" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        ${yTicks.map(t => `
          <line x1="${plotLeft}" y1="${t.y}" x2="${plotRight}" y2="${t.y}" stroke="#202834" stroke-dasharray="${t.y === baseY ? 'none' : '2,2'}" />
          <text x="${plotLeft - 8}" y="${t.y + 4}" fill="#6C7A8D" font-size="10" text-anchor="end">${e(t.label)}</text>
        `).join('')}

        ${coords.map(c => `
          <text x="${c.x}" y="152" fill="#6C7A8D" font-size="10" text-anchor="middle">${e(c.date)}</text>
        `).join('')}

        <path d="${engArea}" fill="url(#trendGradOrange)" />
        <path d="${viewsArea}" fill="url(#trendGradCyan)" />

        <path d="${engLine}" fill="none" stroke="#FF793D" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />
        <path d="${viewsLine}" fill="none" stroke="#16B8E8" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" />

        ${coords.map((c, i) => `
          <g class="perf-point-group" data-action="perf-hover-point" data-index="${i}" data-date="${e(c.date)}" data-eng="${c.engVal}" data-views="${c.views}" data-x="${c.x}" data-y="${Math.min(c.yEng, c.yViews)}" style="cursor:pointer;">
            <circle cx="${c.x}" cy="${c.yEng}" r="${i === activeIdx ? '5' : '3.5'}" fill="${i === activeIdx ? '#FF793D' : '#0D1119'}" stroke="#FF793D" stroke-width="${i === activeIdx ? '2.5' : '2'}" />
            <circle cx="${c.x}" cy="${c.yViews}" r="${i === activeIdx ? '5' : '3.5'}" fill="${i === activeIdx ? '#16B8E8' : '#0D1119'}" stroke="#16B8E8" stroke-width="${i === activeIdx ? '2.5' : '2'}" />
            <rect x="${c.x - 16}" y="10" width="32" height="130" fill="transparent" />
          </g>
        `).join('')}
      </svg>
    </div>
  `;
}

function renderOverview() {
  const active = state.campaigns.filter(c => c.status === 'active').length;
  const drafts = state.content.filter(c => c.status === 'draft').length;
  const inQueue = state.production.filter(p => ['queued', 'waiting_import', 'dispatched', 'retry', 'rendering', 'accepted'].includes(p.status)).length;
  const scheduled = state.jobs.filter(j => ['scheduled', 'retry'].includes(j.status)).length;
  const totalSlots = state.plans.reduce((acc, p) => acc + (p.slots ? p.slots.length : 0), 0);
  const activeStage = drafts > 0 ? 4 : (inQueue > 0 ? 3 : (scheduled > 0 ? 5 : 1));

  const greeting = (() => {
    const hr = new Date().getHours();
    if (hr < 12) return 'Good morning';
    if (hr < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  const draftsList = state.content.filter(c => c.status === 'draft');
  const featuredDraft = draftsList[0] || state.content[0];
  const featuredJob = state.production[0];
  const featuredCampaign = featuredDraft ? state.campaigns.find(c => c.id === featuredDraft.campaign_id) : (featuredJob ? state.campaigns.find(c => c.id === featuredJob.campaign_id) : null);
  const featuredBrand = featuredDraft?.brand || featuredJob?.brand || featuredCampaign?.brands?.[0] || 'yuj-foundation';
  const featuredTitle = featuredCampaign ? featuredCampaign.name : (featuredDraft?.text ? trunc(featuredDraft.text, 44) : (featuredJob ? 'Creative Production #' + trunc(featuredJob.id, 16) : 'Creative Production Asset'));
  const featuredSub = featuredDraft?.platform ? `${featuredDraft.platform.toUpperCase()} · ${featuredDraft.status === 'draft' ? 'Draft Awaiting Review' : 'Active Content'}` : 'Multi-Channel Asset';
  const featuredPlatform = featuredDraft?.platform || featuredJob?.platform || 'instagram';
  const featuredThumb = (featuredDraft ? previewUrl(featuredDraft) : null) || (env.mode === 'demo' ? 'assets/engine15-sample.png' : '');
  const pendingDecisions = draftsList.slice(0, 3);

  // Mini sparklines for KPI command cards
  const sparklineUp = (color) => `
    <svg class="cmd-kpi-spark" viewBox="0 0 48 18" fill="none">
      <path d="M2 15 C 10 14, 18 10, 24 11 C 30 12, 38 4, 46 3" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
  const sparklineFlat = (color) => `
    <svg class="cmd-kpi-spark" viewBox="0 0 48 18" fill="none">
      <path d="M2 9 C 14 9, 26 9, 46 9" stroke="${color}" stroke-width="1.8" stroke-linecap="round" stroke-dasharray="3 3"/>
    </svg>
  `;

  // Circular gauge helper
  const cmdRing = (pct, color, ic) => {
    const r = 24;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    return `
      <div class="cmd-kpi-ring-wrap">
        <svg class="cmd-kpi-ring-svg" viewBox="0 0 58 58">
          <circle cx="29" cy="29" r="${r}" fill="none" stroke="#242D3A" stroke-width="4.5" />
          <circle cx="29" cy="29" r="${r}" fill="none" stroke="${color}" stroke-width="4.5"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round" />
        </svg>
        <div class="cmd-kpi-icon" style="color:${color};">${icon(ic)}</div>
      </div>
    `;
  };

  return `
    <!-- Top Hero Area with Atmospheric Planet Horizon Glow -->
    <div class="overview-hero-wrap">
      <div class="hero-planet-glow"></div>
      ${pageHead(
        'OPERATIONAL COMMAND ///',
        'Your marketing universe, <span class="hero-highlight">in sync.</span>',
        `${greeting}, ${state.user || 'Workspace Admin'}. From first brief to verified impact: plan, create, approve, publish, and measure across every brand channel.`,
        `
          <button class="btn btn-subtle" data-action="navigate" data-target="planner">${icon('calendar')} Plan Content</button>
          <button class="btn btn-primary" data-action="new-campaign">${icon('plus')} Create Campaign</button>
        `,
        true
      )}
    </div>

    <!-- Row of 4 KPI Command Cards -->
    <div class="cmd-kpi-grid">
      <!-- Card 1: Active Campaigns -->
      <div class="cmd-kpi-card" data-action="navigate" data-target="campaigns" role="button" tabindex="0">
        ${cmdRing(82, '#FF873E', 'megaphone')}
        <div class="cmd-kpi-body">
          <div class="cmd-kpi-title">Active Campaigns</div>
          <div class="cmd-kpi-num">${formatNumber(active)}</div>
          <div class="cmd-kpi-trend">
            <span class="cmd-trend-good">▲ +0 vs last week</span>
          </div>
        </div>
      </div>

      <!-- Card 2: Awaiting Approval -->
      <div class="cmd-kpi-card" data-action="navigate" data-target="reviews" role="button" tabindex="0">
        ${cmdRing(60, '#27C7C1', 'clock')}
        <div class="cmd-kpi-body">
          <div class="cmd-kpi-title">Awaiting Approval</div>
          <div class="cmd-kpi-num">${formatNumber(drafts)}</div>
          <div class="cmd-kpi-trend">
            <span class="cmd-trend-good">▲ +0 vs last week</span>
            ${sparklineUp('#27C7C1')}
          </div>
        </div>
      </div>

      <!-- Card 3: In-Flight Creative Jobs -->
      <div class="cmd-kpi-card" data-action="navigate" data-target="creative" role="button" tabindex="0">
        ${cmdRing(0, '#F2BD59', 'briefcase')}
        <div class="cmd-kpi-body">
          <div class="cmd-kpi-title">In-Flight Creative Jobs</div>
          <div class="cmd-kpi-num">${formatNumber(inQueue)}</div>
          <div class="cmd-kpi-trend">
            <span class="cmd-trend-neutral">— No change</span>
            ${sparklineFlat('#F2BD59')}
          </div>
        </div>
      </div>

      <!-- Card 4: Scheduled Posts -->
      <div class="cmd-kpi-card" data-action="navigate" data-target="calendar" role="button" tabindex="0">
        ${cmdRing(75, '#A17CF5', 'calendar')}
        <div class="cmd-kpi-body">
          <div class="cmd-kpi-title">Scheduled Posts</div>
          <div class="cmd-kpi-num">${formatNumber(scheduled)}</div>
          <div class="cmd-kpi-trend">
            <span class="cmd-trend-good">▲ +1 vs last week</span>
            ${sparklineUp('#A17CF5')}
          </div>
        </div>
      </div>
    </div>

    <!-- Middle Panel 1: Marketing Operations Pulse (Real-Time SVG Line Visualizer) -->
    <div class="pulse-panel">
      <div class="pulse-header">
        <div class="pulse-title-wrap">
          <div class="pulse-icon-box">${icon('activity')}</div>
          <div class="pulse-title-text">
            <h3>Marketing Operations Pulse</h3>
            <p>Real-time overview of your marketing performance</p>
          </div>
        </div>
        <div class="pulse-controls">
          <span class="pulse-sync-pill"><span class="pulse-sync-dot"></span> Live Telemetry</span>
          <button class="btn btn-sm btn-subtle" data-action="pulse-filter">${icon('calendar')} Last ${state.pulsePeriod || 30} Days ▾</button>
        </div>
      </div>

      <div class="pulse-chart-container">
        ${renderPulseChart()}
      </div>
    </div>

    <!-- Middle Panel 2: Interactive Marketing Pipeline -->
    <div class="pipeline-track-panel">
      <div class="pipeline-track-head">
        <div class="pipeline-track-icon">${icon('layers')}</div>
        <div class="pipeline-track-title">
          <h3>End-to-End Marketing Pipeline</h3>
          <p>Track your content journey in real-time across execution stages</p>
        </div>
      </div>

      <div class="pipeline-steps-rail">
        <div class="pipeline-connecting-wire"></div>

        <!-- Stage 1 -->
        <div class="pipeline-step-node ${activeStage === 1 ? 'active-stage' : ''}" data-action="navigate" data-target="campaigns" title="Go to Brief & Strategy">
          <div class="pipeline-node-icon" style="background: linear-gradient(135deg, #FF873E, #E06822);">
            ${icon('edit')}
          </div>
          <div class="pipeline-node-text">
            <strong>1. Brief & Strategy</strong>
            <small>${formatNumber(active)} Active</small>
            <span class="pipeline-node-badge ${activeStage === 1 ? 'active' : 'idle'}">${activeStage === 1 ? 'Active Stage' : `${formatNumber(state.campaigns.length)} Total`}</span>
          </div>
        </div>

        <!-- Stage 2 -->
        <div class="pipeline-step-node ${activeStage === 2 ? 'active-stage' : ''}" data-action="navigate" data-target="planner" title="Go to Content Planning">
          <div class="pipeline-node-icon" style="background: linear-gradient(135deg, #27C7C1, #18A8A2);">
            ${icon('grid')}
          </div>
          <div class="pipeline-node-text">
            <strong>2. Content Planning</strong>
            <small>${formatNumber(totalSlots || state.plans.length)} Planned Slots</small>
            <span class="pipeline-node-badge ${activeStage === 2 ? 'active' : 'idle'}">${activeStage === 2 ? 'Active Stage' : `${formatNumber(state.plans.length)} Plans`}</span>
          </div>
        </div>

        <!-- Stage 3 -->
        <div class="pipeline-step-node ${activeStage === 3 ? 'active-stage' : ''}" data-action="navigate" data-target="creative" title="Go to Engine15 Render">
          <div class="pipeline-node-icon" style="background: linear-gradient(135deg, #F2BD59, #D99E28);">
            ${icon('sparkles')}
          </div>
          <div class="pipeline-node-text">
            <strong>3. Engine15 Render</strong>
            <small>${formatNumber(inQueue)} In-Flight</small>
            <span class="pipeline-node-badge ${activeStage === 3 ? 'active' : 'idle'}">${activeStage === 3 ? 'Active Stage' : (inQueue > 0 ? 'Rendering' : 'Ready')}</span>
          </div>
        </div>

        <!-- Stage 4 -->
        <div class="pipeline-step-node ${activeStage === 4 ? 'active-stage' : ''}" data-action="navigate" data-target="reviews" title="Go to Human Review">
          <div class="pipeline-node-icon" style="background: linear-gradient(135deg, #A17CF5, #7D52DF);">
            ${icon('shield')}
          </div>
          <div class="pipeline-node-text">
            <strong>4. Human Review</strong>
            <small>${formatNumber(drafts)} Pending Gate</small>
            <span class="pipeline-node-badge ${activeStage === 4 ? 'active' : 'idle'}">${activeStage === 4 ? 'Active Stage' : (drafts > 0 ? 'Requires Action' : 'Clear')}</span>
          </div>
        </div>

        <!-- Stage 5 -->
        <div class="pipeline-step-node ${activeStage === 5 ? 'active-stage' : ''}" data-action="navigate" data-target="calendar" title="Go to Meta Publish">
          <div class="pipeline-node-icon" style="background: linear-gradient(135deg, #35D69A, #20AB74);">
            ${icon('send')}
          </div>
          <div class="pipeline-node-text">
            <strong>5. Meta Publish</strong>
            <small>${formatNumber(scheduled)} Scheduled</small>
            <span class="pipeline-node-badge ${activeStage === 5 ? 'active' : 'idle'}">${activeStage === 5 ? 'Active Stage' : `${formatNumber(state.jobs.filter(j => j.status === 'published').length)} Live`}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Creative Production Workbench (60%) & Needs Your Decision (40%) -->
    <div class="overview-lower-grid">
      <!-- Left: Creative Production Workbench -->
      <div class="workbench-panel">
        <div class="workbench-header">
          <div class="workbench-header-left">
            <span style="color:#FF873E;">${icon('sparkles')}</span>
            <span>Creative Production Workbench</span>
          </div>
          <button class="panel-link" data-action="navigate" data-target="creative">View All →</button>
        </div>

        ${(featuredDraft || featuredJob) ? `
          <div class="workbench-split-card" data-action="navigate" data-target="${featuredDraft ? 'reviews' : 'creative'}" style="cursor:pointer;">
            <div class="workbench-thumb-box" style="position:relative; overflow:hidden; border-radius:8px; background:#121822; display:flex; align-items:center; justify-content:center; min-height:140px;">
              ${featuredThumb ? `
                <img src="${e(featuredThumb)}" alt="Asset preview" style="width:100%; height:100%; object-fit:cover;" />
              ` : `
                <div style="width:100%; height:100%; background:linear-gradient(135deg, #202834, #131822); display:flex; flex-direction:column; align-items:center; justify-content:center; color:var(--text-dim); gap:6px; padding:12px; text-align:center;">
                  <span style="color:#FF873E; font-size:24px;">${icon('sparkles')}</span>
                  <span style="font-size:12px; font-weight:600; color:var(--text-secondary);">${e(brandName(featuredBrand))}</span>
                  <span style="font-size:10px; text-transform:uppercase; letter-spacing:0.06em;">${e(featuredPlatform)}</span>
                </div>
              `}
            </div>

            <div class="workbench-meta-info">
              <span class="workbench-meta-brand">${e(brandName(featuredBrand).toUpperCase())}</span>
              <div class="workbench-meta-title">${e(featuredTitle)}</div>
              <div class="workbench-meta-sub">${e(featuredSub)}</div>
              <div class="workbench-meta-channels">
                <span class="platform-pill-icon" title="${e(featuredPlatform)}">${icon(featuredPlatform === 'facebook' ? 'facebook' : featuredPlatform === 'linkedin' ? 'linkedin' : 'instagram')}</span>
                <span class="status-pill-ready">${featuredDraft ? (featuredDraft.status === 'draft' ? 'Pending Approval' : 'Approved') : (featuredJob?.status || 'Active')}</span>
              </div>
            </div>
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:140px; text-align:center; padding:16px; color:var(--text-dim); gap:6px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px dashed var(--border-subtle);">
            <span style="color:#FF873E; font-size:22px;">${icon('sparkles')}</span>
            <strong style="color:var(--text); font-size:13.5px;">No In-Flight Creative Jobs</strong>
            <span style="font-size:12px;">Trigger an Engine15 composition from Content Planner to view drafts here.</span>
          </div>
        `}
      </div>

      <!-- Right: Needs Your Decision -->
      <div class="decisions-panel">
        <div class="decisions-header">
          <div class="decisions-header-left">
            <span style="color:#FF873E;">${icon('gavel')}</span>
            <span>Needs Your Decision</span>
          </div>
          <button class="panel-link" data-action="navigate" data-target="reviews">View All →</button>
        </div>

        ${pendingDecisions.length > 0 ? `
          <div class="decisions-list">
            ${pendingDecisions.map(d => {
              const camp = state.campaigns.find(c => c.id === d.campaign_id);
              const title = camp ? camp.name : (d.brand ? brandName(d.brand) : 'Marketing Content Draft');
              const sub = d.text ? trunc(d.text, 50) : (d.caption ? trunc(d.caption, 50) : 'Content awaiting human approval');
              const time = timeAgo(d.created_at);
              return `
                <div class="decision-card-row">
                  <div class="decision-thumb-preview" style="background:linear-gradient(135deg, rgba(255,135,62,0.12), rgba(39,199,193,0.12)); border:1px solid rgba(255,135,62,0.25); display:flex; align-items:center; justify-content:center; color:#FF873E;">
                    ${icon(d.platform === 'facebook' ? 'facebook' : d.platform === 'linkedin' ? 'linkedin' : 'instagram')}
                  </div>
                  <div class="decision-info-col">
                    <div class="decision-info-title">${e(title)}</div>
                    <div class="decision-info-sub">${e(sub)}</div>
                  </div>
                  <div class="decision-time-meta">${icon('clock')} ${e(time)}</div>
                  <button class="btn btn-sm btn-primary" data-action="open-review" data-id="${e(d.id)}">Review</button>
                </div>
              `;
            }).join('')}
          </div>
        ` : `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:140px; text-align:center; padding:16px; color:var(--text-dim); gap:6px; background:rgba(255,255,255,0.02); border-radius:8px; border:1px dashed var(--border-subtle);">
            <span style="color:#35D69A; font-size:22px;">${icon('circleCheck')}</span>
            <strong style="color:var(--text); font-size:13.5px;">Review Queue Clear</strong>
            <span style="font-size:12px;">All content drafts have been reviewed and approved.</span>
          </div>
        `}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 9. SCREEN 2: CAMPAIGNS MODULE
// --------------------------------------------------------------------------
function renderCampaigns() {
  const chosenBrand = state.brandFilter;
  const statusFilter = state.campaignStatusFilter || 'all';

  let campaigns = state.campaigns;
  if (chosenBrand !== 'all') {
    campaigns = campaigns.filter(c => c.brands.includes(chosenBrand));
  }
  if (statusFilter !== 'all') {
    campaigns = campaigns.filter(c => c.status === statusFilter);
  }

  const isGrid = state.campaignsViewMode === 'grid';

  return pageHead(
    'STRATEGIC INITIATIVES',
    'Campaign Portfolio & Intent.',
    'Manage your strategic marketing initiatives, brand alignment, and lifecycle state.',
    `
      <button class="btn btn-primary" data-action="new-campaign">${icon('plus')} Create Campaign</button>
    `
  ) + `
    <!-- Filters & View Options -->
    <div class="filter-strip" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:20px;">
      <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
        <select class="select" id="campaignBrandFilter" aria-label="Filter campaigns by brand">
          <option value="all">All YUJ Brands</option>
          ${[...new Set(state.accounts.map(a => a.brand))].map(b => `
            <option value="${e(b)}" ${chosenBrand === b ? 'selected' : ''}>${e(brandName(b))}</option>
          `).join('')}
        </select>

        <select class="select" id="campaignStatusFilter" aria-label="Filter campaigns by status">
          <option value="all" ${statusFilter === 'all' ? 'selected' : ''}>All Statuses</option>
          <option value="active" ${statusFilter === 'active' ? 'selected' : ''}>Active</option>
          <option value="draft" ${statusFilter === 'draft' ? 'selected' : ''}>Draft</option>
          <option value="paused" ${statusFilter === 'paused' ? 'selected' : ''}>Paused</option>
          <option value="completed" ${statusFilter === 'completed' ? 'selected' : ''}>Completed</option>
        </select>

        <span class="muted">${campaigns.length} campaign${campaigns.length === 1 ? '' : 's'} ${isDemo() ? '· illustrative' : ''}</span>
      </div>

      <div style="display:flex; gap:6px;">
        <button type="button" class="btn btn-sm ${isGrid ? 'btn-soft' : 'btn-subtle'}" data-action="toggle-campaign-view" data-mode="grid" title="Grid layout">
          ${icon('grid')}
        </button>
        <button type="button" class="btn btn-sm ${!isGrid ? 'btn-soft' : 'btn-subtle'}" data-action="toggle-campaign-view" data-mode="list" title="List layout">
          ${icon('overview')}
        </button>
      </div>
    </div>

    <!-- Campaign Cards (Grid or List) -->
    <div class="${isGrid ? 'media-card-grid' : 'wide-list'}">
      ${campaigns.length ? campaigns.map(c => {
        const slots = state.plans.filter(p => p.campaign_id === c.id).flatMap(p => p.slots);
        const posts = state.jobs.filter(p => (p.campaign_id || state.content.find(x => x.id === p.content_id)?.campaign_id) === c.id);
        const avatarClass = c.objective === 'sales' ? 'gold' : c.objective === 'trust' ? 'clay' : '';
        const avatarIcon = c.objective === 'sales' ? icon('trend') : c.objective === 'trust' ? icon('shield') : icon('target');

        if (isGrid) {
          return `
            <article class="panel panel-pad" style="display:flex; flex-direction:column; justify-content:space-between;">
              <div>
                <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
                  <div class="list-avatar ${avatarClass}" style="width:40px; height:40px;">${avatarIcon}</div>
                  ${tag(c.status)}
                </div>
                <h3 style="font-size:18px; margin:0 0 6px; font-weight:750; color:var(--text-primary);">${e(c.name)}</h3>
                <p style="font-size:14.5px; color:var(--text-muted); margin:0 0 14px;">
                  ${e(c.objective.charAt(0).toUpperCase() + c.objective.slice(1))} objective · ${e(c.brands.map(brandName).join(' + '))}
                </p>
                <div class="list-meta" style="flex-direction:column; align-items:flex-start; gap:6px; margin-bottom:18px;">
                  <span>${icon('grid')} ${slots.length} editorial slot(s)</span>
                  <span>${icon('send')} ${posts.length} publishing job(s)</span>
                  <span>Created ${dateLabel(c.created_at)}</span>
                </div>
              </div>
              <div style="display:flex; gap:8px; align-items:center; border-top:1px solid var(--border-subtle); padding-top:14px;">
                <button class="btn btn-sm btn-subtle" data-action="focus-campaign" data-id="${e(c.id)}" style="flex:1;">
                  Open Plan →
                </button>
                ${c.status === 'draft' ? `
                  <button class="btn btn-sm btn-soft" data-action="campaign-transition" data-id="${e(c.id)}" data-status="active">Activate</button>
                ` : c.status === 'active' ? `
                  <button class="btn btn-sm btn-subtle" data-action="campaign-transition" data-id="${e(c.id)}" data-status="paused">${icon('pause')} Pause</button>
                ` : c.status === 'paused' ? `
                  <button class="btn btn-sm btn-soft" data-action="campaign-transition" data-id="${e(c.id)}" data-status="active">${icon('play')} Resume</button>
                ` : ''}
              </div>
            </article>
          `;
        }

        return `
          <article class="list-card">
            <div class="list-avatar ${avatarClass}">${avatarIcon}</div>
            <div class="list-main">
              <h3>${e(c.name)} ${tag(c.status)}</h3>
              <p>${e(c.objective.charAt(0).toUpperCase() + c.objective.slice(1))} objective · ${e(c.brands.map(brandName).join(' + '))}</p>
              <div class="list-meta">
                <span>${icon('grid')} ${slots.length} editorial slots</span>
                <span>${icon('send')} ${posts.length} publishing jobs</span>
                <span>Created ${dateLabel(c.created_at)}</span>
              </div>
            </div>
            <div class="list-actions">
              <button class="btn btn-sm btn-subtle" data-action="focus-campaign" data-id="${e(c.id)}">Open Plan →</button>
              ${c.status === 'draft' ? `
                <button class="btn btn-sm btn-soft" data-action="campaign-transition" data-id="${e(c.id)}" data-status="active">Activate</button>
              ` : c.status === 'active' ? `
                <button class="btn btn-sm btn-subtle" data-action="campaign-transition" data-id="${e(c.id)}" data-status="paused">${icon('pause')} Pause</button>
              ` : c.status === 'paused' ? `
                <button class="btn btn-sm btn-soft" data-action="campaign-transition" data-id="${e(c.id)}" data-status="active">${icon('play')} Resume</button>
              ` : ''}
            </div>
          </article>
        `;
      }).join('') : empty('No campaigns match this filter', 'Create your first marketing campaign to begin editorial planning.', `<button class="btn btn-primary" data-action="new-campaign">${icon('plus')} New Campaign</button>`)}
    </div>

    <!-- Safety Warning Notice -->
    <div class="notice info" style="margin-top:24px;">
      ${icon('info')}
      <div>
        <b>Campaign Safety Invariant:</b> Pausing a campaign holds queued jobs; in-flight publishing jobs must finish before pause is complete. Resuming does not automatically unleash held jobs.
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 10. SCREEN 3: CONTENT PLANNER
// --------------------------------------------------------------------------
function renderPlanner() {
  const selected = state.selectedCampaign;
  const campaign = state.campaigns.find(c => c.id === selected);
  const plans = state.plans.filter(p => !selected || p.campaign_id === selected);
  const brands = campaign?.brands || [];
  const selectedBrand = brands.includes(state.plannerBrand) ? state.plannerBrand : (brands[0] || '');
  const availablePlatforms = [...new Set(state.accounts.filter(a => a.brand === selectedBrand).map(a => a.platform))];
  const platform = availablePlatforms.includes(state.plannerPlatform) ? state.plannerPlatform : (availablePlatforms[0] || 'instagram');
  const wk = startWeek(addDays(new Date(), 7));

  return pageHead(
    'EDITORIAL ARCHITECTURE',
    'Plan the story before the pixels.',
    'Build a weekly content calendar of editorial topic angles, then pass verified briefs into the Creative Lab.',
    `
      <button class="btn btn-subtle" data-action="navigate" data-target="campaigns">${icon('target')} Switch Campaign</button>
    `
  ) + `
    <div class="section-grid" style="display:grid; grid-template-columns:minmax(0,1.4fr) minmax(320px,1fr); gap:24px;">
      <!-- Weekly Composer -->
      <section class="panel panel-pad">
        <div class="panel-head">
          <div>
            <h2>New Weekly Content Brief</h2>
            <p>Saved topics become proposed slots ready for creative rendering</p>
          </div>
          ${tag(campaign?.status || 'Select Campaign')}
        </div>

        <form id="weeklyPlanForm" class="form-stack">
          <label class="form-label">
            Target Campaign
            <select name="campaign_id" id="planCampaignSelect" required>
              ${state.campaigns.map(c => `
                <option value="${e(c.id)}" ${c.id === selected ? 'selected' : ''}>${e(c.name)} · ${e(c.status)}</option>
              `).join('')}
            </select>
          </label>

          <div class="form-row">
            <label class="form-label">
              Brand
              <select name="brand" id="planBrandSelect" required>
                ${brands.map(b => `
                  <option value="${e(b)}" ${b === selectedBrand ? 'selected' : ''}>${e(brandName(b))}</option>
                `).join('')}
              </select>
            </label>
            <label class="form-label">
              Platform Channel
              <select name="platform" id="planPlatformSelect">
                ${availablePlatforms.map(p => `
                  <option value="${e(p)}" ${p === platform ? 'selected' : ''}>${e(p)}</option>
                `).join('')}
              </select>
            </label>
          </div>

          <label class="form-label">
            Week Beginning (Asia/Kolkata)
            <input type="date" id="planStartDate" name="week_start" min="${localISO(new Date())}" value="${e(state.plannerWeek || localISO(wk))}" required />
          </label>

          <label class="form-label">
            Editorial Topic Slots · 1 to 7 lines
            <textarea name="topics" id="planTopics" rows="5" required maxlength="1400" placeholder="Example:\nWhy attention matters in daily learning\nWhat life education means for family discussions\nPractical questions parents can ask">${e(state.plannerTopics || '')}</textarea>
            <small>Supply 1–7 topic lines. Prompts are editorial suggestions, not verified facts.</small>
          </label>

          <div style="display:flex; justify-content:space-between; gap:10px; flex-wrap:wrap; margin-top:8px;">
            <button type="button" class="btn btn-subtle" data-action="suggest-topics">
              ${icon('sparkles')} Suggest Topic Angles
            </button>
            <button type="submit" class="btn btn-primary" ${!campaign || !['draft', 'active'].includes(campaign.status) ? 'disabled' : ''}>
              Save Editorial Plan ${icon('arrow')}
            </button>
          </div>
        </form>
      </section>

      <!-- Workflow Guidelines & Safety Standards -->
      <aside class="panel panel-pad">
        <div class="panel-head">
          <div>
            <h2>Editorial Workflow Principles</h2>
            <p>Consistency, brand safety, and human control</p>
          </div>
        </div>
        <div class="step-list">
          ${[
            ['01', 'Define Business Objective', 'Ground every post in brand awareness, trust, or community learning.'],
            ['02', 'Propose Editorial Slots', 'Topics are planned in advance, never auto-posted to social feeds.'],
            ['03', 'Generate Creative in Lab', 'Feed verified factual claims into the Engine15 layout engine.'],
            ['04', 'Human Review Gate', 'Reviewers audit visual composition, caption copy, and tone.'],
            ['05', 'Schedule and Publish', 'Only human-approved posts are scheduled for execution.']
          ].map(x => `
            <div class="step-row">
              <span class="step-index">${x[0]}</span>
              <div>
                <strong>${x[1]}</strong>
                <small>${x[2]}</small>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="notice info" style="margin-top:22px;">
          ${icon('shield')} All render requests require human-verified facts. Diffusion and automatic multi-variant generation are not enabled in the current Engine15 adapter.
        </div>
      </aside>
    </div>

    <!-- Saved Slots List -->
    <div class="section-heading" style="margin-top:32px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h2>Saved Editorial Slots</h2>
        <p>${e(campaign?.name || 'Select a campaign')} · ${plans.reduce((n, p) => n + (p.slots?.length || 0), 0)} planned slot(s)</p>
      </div>
      <button class="btn btn-sm btn-subtle" data-action="refresh">${icon('refresh')} Refresh Slots</button>
    </div>

    <div class="slot-list" style="display:grid; gap:10px; margin-top:14px;">
      ${plans.length ? plans.flatMap(p => p.slots.map(slot => {
        const production = state.production.find(j => j.slot_id === slot.id);
        return `
          <article class="timeline-slot panel" style="padding:16px 20px; display:flex; gap:16px; align-items:center;">
            <div class="slot-time" style="min-width:85px; text-align:center; padding:8px; border-radius:var(--radius-md); background:var(--bg-surface-elevated);">
              <div style="font-weight:750; font-size:14px;">${e(dateLabel(slot.scheduled_at, { day: 'numeric', month: 'short' }))}</div>
              <div class="muted" style="font-size:12.5px;">${new Date(slot.scheduled_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' })}</div>
            </div>
            <div class="slot-main" style="flex:1;">
              <b style="font-size:16px; color:var(--text-primary);">${e(slot.topic)}</b>
              <p style="font-size:14px; color:var(--text-muted); margin:4px 0 0;">
                ${e(brandName(slot.brand))} · ${e(slot.platform)} · ${e(slot.evidence?.replaceAll('_', ' ') || 'editorial slot')}
              </p>
              <div style="margin-top:6px;">${tag(production?.status || slot.state)}</div>
            </div>
            <div class="slot-actions">
              ${!production && slot.state === 'proposed' ? (
                !isDemo() && Array.isArray(state.renderer?.brands) && !state.renderer.brands.includes(slot.brand)
                  ? '<span class="tag warn">Brand assets needed</span>'
                  : `<button class="btn btn-sm btn-soft" data-action="request-render" data-id="${e(slot.id)}">${icon('sparkles')} Generate Creative</button>`
              ) : production?.content_id ? `
                <button class="btn btn-sm btn-subtle" data-action="open-review" data-id="${e(production.content_id)}">Review Draft →</button>
              ` : `
                <button class="btn btn-sm btn-subtle" data-action="navigate" data-target="creative">Track Render →</button>
              `}
            </div>
          </article>
        `;
      })).join('') : empty('No saved editorial slots yet', 'Compose a weekly brief above to establish editorial topics for production.')}
    </div>
  `;
}

// --------------------------------------------------------------------------
// 11. SCREEN 4: CREATIVE LAB (VISUAL CENTERPIECE)
// --------------------------------------------------------------------------
function renderCreative() {
  const pending = state.production.filter(p => ['queued', 'waiting_import', 'retry', 'dispatched', 'rendering'].includes(p.status)).length;
  const imported = state.production.filter(p => p.status === 'imported').length;
  const jobs = state.production.slice().sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const sample = env.mode === 'demo' ? 'assets/engine15-sample.png' : state.content.map(c => previewUrl(c)).find(Boolean);

  return pageHead(
    'YUJ STUDIO V2.5 / ENGINE15',
    'A canvas for verified ideas.',
    'Deterministic, brand-safe archetype composition with human-verified facts and zero-diffusion compliance.',
    `
      <button class="btn btn-subtle" data-action="navigate" data-target="reviews">${icon('check')} Review Drafts</button>
      <button class="btn btn-primary" data-action="navigate" data-target="planner">${icon('plus')} Request Creative</button>
    `
  ) + `
    <!-- Integrated Creative Studio Hero -->
    <div class="creative-hero">
      <section class="panel creative-workbench">
        <div class="panel-head">
          <div>
            <h2>Integrated Creative Pipeline</h2>
            <p>From editorial brief → deterministic canvas render → unapproved draft</p>
          </div>
          <span class="tag good">${icon('circleCheck')} Engine15 Renderer</span>
        </div>
        <div class="step-list">
          ${[
            ['Brief Received', 'Campaign slot provides the verified editorial subject.'],
            ['Composition Selected', 'Archetype layout, verified facts injection & brand palette.'],
            ['Rendered & Quality-Checked', 'Deterministic canvas rendering with text collision audits.'],
            ['Draft Imported to Social Studio', 'A successful render creates an unapproved draft record.'],
            ['Human Approval Gate', 'Publishing cannot be executed automatically by the renderer.']
          ].map((x, i) => `
            <div class="step-row">
              <span class="step-index">${i + 1}</span>
              <div>
                <strong>${x[0]}</strong>
                <small>${x[1]}</small>
              </div>
              ${i === 4 ? '<span class="tag good">Required</span>' : ''}
            </div>
          `).join('')}
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; margin-top:22px;">
          <span class="pill">${pending} Active Request(s)</span>
          <span class="pill good">${imported} Imported Draft(s)</span>
          <span class="pill warn">Diffusion Off (Verified Facts Mode)</span>
        </div>
      </section>

      <!-- Aspect-Ratio Canvas Preview -->
      <div class="creative-preview-large">
        ${sample ? `
          <img src="${e(sample)}" alt="Genuine Engine15 sample output" />
        ` : `
          <div class="faux-preview green">
            <span class="faux-brand">YUJ DESIGN ENGINE</span>
            <div class="faux-title">Original Engine.<br/>Original Ideas.</div>
            <div class="faux-bottom">CREATIVE PRODUCTION CANVAS</div>
          </div>
        `}
        <div class="image-overlay">
          <span>${isDemo() ? 'GENUINE ENGINE15 SAMPLE' : 'CREATIVE PREVIEW'}</span>
          <strong>${isDemo() ? 'SAMPLE' : 'NO AUTO-PUBLISH'}</strong>
        </div>
      </div>
    </div>

    <!-- Architectural Disclosure Notice -->
    <div class="notice" style="margin:22px 0;">
      ${icon('info')}
      <div>
        <strong>Capability Boundary Disclosure:</strong> The currently documented adapter operates in deterministic composition mode (<code>diffusion_enabled: false</code>). Automated variant generation and AI prompt experiments are illustrated below as UI design concepts for future pipeline phases.
      </div>
    </div>

    <!-- Variant Strategy Concept Cards -->
    <div class="section-heading" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h2>Variant Strategy Preview</h2>
        <p>Architectural concepts for future multi-variant creative pipelines</p>
      </div>
      <span class="tag warn">DESIGN CONCEPT ONLY</span>
    </div>

    <div class="media-card-grid">
      ${[
        ['green', 'A', 'Hero Statement', 'Bold headline with primary focal composition', 'Maximum impact for community awareness'],
        ['earth', 'B', 'Problem → Solution', 'Contrast-led narrative with practical use cases', 'Best for technical product storytelling'],
        ['blue', 'C', 'Educational Explainer', 'Structured proof points and conversational inquiry', 'Optimized for trust and family engagement']
      ].map((x, i) => `
        <div class="media-card">
          <div class="media-image">
            <div class="faux-preview ${x[0]}">
              <span class="faux-brand">YUJ STUDIO · CONCEPT ${x[1]}</span>
              <strong class="faux-title">${e(x[3])}</strong>
              <span class="faux-bottom">${e(x[2].toUpperCase())}</span>
            </div>
          </div>
          <div class="media-card-body">
            <h3>Direction ${x[1]} — ${e(x[2])}</h3>
            <p>${e(x[4])}. Designed for future variant-testing pipelines.</p>
            <div class="media-card-actions">
              <span class="tag">UI CONCEPT</span>
              <span class="muted">No external jobs created</span>
            </div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Real Renderer Activity Table -->
    <div class="section-heading" style="margin-top:32px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h2>Production Job Tracking</h2>
        <p>Authoritative creative rendering jobs and their Social Studio import status ${isDemo() ? '· sample' : ''}</p>
      </div>
      <button class="btn btn-sm btn-subtle" data-action="refresh">${icon('refresh')} Refresh Status</button>
    </div>

    <div class="panel panel-pad" style="margin-top:14px;">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Editorial Slot / Job</th>
              <th>Brand / Channel</th>
              <th>Status</th>
              <th>Rendered Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${jobs.length ? jobs.map(p => {
              const slot = state.plans.flatMap(p => p.slots || []).find(s => s.id === p.slot_id);
              return `
                <tr>
                  <td>
                    <b class="table-primary">${e(trunc(slot?.topic || p.generation_id, 48))}</b><br />
                    <span class="muted" style="font-family:var(--font-mono); font-size:12.5px;">${e(trunc(p.generation_id, 32))}</span>
                  </td>
                  <td>
                    ${e(brandName(p.brand))}<br />
                    <span class="muted">${e(p.platform)}</span>
                  </td>
                  <td>${tag(p.status)}</td>
                  <td>${e(dateLabel(p.created_at))}</td>
                  <td>
                    ${p.content_id ? `
                      <button class="btn-link" data-action="open-review" data-id="${e(p.content_id)}">Open Draft ↗</button>
                      <button class="btn-link" data-action="caption-ideas" data-id="${e(p.id)}">Caption Ideas</button>
                    ` : p.status === 'uncertain' ? `
                      <span class="tag danger">Reconciliation Needed</span>
                    ` : '<span class="muted">Awaiting Import</span>'}
                  </td>
                </tr>
              `;
            }).join('') : `
              <tr>
                <td colspan="5" style="text-align:center; padding:32px; color:var(--text-muted);">
                  No production jobs found. Select an editorial slot in Content Planner to begin.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 12. SCREEN 5: REVIEW QUEUE (HUMAN-IN-THE-LOOP APPROVAL GATE)
// --------------------------------------------------------------------------
function renderReviews() {
  const drafts = state.content.filter(c => c.status === 'draft').length;
  const approved = state.content.filter(c => c.status === 'approved').length;
  const tab = state.reviewTab || 'draft';
  const items = state.content
    .filter(c => tab === 'all' || c.status === tab)
    .filter(c => state.brandFilter === 'all' || state.brandFilter === c.brand)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return pageHead(
    'HUMAN-IN-THE-LOOP APPROVAL',
    'Review with intention.',
    'No content may reach Meta channels without explicit human verification of facts, visuals, and copy.',
    `
      <button class="btn btn-subtle" data-action="upload-draft">${icon('upload')} Upload Draft Asset</button>
      <button class="btn btn-primary" data-action="navigate" data-target="planner">${icon('sparkles')} Request New Creative</button>
    `
  ) + `
    <div class="panel panel-pad">
      <!-- Tabs & Brand Filtering -->
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:16px;">
        <div class="tabs" style="margin-bottom:0; border:none; padding-bottom:0;">
          <button class="tab-btn ${tab === 'draft' ? 'active' : ''}" data-action="review-tab" data-tab="draft">
            Waiting for Approval <span class="tab-count">${drafts}</span>
          </button>
          <button class="tab-btn ${tab === 'approved' ? 'active' : ''}" data-action="review-tab" data-tab="approved">
            Approved <span class="tab-count">${approved}</span>
          </button>
          <button class="tab-btn ${tab === 'all' ? 'active' : ''}" data-action="review-tab" data-tab="all">
            All Creatives
          </button>
        </div>

        <select class="select" id="reviewBrandFilter" aria-label="Filter review queue by brand">
          <option value="all">All Brands</option>
          ${[...new Set(state.accounts.map(a => a.brand))].map(b => `
            <option value="${e(b)}" ${state.brandFilter === b ? 'selected' : ''}>${e(brandName(b))}</option>
          `).join('')}
        </select>
      </div>

      <!-- Creatives List -->
      <div class="review-list">
        ${items.length ? items.map(c => {
          const image = previewUrl(c);
          return `
            <div class="review-row">
              <div class="review-preview">
                ${image ? `
                  <img src="${e(image)}" alt="Draft visual preview" loading="lazy" />
                ` : `
                  <div class="faux-preview green" style="padding:10px;">
                    <span class="faux-brand" style="font-size:7px;">YUJ</span>
                    <b style="font-family:var(--font-serif); font-size:11px;">${e(brandName(c.brand))}</b>
                    <span class="faux-bottom" style="font-size:7px;">DRAFT ASSET</span>
                  </div>
                `}
              </div>
              <div class="review-body">
                <h3>${e(trunc(c.caption, 110))}</h3>
                <p>${e(brandName(c.brand))} · ${e(c.content_type || 'image')} · ${e(campaignName(c.campaign_id))}</p>
                <small>Created ${dateLabel(c.created_at)} · ${c.status === 'draft' ? 'Pending human approval' : 'Verified & Approved'}</small>
              </div>
              <div class="review-actions">
                ${tag(c.status)}
                <button class="btn btn-sm btn-subtle" data-action="open-review" data-id="${e(c.id)}">
                  ${icon('eye')} View & Edit
                </button>
                ${c.status === 'draft' ? `
                  <button class="btn btn-sm btn-primary" data-action="approve" data-id="${e(c.id)}">
                    ${icon('check')} Approve Creative
                  </button>
                ` : c.status === 'approved' ? `
                  <button class="btn btn-sm btn-soft" data-action="schedule" data-id="${e(c.id)}">
                    ${icon('calendar')} Schedule Post
                  </button>
                ` : ''}
              </div>
            </div>
          `;
        }).join('') : empty('Review queue is completely clear', 'No creatives match this filter. Generate from Content Planner or upload a manual draft.')}
      </div>
    </div>

    <!-- Governance Invariant Notice -->
    <div class="notice info" style="margin-top:24px;">
      ${icon('shield')}
      <div>
        <b>Security Invariant:</b> Reviewing is never publishing. Approval certifies that visual layout, factual claims, and brand assets comply with governance before scheduling is unlocked.
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 13. SCREEN 6: PUBLISHING CALENDAR (REFERENCE IMAGE 1 INSPIRATION)
// --------------------------------------------------------------------------
function renderCalendar() {
  const currentMonth = state.calendarMonth || new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const selectedDate = state.calendarSelectedDate || new Date();
  const selectedBrand = state.brandFilter || 'all';
  const selectedPlatform = state.calendarPlatformFilter || 'all';
  const selectedStatus = state.calendarStatusFilter || 'all';
  const viewMode = state.calendarViewMode || 'month';

  const source = state.calendarEntries || state.jobs;
  
  // Filter jobs based on selected criteria
  const filteredJobs = source.filter(j => {
    const jobBrand = j.brand || state.content.find(c => c.id === j.content_id)?.brand;
    const matchBrand = selectedBrand === 'all' || jobBrand === selectedBrand;
    const matchPlatform = selectedPlatform === 'all' || j.platform === selectedPlatform;
    const matchStatus = selectedStatus === 'all' || j.status === selectedStatus;
    return matchBrand && matchPlatform && matchStatus;
  });

  const monthYearLabel = currentMonth.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });
  const selectedDayStr = selectedDate.toDateString();
  const dayJobs = filteredJobs.filter(j => new Date(j.run_at).toDateString() === selectedDayStr)
    .sort((a, b) => new Date(a.run_at) - new Date(b.run_at));

  // Build the center calendar view
  let calendarCenterHtml = '';

  if (viewMode === 'month') {
    // 7-column monthly grid
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDayIndex = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const weekdayHeaders = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    let gridCellsHtml = weekdayHeaders.map(day => `
      <div class="cal-weekday-header">${day}</div>
    `).join('');

    // Days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const cellDate = new Date(year, month - 1, dayNum);
      const isSelected = cellDate.toDateString() === selectedDayStr;
      const cellJobs = filteredJobs.filter(j => new Date(j.run_at).toDateString() === cellDate.toDateString());
      gridCellsHtml += renderCalCell(cellDate, dayNum, true, false, isSelected, cellJobs);
    }

    // Days in current month
    const todayStr = new Date().toDateString();
    for (let dayNum = 1; dayNum <= daysInMonth; dayNum++) {
      const cellDate = new Date(year, month, dayNum);
      const isToday = cellDate.toDateString() === todayStr;
      const isSelected = cellDate.toDateString() === selectedDayStr;
      const cellJobs = filteredJobs.filter(j => new Date(j.run_at).toDateString() === cellDate.toDateString());
      gridCellsHtml += renderCalCell(cellDate, dayNum, false, isToday, isSelected, cellJobs);
    }

    // Days from next month
    const totalRendered = firstDayIndex + daysInMonth;
    const nextDaysCount = (7 - (totalRendered % 7)) % 7;
    for (let dayNum = 1; dayNum <= nextDaysCount; dayNum++) {
      const cellDate = new Date(year, month + 1, dayNum);
      const isSelected = cellDate.toDateString() === selectedDayStr;
      const cellJobs = filteredJobs.filter(j => new Date(j.run_at).toDateString() === cellDate.toDateString());
      gridCellsHtml += renderCalCell(cellDate, dayNum, true, false, isSelected, cellJobs);
    }

    calendarCenterHtml = `<div class="month-grid">${gridCellsHtml}</div>`;
  } else {
    // Week Mode
    const from = state.calendarStart || startWeek(new Date());
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = addDays(from, i);
      const isToday = day.toDateString() === new Date().toDateString();
      const isSelected = day.toDateString() === selectedDayStr;
      const dayJobsInWeek = filteredJobs.filter(j => new Date(j.run_at).toDateString() === day.toDateString());
      return `
        <div class="calendar-cell ${isToday ? 'today' : ''} ${isSelected ? 'selected-day' : ''}" data-action="calendar-select-date" data-date="${day.toISOString()}">
          <div class="calendar-top">
            ${day.toLocaleDateString('en-IN', { weekday: 'short' })}
            <b>${day.getDate()}</b>
          </div>
          ${dayJobsInWeek.length ? dayJobsInWeek.map(j => `
            <button class="calendar-post ${j.status === 'published' ? 'gray' : j.status === 'scheduled' ? '' : 'orange'}" data-action="calendar-job" data-id="${e(j.id)}" title="${e(accountName(j.account_id))} · ${e(j.status)}">
              ${e(j.platform === 'instagram' ? 'IG' : j.platform === 'facebook' ? 'FB' : 'LI')} · ${e(trunc(j.caption_preview || state.content.find(c => c.id === j.content_id)?.caption || j.status, 24))}
            </button>
          `).join('') : '<span class="week-empty">No posts</span>'}
        </div>
      `;
    }).join('');
    calendarCenterHtml = `<div class="mini-calendar">${weekDays}</div>`;
  }

  const selectedDateFormatted = selectedDate.toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return pageHead(
    'PUBLISHING CALENDAR',
    'Editorial orchestration & dispatch timing.',
    'Interactive monthly schedule, multi-platform dispatch tracking, and Meta publication receipts.',
    `
      <button class="btn btn-primary" data-action="navigate" data-target="reviews">
        ${icon('plus')} Schedule Approved Post
      </button>
    `
  ) + `
    <!-- 3-Part Calendar Workspace (Inspired by Reference Image 1) -->
    <div class="calendar-workspace">
      <!-- Main Calendar Grid Area (70-75% Width) -->
      <div class="calendar-main">
        <!-- Controls & Navigation Toolbar -->
        <div class="cal-toolbar">
          <div class="cal-nav-group">
            <button class="icon-btn" data-action="calendar-month-prev" aria-label="Previous month">${icon('back')}</button>
            <h2 class="cal-month-title">${e(monthYearLabel)}</h2>
            <button class="icon-btn" data-action="calendar-month-next" aria-label="Next month">${icon('arrow')}</button>
            <button class="btn btn-sm btn-subtle" data-action="calendar-month-today">Today</button>
          </div>

          <!-- View Switcher (Month / Week) -->
          <div class="cal-view-switch">
            <button type="button" class="cal-view-btn ${viewMode === 'month' ? 'active' : ''}" data-action="calendar-view-mode" data-mode="month">
              ${icon('calendarView')} Month
            </button>
            <button type="button" class="cal-view-btn ${viewMode === 'week' ? 'active' : ''}" data-action="calendar-view-mode" data-mode="week">
              ${icon('listView')} Week
            </button>
          </div>

          <!-- Filters -->
          <div class="cal-filters-group">
            <select class="select" id="calendarBrandFilter" style="min-width:140px;">
              <option value="all">All Brands</option>
              ${[...new Set(state.accounts.map(a => a.brand))].map(b => `
                <option value="${e(b)}" ${selectedBrand === b ? 'selected' : ''}>${e(brandName(b))}</option>
              `).join('')}
            </select>

            <select class="select" id="calendarPlatformFilter" style="min-width:130px;">
              <option value="all" ${selectedPlatform === 'all' ? 'selected' : ''}>All Platforms</option>
              <option value="instagram" ${selectedPlatform === 'instagram' ? 'selected' : ''}>Instagram</option>
              <option value="facebook" ${selectedPlatform === 'facebook' ? 'selected' : ''}>Facebook</option>
              <option value="linkedin" ${selectedPlatform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
            </select>

            <select class="select" id="calendarStatusFilter" style="min-width:120px;">
              <option value="all" ${selectedStatus === 'all' ? 'selected' : ''}>All Statuses</option>
              <option value="scheduled" ${selectedStatus === 'scheduled' ? 'selected' : ''}>Scheduled</option>
              <option value="published" ${selectedStatus === 'published' ? 'selected' : ''}>Published</option>
              <option value="held" ${selectedStatus === 'held' ? 'selected' : ''}>Held</option>
              <option value="failed" ${selectedStatus === 'failed' ? 'selected' : ''}>Failed</option>
            </select>
          </div>
        </div>

        <!-- Rendered Grid -->
        ${calendarCenterHtml}

        <div class="form-help" style="margin-top:16px;">
          ${filteredJobs.length} dispatch(es) matching current filters. Click any day on the grid to inspect scheduled times, or click an event chip to view full publication details.
        </div>
      </div>

      <!-- Right-Side Contextual Daily Schedule Inspector (25-30% Width) -->
      <div class="calendar-sidebar">
        <div class="daily-schedule-head">
          <div>
            <div class="daily-schedule-title">Daily Schedule</div>
            <h3 class="daily-schedule-date">${e(selectedDateFormatted)}</h3>
          </div>
          <span class="pill">${dayJobs.length} dispatch${dayJobs.length === 1 ? '' : 'es'}</span>
        </div>

        <div class="daily-schedule-list">
          ${dayJobs.length ? dayJobs.map(j => {
            const c = state.content.find(x => x.id === j.content_id);
            const caption = j.caption_preview || c?.caption || 'Dispatched social publication';
            const timeStr = new Date(j.run_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
            const pLabel = j.platform === 'instagram' ? 'Instagram' : j.platform === 'facebook' ? 'Facebook' : 'LinkedIn';
            const pIcon = j.platform === 'instagram' ? 'instagram' : j.platform === 'facebook' ? 'facebook' : 'linkedin';
            const thumb = previewUrl(c);

            return `
              <div class="daily-schedule-card">
                <div class="daily-card-top">
                  <span class="daily-card-time">${icon('clock')} ${e(timeStr)}</span>
                  ${tag(j.status)}
                </div>
                <h4 class="daily-card-title">${e(caption)}</h4>
                <div class="daily-card-meta">
                  <span>${icon(pIcon)} <b>${e(pLabel)}</b></span>
                  <span>·</span>
                  <span>${e(accountName(j.account_id))}</span>
                </div>
                ${j.remote_post_id ? `
                  <div class="daily-card-receipt">
                    ${icon('check')} Meta Receipt: ${e(j.remote_post_id)}
                  </div>
                ` : ''}
                <div class="daily-card-actions">
                  <button class="btn btn-sm btn-subtle" data-action="calendar-job" data-id="${e(j.id)}">
                    ${j.status === 'scheduled' ? 'Inspect / Reschedule' : 'View Details'} ↗
                  </button>
                </div>
              </div>
            `;
          }).join('') : `
            <div class="daily-schedule-empty">
              <div class="daily-empty-icon">${icon('calendar')}</div>
              <p style="font-weight:750; color:var(--text-primary); margin:0 0 6px;">No Dispatches Scheduled</p>
              <p style="font-size:13.5px; margin:0 0 16px;">There are no posts scheduled or published for ${e(selectedDateFormatted)}.</p>
              <button class="btn btn-sm btn-primary" data-action="navigate" data-target="reviews">
                ${icon('plus')} Schedule Approved Post
              </button>
            </div>
          `}
        </div>
      </div>
    </div>

    <!-- Upcoming Jobs List Table -->
    <div class="section-heading" style="margin-top:32px; display:flex; justify-content:space-between; align-items:center;">
      <div>
        <h2>All Scheduled Dispatches & Publication Receipts</h2>
        <p>Execution queue sorted by scheduled timestamp</p>
      </div>
      <span class="pill">${filteredJobs.length} item(s)</span>
    </div>

    <div class="panel panel-pad" style="margin-top:14px;">
      <div class="table-wrap">
        <table class="data-table">
          <thead>
            <tr>
              <th>Post Preview / Account</th>
              <th>Scheduled Time (Asia/Kolkata)</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            ${filteredJobs.length ? filteredJobs.slice().sort((a, b) => new Date(a.run_at) - new Date(b.run_at)).map(j => `
              <tr>
                <td>
                  <b class="table-primary">${e(trunc(j.caption_preview || state.content.find(c => c.id === j.content_id)?.caption || 'Social Post', 48))}</b><br />
                  <span class="muted">${e(accountName(j.account_id))}</span>
                </td>
                <td>${e(timeLabel(j.run_at))}</td>
                <td>
                  <span style="display:inline-flex; align-items:center; gap:5px;">
                    ${icon(j.platform === 'instagram' ? 'instagram' : j.platform === 'facebook' ? 'facebook' : 'linkedin')}
                    ${e(j.platform.toUpperCase())}
                  </span>
                </td>
                <td>${tag(j.status)}</td>
                <td>
                  <button class="btn-link" data-action="calendar-job" data-id="${e(j.id)}">Details ↗</button>
                </td>
              </tr>
            `).join('') : `
              <tr>
                <td colspan="5" style="text-align:center; padding:32px; color:var(--text-muted);">
                  No publishing jobs scheduled matching selected filters.
                </td>
              </tr>
            `}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderCalCell(cellDate, dayNum, isAdjacent, isToday, isSelected, cellJobs) {
  const dateISO = cellDate.toISOString();
  const maxChips = 3;
  const visibleChips = cellJobs.slice(0, maxChips);
  const remainingCount = cellJobs.length - maxChips;

  const chipsHtml = visibleChips.map(j => {
    const c = state.content.find(x => x.id === j.content_id);
    const caption = j.caption_preview || c?.caption || 'Dispatched post';
    const timeStr = new Date(j.run_at).toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true });
    const pTag = j.platform === 'instagram' ? 'IG' : j.platform === 'facebook' ? 'FB' : 'LI';
    return `
      <button class="cal-event-chip chip-${j.status}" data-action="calendar-job" data-id="${e(j.id)}" title="${e(timeStr)} · ${e(caption)} (${e(j.status)})">
        <span class="chip-platform-tag">${e(pTag)}</span>
        <span class="chip-caption">${e(trunc(caption, 16))}</span>
      </button>
    `;
  }).join('');

  const moreBtnHtml = remainingCount > 0 ? `
    <button class="cal-more-btn" data-action="calendar-select-date" data-date="${dateISO}">
      +${remainingCount} more
    </button>
  ` : '';

  return `
    <div class="cal-day-cell ${isAdjacent ? 'adjacent-month' : ''} ${isToday ? 'today' : ''} ${isSelected ? 'selected-day' : ''}" data-action="calendar-select-date" data-date="${dateISO}">
      <div class="cal-day-header">
        <span class="cal-day-num">${dayNum}</span>
        ${isToday ? '<span class="cal-today-badge">TODAY</span>' : ''}
      </div>
      <div class="cal-chips-container">
        ${chipsHtml}
        ${moreBtnHtml}
      </div>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 14. SCREEN 7: PERFORMANCE INTELLIGENCE COMMAND CENTER (REFERENCE-ACCURATE)
// --------------------------------------------------------------------------
function renderAnalytics() {
  const analytics = getAggregatedAnalytics();
  const selectedCampaignObj = state.perfCampaign ? state.campaigns.find(c => c.id === state.perfCampaign) : null;
  const campaignTitle = selectedCampaignObj
    ? `${selectedCampaignObj.name.toUpperCase()} — CAMPAIGN PERFORMANCE`
    : 'PORTFOLIO PERFORMANCE INTELLIGENCE';
  const campaignSubtitle = selectedCampaignObj
    ? `Objective: ${selectedCampaignObj.objective.toUpperCase()} • Created by: ${selectedCampaignObj.created_by} • Verified Meta Telemetry`
    : `Aggregated Performance • Window: Last ${analytics.days} Days • Connected Meta Graph API / SQLite WAL`;

  const perfGauge = (pct, color, label) => {
    const validPct = (typeof pct === 'number' && Number.isFinite(pct) && pct >= 0) ? Math.min(100, Math.round(pct)) : null;
    const r = 16;
    const circ = 2 * Math.PI * r;
    const offset = validPct !== null ? circ - (validPct / 100) * circ : circ;
    return `
      <div style="position:relative; width:38px; height:38px; display:grid; place-items:center; flex-shrink:0;">
        <svg viewBox="0 0 40 40" style="width:38px; height:38px; transform:rotate(-90deg);">
          <circle cx="20" cy="20" r="${r}" fill="none" stroke="#202834" stroke-width="3.5" />
          <circle cx="20" cy="20" r="${r}" fill="none" stroke="${validPct !== null ? color : '#364356'}" stroke-width="3.5"
            stroke-dasharray="${circ}" stroke-dashoffset="${offset}" stroke-linecap="round" />
        </svg>
        <span style="position:absolute; font-size:9px; font-weight:800; color:#F3F5F7;">${validPct !== null ? validPct + '%' : (label || '—')}</span>
      </div>
    `;
  };

  const perfIconBox = (ic, color) => `
    <div style="width:38px; height:38px; border-radius:50%; background:rgba(255,255,255,0.05); border:1px solid #293444; color:${color}; display:grid; place-items:center; flex-shrink:0;">
      ${icon(ic)}
    </div>
  `;

  const bestPlatformObj = [...analytics.platformBreakdown].sort((a, b) => b.reach - a.reach)[0];
  const bestPlatform = bestPlatformObj && bestPlatformObj.reach > 0
    ? `${bestPlatformObj.platform.toUpperCase()} (${formatNumber(bestPlatformObj.reach)} reach)`
    : 'None observed';

  return pageHead(
    'PERFORMANCE INTELLIGENCE',
    campaignTitle,
    campaignSubtitle,
    `
      <button class="btn btn-subtle" data-action="refresh-perf">${icon('refresh')} Sync Telemetry</button>
      <button class="perf-btn-export" data-action="export-report">${icon('upload')} Export Report</button>
    `
  ) + `
    <div class="perf-workspace">
      <!-- Top Header & Filter Controls Bar -->
      <div class="perf-top-bar">
        <div class="perf-top-title">
          <h2>${e(campaignTitle)}</h2>
          <p>${e(campaignSubtitle)}</p>
        </div>

        <div class="perf-top-controls">
          <button class="perf-select-btn" data-action="perf-date-picker">${icon('calendar')} Last ${analytics.days} Days ▾</button>
          <button class="perf-select-btn" data-action="perf-channel-filter">${analytics.platformFilter === 'all' ? 'All Channels' : analytics.platformFilter.toUpperCase()} ▾</button>
          <button class="perf-select-btn" data-action="perf-campaign-filter">${selectedCampaignObj ? e(selectedCampaignObj.name) : 'All Campaigns'} ▾</button>
          <button class="perf-btn-export" data-action="export-report">${icon('upload')} Export Report</button>
          <button class="icon-btn" data-action="refresh-perf" title="Sync Telemetry" style="background:#1B2330; border:1px solid #293444; border-radius:6px; color:#F3F5F7;">
            ${icon('refresh')}
          </button>
        </div>
      </div>

      <!-- Row of 7 KPI Cards (Dynamically Connected to Actual Backend Telemetry) -->
      <div class="perf-kpi-strip">
        <!-- 1. Total Impressions -->
        <div class="perf-kpi-card">
          <div class="perf-kpi-card-header">Total Impressions</div>
          <div class="perf-kpi-card-main">
            ${perfGauge(analytics.totalViews != null ? 100 : null, '#FF793D')}
            <div>
              <div class="perf-kpi-val">${analytics.totalViews != null ? formatNumber(analytics.totalViews) : '—'}</div>
              <div class="perf-kpi-trend" style="color:${analytics.totalViews != null ? '#18C99A' : '#6C7A8D'};">
                ${analytics.totalViews != null ? '● Observed via Meta' : 'Pending platform poll'}
              </div>
            </div>
          </div>
          <div class="perf-kpi-sub">Total verified video & post impressions</div>
        </div>

        <!-- 2. Unique Reach -->
        <div class="perf-kpi-card">
          <div class="perf-kpi-card-header">Unique Reach</div>
          <div class="perf-kpi-card-main">
            ${perfGauge(analytics.totalReach != null ? 100 : null, '#16B8E8')}
            <div>
              <div class="perf-kpi-val">${analytics.totalReach != null ? formatNumber(analytics.totalReach) : '—'}</div>
              <div class="perf-kpi-trend" style="color:${analytics.totalReach != null ? '#18C99A' : '#6C7A8D'};">
                ${(analytics.totalReach && analytics.totalViews) ? 'Freq: ' + (analytics.totalViews / analytics.totalReach).toFixed(2) + 'x per user' : 'Distinct accounts'}
              </div>
            </div>
          </div>
          <div class="perf-kpi-sub">Unique audience accounts reached</div>
        </div>

        <!-- 3. Engagement Rate -->
        <div class="perf-kpi-card">
          <div class="perf-kpi-card-header">Engagement Rate</div>
          <div class="perf-kpi-card-main">
            ${perfGauge(parseFloat(analytics.engagementRate) || null, '#18C99A')}
            <div>
              <div class="perf-kpi-val">${analytics.engagementRate}</div>
              <div class="perf-kpi-trend" style="color:${analytics.totalEngagements > 0 ? '#18C99A' : '#6C7A8D'};">
                ${analytics.totalEngagements > 0 ? '▲ ' + formatNumber(analytics.totalEngagements) + ' actions' : 'No interactions recorded'}
              </div>
            </div>
          </div>
          <div class="perf-kpi-sub">Interactions / Views (Meta benchmark)</div>
        </div>

        <!-- 4. Positive Sentiment -->
        <div class="perf-kpi-card">
          <div class="perf-kpi-card-header">Positive Sentiment</div>
          <div class="perf-kpi-card-main">
            ${perfGauge(null, '#6C7A8D', 'N/A')}
            <div>
              <div class="perf-kpi-val" style="color:#818D9D;">N/A</div>
              <div class="perf-kpi-trend" style="color:#6C7A8D;">API Not Configured</div>
            </div>
          </div>
          <div class="perf-kpi-sub">NLP sentiment model not enabled</div>
        </div>

        <!-- 5. Total Conversions -->
        <div class="perf-kpi-card">
          <div class="perf-kpi-card-header">Total Conversions</div>
          <div class="perf-kpi-card-main">
            ${perfIconBox('circleCheck', '#6C7A8D')}
            <div>
              <div class="perf-kpi-val" style="color:#818D9D;">N/A</div>
              <div class="perf-kpi-trend" style="color:#6C7A8D;">Pixel Not Connected</div>
            </div>
          </div>
          <div class="perf-kpi-sub">Web conversion tracking not connected</div>
        </div>

        <!-- 6. Earned Media Value -->
        <div class="perf-kpi-card">
          <div class="perf-kpi-card-header">Earned Media Value</div>
          <div class="perf-kpi-card-main">
            ${perfIconBox('dollar', '#6C7A8D')}
            <div>
              <div class="perf-kpi-val" style="color:#818D9D;">N/A</div>
              <div class="perf-kpi-trend" style="color:#6C7A8D;">Model Not Configured</div>
            </div>
          </div>
          <div class="perf-kpi-sub">PR value multiplier not active</div>
        </div>

        <!-- 7. Blended ROAS -->
        <div class="perf-kpi-card">
          <div class="perf-kpi-card-header">Blended ROAS</div>
          <div class="perf-kpi-card-main">
            ${perfIconBox('target', '#6C7A8D')}
            <div>
              <div class="perf-kpi-val" style="color:#818D9D;">N/A</div>
              <div class="perf-kpi-trend" style="color:#6C7A8D;">Paid Ads Not Linked</div>
            </div>
          </div>
          <div class="perf-kpi-sub">Paid spend tracking not connected</div>
        </div>
      </div>

      <!-- ROW 1 — THREE ANALYTICS PANELS -->
      <div class="perf-analytics-grid-row">
        <!-- Panel A: Daily Engagement Trend -->
        <div class="perf-box">
          <div class="perf-box-head">
            <div class="perf-box-title">
              <h4>Daily Engagement Trend</h4>
              <p>Total Engagement Actions: ${formatNumber(analytics.totalEngagements)}</p>
            </div>
            <div style="display:flex; align-items:center; gap:12px; font-size:11px; font-weight:700;">
              <span style="color:#FF793D;">● Engagements</span>
              <span style="color:#16B8E8;">● Views</span>
            </div>
          </div>

          <div class="perf-chart-svg-wrap">
            ${renderPerformanceTrendChart(analytics)}
          </div>

          <div class="perf-box-foot">
            <b>Telemetry Status:</b> Verified daily metrics from active publishing jobs.
          </div>
        </div>

        <!-- Panel B: Platform Reach Breakdown (%) -->
        <div class="perf-box">
          <div class="perf-box-head">
            <div class="perf-box-title">
              <h4>Platform Reach Distribution (%)</h4>
              <p>Breakdown across configured social accounts</p>
            </div>
            <div style="font-size:11px; font-weight:700; color:#929EAE;">
              <span>■ Actual Reach %</span>
            </div>
          </div>

          <div class="perf-bars-list">
            ${analytics.platformBreakdown.length > 0 ? analytics.platformBreakdown.map(p => {
              const platformColor = p.platform === 'instagram' ? '#16B8E8' : (p.platform === 'facebook' ? '#4B6BFB' : (p.platform === 'linkedin' ? '#27C7C1' : '#FF793D'));
              return `
                <div class="perf-bar-row">
                  <div class="perf-bar-row-top">
                    <span style="display:flex; align-items:center; gap:6px; text-transform:capitalize;">${icon(p.platform === 'instagram' ? 'instagram' : (p.platform === 'facebook' ? 'facebook' : 'globe'))} ${e(p.platform)}</span>
                    <span style="color:${platformColor}; font-weight:750;">${p.percentage}% <small style="color:#6C7A8D; font-weight:500;">(${formatNumber(p.reach)} Reach • ${p.posts} Posts)</small></span>
                  </div>
                  <div class="perf-bar-track">
                    <div class="perf-bar-fill" style="width:${Math.max(4, parseFloat(p.percentage) || 0)}%; background:${platformColor};"></div>
                  </div>
                </div>
              `;
            }).join('') : `
              <div style="padding:24px; text-align:center; color:#6C7A8D; font-size:13px;">
                No platform reach observations recorded yet.
              </div>
            `}
          </div>

          <div class="perf-box-foot">
            Platform shares reflect observed Meta Graph API post reach.
          </div>
        </div>

        <!-- Panel C: Brand Distribution & Sentiment Status -->
        <div class="perf-box">
          <div class="perf-box-head">
            <div class="perf-box-title">
              <h4>Portfolio Content Share</h4>
              <p>Distribution Across Connected Brands</p>
            </div>
          </div>

          <!-- Segmented Horizontal Bar -->
          <div class="perf-sov-segments">
            ${analytics.brandBreakdown.map((b, i) => {
              const colors = ['#FF793D', '#16B8E8', '#18C99A', '#9675F5', '#F2BD59'];
              return `<div style="width:${Math.max(4, parseFloat(b.percentage))}%; background:${colors[i % colors.length]};" title="${e(brandName(b.brand))}: ${b.percentage}%"></div>`;
            }).join('')}
          </div>

          <div class="perf-sov-legend-list">
            ${analytics.brandBreakdown.map((b, i) => {
              const colors = ['#FF793D', '#16B8E8', '#18C99A', '#9675F5', '#F2BD59'];
              return `
                <div class="perf-sov-legend-row">
                  <span><span style="color:${colors[i % colors.length]};">●</span> <b>${e(brandName(b.brand))}</b></span>
                  <div>
                    <b style="color:#F3F5F7;">${b.percentage}%</b>
                    <span class="perf-sov-rank-badge">#${i + 1} Rank</span>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Audience Sentiment Status -->
          <div style="margin-top:14px; padding-top:10px; border-top:1px solid #202834;">
            <div style="font-size:12px; font-weight:750; color:#F3F5F7; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:4px;">
              Audience Sentiment Status
            </div>
            <div style="font-size:12px; color:#818D9D; padding:6px 0;">
              External sentiment listening API is not configured in backend. Ready for integration.
            </div>
          </div>

          <div class="perf-box-foot">
            Calculated from internal portfolio publishing records.
          </div>
        </div>
      </div>

      <!-- ROW 2 — THREE INFORMATION PANELS -->
      <div class="perf-analytics-grid-row">
        <!-- Panel A: Top Performing Campaign Posts Table -->
        <div class="perf-box">
          <div class="perf-box-head">
            <div class="perf-box-title">
              <h4>Top Performing Campaign Posts</h4>
              <p>Ranked by Engagement & Verified Views</p>
            </div>
          </div>

          <table class="perf-posts-table">
            <thead>
              <tr>
                <th>Post ID</th>
                <th>Platform</th>
                <th>Title / Topic</th>
                <th>Views</th>
                <th>Engagements</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${analytics.posts.length > 0 ? analytics.posts.slice(0, 5).map(p => {
                const engTotal = (Number(p.likes) || 0) + (Number(p.comments) || 0) + (Number(p.saved) || 0) + (Number(p.shares) || 0);
                return `
                  <tr>
                    <td style="color:#FF793D; font-weight:750;">#${e(String(p.id || '').slice(-6).toUpperCase())}</td>
                    <td><span style="display:inline-flex; align-items:center; gap:4px; text-transform:capitalize;">${icon(p.platform === 'instagram' ? 'instagram' : (p.platform === 'facebook' ? 'facebook' : 'globe'))} ${e(p.platform)}</span></td>
                    <td style="max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;" title="${e(p.title || p.topic || '')}">${e(p.title || p.topic || 'Published Post')}</td>
                    <td style="font-weight:750;">${p.views != null ? formatNumber(p.views) : '—'}</td>
                    <td style="color:#18C99A; font-weight:750;">${formatNumber(engTotal)}</td>
                    <td><span class="tag good">Observed</span></td>
                  </tr>
                `;
              }).join('') : `
                <tr>
                  <td colspan="6" style="text-align:center; padding:24px; color:#818D9D;">No published posts with performance observations found for current filters.</td>
                </tr>
              `}
            </tbody>
          </table>

          <div class="perf-box-foot">
            Showing ${Math.min(5, analytics.posts.length)} of ${analytics.posts.length} published posts with insights
          </div>
        </div>

        <!-- Panel B: Audience Demographics & Hashtags -->
        <div class="perf-box">
          <div class="perf-box-head">
            <div class="perf-box-title">
              <h4>Audience & Hashtag Telemetry</h4>
              <p>Published Content Distribution</p>
            </div>
          </div>

          <div style="font-size:12px; color:#818D9D; margin-bottom:12px; padding:8px; background:rgba(255,255,255,0.02); border-radius:6px;">
            Audience age and gender telemetry requires Meta Insights demographics API authorization.
          </div>

          <!-- Top Campaign Hashtags -->
          <div style="border-top:1px solid #202834; padding-top:10px;">
            <div style="font-size:12px; font-weight:750; color:#F3F5F7; text-transform:uppercase; letter-spacing:0.04em; margin-bottom:8px;">
              Active Campaign Hashtags
            </div>
            <div style="display:flex; flex-direction:column; gap:6px; font-size:12px;">
              ${analytics.topHashtags.length > 0 ? analytics.topHashtags.map(h => `
                <div style="display:flex; justify-content:space-between; align-items:center;">
                  <span style="color:#16B8E8; font-weight:750;">${e(h.tag)}</span>
                  <span style="color:#929EAE;">${h.count} post${h.count === 1 ? '' : 's'} included</span>
                </div>
              `).join('') : `
                <span style="color:#6C7A8D;">No hashtags detected in current published copy.</span>
              `}
            </div>
          </div>

          <div class="perf-box-foot">
            Extracted from active published content records.
          </div>
        </div>

        <!-- Panel C: Real-Time Alerts & Spikes -->
        <div class="perf-box">
          <div class="perf-box-head">
            <div class="perf-box-title">
              <h4>Real-Time Alerts & Health</h4>
              <p>Operational Anomaly Detection</p>
            </div>
            <button class="panel-link" data-action="navigate" data-target="operations">View Health ↗</button>
          </div>

          <div style="display:flex; flex-direction:column; gap:8px;">
            ${(state.ops.alerts && state.ops.alerts.length > 0) ? state.ops.alerts.map(a => `
              <div class="perf-alert-card warning">
                <div class="perf-alert-title" style="color:#F4B942;">
                  <span>${icon('alert')} ${e(String(a.kind || 'OPERATIONAL ALERT').toUpperCase().replaceAll('_', ' '))}</span>
                </div>
                <div class="perf-alert-desc">Brand: ${e(brandName(a.brand || 'all'))} • Count: ${e(a.count || 1)} requiring operator attention.</div>
              </div>
            `).join('') : `
              <div class="perf-alert-card success">
                <div class="perf-alert-title" style="color:#18C99A;">
                  <span>${icon('circleCheck')} ALL PIPELINES OPERATIONAL</span>
                </div>
                <div class="perf-alert-desc">Zero publishing failures or event delivery anomalies recorded.</div>
              </div>
            `}
          </div>

          <div class="perf-box-foot">
            Telemetry auto-synced with Social Studio operational state.
          </div>
        </div>
      </div>

      <!-- Bottom Intelligence Strip -->
      <div class="perf-bottom-strip">
        <div class="perf-bottom-strip-left">
          ${icon('circleCheck')}
          <span>PERFORMANCE TELEMETRY SYNCHRONIZED</span>
        </div>

        <div class="perf-bottom-strip-metrics">
          <span>Observed Posts: <strong>${analytics.posts.length}</strong></span>
          <span>Verified Reach: <strong>${analytics.totalReach != null ? formatNumber(analytics.totalReach) : '—'}</strong></span>
          <span>Total Interactions: <strong>${formatNumber(analytics.totalEngagements)}</strong></span>
          <span>Best Channel: <strong style="color:#FF793D;">${e(bestPlatform)}</strong></span>
        </div>

        <div class="perf-bottom-kpi-pill">
          <span>● STATUS: CONNECTED</span>
        </div>
      </div>
    </div>
  `;
}

function renderOperations() {
  const alerts = state.ops.alerts || [];
  const prod = state.ops.production || {};
  const outbox = state.ops.outbox || {};

  const stages = [
    { title: 'Campaigns & Strategy', desc: 'Active business objectives & brand parameters', ready: state.campaigns.length > 0 },
    { title: 'Social Studio API v0.6', desc: isDemo() ? 'Isolated demo adapter' : (env.socialConfigured ? 'Authenticated gateway proxy' : 'Not configured'), ready: env.socialConfigured },
    { title: 'Engine15 Renderer Adapter', desc: isDemo() ? 'Sample render loaded · deterministic mode' : (env.rendererConfigured ? 'Renderer adapter live' : 'Not configured'), ready: env.rendererConfigured },
    { title: 'Diffusion Engine', desc: 'Not enabled in current Engine15 adapter', ready: false },
    { title: 'Multi-Variant Optimizer', desc: 'Planned capability · architectural concept', ready: false },
    { title: 'Human Approval Gate', desc: 'Strict operational constraint enforced in code', ready: true },
    { title: 'Event Bus v0.3.6', desc: 'External event delivery bus', ready: null },
    { title: 'Meta Publishing Pipeline', desc: isDemo() ? 'Simulated local dispatches' : `${state.accounts.filter(a => a.ready).length} accounts ready`, ready: !isDemo() && state.accounts.some(a => a.ready) }
  ];

  return pageHead(
    'OPERATIONAL OBSERVABILITY',
    'Know what is running.',
    'Real-time health telemetry across the Social Studio gateway, Engine15 adapter, and publishing outbox.',
    `
      <button class="btn btn-subtle" data-action="refresh">${icon('refresh')} Recheck Health</button>
    `
  ) + `
    <!-- Top Operations Stat Cards -->
    <div class="stats-grid">
      ${[
        ['Pending Approvals', state.ops.awaiting_approval ?? state.content.filter(c => c.status === 'draft').length, 'check'],
        ['Renderer Imports', state.ops.creative_imports ?? 0, 'image'],
        ['Publishing Exceptions', state.jobs.filter(x => ['dead', 'failed', 'uncertain'].includes(x.status)).length, 'alert'],
        ['Outbox Backlog', sumNumbers(Object.entries(outbox).filter(([k]) => ['pending', 'retry', 'dead'].includes(k)).map(([, v]) => v)), 'network']
      ].map(x => `
        <div class="stat-card">
          <div class="stat-top">
            <span class="stat-label">${e(x[0])}</span>
            <span class="stat-icon">${icon(x[2])}</span>
          </div>
          <div class="stat-number">${formatNumber(x[1])}</div>
          <div class="stat-sub">${isDemo() ? 'Seeded demo counter' : 'Gateway operational response'}</div>
        </div>
      `).join('')}
    </div>

    <!-- Health Telemetry Matrix -->
    <div class="section-grid" style="display:grid; grid-template-columns:minmax(0,1.3fr) minmax(320px,1fr); gap:24px;">
      <section class="panel panel-pad">
        <div class="panel-head">
          <div>
            <h2>Service Boundaries & Readiness</h2>
            <p>Monitored operational status of all platform adapters</p>
          </div>
        </div>
        <div class="health-items">
          ${stages.map(s => `
            <div class="health-item">
              <span class="health-icon">${icon(s.ready ? 'circleCheck' : s.ready === null ? 'info' : 'network')}</span>
              <div style="min-width:0; flex:1;">
                <strong>${e(s.title)}</strong>
                <small>${e(s.desc)}</small>
              </div>
              <span class="tag ${s.ready ? 'good' : s.ready === null ? '' : 'warn'}">
                ${s.ready ? 'Operational' : s.ready === null ? 'External' : s.title.includes('Diffusion') || s.title.includes('Variant') ? 'Planned' : 'Not Connected'}
              </span>
            </div>
          `).join('')}
        </div>
      </section>

      <!-- Exceptions & Request Counters -->
      <section class="panel panel-pad">
        <div class="panel-head">
          <div>
            <h2>Exceptions & Alerts Feed</h2>
            <p>Failures require explicit operator reconciliation</p>
          </div>
        </div>
        ${alerts.length ? alerts.map(a => `
          <div class="queue-row">
            <div class="queue-thumb red">${icon('alert')}</div>
            <div class="queue-main">
              <strong>${e(a.kind.replaceAll('_', ' '))}</strong>
              <small>${e(a.brand || 'Pipeline')} · ${e(String(a.count || 1))} affected</small>
            </div>
            <span class="tag danger">Attention</span>
          </div>
        `).join('') : '<div class="queue-empty">Zero critical operational alerts reported by the gateway.</div>'}

        <div class="notice info" style="margin-top:20px;">
          ${icon('shield')} Ambiguous renderer and Meta dispatch outcomes require deliberate reconciliation. Blind retries are strictly forbidden.
        </div>

        <div style="margin-top:24px;">
          <h3 style="font-size:14px; font-weight:750; margin:0 0 10px; color:var(--text-muted); text-transform:uppercase; letter-spacing:0.06em;">Creative Request States</h3>
          ${Object.entries(prod).length ? Object.entries(prod).map(([k, v]) => `
            <div class="setting-row">
              <span>${e(k.replaceAll('_', ' '))}</span>
              <strong>${formatNumber(v)}</strong>
            </div>
          `).join('') : '<div class="muted">No production counters returned.</div>'}
        </div>
      </section>
    </div>
  `;
}

// --------------------------------------------------------------------------
// 16. SCREEN 9: CONNECTIONS & SETTINGS
// --------------------------------------------------------------------------
function renderSettings() {
  const isDark = ((typeof document !== 'undefined' && document.documentElement?.getAttribute?.('data-theme')) || state.theme || 'dark') === 'dark';

  return pageHead(
    'SYSTEM INTEGRATIONS',
    'Connections & Security Boundaries.',
    'Server-side credentials, social accounts, and console deployment controls.',
    `
      <button class="btn btn-subtle" data-action="refresh">${icon('refresh')} Recheck Connections</button>
    `
  ) + `
    <div class="section-grid" style="display:grid; grid-template-columns:1fr 1fr; gap:24px;">
      <!-- Upstream Service Boundaries -->
      <section class="panel panel-pad">
        <div class="panel-head">
          <div>
            <h2>Service Boundaries & Security</h2>
            <p>Zero-exposure architectural boundaries</p>
          </div>
        </div>
        <div class="card-list">
          ${[
            ['Social Studio v0.6 Gateway', 'Campaigns, reviews, scheduling, Meta dispatch', env.socialConfigured],
            ['Engine15 Renderer Adapter', 'Deterministic archetype canvas composition', env.rendererConfigured],
            ['Event Bus v0.3.6', 'Cross-domain messaging architecture', null],
            ['Diffusion Backend', 'Future GPU asset generation adapter', false],
            ['Multi-Variant Engine', 'Future automated variant optimization', false]
          ].map(s => `
            <div class="setting-row">
              <div>
                <strong>${s[0]}</strong>
                <small>${s[1]}</small>
              </div>
              <span class="tag ${s[2] === true ? 'good' : s[2] === null ? '' : 'warn'}">
                ${s[2] === true ? 'Configured' : s[2] === null ? 'External' : 'Not Connected'}
              </span>
            </div>
          `).join('')}
        </div>
        <div class="notice info" style="margin-top:20px;">
          ${icon('lock')}
          <div>
            <b>Credential Protection:</b> Live mode uses HttpOnly, SameSite=Strict session cookies. Meta and Renderer keys reside exclusively on the server gateway.
          </div>
        </div>
      </section>

      <!-- Connected Social Accounts -->
      <section class="panel panel-pad">
        <div class="panel-head">
          <div>
            <h2>Connected Brand Channels</h2>
            <p>Accounts managed via Social Studio backend</p>
          </div>
        </div>
        <div class="card-list">
          ${state.accounts.length ? state.accounts.map(a => `
            <div class="setting-row">
              <div>
                <strong>${e(a.label)}</strong>
                <small>${e(brandName(a.brand))} · ${e(a.platform)}</small>
              </div>
              <span class="tag ${a.ready ? 'good' : 'warn'}">${a.ready ? 'Ready to Publish' : 'Needs Config'}</span>
            </div>
          `).join('') : '<div class="queue-empty">No social accounts detected on gateway.</div>'}
        </div>
      </section>
    </div>

    <!-- Appearance & Preferences -->
    <section class="panel panel-pad" style="margin-top:24px;">
      <div class="panel-head">
        <div>
          <h2>Appearance & Workspace Theme</h2>
          <p>Customize the visual interface</p>
        </div>
      </div>
      <div class="setting-row">
        <div>
          <strong>Interface Theme</strong>
          <small>Select dark forest-green or light cream mode</small>
        </div>
        <div style="display:flex; gap:8px;">
          <button type="button" class="btn btn-sm ${isDark ? 'btn-primary' : 'btn-subtle'}" data-action="toggle-theme">
            ${isDark ? icon('moon') : icon('sun')} ${isDark ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
          </button>
        </div>
      </div>
    </section>

    <!-- Deployment Mode Details -->
    <section class="panel panel-pad" style="margin-top:24px;">
      <div class="panel-head">
        <div>
          <h2>Deployment Workspace Mode</h2>
          <p>Runtime isolation and credential governance</p>
        </div>
        ${tag(env.mode === 'live' ? 'Connected Mode' : 'Preview Mode')}
      </div>
      <div class="form-row">
        <div>
          <div class="muted">Active Mode</div>
          <div class="code-field">${isDemo() ? 'LOCAL PREVIEW — OFFLINE SIMULATION' : 'LIVE CONNECTED — AUTHENTICATED GATEWAY'}</div>
        </div>
        <div>
          <div class="muted">Renderer Policy</div>
          <div class="code-field">Human Approval Enforced · diffusion_enabled=false</div>
        </div>
      </div>
      <div style="margin-top:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px;">
        <span class="muted" style="font-size:14px;">
          To connect to live services, set <code>SOCIAL_BASE_URL</code> and <code>SOCIAL_ADMIN_KEY</code> on your FastAPI gateway.
        </span>
        ${isDemo() ? `
          <button class="btn btn-subtle" data-action="reset-demo">${icon('refresh')} Reset Preview Data</button>
        ` : `
          <button class="btn btn-danger" data-action="logout">${icon('logout')} Sign Out of Console</button>
        `}
      </div>
    </section>
  `;
}

// --------------------------------------------------------------------------
// 17. NAVIGATION, DIALOGS, MODALS & TOASTS
// --------------------------------------------------------------------------
function navigate(page) {
  state.page = page;
  state.calendarEntries = null;
  $('sidebar')?.classList.remove('open');
  render();
  if (typeof window !== 'undefined' && window.scrollTo) {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }
  if (page === 'calendar' && !isDemo()) {
    loadCalendar();
  }
}

async function loadCalendar() {
  if (isDemo()) return;
  let start, end;
  if (state.calendarViewMode === 'month') {
    const y = (state.calendarMonth || new Date()).getFullYear();
    const m = (state.calendarMonth || new Date()).getMonth();
    start = new Date(y, m - 1, 20).toISOString();
    end = new Date(y, m + 2, 10).toISOString();
  } else {
    start = (state.calendarStart || startWeek(new Date())).toISOString();
    end = addDays(state.calendarStart || startWeek(new Date()), 7).toISOString();
  }
  try {
    state.calendarEntries = await service(`/v1/calendar?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
    if (state.page === 'calendar') render();
  } catch (ex) {
    toast('Could not load exact calendar window: ' + ex.message, 'error');
  }
}

function toast(message, type = 'good') {
  if (typeof document === 'undefined') return;
  const region = $('toastRegion');
  if (!region) return;
  const box = document.createElement('div');
  box.className = 'toast ' + (type === 'error' ? 'error' : '');
  box.innerHTML = `
    ${icon(type === 'error' ? 'alert' : 'circleCheck')}
    <span>${e(message)}</span>
    <button type="button" aria-label="Dismiss notification">×</button>
  `;
  const btn = box.querySelector('button');
  if (btn) btn.onclick = () => box.remove();
  region.prepend(box);
  hydrateIcons(box);
  setTimeout(() => box.remove(), 6000);
}

function openModal(title, body) {
  if (typeof document === 'undefined') return;
  popupReturnFocus = document.activeElement;
  const titleEl = $('modalTitle');
  if (titleEl) titleEl.textContent = title;
  const bodyEl = $('modalBody');
  if (bodyEl) {
    bodyEl.innerHTML = body;
    hydrateIcons(bodyEl);
  }
  const overlay = $('modalOverlay');
  if (overlay) {
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
  }
  setTimeout(() => {
    const focusable = bodyEl?.querySelector('input, textarea, select, button');
    (focusable || $('modalCloseBtn'))?.focus();
  }, 30);
}

function closeModal() {
  const overlay = $('modalOverlay');
  if (overlay) {
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }
  const bodyEl = $('modalBody');
  if (bodyEl) bodyEl.innerHTML = '';
  popupReturnFocus?.focus?.();
}

// --------------------------------------------------------------------------
// 18. COMMAND PALETTE (CTRL+K / CMD+K)
// --------------------------------------------------------------------------
function openCommandPalette() {
  const overlay = $('commandPaletteOverlay');
  if (!overlay) return;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden', 'false');
  const input = $('commandPaletteInput');
  if (input) {
    input.value = '';
    input.focus();
  }
  renderPaletteResults('');
}

function closeCommandPalette() {
  const overlay = $('commandPaletteOverlay');
  if (!overlay) return;
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden', 'true');
}

function renderPaletteResults(query = '') {
  const resultsEl = $('paletteResults');
  if (!resultsEl) return;
  const q = query.toLowerCase().trim();

  const pages = [
    { id: 'overview', title: 'Command Center', icon: 'overview', tag: 'Module' },
    { id: 'campaigns', title: 'Campaigns', icon: 'target', tag: 'Module' },
    { id: 'planner', title: 'Content Planner', icon: 'grid', tag: 'Module' },
    { id: 'creative', title: 'Creative Lab', icon: 'sparkles', tag: 'Module' },
    { id: 'reviews', title: 'Review Queue', icon: 'check', tag: 'Module' },
    { id: 'calendar', title: 'Publishing Calendar', icon: 'calendar', tag: 'Module' },
    { id: 'analytics', title: 'Performance Analytics', icon: 'chart', tag: 'Module' },
    { id: 'operations', title: 'Pipeline Health', icon: 'activity', tag: 'Module' },
    { id: 'settings', title: 'Connections & Settings', icon: 'sliders', tag: 'Module' }
  ].filter(p => !q || p.title.toLowerCase().includes(q));

  const campaigns = state.campaigns.filter(c => !q || c.name.toLowerCase().includes(q)).slice(0, 5);
  const drafts = state.content.filter(c => !q || c.caption.toLowerCase().includes(q)).slice(0, 5);

  resultsEl.innerHTML = `
    <div class="palette-group-label">Navigation & Modules</div>
    ${pages.map(p => `
      <div class="palette-item" data-action="navigate" data-target="${p.id}" tabindex="0">
        ${icon(p.icon)}
        <span>${e(p.title)}</span>
        <span class="palette-item-tag">${p.tag}</span>
      </div>
    `).join('')}

    ${campaigns.length ? `
      <div class="palette-group-label">Active Campaigns</div>
      ${campaigns.map(c => `
        <div class="palette-item" data-action="focus-campaign" data-id="${e(c.id)}" tabindex="0">
          ${icon('target')}
          <span>${e(c.name)}</span>
          <span class="palette-item-tag">${e(c.status)}</span>
        </div>
      `).join('')}
    ` : ''}

    ${drafts.length ? `
      <div class="palette-group-label">Draft Creatives</div>
      ${drafts.map(d => `
        <div class="palette-item" data-action="open-review" data-id="${e(d.id)}" tabindex="0">
          ${icon('image')}
          <span>${e(trunc(d.caption, 48))}</span>
          <span class="palette-item-tag">${e(brandName(d.brand))}</span>
        </div>
      `).join('')}
    ` : ''}

    <div class="palette-group-label">Quick Actions</div>
    <div class="palette-item" data-action="new-campaign" tabindex="0">
      ${icon('plus')}
      <span>Create New Campaign</span>
      <span class="palette-item-tag">Action</span>
    </div>
    <div class="palette-item" data-action="toggle-theme" tabindex="0">
      ${icon('sun')}
      <span>Toggle Dark / Light Theme</span>
      <span class="palette-item-tag">Theme</span>
    </div>
  `;
  hydrateIcons(resultsEl);
}

// --------------------------------------------------------------------------
// 19. MODALS: CAMPAIGNS, CREATIVE, REVIEW, SCHEDULE, UPLOADS
// --------------------------------------------------------------------------
function optionsForBrands(chosen = []) {
  return [...new Set(state.accounts.map(a => a.brand))].map(b => `
    <label class="checkbox-line">
      <input type="checkbox" name="brands" value="${e(b)}" ${chosen.includes(b) ? 'checked' : ''} />
      <span>${e(brandName(b))}</span>
    </label>
  `).join('');
}

function newCampaignModal() {
  openModal('Create New Marketing Campaign', `
    <form id="campaignForm" class="form-stack">
      <label class="form-label">
        Campaign Name
        <input name="name" required maxlength="180" minlength="3" placeholder="e.g. Life Education — Awareness Drive 2026" />
      </label>

      <label class="form-label">
        Primary Marketing Objective
        <select name="objective" required>
          ${[
            ['awareness', 'Brand Awareness'],
            ['trust', 'Build Trust & Credibility'],
            ['traffic', 'Drive Website Visits'],
            ['lead', 'Lead Generation'],
            ['sales', 'Product Sales & Conversions'],
            ['enrollment', 'Program Enrollment'],
            ['retention', 'Community Retention']
          ].map(a => `<option value="${a[0]}">${a[1]}</option>`).join('')}
        </select>
      </label>

      <div class="form-label">
        <span>Participating Brands</span>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; padding:14px; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          ${optionsForBrands(['yuj-foundation'])}
        </div>
      </div>

      <div class="form-help">
        Every selected brand must have at least one configured social channel account. Newly created campaigns initialize as drafts.
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-subtle" data-action="close-modal">Cancel</button>
        <button class="btn btn-primary" type="submit">Create Draft Campaign ${icon('arrow')}</button>
      </div>
    </form>
  `);
}

function renderRequestModal(slotId) {
  const slot = state.plans.flatMap(p => p.slots || []).find(s => s.id === slotId);
  if (!slot) {
    toast('Editorial slot not found. Refreshing plans...', 'error');
    return;
  }
  if (!isDemo() && Array.isArray(state.renderer?.brands) && !state.renderer.brands.includes(slot.brand)) {
    toast('Renderer has no approved asset profile for ' + brandName(slot.brand) + '. Configure logos first.', 'error');
    return;
  }
  const candidates = state.accounts.filter(a => a.brand === slot.brand && a.platform === slot.platform && a.ready);

  openModal('Generate Branded Creative', `
    <div class="notice info" style="margin-bottom:18px;">
      ${icon('shield')} Submits to Engine15 Renderer Adapter. Generated assets return as unapproved drafts in the Review Queue.
    </div>

    <form id="productionForm" class="form-stack" data-slot-id="${e(slot.id)}">
      <div class="form-label">
        <span>Editorial Topic</span>
        <div class="code-field">${e(slot.topic)}</div>
      </div>

      <div class="form-row">
        <label class="form-label">
          Target Audience
          <input name="audience" minlength="2" maxlength="100" value="YUJ Community" required />
        </label>
        <label class="form-label">
          Editorial Tone
          <select name="tone">
            <option value="educational">Educational</option>
            <option value="warm">Warm & Conversational</option>
            <option value="direct">Direct & Clear</option>
            <option value="playful">Playful & Inspiring</option>
          </select>
        </label>
      </div>

      <label class="form-label">
        Human-Verified Facts · 1 to 6 statements (one per line)
        <textarea name="facts" required rows="4" placeholder="Enter statements verified by your team. No invented claims or promises.">${state.creativeFacts.join('\n')}</textarea>
        <small>Maximum 280 characters per fact statement. Engine15 uses verified facts as source truth.</small>
      </label>

      <div class="form-row">
        <label class="form-label">
          Call to Action (CTA)
          <input name="cta" maxlength="140" value="Learn more" />
        </label>
        <label class="form-label">
          Language
          <select name="language">
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="hinglish">Hinglish</option>
          </select>
        </label>
      </div>

      <div class="form-row">
        <label class="form-label">
          Aspect Ratio Dimensions
          <select name="size">
            <option value="1080x1350">Portrait · 1080 × 1350 (4:5)</option>
            <option value="1080x1080">Square · 1080 × 1080 (1:1)</option>
            <option value="1200x1080">Landscape · 1200 × 1080 (1.11:1)</option>
          </select>
        </label>
        <label class="form-label">
          Template Archetype ID (Optional)
          <input name="template_id" maxlength="120" placeholder="Default archetype" />
        </label>
      </div>

      <label class="form-label">
        Optional Auto-Schedule Account (Post-Approval)
        <select name="account">
          <option value="">No automatic schedule (Reviewer decides)</option>
          ${candidates.map(a => `<option value="${e(a.id)}">${e(a.label)}</option>`).join('')}
        </select>
      </label>

      <label class="checkbox-line">
        <input type="checkbox" name="auto_schedule" />
        <span>After a human reviewer explicitly approves this creative, automatically schedule it to the chosen account.</span>
      </label>

      <div class="form-actions">
        <button class="btn btn-subtle" data-action="close-modal" type="button">Cancel</button>
        <button class="btn btn-primary" type="submit">${icon('sparkles')} Submit Render Request</button>
      </div>
    </form>
  `);
}

function reviewModal(id) {
  const c = state.content.find(c => c.id === id);
  if (!c) return toast('Creative record not found', 'error');
  const url = previewUrl(c);

  openModal(c.status === 'draft' ? 'Review & Edit Creative' : 'Creative Details', `
    <div class="form-stack">
      <div style="display:flex; gap:18px; align-items:flex-start;">
        <div style="height:150px; width:120px; flex-shrink:0; border-radius:var(--radius-md); background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); overflow:hidden;">
          ${url ? `
            <img src="${e(url)}" alt="Creative preview" style="height:100%; width:100%; object-fit:cover;" />
          ` : `
            <div class="faux-preview green" style="padding:10px;">
              <span class="faux-brand" style="font-size:7px;">YUJ</span>
              <span class="faux-title" style="font-size:12px;">Visual Preview</span>
              <span class="faux-bottom" style="font-size:7px;">DRAFT IMAGE</span>
            </div>
          `}
        </div>
        <div>
          <div class="eyebrow">${e(brandName(c.brand))}</div>
          <h3 style="font-size:18px; font-weight:750; margin:4px 0 8px; color:var(--text-primary);">${e(campaignName(c.campaign_id))}</h3>
          <div style="margin-bottom:8px;">${tag(c.status)} <span class="tag">${e(c.content_type || 'image')}</span></div>
          <p class="muted" style="font-size:14px;">
            Rendered deterministically by Engine15 or manually uploaded. Captions can be edited prior to human approval.
          </p>
        </div>
      </div>

      <form id="reviewForm" data-id="${e(c.id)}" class="form-stack">
        <label class="form-label">
          Post Caption
          <textarea name="caption" required maxlength="2200" ${c.status === 'draft' ? '' : 'readonly'}>${e(c.caption)}</textarea>
        </label>
        <label class="form-label">
          Accessibility Alt Text
          <textarea name="alt_text" maxlength="1000" ${c.status === 'draft' ? '' : 'readonly'}>${e(c.alt_text || '')}</textarea>
        </label>

        <div class="form-help">
          Captions can be modified while the creative is in draft status. After human approval, edits are locked.
        </div>

        <div class="form-actions">
          <button class="btn btn-subtle" type="button" data-action="close-modal">Close</button>
          ${c.status === 'draft' ? `
            <button class="btn btn-subtle" type="submit">Save Changes</button>
            <button class="btn btn-primary" type="button" data-action="approve" data-id="${e(c.id)}">
              ${icon('check')} Approve Creative
            </button>
          ` : c.status === 'approved' ? `
            <button class="btn btn-primary" type="button" data-action="schedule" data-id="${e(c.id)}">
              ${icon('calendar')} Schedule Approved Post
            </button>
          ` : ''}
        </div>
      </form>
    </div>
  `);
}

function scheduleModal(contentId) {
  const c = state.content.find(x => x.id === contentId);
  if (!c) return toast('Content not found', 'error');
  if (c.status !== 'approved') return toast('Only approved content can be scheduled', 'error');
  const matching = state.accounts.filter(a => a.brand === c.brand && a.ready);
  const when = new Date(Date.now() + 86400000);
  when.setHours(18, 0, 0, 0);
  const localDateTime = `${localISO(when)}T18:00`;

  openModal('Schedule Approved Creative', `
    <div class="notice info" style="margin-bottom:18px;">
      ${icon('check')} Creative is certified by human reviewer. A scheduled publishing job will be generated.
    </div>

    <form id="scheduleForm" data-id="${e(contentId)}" class="form-stack">
      <label class="form-label">
        Scheduled Date & Time (Asia/Kolkata)
        <input type="datetime-local" name="scheduled_at" value="${localDateTime}" required />
      </label>

      <div class="form-label">
        <span>Target Social Channel Accounts</span>
        <div style="display:grid; gap:10px; padding:14px; background:var(--bg-surface-elevated); border:1px solid var(--border-subtle); border-radius:var(--radius-md);">
          ${matching.length ? matching.map(a => `
            <label class="checkbox-line">
              <input name="account_ids" type="checkbox" value="${e(a.id)}" checked />
              <span>${e(a.label)} (${e(a.platform)})</span>
            </label>
          `).join('') : '<span class="muted">No eligible accounts found for this brand.</span>'}
        </div>
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-subtle" data-action="close-modal">Cancel</button>
        <button type="submit" class="btn btn-primary" ${matching.length ? '' : 'disabled'}>
          Schedule Post ${icon('calendar')}
        </button>
      </div>
    </form>
  `);
}

function uploadModal() {
  openModal('Upload Reviewable Draft Asset', `
    <form id="uploadForm" class="form-stack">
      <label class="form-label">
        Brand Association
        <select name="brand">
          ${[...new Set(state.accounts.map(a => a.brand))].map(b => `
            <option value="${e(b)}">${e(brandName(b))}</option>
          `).join('')}
        </select>
      </label>

      <label class="form-label">
        Image File (PNG, JPEG, WEBP · Max 8MB)
        <input type="file" name="file" accept="image/png,image/jpeg,image/webp" required />
        <small>Uploaded assets are stored securely by Social Studio and initialized as drafts.</small>
      </label>

      <label class="form-label">
        Initial Post Caption
        <textarea name="caption" required maxlength="2200" placeholder="Write a factual, engaging caption..."></textarea>
      </label>

      <label class="form-label">
        Optional Campaign Link
        <select name="campaign_id">
          <option value="">No campaign</option>
          ${state.campaigns.map(c => `<option value="${e(c.id)}">${e(c.name)}</option>`).join('')}
        </select>
      </label>

      <div class="notice info">
        ${icon('shield')} Uploading creates an unapproved draft. It does NOT publish directly to any social account.
      </div>

      <div class="form-actions">
        <button class="btn btn-subtle" data-action="close-modal" type="button">Cancel</button>
        <button class="btn btn-primary" type="submit">${icon('upload')} Upload to Review Queue</button>
      </div>
    </form>
  `);
}

function jobModal(id) {
  const j = [...(state.calendarEntries || []), ...state.jobs].find(x => x.id === id);
  if (!j) return toast('Publishing job not found', 'error');
  const c = state.content.find(x => x.id === j.content_id);
  const future = ['scheduled', 'retry', 'held'].includes(j.status);
  const newDate = new Date(Date.now() + 86400000);
  newDate.setHours(18, 0, 0, 0);

  const pLabel = j.platform === 'instagram' ? 'Instagram' : j.platform === 'facebook' ? 'Facebook' : 'LinkedIn';
  const pIcon = j.platform === 'instagram' ? 'instagram' : j.platform === 'facebook' ? 'facebook' : 'linkedin';
  const preview = previewUrl(c);

  openModal('Publishing Dispatch Details', `
    <div class="form-stack">
      <div style="display:flex; gap:16px; align-items:flex-start; margin-bottom:12px;">
        <div style="width:72px; height:72px; border-radius:var(--radius-md); background:var(--bg-surface-elevated); border:1px solid var(--border-medium); display:flex; align-items:center; justify-content:center; overflow:hidden; flex-shrink:0;">
          ${preview ? `<img src="${e(preview)}" alt="Creative preview" style="width:100%; height:100%; object-fit:cover;" />` : `
            <div style="color:var(--primary-accent);">${icon('image')}</div>
          `}
        </div>
        <div style="flex:1;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div style="font-size:12px; font-weight:750; color:var(--text-muted); text-transform:uppercase;">${e(brandName(c?.brand || j.brand))}</div>
            ${tag(j.status)}
          </div>
          <h3 style="font-size:16px; font-weight:750; margin:4px 0 6px; color:var(--text-primary); line-height:1.35;">
            ${e(c?.caption || j.caption_preview || 'Publishing job')}
          </h3>
          <div class="muted" style="font-size:13px; display:flex; align-items:center; gap:6px;">
            ${icon(pIcon)} <span>${e(pLabel)}</span> · <span>${e(accountName(j.account_id))}</span>
          </div>
        </div>
      </div>

      <div class="setting-row">
        <div>
          <strong>Scheduled Dispatch Timestamp</strong>
          <small>${e(timeLabel(j.run_at))} (Asia/Kolkata)</small>
        </div>
        <span class="tag">${e(j.platform.toUpperCase())}</span>
      </div>

      <div class="setting-row">
        <div>
          <strong>Remote Publication Receipt</strong>
          <small>${e(j.remote_post_id ? `Verified Meta Post ID: ${j.remote_post_id}` : 'Awaiting automatic queue dispatch')}</small>
        </div>
        ${j.remote_post_id ? `<span class="tag good">${icon('check')} Meta Verified</span>` : ''}
      </div>

      ${future && (j.status === 'scheduled' || j.status === 'held') ? `
        <form id="rescheduleForm" data-id="${e(j.id)}" class="form-stack" style="margin-top:14px; padding-top:14px; border-top:1px solid var(--border-subtle);">
          <label class="form-label">
            Reschedule to New Time (Asia/Kolkata)
            <input type="datetime-local" name="scheduled_at" value="${localISO(newDate)}T18:00" required />
          </label>
          <div class="form-actions" style="margin-top:8px;">
            <button class="btn btn-subtle" data-action="close-modal" type="button">Cancel</button>
            <button class="btn btn-primary" type="submit">Confirm Reschedule</button>
          </div>
        </form>
      ` : `
        <div class="notice info" style="margin-top:10px;">
          ${icon('info')} This job cannot be rescheduled from its current state (${e(j.status)}).
        </div>
        <div class="form-actions" style="margin-top:12px;">
          <button class="btn btn-subtle" data-action="close-modal" type="button">Close</button>
        </div>
      `}
    </div>
  `);
}

function notificationsModal() {
  const alerts = state.ops.alerts || [];
  const drafts = state.content.filter(c => c.status === 'draft');

  openModal('Workspace Notifications & Alerts', `
    <div class="form-stack">
      ${alerts.map(a => `
        <div class="notice">
          ${icon('alert')} ${e(a.kind.replaceAll('_', ' '))} · ${e(String(a.count || 1))} affected
        </div>
      `).join('')}

      ${drafts.length ? `
        <div class="notice info">
          ${icon('check')} ${drafts.length} creative draft${drafts.length > 1 ? 's' : ''} awaiting your explicit approval.
        </div>
      ` : ''}

      ${!alerts.length && !drafts.length ? `
        <div class="notice info">
          ${icon('circleCheck')} All caught up. Zero critical alerts or pending reviews.
        </div>
      ` : ''}

      <button class="btn btn-primary" data-action="navigate" data-target="reviews" type="button">
        Go to Review Queue
      </button>
    </div>
  `);
}

// --------------------------------------------------------------------------
// 20. FORM & ACTION DISPATCHERS
// --------------------------------------------------------------------------
async function sendJSON(path, body, method = 'POST') {
  return service(path, { method, body: JSON.stringify(body) });
}

function mutateDemo(fn, notice) {
  fn(state.data);
  saveDemo();
  applyDemoData();
  state.alertCount = (state.ops.alerts || []).length + state.content.filter(c => c.status === 'draft').length;
  closeModal();
  render();
  if (notice) toast(notice + ' (preview mode)');
}

async function handleAction(btn) {
  if (!btn || (state.busy && !['close-modal', 'navigate', 'toggle-theme'].includes(btn.dataset?.action))) return;
  const act = btn.dataset?.action, id = btn.dataset?.id, target = btn.dataset?.target;

  try {
    if (act === 'close-modal') return closeModal();
    if (act === 'pulse-filter') {
      openModal('Filter Operations Pulse Date Range', `
        <div class="form-stack">
          <button type="button" class="btn btn-block ${(state.pulsePeriod || '30') === '7' ? 'btn-primary' : 'btn-subtle'}" data-action="set-pulse-period" data-period="7">Last 7 Days</button>
          <button type="button" class="btn btn-block ${(state.pulsePeriod || '30') === '30' ? 'btn-primary' : 'btn-subtle'}" data-action="set-pulse-period" data-period="30">Last 30 Days</button>
          <button type="button" class="btn btn-block ${(state.pulsePeriod || '30') === '90' ? 'btn-primary' : 'btn-subtle'}" data-action="set-pulse-period" data-period="90">Last 90 Days</button>
        </div>
      `);
      return;
    }
    if (act === 'set-pulse-period') {
      state.pulsePeriod = btn.dataset?.period || '30';
      state.analyticsPeriodDays = Number(state.pulsePeriod);
      closeModal();
      if (!isDemo()) {
        state.pulseLoading = true;
        render();
        service(`/v1/analytics/overview?days=${state.pulsePeriod}`)
          .then(data => {
            state.insights = data;
            state.pulseError = null;
          })
          .catch(err => {
            state.pulseError = err.message;
          })
          .finally(() => {
            state.pulseLoading = false;
            render();
          });
      } else {
        render();
      }
      return;
    }
    if (act === 'pulse-hover-point') {
      state.pulseHoverIndex = Number(btn.dataset?.index ?? 0);
      render();
      return;
    }
    if (act === 'perf-date-picker') {
      openModal('Filter Performance Window', `
        <div class="form-stack">
          <button type="button" class="btn btn-block ${(state.perfPeriod || '30') === '7' ? 'btn-primary' : 'btn-subtle'}" data-action="set-perf-period" data-period="7">Last 7 Days</button>
          <button type="button" class="btn btn-block ${(state.perfPeriod || '30') === '30' ? 'btn-primary' : 'btn-subtle'}" data-action="set-perf-period" data-period="30">Last 30 Days</button>
          <button type="button" class="btn btn-block ${(state.perfPeriod || '30') === '90' ? 'btn-primary' : 'btn-subtle'}" data-action="set-perf-period" data-period="90">Last 90 Days</button>
        </div>
      `);
      return;
    }
    if (act === 'set-perf-period') {
      state.perfPeriod = btn.dataset?.period || '30';
      state.analyticsPeriodDays = Number(state.perfPeriod);
      closeModal();
      if (!isDemo()) {
        state.perfLoading = true;
        render();
        const params = new URLSearchParams();
        params.set('days', state.perfPeriod);
        if (state.perfCampaign) params.set('campaign_id', state.perfCampaign);
        service(`/v1/analytics/overview?${params.toString()}`)
          .then(data => {
            state.insights = data;
            state.perfError = null;
          })
          .catch(err => {
            state.perfError = err.message;
          })
          .finally(() => {
            state.perfLoading = false;
            render();
          });
      } else {
        render();
      }
      return;
    }
    if (act === 'perf-channel-filter') {
      const platforms = ['all', 'instagram', 'facebook', 'linkedin', 'tiktok', 'youtube'];
      openModal('Filter by Channel', `
        <div class="form-stack">
          ${platforms.map(p => `
            <button type="button" class="btn btn-block ${(state.perfPlatform || 'all') === p ? 'btn-primary' : 'btn-subtle'}" data-action="set-perf-platform" data-platform="${p}">
              ${p === 'all' ? 'All Channels (Multi-Platform)' : p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          `).join('')}
        </div>
      `);
      return;
    }
    if (act === 'set-perf-platform') {
      state.perfPlatform = btn.dataset?.platform || 'all';
      closeModal();
      render();
      return;
    }
    if (act === 'perf-campaign-filter') {
      openModal('Filter by Campaign', `
        <div class="form-stack">
          <button type="button" class="btn btn-block ${!state.perfCampaign ? 'btn-primary' : 'btn-subtle'}" data-action="set-perf-campaign" data-id="">
            All Campaigns (Aggregated View)
          </button>
          ${state.campaigns.map(c => `
            <button type="button" class="btn btn-block ${state.perfCampaign === c.id ? 'btn-primary' : 'btn-subtle'}" data-action="set-perf-campaign" data-id="${e(c.id)}">
              ${e(c.name)} (${e(c.status)})
            </button>
          `).join('')}
        </div>
      `);
      return;
    }
    if (act === 'set-perf-campaign') {
      state.perfCampaign = btn.dataset?.id || '';
      closeModal();
      if (!isDemo()) {
        state.perfLoading = true;
        render();
        const params = new URLSearchParams();
        params.set('days', state.perfPeriod || '30');
        if (state.perfCampaign) params.set('campaign_id', state.perfCampaign);
        service(`/v1/analytics/overview?${params.toString()}`)
          .then(data => {
            state.insights = data;
            state.perfError = null;
          })
          .catch(err => {
            state.perfError = err.message;
          })
          .finally(() => {
            state.perfLoading = false;
            render();
          });
      } else {
        render();
      }
      return;
    }
    if (act === 'perf-hover-point') {
      state.perfHoverIndex = Number(btn.dataset?.index ?? 0);
      render();
      return;
    }
    if (act === 'refresh-perf') {
      await refreshAll();
      toast('Performance metrics synchronized');
      return;
    }
    if (act === 'close-palette') return closeCommandPalette();
    if (act === 'toggle-theme') return toggleTheme();
    if (act === 'toggle-campaign-view') {
      state.campaignsViewMode = btn.dataset?.mode || 'grid';
      return render();
    }
    if (act === 'navigate') {
      closeModal();
      closeCommandPalette();
      navigate(target);
      return;
    }
    if (act === 'refresh') {
      await refreshAll();
      if (state.page === 'calendar' && !isDemo()) await loadCalendar();
      toast('Workspace data refreshed');
      return;
    }
    if (act === 'new-campaign') {
      closeCommandPalette();
      return newCampaignModal();
    }
    if (act === 'focus-campaign') {
      state.selectedCampaign = id;
      closeModal();
      closeCommandPalette();
      return navigate('planner');
    }
    if (act === 'review-tab') {
      state.reviewTab = btn.dataset?.tab || 'draft';
      return render();
    }
    if (act === 'analytics-metric') {
      state.analyticsMetricFilter = btn.dataset?.filter || 'all';
      return render();
    }
    if (act === 'analytics-period') {
      state.analyticsPeriod = btn.dataset?.period || '30';
      return render();
    }
    if (act === 'request-render') return renderRequestModal(id);
    if (act === 'caption-ideas') {
      const job = state.production.find(x => x.id === id);
      if (!job) return toast('Production job not found', 'error');
      let captions = [];
      if (isDemo()) {
        const slot = state.plans.flatMap(p => p.slots || []).find(s => s.id === job.slot_id);
        const topic = slot?.topic || 'Learn with YUJ';
        captions = [
          `${topic}. Explore the programme, ask questions, and grow together.`,
          `A practical look at ${topic.toLowerCase()}. Discover more with YUJ Foundation.`,
          `What does ${topic.toLowerCase()} mean to you? Join the community conversation.`
        ];
      } else {
        const ideas = await sendJSON(`/v1/production/jobs/${encodeURIComponent(job.id)}/caption-suggestions`, { mode: 'templates' });
        captions = ideas.captions || [];
      }
      state.captionSuggestions = captions;
      const draft = state.content.find(x => x.id === job.content_id);
      openModal('Deterministic Caption Suggestions', `
        <div class="notice info" style="margin-bottom:16px;">
          ${icon('shield')} Verified deterministic template suggestions, not ungrounded AI prompts.
        </div>
        <div class="form-stack">
          ${captions.map((caption, i) => `
            <div class="panel panel-pad">
              <span class="tag">Option ${i + 1}</span>
              <p style="font-size:15px; line-height:1.55; margin:8px 0 12px; white-space:pre-wrap;">${e(caption)}</p>
              ${draft?.status === 'draft' ? `
                <button type="button" class="btn btn-sm btn-soft" data-action="apply-caption" data-id="${e(draft.id)}" data-index="${i}">
                  Use for Draft Caption
                </button>
              ` : ''}
            </div>
          `).join('')}
        </div>
      `);
      return;
    }
    if (act === 'apply-caption') {
      const draft = state.content.find(x => x.id === id);
      if (!draft || draft.status !== 'draft') throw new Error('Only unapproved drafts may be edited.');
      const caption = state.captionSuggestions?.[Number(btn.dataset?.index)];
      if (!caption) throw new Error('Caption suggestion unavailable.');
      if (isDemo()) {
        return mutateDemo(d => {
          d.content.find(x => x.id === id).caption = caption;
        }, 'Caption applied to draft');
      }
      await sendJSON(`/v1/content/${encodeURIComponent(id)}`, { caption }, 'PATCH');
      closeModal();
      await refreshAll(true);
      toast('Suggestion applied. Review and approve draft separately.');
      return;
    }
    if (act === 'open-review') {
      closeCommandPalette();
      return reviewModal(id);
    }
    if (act === 'schedule') return scheduleModal(id);
    if (act === 'upload-draft') return uploadModal();
    if (act === 'calendar-job') return jobModal(id);
    if (act === 'calendar-view-mode') {
      state.calendarViewMode = btn.dataset?.mode || 'month';
      return render();
    }
    if (act === 'calendar-month-prev' || act === 'calendar-month-next' || act === 'calendar-month-today') {
      if (act === 'calendar-month-today') {
        const now = new Date();
        state.calendarMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        state.calendarSelectedDate = now;
      } else {
        const d = new Date(state.calendarMonth);
        d.setMonth(d.getMonth() + (act === 'calendar-month-prev' ? -1 : 1));
        state.calendarMonth = d;
      }
      state.calendarEntries = null;
      render();
      if (!isDemo()) await loadCalendar();
      return;
    }
    if (act === 'calendar-select-date') {
      const d = btn.dataset?.date;
      if (d) {
        state.calendarSelectedDate = new Date(d);
        return render();
      }
    }
    if (act === 'analytics-metric-tab') {
      state.analyticsMetricTab = btn.dataset?.tab || 'reach';
      return render();
    }
    if (act === 'analytics-platform-tab') {
      state.analyticsPlatformFilter = btn.dataset?.platform || 'all';
      return render();
    }
    if (act === 'analytics-period') {
      state.analyticsPeriodDays = Number(btn.dataset?.days || 30);
      return render();
    }
    if (act === 'analytics-sort') {
      const col = btn.dataset?.col || 'reach';
      if (state.analyticsSortCol === col) {
        state.analyticsSortDir = state.analyticsSortDir === 'desc' ? 'asc' : 'desc';
      } else {
        state.analyticsSortCol = col;
        state.analyticsSortDir = 'desc';
      }
      return render();
    }
    if (act === 'calendar-prev' || act === 'calendar-next' || act === 'calendar-today') {
      state.calendarStart = act === 'calendar-today' ? startWeek(new Date()) : addDays(state.calendarStart, act === 'calendar-prev' ? -7 : 7);
      state.calendarEntries = null;
      render();
      if (!isDemo()) await loadCalendar();
      return;
    }
    if (act === 'reset-demo') {
      if (!isDemo()) return;
      if (typeof confirm !== 'undefined' && !confirm('Reset illustrative data and restore fresh seed state?')) return;
      try {
        localStorage.removeItem(DEMO_KEY);
      } catch {}
      state.data = freshDemo();
      saveDemo();
      applyDemoData();
      state.selectedCampaign = '';
      await refreshAll();
      toast('Demo workspace reset to clean initial state');
      return;
    }
    if (act === 'logout') return logout();
    if (act === 'suggest-topics') {
      const campaign = state.campaigns.find(c => c.id === state.selectedCampaign);
      if (!campaign) return toast('Create or select a campaign first', 'error');
      const topic = typeof window !== 'undefined' && window.prompt
        ? window.prompt('Enter one broad topic angle for suggestion ideas:', 'Life Education')
        : 'Life Education';
      if (!topic || topic.trim().length < 3) return;
      const form = $('weeklyPlanForm');
      const brand = form?.querySelector('[name="brand"]')?.value || 'yuj-foundation';
      const platform = form?.querySelector('[name="platform"]')?.value || 'instagram';

      let topics;
      if (isDemo()) {
        topics = [
          `Introduction to ${topic}`,
          `Practical daily questions about ${topic}`,
          `How families can explore ${topic} together`,
          `Real stories and lessons around ${topic}`,
          `Everyday exercises for ${topic}`
        ];
      } else {
        const res = await sendJSON('/v1/planning/objective-preview', {
          campaign_id: campaign.id,
          brand,
          platform,
          seed_topic: topic.trim(),
          count: 5
        });
        topics = res.suggested_topics;
      }
      state.plannerTopics = topics.join('\n');
      if (form) {
        const ta = form.querySelector('#planTopics');
        if (ta) ta.value = state.plannerTopics;
      }
      toast('Suggested angles added. Edit them before saving plan.');
      return;
    }
    if (act === 'approve') {
      const c = state.content.find(x => x.id === id);
      if (!c || c.status !== 'draft') return toast('Only draft content can be approved', 'error');
      if (typeof confirm !== 'undefined' && !confirm('Approve this creative for publishing? Verify imagery, factual claims, and copy first.')) return;
      state.busy = true;
      try {
        if (isDemo()) {
          return mutateDemo(d => {
            const item = d.content.find(x => x.id === id);
            if (item) {
              item.status = 'approved';
              item.approved_at = new Date().toISOString();
              item.approved_by = state.user;
            }
          }, 'Creative approved by human reviewer');
        }
        await sendJSON(`/v1/content/${encodeURIComponent(id)}/approve`, { approver: state.user });
        closeModal();
        await refreshAll(true);
        toast('Creative successfully approved by human reviewer.');
      } finally {
        state.busy = false;
      }
      return;
    }
    if (act === 'campaign-transition') {
      const c = state.campaigns.find(x => x.id === id);
      if (!c) return;
      const status = btn.dataset?.status;
      if (status === 'paused' && typeof confirm !== 'undefined' && !confirm('Pause this campaign? Queued posts will be held. In-flight dispatches must settle.')) return;
      state.busy = true;
      try {
        if (isDemo()) {
          return mutateDemo(d => {
            const camp = d.campaigns.find(x => x.id === id);
            if (camp) camp.status = status;
            if (status === 'paused') {
              d.jobs.filter(j => j.campaign_id === id && j.status === 'scheduled').forEach(j => { j.status = 'held'; });
            }
          }, `Campaign ${status}`);
        }
        await sendJSON(`/v1/campaigns/${encodeURIComponent(id)}/transition`, { status, actor: state.user });
        await refreshAll(true);
        toast(`Campaign status updated to ${status}.`);
      } finally {
        state.busy = false;
      }
      return;
    }
  } catch (err) {
    toast(err.message, 'error');
  }
}

async function handleForm(form) {
  if (state.busy) return;
  state.busy = true;
  const fd = new FormData(form);
  const obj = Object.fromEntries(fd.entries());

  try {
    if (form.id === 'campaignForm') {
      const brands = fd.getAll('brands');
      if (!brands.length) throw new Error('Select at least one brand');
      const slug = String(obj.name || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 65);
      const id = `${slug}-${Date.now().toString(36)}`;
      const payload = { id, name: String(obj.name || '').trim(), objective: obj.objective, brands, created_by: state.user };

      if (isDemo()) {
        mutateDemo(d => {
          d.campaigns.unshift({ ...payload, status: 'draft', created_at: new Date().toISOString(), version: 1 });
        }, 'Campaign created as draft');
        state.selectedCampaign = id;
        return;
      }
      const result = await sendJSON('/v1/campaigns', payload);
      state.selectedCampaign = result.id;
      closeModal();
      await refreshAll(true);
      toast('Campaign created as draft.');
      return;
    }

    if (form.id === 'weeklyPlanForm') {
      const topics = String(obj.topics).split(/\r?\n/).map(x => x.trim()).filter(Boolean);
      if (topics.length < 1 || topics.length > 7) throw new Error('Enter 1–7 topic lines');
      if (topics.some(x => x.length > 180)) throw new Error('Each topic must be at most 180 characters');
      const payload = {
        campaign_id: obj.campaign_id,
        request_key: rid('weekly'),
        created_by: state.user,
        week_start: obj.week_start,
        timezone: 'Asia/Kolkata',
        lines: [{ brand: obj.brand, platform: obj.platform, topics }]
      };

      if (isDemo()) {
        mutateDemo(d => {
          const id = rid('plan');
          d.plans.unshift({
            id,
            campaign_id: obj.campaign_id,
            start_date: obj.week_start,
            timezone: 'Asia/Kolkata',
            created_at: new Date().toISOString(),
            slots: topics.map((topic, i) => ({
              id: rid('slot'),
              campaign_id: obj.campaign_id,
              brand: obj.brand,
              platform: obj.platform,
              topic,
              state: 'proposed',
              scheduled_at: new Date(`${obj.week_start}T11:00:00+05:30`).toISOString(),
              evidence: 'editorial_slot_brief',
              position: i
            }))
          });
        }, `${topics.length} editorial slot(s) saved`);
        state.plannerTopics = '';
        return;
      }
      await sendJSON('/v1/plans/weekly', payload);
      state.plannerTopics = '';
      await refreshAll(true);
      toast(`${topics.length} editorial slots saved to plan.`);
      return;
    }

    if (form.id === 'productionForm') {
      const slotId = form.dataset?.slotId;
      const slot = state.plans.flatMap(p => p.slots || []).find(s => s.id === slotId);
      if (!slot) throw new Error('Plan slot not found');
      const facts = String(obj.facts || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
      if (!facts.length || facts.length > 6 || facts.some(x => x.length > 280)) {
        throw new Error('Supply 1–6 human-verified facts, up to 280 characters each.');
      }
      if (fd.has('auto_schedule') && !obj.account) {
        throw new Error('Choose an eligible account to enable post-approval scheduling');
      }
      const [width, height] = (obj.size || '1080x1350').split('x').map(Number);
      const payload = {
        request_key: rid('render'),
        audience: String(obj.audience || '').trim(),
        facts,
        cta: obj.cta || 'Learn more',
        language: obj.language,
        tone: obj.tone,
        template_id: obj.template_id?.trim() || null,
        width,
        height,
        account_ids: obj.account ? [obj.account] : [],
        schedule_after_approval: fd.has('auto_schedule')
      };

      if (isDemo()) {
        mutateDemo(d => {
          const prod = {
            id: rid('prod'),
            slot_id: slotId,
            campaign_id: slot.campaign_id,
            brand: slot.brand,
            platform: slot.platform,
            engine: 'yuj-design',
            generation_id: rid('gen'),
            status: 'imported',
            content_id: rid('draft'),
            variant_id: 'default',
            created_at: new Date().toISOString()
          };
          d.production.unshift(prod);
          d.content.unshift({
            id: prod.content_id,
            brand: slot.brand,
            campaign_id: slot.campaign_id,
            caption: `${slot.topic}. ${payload.cta}.`,
            content_type: 'image',
            media_id: 'demo-' + Date.now(),
            status: 'draft',
            created_at: new Date().toISOString(),
            preview_url: slot.brand === 'yuj-foundation' ? 'assets/engine15-sample.png' : ''
          });
        }, 'Simulated Engine15 render imported as draft');
        return;
      }
      await sendJSON(`/v1/production/slots/${encodeURIComponent(slotId)}`, payload);
      closeModal();
      await refreshAll(true);
      toast('Renderer request queued. A draft will appear in Review Queue.');
      return;
    }

    if (form.id === 'reviewForm') {
      const id = form.dataset?.id;
      const c = state.content.find(c => c.id === id);
      if (!c || c.status !== 'draft') throw new Error('Only drafts are editable');
      const patch = {
        caption: String(obj.caption).trim(),
        alt_text: String(obj.alt_text || '').trim() || null
      };

      if (isDemo()) {
        return mutateDemo(d => {
          Object.assign(d.content.find(c => c.id === id), patch);
        }, 'Draft caption updated');
      }
      await sendJSON(`/v1/content/${encodeURIComponent(id)}`, patch, 'PATCH');
      closeModal();
      await refreshAll(true);
      toast('Draft updated successfully.');
      return;
    }

    if (form.id === 'scheduleForm') {
      const id = form.dataset?.id;
      const accounts = fd.getAll('account_ids');
      if (!accounts.length) throw new Error('Choose one or more target accounts');
      const when = new Date(obj.scheduled_at);
      if (!Number.isFinite(when.getTime()) || when.getTime() < Date.now() + 10000) {
        throw new Error('Select a future local date and time');
      }
      const payload = { account_ids: accounts, scheduled_at: when.toISOString() };

      if (isDemo()) {
        return mutateDemo(d => {
          accounts.forEach(account => {
            const acc = d.accounts.find(a => a.id === account);
            d.jobs.unshift({
              id: rid('post'),
              content_id: id,
              campaign_id: d.content.find(c => c.id === id)?.campaign_id,
              account_id: account,
              platform: acc?.platform || 'instagram',
              status: 'scheduled',
              run_at: when.toISOString(),
              created_at: new Date().toISOString(),
              snapshot_type: 'image'
            });
          });
        }, 'Approved creative scheduled for publishing');
      }
      await sendJSON(`/v1/content/${encodeURIComponent(id)}/schedule`, payload);
      closeModal();
      await refreshAll(true);
      toast(`Scheduled ${accounts.length} publishing job(s).`);
      return;
    }

    if (form.id === 'rescheduleForm') {
      const id = form.dataset?.id;
      const when = new Date(obj.scheduled_at);
      if (!Number.isFinite(when.getTime()) || when.getTime() < Date.now() + 10000) {
        throw new Error('Schedule must be in the future.');
      }

      if (isDemo()) {
        return mutateDemo(d => {
          d.jobs.find(j => j.id === id).run_at = when.toISOString();
        }, 'Publishing job rescheduled');
      }
      await sendJSON(`/v1/jobs/${encodeURIComponent(id)}/reschedule`, { scheduled_at: when.toISOString() });
      closeModal();
      await refreshAll(true);
      if (state.page === 'calendar') await loadCalendar();
      toast('Publishing job rescheduled.');
      return;
    }

    if (form.id === 'uploadForm') {
      const f = fd.get('file');
      if (typeof File !== 'undefined' && f instanceof File) {
        if (!f.size) throw new Error('Select an image file');
        if (!/^image\/(png|jpeg|webp)$/.test(f.type)) throw new Error('Only PNG, JPEG and WEBP accepted');
        if (f.size > 8 * 1024 * 1024) throw new Error('Image exceeds 8MB size limit');
      }
      if (isDemo()) {
        return mutateDemo(d => {
          d.content.unshift({
            id: rid('draft'),
            brand: obj.brand,
            campaign_id: obj.campaign_id || null,
            caption: String(obj.caption).trim(),
            status: 'draft',
            content_type: 'image',
            media_id: rid('demo-upload'),
            created_at: new Date().toISOString()
          });
        }, 'Manual draft asset saved to queue');
      }
      const upload = new FormData();
      upload.append('brand', obj.brand);
      upload.append('file', f);
      const media = await gatewayFetch('/api/social/v1/assets', { method: 'POST', body: upload });
      const draft = {
        brand: obj.brand,
        caption: String(obj.caption).trim(),
        media_id: media.id,
        content_type: 'image',
        campaign_id: obj.campaign_id || null,
        language: 'en'
      };
      await sendJSON('/v1/content', draft);
      closeModal();
      await refreshAll(true);
      toast('Image uploaded as an unapproved draft.');
      return;
    }
  } catch (ex) {
    toast(ex.message, 'error');
  } finally {
    state.busy = false;
  }
}

async function logout() {
  if (env.mode === 'demo') {
    toast('Preview mode operates offline without a gateway session.');
    return;
  }
  try {
    await gatewayFetch('/api/logout', { method: 'POST' });
  } catch {}
  state.csrf = '';
  $('loginOverlay')?.classList.remove('hidden');
}

// --------------------------------------------------------------------------
// 21. EVENT LISTENERS & LIFECYCLE WIRING
// --------------------------------------------------------------------------
if (typeof document !== 'undefined') {
  document.addEventListener('click', ev => {
    const nav = ev.target.closest('button[data-page]');
    if (nav) {
      navigate(nav.dataset.page);
      return;
    }
    const button = ev.target.closest('[data-action]');
    if (button) {
      ev.preventDefault();
      handleAction(button);
    }
  });

  document.addEventListener('submit', ev => {
    if (ev.target.id === 'loginForm') return;
    ev.preventDefault();
    handleForm(ev.target);
  });

  document.addEventListener('change', ev => {
    if (ev.target.id === 'campaignBrandFilter' || ev.target.id === 'reviewBrandFilter' || ev.target.id === 'calendarBrandFilter') {
      state.brandFilter = ev.target.value;
      render();
      if (state.page === 'calendar' && !isDemo()) loadCalendar();
    }
    if (ev.target.id === 'calendarPlatformFilter') {
      state.calendarPlatformFilter = ev.target.value;
      render();
    }
    if (ev.target.id === 'calendarStatusFilter') {
      state.calendarStatusFilter = ev.target.value;
      render();
    }
    if (ev.target.id === 'campaignStatusFilter') {
      state.campaignStatusFilter = ev.target.value;
      render();
    }
    if (ev.target.id === 'planCampaignSelect') {
      state.selectedCampaign = ev.target.value;
      state.plannerBrand = '';
      state.plannerTopics = '';
      render();
    }
    if (ev.target.id === 'planBrandSelect') {
      state.plannerBrand = ev.target.value;
      state.plannerPlatform = 'instagram';
      const topicsEl = $('planTopics');
      if (topicsEl) state.plannerTopics = topicsEl.value;
      render();
    }
    if (ev.target.id === 'planPlatformSelect') {
      state.plannerPlatform = ev.target.value;
      const topicsEl = $('planTopics');
      if (topicsEl) state.plannerTopics = topicsEl.value;
    }
    if (ev.target.id === 'planStartDate') {
      state.plannerWeek = ev.target.value;
    }
  });

  document.addEventListener('input', ev => {
    if (ev.target.id === 'analyticsSearchInput') {
      state.analyticsSearchQuery = ev.target.value;
      render();
      const inp = $('analyticsSearchInput');
      if (inp) {
        inp.focus();
        inp.setSelectionRange(inp.value.length, inp.value.length);
      }
    }
    if (ev.target.id === 'planTopics') {
      state.plannerTopics = ev.target.value;
    }
    if (ev.target.id === 'commandPaletteInput') {
      renderPaletteResults(ev.target.value);
    }
  });

  $('modalCloseBtn')?.addEventListener('click', closeModal);
  $('mobileNavBtn')?.addEventListener('click', () => {
    $('sidebar')?.classList.toggle('open');
  });
  $('sidebarCollapseBtn')?.addEventListener('click', () => {
    const shell = $('appShell');
    if (shell) {
      shell.classList.toggle('sidebar-collapsed');
      try {
        localStorage.setItem('yuj_sidebar_collapsed', shell.classList.contains('sidebar-collapsed'));
      } catch {}
    }
  });
  $('themeToggleBtn')?.addEventListener('click', toggleTheme);
  $('notificationsBtn')?.addEventListener('click', notificationsModal);
  $('commandPaletteTrigger')?.addEventListener('click', openCommandPalette);

  document.addEventListener('keydown', ev => {
    if (ev.key === 'Escape') {
      if ($('commandPaletteOverlay')?.classList.contains('open')) {
        closeCommandPalette();
      } else if ($('modalOverlay')?.classList.contains('open')) {
        closeModal();
      } else {
        $('sidebar')?.classList.remove('open');
      }
    }
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault();
      openCommandPalette();
    }
  });

  // 3D KPI Card Hover Tilt Microinteraction (Max 3.5 deg, disabled on touch/reduced-motion)
  document.addEventListener('mousemove', ev => {
    // Interactive point hover tracking
    const pulsePoint = ev.target.closest('[data-action="pulse-hover-point"]');
    if (pulsePoint) {
      const date = pulsePoint.dataset.date;
      const reach = pulsePoint.dataset.reach;
      const views = pulsePoint.dataset.views;
      const x = parseFloat(pulsePoint.dataset.x);
      const y = parseFloat(pulsePoint.dataset.y);
      const tooltip = $('pulseTooltipBox');
      if (tooltip) {
        tooltip.style.left = `${Math.max(12, Math.min(88, (x / 1000) * 100))}%`;
        tooltip.style.top = `${Math.max(12, y - 48)}px`;
        const dtEl = $('pulseTooltipDate');
        if (dtEl) dtEl.textContent = date;
        const rEl = $('pulseTooltipReach');
        if (rEl) rEl.textContent = formatNumber(Number(reach));
        const vEl = $('pulseTooltipViews');
        if (vEl) vEl.textContent = formatNumber(Number(views));
      }
    }

    const perfPoint = ev.target.closest('[data-action="perf-hover-point"]');
    if (perfPoint) {
      const date = perfPoint.dataset.date;
      const eng = perfPoint.dataset.eng;
      const views = perfPoint.dataset.views;
      const x = parseFloat(perfPoint.dataset.x);
      const y = parseFloat(perfPoint.dataset.y);
      const tooltip = $('perfTrendTooltip');
      if (tooltip) {
        tooltip.style.left = `${Math.max(14, Math.min(86, (x / 540) * 100))}%`;
        tooltip.style.top = `${Math.max(6, y - 38)}px`;
        tooltip.innerHTML = `
          <div style="color:#6C7A8D; font-weight:700; margin-bottom:2px;">${e(date)}</div>
          <div style="color:#FF793D; font-weight:700;">● Eng: ${formatNumber(Number(eng))}</div>
          <div style="color:#16B8E8; font-weight:700;">● Views: ${formatNumber(Number(views))}</div>
        `;
      }
    }
    const card = ev.target.closest?.('.kpi-3d-card');
    if (!card) {
      document.querySelectorAll?.('.kpi-3d-card')?.forEach?.(c => {
        if (c.style?.transform) c.style.transform = '';
      });
      return;
    }
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(hover: none), (prefers-reduced-motion: reduce)').matches) return;
    if (!card.getBoundingClientRect) return;
    const rect = card.getBoundingClientRect();
    const x = ev.clientX - rect.left;
    const y = ev.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -3.5;
    const rotY = ((x - cx) / cx) * 3.5;
    card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateY(-4px) scale3d(1.015, 1.015, 1.015)`;
  });

  document.addEventListener('mouseleave', ev => {
    const card = ev.target.closest?.('.kpi-3d-card');
    if (card && card.style) card.style.transform = '';
  }, true);

  $('loginForm')?.addEventListener('submit', async ev => {
    ev.preventDefault();
    const button = ev.target.querySelector('button');
    if (button) button.disabled = true;
    try {
      const password = new FormData(ev.target).get('password');
      const reply = await gatewayFetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ password })
      });
      state.csrf = reply.csrf || '';
      $('loginOverlay')?.classList.add('hidden');
      ev.target.reset();
      await refreshAll();
      toast('Signed into YUJ Studio successfully.');
    } catch (err) {
      const hint = $('loginHint');
      if (hint) {
        hint.textContent = err.message;
        hint.style.color = 'var(--status-danger)';
      }
    } finally {
      if (button) button.disabled = false;
    }
  });

  $('logoutBtn')?.addEventListener('click', logout);

  boot();
}

// --------------------------------------------------------------------------
// 22. EXPORT COMPATIBILITY HARNESS (TEST SUITES & HEADLESS VERIFICATION)
// --------------------------------------------------------------------------
if (typeof globalThis !== 'undefined') {
  globalThis.__probe = {
    state,
    render,
    renderOverview,
    renderCampaigns,
    renderPlanner,
    renderCreative,
    renderReviews,
    renderCalendar,
    renderAnalytics,
    renderOperations,
    renderSettings
  };
  globalThis.testAPI = {
    state,
    handleForm,
    handleAction,
    render,
    loadDemo
  };
}

// Expose Engine 15 asset uploader globally for engine15.html integration
if (typeof window !== 'undefined') {
  window.uploadEngine15Asset = async function(blobOrBase64, metadata = {}) {
    try {
      let fileBlob;
      if (typeof blobOrBase64 === 'string' && blobOrBase64.startsWith('data:')) {
        const arr = blobOrBase64.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        fileBlob = new Blob([u8arr], { type: mime });
      } else {
        fileBlob = blobOrBase64;
      }

      const formData = new FormData();
      formData.append('file', fileBlob, metadata.filename || 'engine15_render.png');
      formData.append('metadata', JSON.stringify({
        archetype: metadata.archetype || 'auto',
        compositionScore: metadata.compositionScore || null,
        generatedAt: new Date().toISOString()
      }));

      return await gatewayFetch('/api/social/v1/assets', {
        method: 'POST',
        body: formData
      });
    } catch (err) {
      console.error('Failed to upload Engine 15 asset:', err);
      throw err;
    }
  };
}
