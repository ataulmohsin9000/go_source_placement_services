import prisma from '../../shared/prisma';
import { CaseStatus, LeadStage } from '@prisma/client';

const ANALYTICS_DAYS = 14;
const INACTIVE_CASE_STATUSES: CaseStatus[] = [
  CaseStatus.CLOSED,
  CaseStatus.APPROVED,
  CaseStatus.REFUSED,
  CaseStatus.WITHDRAWN,
];

interface DailyAnalytics {
  date: string;
  leadsBySource: Record<string, number>;
  cases: number;
  invoices: number;
}

interface ZonedDateParts {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
}

const dateFormatters = new Map<string, Intl.DateTimeFormat>();

const getZonedDateParts = (date: Date, timeZone: string): ZonedDateParts => {
  let formatter = dateFormatters.get(timeZone);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat('en-US', {
      timeZone,
      calendar: 'gregory',
      numberingSystem: 'latn',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hourCycle: 'h23',
    });
    dateFormatters.set(timeZone, formatter);
  }
  const parts = formatter.formatToParts(date);
  const getPart = (type: string) => Number(parts.find((part) => part.type === type)?.value);

  return {
    year: getPart('year'),
    month: getPart('month'),
    day: getPart('day'),
    hour: getPart('hour'),
    minute: getPart('minute'),
    second: getPart('second'),
  };
};

const getCalendarDateKey = (date: Date) => date.toISOString().slice(0, 10);

const getBusinessDayStart = (year: number, month: number, day: number, timeZone: string) => {
  const targetWallTime = Date.UTC(year, month - 1, day);
  let timestamp = targetWallTime;

  for (let attempt = 0; attempt < 4; attempt += 1) {
    const parts = getZonedDateParts(new Date(timestamp), timeZone);
    const observedWallTime = Date.UTC(
      parts.year,
      parts.month - 1,
      parts.day,
      parts.hour,
      parts.minute,
      parts.second
    );
    const difference = observedWallTime - targetWallTime;
    if (difference === 0) break;
    timestamp -= difference;
  }

  return new Date(timestamp);
};

const getBusinessDateKey = (date: Date, timeZone: string) => {
  const parts = getZonedDateParts(date, timeZone);
  return `${parts.year}-${String(parts.month).padStart(2, '0')}-${String(parts.day).padStart(2, '0')}`;
};

const getTrend = (current: number, previous: number) => ({
  current,
  previous,
  percentChange:
    previous === 0 ? (current === 0 ? 0 : null) : Math.round(((current - previous) / previous) * 100),
});

const isReferralSource = (source: string) => source.toLowerCase().includes('referr');

