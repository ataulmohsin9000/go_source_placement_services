import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  CalendarDays,
  FileText,
  Minus,
  RefreshCw,
  Users,
} from 'lucide-react';
import aeFlag from 'flag-icons/flags/4x3/ae.svg';
import auFlag from 'flag-icons/flags/4x3/au.svg';
import caFlag from 'flag-icons/flags/4x3/ca.svg';
import gbFlag from 'flag-icons/flags/4x3/gb.svg';
import inFlag from 'flag-icons/flags/4x3/in.svg';
import nzFlag from 'flag-icons/flags/4x3/nz.svg';
import qaFlag from 'flag-icons/flags/4x3/qa.svg';
import saFlag from 'flag-icons/flags/4x3/sa.svg';
import trFlag from 'flag-icons/flags/4x3/tr.svg';
import usFlag from 'flag-icons/flags/4x3/us.svg';
import api from '../api';
import { worldMapLandPath } from '../data/worldMapLand';

type ChartMode = 'leads' | 'cases' | 'sources';
type DashboardTab = 'overview' | 'analytics' | 'operations';

const chartModeByTab: Record<DashboardTab, ChartMode> = {
  overview: 'leads',
  analytics: 'sources',
  operations: 'cases',
};

interface Trend {
  current: number;
  previous: number;
  percentChange: number | null;
}

interface ChartRow {
  id: string;
  label: string;
  value: number;
  day?: any;
  colorIndex?: number;
}

interface CountryActivity {
  code: string;
  name: string;
  count: number;
  percentage: number;
  isDemo?: boolean;
}

const sourceColors = ['#168b93', '#39c9a7', '#72cbbd', '#a0ddd3', '#c4e9e3', '#e0f3ef'];

const demoDestinationCountryCounts: Array<Pick<CountryActivity, 'code' | 'name' | 'count'>> = [
  { code: 'US', name: 'United States', count: 8 },
  { code: 'GB', name: 'United Kingdom', count: 7 },
  { code: 'CA', name: 'Canada', count: 6 },
  { code: 'AU', name: 'Australia', count: 5 },
  { code: 'IN', name: 'India', count: 4 },
  { code: 'NZ', name: 'New Zealand', count: 3 },
  { code: 'TR', name: 'Turkey', count: 2 },
  { code: 'QA', name: 'Qatar', count: 1 },
];

const countryFlagImages: Record<string, string> = {
  AE: aeFlag,
  AU: auFlag,
  CA: caFlag,
  GB: gbFlag,
  IN: inFlag,
  NZ: nzFlag,
  QA: qaFlag,
  SA: saFlag,
  TR: trFlag,
  US: usFlag,
};

const countryFlagColors: Record<string, string> = {
  AE: '#009739',
  AR: '#74acdf',
  AU: '#00008b',
  BD: '#006a4e',
  BR: '#009739',
  CA: '#d80621',
  CH: '#d52b1e',
  CN: '#de2910',
  DE: '#dd0000',
  EG: '#ce1126',
  ES: '#aa151b',
  FR: '#0055a4',
  GB: '#012169',
  GR: '#0d5eaf',
  ID: '#e31b23',
  IN: '#ff9933',
  IT: '#009246',
  JP: '#bc002d',
  KR: '#cd2e3a',
  KW: '#007a3d',
  LK: '#8d153a',
  MX: '#006847',
  NL: '#ae1c28',
  NO: '#ba0c2f',
  NZ: '#00247d',
  OM: '#db161b',
  PK: '#01411c',
  QA: '#8a1538',
  SA: '#006c35',
  RU: '#0039a6',
  SE: '#006aa7',
  SG: '#e31b23',
  TH: '#2d2a4a',
  TR: '#e30a17',
  US: '#b22234',
  ZA: '#007749',
};

