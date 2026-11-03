/* Test Suite: Dynamic Dashboard Verification */
const fs = require('fs');
const vm = require('vm');
const crypto = require('crypto');

const src = fs.readFileSync(__dirname + '/../app.js', 'utf8');
const elements = new Map();

function node(id) {
  if (!elements.has(id)) {
    elements.set(id, {
      id,
      style: {},
      dataset: {},
      value: '',
      innerHTML: '',
      textContent: '',
      attributes: {},
      classList: {
        add() {},
        remove() {},
        toggle() {},
        contains() { return false; }
      },
      focus() {},
      blur() {},
      addEventListener() {},
      setAttribute() {},
      removeAttribute() {},
      querySelectorAll() { return []; },
      querySelector() { return node('child'); },
      prepend() {},
      remove() {}
    });
  }
  return elements.get(id);
}

const local = new Map();
const context = {
  console,
  Date,
  Intl,
  crypto,
  URL,
  URLSearchParams,
  Promise,
  Map,
  Set,
  Array,
  Number,
  JSON,
  String,
  Object,
  RegExp,
  Math,
  Error,
  Boolean,
  document: {
    title: '',
    activeElement: node('active'),
    getElementById: node,
    addEventListener() {},
    querySelectorAll() { return []; },
    createElement() { return node('dynamic-' + Math.random()); }
  },
  window: { scrollTo() {}, prompt() { return null; } },
  location: { protocol: 'file:' },
  localStorage: { getItem: k => local.get(k) || null, setItem: (k, v) => local.set(k, v), removeItem: k => local.delete(k) },
  setTimeout() {},
  clearTimeout() {},
  confirm() { return true; },
  fetch: async () => { throw Error('Test environment'); }
};
context.globalThis = context;
vm.createContext(context);
vm.runInContext(src + '\nglobalThis.testAPI = { state, handleAction, render, renderOverview, renderAnalytics, getAggregatedAnalytics, renderPulseChart };', context);