export class DashboardService {
  static async getOverview(businessId: string) {
    const business = await prisma.business.findUnique({
      where: { id: businessId },
      select: { timezone: true },
    });
    if (!business) throw new Error('Business not found');

    const timeZone = business.timezone;
    const today = getZonedDateParts(new Date(), timeZone);
    const currentStartCalendar = new Date(
      Date.UTC(today.year, today.month - 1, today.day - (ANALYTICS_DAYS - 1))
    );
    const currentEndCalendar = new Date(Date.UTC(today.year, today.month - 1, today.day + 1));
    const previousStartCalendar = new Date(
      Date.UTC(
        currentStartCalendar.getUTCFullYear(),
        currentStartCalendar.getUTCMonth(),
        currentStartCalendar.getUTCDate() - ANALYTICS_DAYS
      )
    );
    const currentStart = getBusinessDayStart(
      currentStartCalendar.getUTCFullYear(),
      currentStartCalendar.getUTCMonth() + 1,
      currentStartCalendar.getUTCDate(),
      timeZone
    );
    const currentEnd = getBusinessDayStart(
      currentEndCalendar.getUTCFullYear(),
      currentEndCalendar.getUTCMonth() + 1,
      currentEndCalendar.getUTCDate(),
      timeZone
    );
    const previousStart = getBusinessDayStart(
      previousStartCalendar.getUTCFullYear(),
      previousStartCalendar.getUTCMonth() + 1,
      previousStartCalendar.getUTCDate(),
      timeZone
    );

    const [
      totalLeads,
      newLeads,
      totalCases,
      activeCases,
      approvedCases,
      totalClients,
      invoices,
      recentCases,
      leadsByStage,
      leadActivity,
      caseActivity,
      invoiceActivity,
      historicalImport,
      activeUserCount,
      activeUsers,
      activeCaseCountries,
    ] = await Promise.all([
      prisma.lead.count({ where: { businessId } }),
      prisma.lead.count({ where: { businessId, stage: LeadStage.NEW } }),
      prisma.case.count({ where: { businessId } }),
      prisma.case.count({
        where: {
          businessId,
          status: { notIn: INACTIVE_CASE_STATUSES },
        },
      }),
      prisma.case.count({ where: { businessId, status: CaseStatus.APPROVED } }),
      prisma.client.count({ where: { businessId } }),
      prisma.invoice.findMany({
        where: { businessId },
        select: { totalAmount: true, paidAmount: true },
      }),
      prisma.case.findMany({
        where: { businessId },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          applicant: true,
          country: true,
          visaType: true,
        },
      }),
      prisma.lead.groupBy({
        by: ['stage'],
        where: { businessId },
        _count: { id: true },
      }),
      prisma.lead.findMany({
        where: {
          businessId,
          createdAt: { gte: previousStart, lt: currentEnd },
        },
        select: { createdAt: true, source: true },
      }),
      prisma.case.findMany({
        where: {
          businessId,
          createdAt: { gte: previousStart, lt: currentEnd },
        },
        select: { createdAt: true },
      }),
      prisma.invoice.findMany({
        where: {
          businessId,
          issueDate: { gte: previousStart, lt: currentEnd },
        },
        select: { issueDate: true },
      }),
      prisma.historicalVisaImport.findFirst({
        where: { businessId },
        orderBy: { importedAt: 'desc' },
        select: {
          sourceFile: true,
          snapshotDate: true,
          recordCount: true,
          uniquePassportCount: true,
          repeatedPassportEntries: true,
          sheetCount: true,
          statusCounts: true,
          importedAt: true,
        },
      }),
      prisma.user.count({
        where: { businessId, isActive: true },
      }),
      prisma.user.findMany({
        where: { businessId, isActive: true },
        take: 6,
        orderBy: [{ lastLoginAt: 'desc' }, { updatedAt: 'desc' }],
        select: {
          id: true,
          firstName: true,
          lastName: true,
          lastLoginAt: true,
          userRoles: {
            select: {
              role: {
                select: { name: true },
              },
            },
          },
        },
      }),
      prisma.country.findMany({
        where: {
          businessId,
          cases: {
            some: {
              businessId,
              status: { notIn: INACTIVE_CASE_STATUSES },
            },
          },
        },
        select: {
          code: true,
          name: true,
          _count: {
            select: {
              cases: {
                where: {
                  businessId,
                  status: { notIn: INACTIVE_CASE_STATUSES },
                },
              },
            },
          },
        },
      }),
    ]);

    let totalBilled = 0;
    let totalCollected = 0;
    invoices.forEach((invoice) => {
      totalBilled += Number(invoice.totalAmount || 0);
      totalCollected += Number(invoice.paidAmount || 0);
    });

    const destinationCounts = activeCaseCountries
      .map(({ code, name, _count }) => ({ code, name, count: _count.cases }))
      .sort((left, right) => right.count - left.count || left.name.localeCompare(right.name));
    const destinationCaseCount = destinationCounts.reduce((total, country) => total + country.count, 0);
    const activeCaseDestinations = {
      totalCases: destinationCaseCount,
      countries: destinationCounts.map((country) => ({
        ...country,
        percentage: destinationCaseCount
          ? Math.round((country.count / destinationCaseCount) * 100)
          : 0,
      })),
    };

    const daily: DailyAnalytics[] = [];
    const dailyByDate = new Map<string, DailyAnalytics>();
    for (
      let calendarDay = new Date(currentStartCalendar);
      calendarDay < currentEndCalendar;
      calendarDay.setUTCDate(calendarDay.getUTCDate() + 1)
    ) {
      const key = getCalendarDateKey(calendarDay);
      const record: DailyAnalytics = { date: key, leadsBySource: {}, cases: 0, invoices: 0 };
      daily.push(record);
      dailyByDate.set(key, record);
    }

    let currentLeadCount = 0;
    let previousLeadCount = 0;
    let currentReferralCount = 0;
    let previousReferralCount = 0;
    const sourceCounts = new Map<string, number>();
    const sourceLabels = new Map<string, string>();