const countryCoordinates: Record<string, { longitude: number; latitude: number }> = {
  AE: { longitude: 54.4, latitude: 24.5 },
  AR: { longitude: -63.6, latitude: -38.4 },
  AU: { longitude: 133.8, latitude: -25.3 },
  BD: { longitude: 90.4, latitude: 23.7 },
  BR: { longitude: -51.9, latitude: -14.2 },
  CA: { longitude: -106, latitude: 56 },
  CH: { longitude: 8.2, latitude: 46.8 },
  CN: { longitude: 104, latitude: 35 },
  DE: { longitude: 10.5, latitude: 51 },
  EG: { longitude: 30.8, latitude: 26.8 },
  ES: { longitude: -3.7, latitude: 40.4 },
  FR: { longitude: 2.2, latitude: 46.2 },
  GB: { longitude: -3, latitude: 55 },
  GR: { longitude: 22, latitude: 39 },
  ID: { longitude: 113, latitude: -2 },
  IN: { longitude: 78, latitude: 21 },
  IT: { longitude: 12.5, latitude: 42.5 },
  JP: { longitude: 138, latitude: 36 },
  KR: { longitude: 127.5, latitude: 36 },
  KW: { longitude: 47.5, latitude: 29.3 },
  LK: { longitude: 80.7, latitude: 7.8 },
  MX: { longitude: -102, latitude: 23.6 },
  NL: { longitude: 5.3, latitude: 52 },
  NO: { longitude: 8, latitude: 61 },
  NZ: { longitude: 174, latitude: -41 },
  OM: { longitude: 56, latitude: 21 },
  PK: { longitude: 69, latitude: 30 },
  QA: { longitude: 51.2, latitude: 25.3 },
  RU: { longitude: 100, latitude: 60 },
  SA: { longitude: 45, latitude: 24 },
  SG: { longitude: 103.8, latitude: 1.4 },
  SE: { longitude: 15, latitude: 62 },
  TH: { longitude: 101, latitude: 15 },
  TR: { longitude: 35, latitude: 39 },
  US: { longitude: -98, latitude: 39 },
  ZA: { longitude: 24, latitude: -29 },
};

const getCountryFlagColor = (code: string) =>
  countryFlagColors[code.trim().toUpperCase()] || '#168b93';

const CountryFlag: React.FC<{ code: string; name: string }> = ({ code, name }) => {
  const flagImage = countryFlagImages[code.trim().toUpperCase()];
  if (!flagImage) {
    return (
      <span role="img" aria-label={name} className="shrink-0 text-xl leading-none">
        🌐
      </span>
    );
  }

  return (
    <img
      src={flagImage}
      alt={name}
      className="h-6 w-6 shrink-0 rounded-full object-cover ring-1 ring-slate-200"
    />
  );
};

const WorldMap: React.FC<{ countries: CountryActivity[] }> = ({ countries }) => (
  <svg
    viewBox="0 0 800 360"
    role="img"
    aria-label={`World map with ${
      countries.filter((country) => !country.isDemo).length
    } live and ${countries.filter((country) => country.isDemo).length} sample destination countries`}
    className="h-full max-h-none w-full"
  >
    <g className="dashboard-map-land" strokeWidth="0.7" strokeLinejoin="round">
      <path d={worldMapLandPath} />
    </g>
    {countries.map((country, index) => {
      const location = countryCoordinates[country.code.trim().toUpperCase()];
      if (!location) return null;
      const point = {
        x: ((location.longitude + 180) / 360) * 800,
        y: ((90 - location.latitude) / 180) * 360,
      };
      return (
        <g key={country.code}>
          <title>
            {country.isDemo
              ? `Sample preview: ${country.name}`
              : `${country.name}: ${formatCount(country.count)} active ${country.count === 1 ? 'case' : 'cases'}`}
          </title>
          <circle
            className="dashboard-map-dot-pulse"
            cx={point.x}
            cy={point.y}
            r="8"
            style={{ animationDelay: `${index * 180}ms` }}
          />
          <circle cx={point.x} cy={point.y} r="5" fill="#168b93" stroke="#fff" strokeWidth="2" />
        </g>
      );
    })}
  </svg>
);

const CountryProgressRow: React.FC<{ country: CountryActivity }> = ({ country }) => (
  <div className="flex items-center gap-2">
    <CountryFlag code={country.code} name={country.name} />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-1.5">
        <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-slate-700">
          {country.name}
        </span>
        <span
          className={`rounded px-1 py-0.5 text-[8px] font-semibold uppercase ${
            country.isDemo ? 'bg-amber-50 text-amber-700' : 'bg-teal-50 text-teal-700'
          }`}
        >
          {country.isDemo ? 'Sample' : 'Live'}
        </span>
        <span className="text-[10px] font-semibold text-slate-600">{country.percentage}%</span>
      </div>
      <div className="mt-1 flex items-center gap-2">
        <div
          role="progressbar"
          aria-label={`${country.name} share of ${country.isDemo ? 'sample' : 'active'} cases`}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={country.percentage}
          className="h-1.5 min-w-0 flex-1 overflow-hidden rounded-full bg-slate-100"
        >
          <div
            className="h-full rounded-full"
            style={{
              width: `${country.percentage}%`,
              backgroundColor: getCountryFlagColor(country.code),
            }}
          />
        </div>
        <span className="shrink-0 text-[9px] text-slate-400">
          {formatCount(country.count)}{' '}
          {country.isDemo ? 'sample cases' : country.count === 1 ? 'case' : 'cases'}
        </span>
      </div>
    </div>
  </div>
);