async function testSuite() {
  const { state, handleAction, renderOverview, renderAnalytics, getAggregatedAnalytics, renderPulseChart } = context.testAPI;

  console.log('--- 1. Testing Command Center Pulse Graph ---');
  state.page = 'overview';
  const overviewHtml = renderOverview();
  if (!overviewHtml.includes('Marketing Operations Pulse')) throw Error('Overview missing Pulse chart');
  if (!overviewHtml.includes('data-action="pulse-filter"')) throw Error('Overview missing pulse filter button');
  if (!overviewHtml.includes('pulse-tooltip-box')) throw Error('Pulse chart missing tooltip element');
  
  // Verify dynamic data calculations
  const analytics = getAggregatedAnalytics();
  if (!Array.isArray(analytics.timeSeries) || analytics.timeSeries.length === 0) {
    throw Error('Analytics timeSeries empty');
  }
  console.log('   ✓ Pulse timeSeries loaded:', analytics.timeSeries.length, 'data points');

  // Verify pulse filter action
  await handleAction({ dataset: { action: 'set-pulse-period', period: '7' } });
  if (state.pulsePeriod !== '7') throw Error('Failed to set pulsePeriod to 7');
  const filteredAnalytics = getAggregatedAnalytics();
  console.log('   ✓ Filtered 7 days timeSeries count:', filteredAnalytics.timeSeries.length);

  // Test empty state
  state.insights = { time_series: [], groups: [], posts: [] };
  const emptyChart = renderPulseChart();
  if (!emptyChart.includes('No Telemetry Recorded')) throw Error('Pulse chart did not render empty state');
  console.log('   ✓ Pulse empty state rendered correctly');

  // Test error state
  state.pulseError = 'Backend API timeout';
  const errorChart = renderPulseChart();
  if (!errorChart.includes('Backend API timeout')) throw Error('Pulse chart did not render error state');
  console.log('   ✓ Pulse error state rendered correctly');
  state.pulseError = null;

  console.log('\n--- 2. Testing Performance Dashboard & Demo Data Removal ---');
  // Reset demo insights
  state.data = context.loadDemo();
  context.applyDemoData();
  state.page = 'analytics';

  const perfHtml = renderAnalytics();

  // Verify removed fake hardcoded metrics
  const forbiddenMockStrings = [
    '28.8M',
    '14.2M',
    'Target: 35.0M | Paid+Org',
    '▲ 18.2% vs tgt',
    '▲ 12.4% vs tgt',
    '#AURA-01',
    '#AURA-04',
    '#FizzVibe',
    'Oct 11 Global Launch Event'
  ];

  for (const mockStr of forbiddenMockStrings) {
    if (perfHtml.includes(mockStr)) {
      throw Error(`Found hardcoded demo metric that should have been removed: "${mockStr}"`);
    }
  }
  console.log('   ✓ All hardcoded demo strings successfully removed from normal dashboard rendering');

  // Verify honest N/A indicators for unavailable APIs
  if (!perfHtml.includes('NLP sentiment model not enabled')) throw Error('Missing Sentiment unavailable note');
  if (!perfHtml.includes('Web conversion tracking not connected')) throw Error('Missing Conversion unavailable note');
  if (!perfHtml.includes('Paid spend tracking not connected')) throw Error('Missing ROAS unavailable note');
  console.log('   ✓ Honest N/A indicators present for unconfigured upstream APIs');

  // Verify real KPI values
  const realAnalytics = getAggregatedAnalytics();
  console.log('   ✓ Real computed Total Views:', realAnalytics.totalViews);
  console.log('   ✓ Real computed Total Reach:', realAnalytics.totalReach);
  console.log('   ✓ Real computed Engagement Rate:', realAnalytics.engagementRate);

  // Test filter interactions
  console.log('\n--- 3. Testing Filters & Dashboard Synchronization ---');
  // Channel filter
  await handleAction({ dataset: { action: 'set-perf-platform', platform: 'instagram' } });
  if (state.perfPlatform !== 'instagram') throw Error('Failed to set platform filter to instagram');
  const igAnalytics = getAggregatedAnalytics();
  if (igAnalytics.groups.some(g => g.platform !== 'instagram')) throw Error('Platform filter failed in group aggregation');
  console.log('   ✓ Platform filter Instagram applied:', igAnalytics.groups.length, 'group(s)');

  // Campaign filter
  await handleAction({ dataset: { action: 'set-perf-campaign', id: 'life-education-spring' } });
  if (state.perfCampaign !== 'life-education-spring') throw Error('Failed to set campaign filter');
  console.log('   ✓ Campaign filter applied:', state.perfCampaign);

  // Period filter
  await handleAction({ dataset: { action: 'set-perf-period', period: '90' } });
  if (state.perfPeriod !== '90') throw Error('Failed to set perfPeriod to 90');
  console.log('   ✓ Period filter 90 days applied');

  console.log('\n--- 4. Testing Pipeline Animation & Pulse Legend Removal ---');
  state.page = 'overview';
  const ovHtml = renderOverview();
  if (ovHtml.includes('pulse-legend-strip')) throw Error('Reach & Views legend strip was NOT removed from Pulse chart');
  console.log('   ✓ Reach & Views legend strip verified removed from Command Center');
  if (!ovHtml.includes('pipeline-connecting-wire')) throw Error('Missing animated pipeline wire');
  if (!ovHtml.includes('active-stage')) throw Error('Missing glowing active-stage on pipeline');
  console.log('   ✓ Animated pipeline wire and glowing active-stage verified');

  console.log('\n--- 5. Testing Dynamic Workbench & Decisions ---');
  if (!ovHtml.includes('Creative Production Workbench')) throw Error('Missing Workbench');
  if (!ovHtml.includes('Needs Your Decision')) throw Error('Missing Decisions panel');
  if (ovHtml.includes('Dream Bigger — Campaign 2025')) throw Error('Found hardcoded Dream Bigger in Workbench');
  if (ovHtml.includes('Sustainability Series')) throw Error('Found hardcoded Sustainability Series in Decisions');
  console.log('   ✓ Hardcoded demo strings removed from Workbench & Decisions');

  // Test empty states
  state.content = [];
  state.production = [];
  const emptyOv = renderOverview();
  if (!emptyOv.includes('No In-Flight Creative Jobs')) throw Error('Workbench did not render empty state');
  if (!emptyOv.includes('Review Queue Clear')) throw Error('Decisions did not render empty state');
  console.log('   ✓ Workbench and Decisions empty states rendered cleanly');

  console.log('\nPASS: Dynamic dashboard verification completed with 100% success.');
}

testSuite().catch(err => {
  console.error('FAIL:', err);
  process.exit(1);
});