    leadActivity.forEach((lead) => {
      const label = lead.source?.trim() || 'Unspecified';
      const sourceKey = label.toLowerCase();
      sourceLabels.set(sourceKey, sourceLabels.get(sourceKey) || label);

      if (lead.createdAt >= currentStart) {
        currentLeadCount += 1;
        sourceCounts.set(sourceKey, (sourceCounts.get(sourceKey) || 0) + 1);
        const day = dailyByDate.get(getBusinessDateKey(lead.createdAt, timeZone));
        if (day) day.leadsBySource[sourceKey] = (day.leadsBySource[sourceKey] || 0) + 1;
        if (isReferralSource(label)) currentReferralCount += 1;
      } else {
        previousLeadCount += 1;
        if (isReferralSource(label)) previousReferralCount += 1;
      }
    });

    let currentCaseCount = 0;
    let previousCaseCount = 0;
    caseActivity.forEach((caseRecord) => {
      if (caseRecord.createdAt >= currentStart) {
        currentCaseCount += 1;
        const day = dailyByDate.get(getBusinessDateKey(caseRecord.createdAt, timeZone));
        if (day) day.cases += 1;
      } else {
        previousCaseCount += 1;
      }
    });

    let currentInvoiceCount = 0;
    let previousInvoiceCount = 0;
    invoiceActivity.forEach((invoice) => {
      if (invoice.issueDate >= currentStart) {
        currentInvoiceCount += 1;
        const day = dailyByDate.get(getBusinessDateKey(invoice.issueDate, timeZone));
        if (day) day.invoices += 1;
      } else {
        previousInvoiceCount += 1;
      }
    });

    const sourceBreakdown = Array.from(sourceCounts.entries())
      .map(([key, count]) => ({ source: sourceLabels.get(key) || 'Unspecified', count, key }))
      .sort((left, right) => right.count - left.count || left.source.localeCompare(right.source));

    const selectedSources = sourceBreakdown.slice(0, 3);
    const referralSource = sourceBreakdown.find(
      (source) =>
        isReferralSource(source.source) && !selectedSources.some((selected) => selected.key === source.key)
    );
    if (referralSource) selectedSources.push(referralSource);

    const selectedSourceKeys = new Set(selectedSources.map((source) => source.key));
    const hasOtherSources = sourceBreakdown.some((source) => !selectedSourceKeys.has(source.key));
    const leadSources = selectedSources.map((source) => source.source);
    if (hasOtherSources) leadSources.push('Other sources');

    const analyticsDaily = daily.map((day) => {
      const leadsBySource: Record<string, number> = Object.fromEntries(leadSources.map((source) => [source, 0]));
      Object.entries(day.leadsBySource).forEach(([key, count]) => {
        const source = selectedSourceKeys.has(key) ? sourceLabels.get(key) || 'Unspecified' : 'Other sources';
        leadsBySource[source] = (leadsBySource[source] || 0) + count;
      });

      return {
        date: day.date,
        leadsBySource,
        cases: day.cases,
        invoices: day.invoices,
      };
    });

    const currentEndDate = new Date(currentEndCalendar);
    currentEndDate.setUTCDate(currentEndDate.getUTCDate() - 1);
    const previousEndCalendar = new Date(currentStartCalendar);
    previousEndCalendar.setUTCDate(previousEndCalendar.getUTCDate() - 1);

    return {
      metrics: {
        totalLeads,
        newLeads,
        totalCases,
        activeCases,
        approvedCases,
        totalClients,
        totalBilled,
        totalCollected,
        outstanding: totalBilled - totalCollected,
      },
      recentCases,
      historicalImport,
      activeUsers: {
        count: activeUserCount,
        members: activeUsers.map((user) => ({
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          roles: user.userRoles.map(({ role }) => role.name).sort(),
          lastLoginAt: user.lastLoginAt,
        })),
      },
      activeCaseDestinations,
      leadsByStage: leadsByStage.map((lead) => ({ stage: lead.stage, count: lead._count.id })),
      analytics: {
        period: {
          days: ANALYTICS_DAYS,
          timeZone,
          start: getCalendarDateKey(currentStartCalendar),
          end: getCalendarDateKey(currentEndDate),
          previousStart: getCalendarDateKey(previousStartCalendar),
          previousEnd: getCalendarDateKey(previousEndCalendar),
        },
        daily: analyticsDaily,
        leadSources,
        sourceBreakdown: sourceBreakdown.map(({ source, count }) => ({ source, count })),
        trends: {
          leads: getTrend(currentLeadCount, previousLeadCount),
          cases: getTrend(currentCaseCount, previousCaseCount),
          invoices: getTrend(currentInvoiceCount, previousInvoiceCount),
          referralLeads: getTrend(currentReferralCount, previousReferralCount),
        },
      },
    };
  }
}