const toNumber = (value: unknown) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
};

const formatCount = (value: number) => value.toLocaleString('en-PK');
const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-PK', { maximumFractionDigits: 0 }).format(value);

const formatDate = (value: string) => {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return value;
  return new Intl.DateTimeFormat('en-PK', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)));
};

const TrendBadge: React.FC<{ trend?: Trend; title: string }> = ({ trend, title }) => {
  if (!trend) return null;

  const isNew = trend.percentChange === null && trend.current > 0;
  const isDown = trend.percentChange !== null && trend.percentChange < 0;
  const label = isNew
    ? 'New'
    : trend.percentChange === 0
      ? '0%'
      : `${trend.percentChange! > 0 ? '+' : ''}${trend.percentChange}%`;
  const Icon = isDown ? ArrowDownRight : trend.percentChange === 0 ? Minus : ArrowUpRight;

  return (
    <span
      title={title}
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-1 text-[9px] font-semibold ${
        isDown
          ? 'bg-rose-50 text-rose-600'
          : trend.percentChange === 0
            ? 'bg-slate-100 text-slate-500'
            : 'bg-emerald-50 text-emerald-700'
      }`}
    >
      {!isNew && <Icon className="h-3 w-3" />}
      {label}
    </span>
  );
};

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const chartMode = chartModeByTab[activeTab];

  const fetchOverview = () => {
    setLoading(true);
    setError('');
    api
      .get('/dashboard/overview')
      .then((res: any) => setData(res.data))
      .catch((err) => {
        console.error('Failed to load dashboard overview', err);
        setError(err?.message || 'The dashboard could not be loaded. Check your connection and try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  if (loading && !data) {
    return (
      <div className="space-y-6" aria-label="Loading dashboard">
        <div className="h-16 animate-pulse rounded-xl bg-slate-200/70" />
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)]">
          <div className="h-[430px] animate-pulse rounded-2xl bg-white shadow-sm" />
          <div className="h-[430px] animate-pulse rounded-2xl bg-white shadow-sm" />
        </div>
        <div className="h-48 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="surface-card flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="surface-card-title">Dashboard unavailable</p>
          <p className="page-description">{error}</p>
        </div>
        <button
          type="button"
          onClick={fetchOverview}
          className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-700"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  const metrics = data?.metrics || {};
  const analytics = data?.analytics || {};
  const trends = analytics.trends || {};
  const period = analytics.period || {};
  const daily = analytics.daily || [];
  const leadSources: string[] = analytics.leadSources || [];
  const sourceBreakdown: Array<{ source: string; count: number }> = analytics.sourceBreakdown || [];
  const historicalImport = data?.historicalImport;
  const activeUsers: { count: number } | undefined = data?.activeUsers;
  const activeCaseDestinations:
    | { totalCases: number; countries: CountryActivity[] }
    | undefined = data?.activeCaseDestinations;
  const liveDestinationCountries = activeCaseDestinations?.countries || [];
  const liveDestinationCodes = new Set(
    liveDestinationCountries.map((country) => country.code.trim().toUpperCase())
  );
  const visibleLiveDestinationCountries = liveDestinationCountries.slice(0, 5);
  const sampleDestinationSlots = Math.max(0, 5 - visibleLiveDestinationCountries.length);
  const sampleDestinationCounts = demoDestinationCountryCounts
    .filter((country) => !liveDestinationCodes.has(country.code));
  const sampleDestinationTotal = sampleDestinationCounts.reduce((total, country) => total + country.count, 0);
  const sampleDestinationCountries: CountryActivity[] = sampleDestinationCounts.map((country) => ({
    ...country,
    percentage: sampleDestinationTotal
      ? Math.round((country.count / sampleDestinationTotal) * 100)
      : 0,
    isDemo: true,
  }));
  const visibleSampleDestinationCountries = sampleDestinationCountries.slice(0, sampleDestinationSlots);
  const mapDestinationCountries = [...liveDestinationCountries, ...sampleDestinationCountries];
  const importedStatusCounts: Record<string, Record<string, number>> =
    historicalImport?.statusCounts && typeof historicalImport.statusCounts === 'object'
      ? historicalImport.statusCounts
      : {};
  const importedStatuses = Object.entries(importedStatusCounts)
    .reduce<Record<string, number>>((totals, [, statuses]) => {
      Object.entries(statuses).forEach(([status, count]) => {
        totals[status] = (totals[status] || 0) + toNumber(count);
      });
      return totals;
    }, {});
  const importedStatusRows = Object.entries(importedStatuses)
    .map(([status, count]) => ({ status, count }))
    .sort((left, right) => right.count - left.count || left.status.localeCompare(right.status));
  const visibleImportedStatuses = importedStatusRows.slice(0, 5);
  const remainingImportedStatuses = importedStatusRows.slice(5);
  const importedSnapshotDate = historicalImport?.snapshotDate
    ? formatDate(String(historicalImport.snapshotDate).slice(0, 10))
    : '';

  const totalCases = toNumber(metrics.totalCases);
  const approvedCases = toNumber(metrics.approvedCases);
  const totalBilled = toNumber(metrics.totalBilled);
  const totalCollected = toNumber(metrics.totalCollected);
  const outstanding = Math.max(0, toNumber(metrics.outstanding ?? totalBilled - totalCollected));
  const collectionRate = totalBilled
    ? Math.min(100, Math.max(0, Math.round((totalCollected / totalBilled) * 100)))
    : 0;
  const approvalRate = totalCases
    ? Math.min(100, Math.max(0, Math.round((approvedCases / totalCases) * 100)))
    : 0;

  const chartCopy: Record<ChartMode, { title: string; subtitle: string; unit: string }> = {
    leads: {
      title: 'Daily enquiries by source',
      subtitle: 'New leads, grouped by the source recorded on each enquiry',
      unit: 'Leads',
    },
    cases: {
      title: 'Cases opened by day',
      subtitle: 'New visa cases created during this period',
      unit: 'Cases',
    },
    sources: {
      title: 'Lead sources',
      subtitle: 'Enquiries by recorded referral or acquisition source',
      unit: 'Leads',
    },
  };

  const chartRows: ChartRow[] =
    chartMode === 'sources'
      ? sourceBreakdown.map((item, index) => ({
          id: item.source,
          label: item.source,
          value: toNumber(item.count),
          colorIndex: index,
        }))
      : daily.map((day: any) => ({
          id: day.date,
          label: formatDate(day.date),
          value:
            chartMode === 'cases'
              ? toNumber(day.cases)
              : Object.values(day.leadsBySource || {}).reduce<number>(
                  (sum, count) => sum + toNumber(count),
                  0
                ),
          day,
        }));

  const maxPoint = Math.max(0, ...chartRows.map((row) => row.value));
  const axisMaximum = maxPoint ? Math.ceil(maxPoint / 4) * 4 : 4;
  const chartWidth = 760;
  const chartHeight = 250;
  const chartLeft = 46;
  const chartRight = 12;
  const chartTop = 18;
  const chartBottom = 42;
  const plotWidth = chartWidth - chartLeft - chartRight;
  const plotHeight = chartHeight - chartTop - chartBottom;
  const hasChartData = maxPoint > 0;
  const reportStart = formatDate(period.start || '');
  const reportEnd = formatDate(period.end || '');
  const previousStart = formatDate(period.previousStart || '');
  const previousEnd = formatDate(period.previousEnd || '');
  const reportDays = toNumber(period.days) || 14;
  const shouldShowDateLabel = (index: number) =>
    chartMode === 'sources' || index % 2 === 1 || index === chartRows.length - 1;

  const summaryMetrics = [
    { label: 'Leads created', trend: trends.leads as Trend | undefined, icon: Users, to: '/leads' },
    { label: 'Cases started', trend: trends.cases as Trend | undefined, icon: Briefcase, to: '/cases' },
    { label: 'Invoices issued', trend: trends.invoices as Trend | undefined, icon: FileText, to: '/invoices' },
    { label: 'Referral leads', trend: trends.referralLeads as Trend | undefined, icon: Users, to: '/leads' },
  ];

  const trendTitle = (trend?: Trend) =>
    trend
      ? `${formatCount(trend.current)} this period; ${formatCount(trend.previous)} in the previous ${reportDays} days`
      : 'Trend comparison is unavailable';

  const chartDescription =
    chartMode === 'leads'
      ? chartRows
          .map((row) => {
            const values = leadSources
              .map((source) => `${source} ${toNumber(row.day?.leadsBySource?.[source])}`)
              .join(', ');
            return `${row.label}: ${values || '0 leads'}`;
          })
          .join('; ')
      : chartRows.map((row) => `${row.label}: ${row.value}`).join(', ');

  return (
    <div className="dashboard-page space-y-4 sm:space-y-5">
      <div className="dashboard-welcome">
        <div>
          <h1 className="page-title">Welcome back</h1>
          <p className="page-description">
            Review your enquiries, applications, and collections.
          </p>
        </div>
        <div className="dashboard-welcome-actions flex flex-wrap items-center gap-3">
          <div className="dashboard-date-range">
            <CalendarDays className="h-4 w-4" />
            <span>Last {reportDays} days</span>
            <span className="dashboard-date-divider" />
            <span>{reportStart}–{reportEnd}</span>
          </div>
          <Link
            to="/leads"
            className="dashboard-action-link inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-lg px-3 text-xs font-semibold transition sm:self-auto"
          >
            View enquiries
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="dashboard-tab-bar" role="tablist" aria-label="Dashboard sections">
        {([
          ['overview', 'Overview'],
          ['analytics', 'Analytics'],
          ['operations', 'Operations'],
        ] as const).map(([tab, label]) => (
          <button
            key={tab}
            id={`dashboard-tab-${tab}`}
            type="button"
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls="dashboard-panel"
            onClick={() => setActiveTab(tab)}
            className={`dashboard-tab${activeTab === tab ? ' dashboard-tab-active' : ''}`}
          >
            {label}
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800">
          <span>{error} Showing the last available overview.</span>
          <button type="button" onClick={fetchOverview} className="shrink-0 font-semibold underline">
            Retry
          </button>
        </div>
      )}

      <div
        id="dashboard-panel"
        role="tabpanel"
        aria-labelledby={`dashboard-tab-${activeTab}`}
        className="dashboard-overview-grid items-stretch gap-4"
      >
        <section className="surface-card flex min-w-0 flex-col overflow-hidden">
          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
            <div>
              <h2 className="surface-card-title">Enquiry overview</h2>
              <p className="surface-card-subtitle">
                Last {reportDays} days · {reportStart}–{reportEnd}
                {period.timeZone ? ` · ${period.timeZone}` : ''}
              </p>
              <p className="mt-1 text-[9px] text-slate-400">
                Trends compare {previousStart}–{previousEnd}
              </p>
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-center px-4 pb-4 pt-5 sm:px-6">
            <div className="mb-2 flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xs font-semibold text-slate-800">{chartCopy[chartMode].title}</h3>
                <p className="mt-1 text-[10px] text-slate-400">{chartCopy[chartMode].subtitle}</p>
              </div>
              <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
                {chartCopy[chartMode].unit}
              </span>
            </div>

            {chartMode !== 'sources' && (
              <div className="mb-1 flex min-h-6 flex-wrap justify-center gap-x-4 gap-y-1">
                {(chartMode === 'leads'
                  ? leadSources.map((source, index) => ({
                      label: source,
                      color: sourceColors[index % sourceColors.length],
                    }))
                  : [{ label: 'Cases opened', color: sourceColors[0] }]
                ).map((series) => (
                  <span key={series.label} className="inline-flex items-center gap-1.5 text-[9px] text-slate-500">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: series.color }} />
                    {series.label}
                  </span>
                ))}
              </div>
            )}

            {hasChartData ? (
              <div className="overflow-x-auto">
                <svg
                  className="h-[250px] w-full min-w-0"
                  viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                  role="img"
                  aria-label={`${chartCopy[chartMode].title}: ${chartDescription}`}
                  preserveAspectRatio="none"
                >
                  {Array.from({ length: 5 }, (_, index) => {
                    const value = (axisMaximum * (4 - index)) / 4;
                    const y = chartTop + (plotHeight * index) / 4;

                    return (
                      <g key={index}>
                        <line
                          x1={chartLeft}
                          x2={chartWidth - chartRight}
                          y1={y}
                          y2={y}
                          stroke="#edf1f2"
                          strokeDasharray={index === 4 ? undefined : '3 4'}
                        />
                        <text
                          x={chartLeft - 8}
                          y={y + 3}
                          textAnchor="end"
                          fill="#91a0a5"
                          fontSize="9"
                        >
                          {formatCount(value)}
                        </text>
                      </g>
                    );
                  })}
                  {chartRows.map((row, index) => {
                    const step = plotWidth / chartRows.length;
                    const barWidth = Math.min(chartMode === 'sources' ? 36 : 20, step * 0.4);
                    const x = chartLeft + index * step + (step - barWidth) / 2;
                    const bottom = chartTop + plotHeight;
                    const label = row.label.length > 12 ? `${row.label.slice(0, 11)}…` : row.label;

                    if (chartMode === 'leads') {
                      let stackedValue = 0;
                      return (
                        <g key={row.id}>
                          <title>
                            {`${row.label}: ${leadSources
                              .map((source) => `${source} ${toNumber(row.day?.leadsBySource?.[source])}`)
                              .join(', ')}`}
                          </title>
                          {leadSources.map((source, sourceIndex) => {
                            const value = toNumber(row.day?.leadsBySource?.[source]);
                            const barHeight = (value / axisMaximum) * plotHeight;
                            const y = bottom - ((stackedValue + value) / axisMaximum) * plotHeight;
                            stackedValue += value;
                            if (!value) return null;

                            return (
                              <rect
                                key={source}
                                x={x}
                                y={y}
                                width={barWidth}
                                height={barHeight}
                                rx="4"
                                fill={sourceColors[sourceIndex % sourceColors.length]}
                              />
                            );
                          })}
                          {shouldShowDateLabel(index) && (
                            <>
                              <text
                                className="dashboard-chart-date-full"
                                x={x + barWidth / 2}
                                y={chartHeight - 12}
                                textAnchor="middle"
                                fill="#718087"
                                fontSize="9"
                              >
                                {label}
                              </text>
                              <text
                                className="dashboard-chart-date-short"
                                x={x + barWidth / 2}
                                y={chartHeight - 12}
                                textAnchor="middle"
                                fill="#718087"
                                fontSize="9"
                              >
                                {label.split(' ')[0]}
                              </text>
                            </>
                          )}
                        </g>
                      );
                    }

                    const barHeight = (row.value / axisMaximum) * plotHeight;
                    const y = bottom - barHeight;
                    const color =
                      chartMode === 'sources'
                        ? sourceColors[(row.colorIndex || 0) % sourceColors.length]
                        : sourceColors[0];

                    return (
                      <g key={row.id}>
                        <title>{`${row.label}: ${formatCount(row.value)}`}</title>
                        <rect
                          x={x}
                          y={y}
                          width={barWidth}
                          height={Math.max(barHeight, row.value ? 2 : 0)}
                          rx="4"
                          fill={color}
                        />
                        <text
                          x={x + barWidth / 2}
                          y={Math.max(chartTop + 10, y - 7)}
                          textAnchor="middle"
                          fill="#52646a"
                          fontSize="9"
                          fontWeight="600"
                        >
                          {formatCount(row.value)}
                        </text>
                        {shouldShowDateLabel(index) && (
                          <text
                            x={x + barWidth / 2}
                            y={chartHeight - 12}
                            textAnchor="middle"
                            fill="#718087"
                            fontSize="9"
                          >
                            {label}
                          </text>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            ) : (
              <div className="flex h-[250px] flex-col items-center justify-center text-center">
                {chartMode === 'cases' ? (
                  <Briefcase className="h-7 w-7 text-slate-300" />
                ) : (
                  <Users className="h-7 w-7 text-slate-300" />
                )}
                <p className="mt-2 text-xs font-medium text-slate-600">Nothing to chart yet</p>
                <p className="mt-1 text-[10px] text-slate-400">
                  Add records in this area to see the {chartMode === 'sources' ? 'source breakdown' : 'daily trend'}.
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 border-t border-slate-100">
            {summaryMetrics.map((metric, index) => (
              <Link
                key={metric.label}
                to={metric.to}
                className={`group px-4 py-4 transition hover:bg-slate-50/80 sm:px-5 ${
                  index > 1 ? 'border-t border-slate-100' : ''
                } ${index % 2 === 1 ? 'border-l border-slate-100' : ''}`}
              >
                <span className="flex items-center justify-between gap-2 text-[10px] text-slate-500">
                  {metric.label}
                  <TrendBadge trend={metric.trend} title={trendTitle(metric.trend)} />
                </span>
                <span className="mt-1 flex items-center justify-between gap-2">
                  <span className="text-lg font-semibold tracking-tight text-slate-800">
                    {formatCount(toNumber(metric.trend?.current))}
                  </span>
                  <metric.icon className="h-4 w-4 text-slate-300 transition group-hover:text-brand-600" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section className="surface-card flex flex-col items-center px-5 py-5 sm:px-6">
          <div className="flex w-full items-start justify-between">
            <div>
              <h2 className="surface-card-title">Revenue & outcomes</h2>
              <p className="surface-card-subtitle">Collection and approval progress</p>
            </div>
            <Link
              to="/invoices"
              aria-label="Open invoices"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-50 hover:text-brand-700"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div
            className="relative mt-3 h-[200px] w-[200px] max-w-full"
            role="img"
            aria-label={`Collection rate ${collectionRate} percent, case approval rate ${approvalRate} percent`}
          >
            <svg viewBox="0 0 200 200" className="h-full w-full">
              <circle cx="100" cy="100" r="72" fill="none" stroke="#edf1f2" strokeWidth="10" />
              {collectionRate > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r="72"
                  fill="none"
                  stroke="#168b93"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(collectionRate / 100) * 452.39} 452.39`}
                  transform="rotate(-90 100 100)"
                />
              )}
              <circle cx="100" cy="100" r="58" fill="none" stroke="#f1f5f4" strokeWidth="8" />
              {approvalRate > 0 && (
                <circle
                  cx="100"
                  cy="100"
                  r="58"
                  fill="none"
                  stroke="#39c9a7"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(approvalRate / 100) * 364.42} 364.42`}
                  transform="rotate(-90 100 100)"
                />
              )}
              <text x="100" y="98" textAnchor="middle" fill="#17212b" fontSize="27" fontWeight="650">
                {collectionRate}%
              </text>
              <text x="100" y="118" textAnchor="middle" fill="#829096" fontSize="10">
                collected
              </text>
            </svg>
          </div>

          <div className="mt-1 grid w-full grid-cols-2 gap-3 text-center">
            <div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-[#168b93]" />
                Collections
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-800">{collectionRate}%</p>
              <p className="text-[10px] text-slate-500">PKR {formatCurrency(totalCollected)} collected</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
                <span className="h-2 w-2 rounded-full bg-[#39c9a7]" />
                Approved cases
              </div>
              <p className="mt-1 text-sm font-semibold text-slate-800">
                {approvalRate}%
              </p>
              <p className="text-[10px] text-slate-500">{approvedCases} / {totalCases} cases</p>
            </div>
          </div>

          <div className="mt-4 w-full rounded-xl bg-slate-50 px-4 py-3">
            <div className="flex items-center justify-between gap-2 text-[10px]">
              <span className="text-slate-500">Outstanding balance</span>
              <span className="font-semibold text-slate-800">PKR {formatCurrency(outstanding)}</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full rounded-full bg-[#168b93]" style={{ width: `${collectionRate}%` }} />
            </div>
          </div>
          <Link to="/invoices" className="mt-4 inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-900">
            Manage invoices <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>
      </div>

      <section className="surface-card overflow-hidden">
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-3 sm:px-6">
          <div>
            <h2 className="surface-card-title">Active users</h2>
             <p className="surface-card-subtitle">Active visa case destinations</p>
          </div>
          {activeUsers && (
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
              {formatCount(activeUsers.count)} enabled
            </span>
          )}
        </div>
        {activeCaseDestinations ? (
          <div className="grid gap-5 p-4 md:grid-cols-[minmax(0,1.3fr)_minmax(220px,0.8fr)]">
            <div className="flex min-w-0 flex-col">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h3 className="text-xs font-semibold text-slate-800">Active case destinations</h3>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {formatCount(activeCaseDestinations.totalCases)}{' '}
                    live CRM {activeCaseDestinations.totalCases === 1 ? 'case' : 'cases'} ·{' '}
                    {sampleDestinationCountries.length} sample countries
                  </p>
                </div>
              </div>
              <div className="active-destination-map mt-3 flex min-h-[200px] flex-1 items-center justify-center rounded-xl p-2">
                <WorldMap countries={mapDestinationCountries} />
              </div>
            </div>
            <div className="min-w-0">
              <div className="mb-3">
                <h3 className="text-xs font-semibold text-slate-800">Destinations by country</h3>
                <p className="mt-1 text-[10px] text-slate-400">Live cases and demo preview</p>
              </div>
              <p className="mb-2 text-[9px] text-slate-400">
                Demo counts are illustrative; not saved in CRM.
              </p>
              <div className="space-y-1">
                {visibleLiveDestinationCountries.map((country) => (
                  <CountryProgressRow key={country.code} country={country} />
                ))}
                {visibleSampleDestinationCountries.map((country) => (
                  <CountryProgressRow key={country.code} country={country} />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div role="alert" className="px-5 py-4 text-xs text-rose-600">
            Active destination data is unavailable.
          </div>
        )}
      </section>

      <div className="dashboard-support-grid gap-4">
        <section className="surface-card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
            <div>
              <h2 className="surface-card-title">Recent visa cases</h2>
              <p className="surface-card-subtitle">Latest files moving through your workflow</p>
            </div>
            <Link to="/cases" className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-700 hover:text-brand-900">
              All cases <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-slate-100 px-5 sm:px-6">
            {data?.recentCases?.length > 0 ? (
              data.recentCases.map((item: any) => {
                const firstName = item.applicant?.firstName || '';
                const lastName = item.applicant?.lastName || '';
                const initials = `${firstName[0] || ''}${lastName[0] || ''}` || 'A';

                return (
                  <div key={item.id} className="flex min-w-0 items-center gap-3 py-4">
                    <div className="case-avatar">{initials.toUpperCase()}</div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-slate-800">
                        {`${firstName} ${lastName}`.trim() || 'Applicant'}
                      </p>
                      <p className="mt-1 truncate text-[10px] text-slate-500">
                        {item.reference || 'Case'} <span className="px-1 text-slate-300">•</span>
                        {[item.country?.name, item.visaType?.name].filter(Boolean).join(' / ') || 'Visa application'}
                      </p>
                    </div>
                    <span className="hidden max-w-36 truncate rounded-full bg-slate-100 px-2 py-1 text-[9px] font-semibold text-slate-600 md:inline-block">
                      {(item.status || 'In progress').replace(/_/g, ' ')}
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center">
                <Briefcase className="mx-auto h-7 w-7 text-slate-300" />
                <p className="mt-2 text-xs font-medium text-slate-600">No visa cases yet</p>
                <p className="mt-1 text-[10px] text-slate-400">Convert a qualified lead to open a case.</p>
              </div>
            )}
          </div>
        </section>

        <section className="surface-card p-5 sm:p-6">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <h2 className="surface-card-title">Historical visa snapshot</h2>
              <p className="surface-card-subtitle">
                {historicalImport
                  ? `As of ${importedSnapshotDate} · ${historicalImport.sheetCount} sheets`
                  : 'Workbook status summary'}
              </p>
            </div>
            <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[9px] font-semibold text-slate-500">
              Historical
            </span>
          </div>
          {historicalImport ? (
            <>
              <div className="mb-5 grid grid-cols-3 divide-x divide-slate-100 rounded-lg bg-slate-50 py-3 text-center">
                <div className="px-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCount(toNumber(historicalImport.recordCount))}
                  </p>
                  <p className="mt-1 text-[9px] text-slate-500">Records</p>
                </div>
                <div className="px-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCount(toNumber(historicalImport.uniquePassportCount))}
                  </p>
                  <p className="mt-1 text-[9px] text-slate-500">Unique passports</p>
                </div>
                <div className="px-1">
                  <p className="text-sm font-semibold text-slate-800">
                    {formatCount(toNumber(historicalImport.repeatedPassportEntries))}
                  </p>
                  <p className="mt-1 text-[9px] text-slate-500">Repeated rows</p>
                </div>
              </div>
              <div className="space-y-3">
                {visibleImportedStatuses.map((item, index) => {
                  const percentage = historicalImport.recordCount
                    ? Math.round((item.count / toNumber(historicalImport.recordCount)) * 100)
                    : 0;
                  return (
                    <div key={item.status}>
                      <div className="mb-1 flex items-center justify-between gap-3 text-[10px]">
                        <span className="truncate font-medium text-slate-700">{item.status}</span>
                        <span className="shrink-0 text-slate-500">{formatCount(item.count)}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: sourceColors[index % sourceColors.length],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              {remainingImportedStatuses.length > 0 && (
                <details className="mt-4 border-t border-slate-100 pt-3">
                  <summary className="cursor-pointer text-[10px] font-semibold text-brand-700">
                    Show all {importedStatusRows.length} statuses
                  </summary>
                  <div className="mt-3 max-h-52 space-y-2 overflow-y-auto pr-1">
                    {remainingImportedStatuses.map((item) => (
                      <div key={item.status} className="flex items-center justify-between gap-3 text-[10px]">
                        <span className="truncate text-slate-600">{item.status}</span>
                        <span className="shrink-0 font-medium text-slate-700">{formatCount(item.count)}</span>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </>
          ) : (
            <div className="py-8 text-center">
              <FileText className="mx-auto h-7 w-7 text-slate-300" />
              <p className="mt-2 text-xs font-medium text-slate-600">No historical data imported</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
