import 'dotenv/config';
import {
  CaseOutcome,
  CaseStatus,
  ClientType,
  ConsentStatus,
  InvoiceStatus,
  LeadStage,
  PaymentMethod,
  PaymentStatus,
  PrismaClient,
} from '@prisma/client';

const prisma = new PrismaClient();
const DEMO_NOTE = 'DEMO DATA - Generated for local preview only; not a real record.';
const DAY_IN_MS = 24 * 60 * 60 * 1000;

const demoCountries = [
  {
    code: 'AE',
    name: 'United Arab Emirates',
    visaTypes: ['Tourist Visa', 'Employment Visa'],
  },
  { code: 'GB', name: 'United Kingdom', visaTypes: ['Standard Visitor Visa', 'Student Visa'] },
  { code: 'CA', name: 'Canada', visaTypes: ['Visitor Visa (TRV)', 'Study Permit'] },
  { code: 'SA', name: 'Saudi Arabia', visaTypes: ['Tourist E-Visa', 'Work Visit Visa'] },
  { code: 'US', name: 'United States', visaTypes: ['Visitor Visa', 'Student Visa'] },
  { code: 'AU', name: 'Australia', visaTypes: ['Visitor Visa', 'Student Visa'] },
  { code: 'TR', name: 'Turkey', visaTypes: ['Tourist e-Visa', 'Student Visa'] },
  { code: 'QA', name: 'Qatar', visaTypes: ['Tourist Visa', 'Work Visa'] },
];

const demoPeople = [
  { firstName: 'Ayesha', lastName: 'Rahman', city: 'Islamabad', code: 'GB', visaType: 'Standard Visitor Visa' },
  { firstName: 'Bilal', lastName: 'Ahmed', city: 'Lahore', code: 'CA', visaType: 'Visitor Visa (TRV)' },
  { firstName: 'Zara', lastName: 'Malik', city: 'Karachi', code: 'AU', visaType: 'Visitor Visa' },
  { firstName: 'Hassan', lastName: 'Javed', city: 'Rawalpindi', code: 'AE', visaType: 'Tourist Visa' },
  { firstName: 'Sana', lastName: 'Iqbal', city: 'Multan', code: 'SA', visaType: 'Tourist E-Visa' },
  { firstName: 'Omar', lastName: 'Farooq', city: 'Faisalabad', code: 'US', visaType: 'Visitor Visa' },
  { firstName: 'Hira', lastName: 'Shah', city: 'Peshawar', code: 'TR', visaType: 'Tourist e-Visa' },
  { firstName: 'Usman', lastName: 'Khalid', city: 'Islamabad', code: 'QA', visaType: 'Tourist Visa' },
];

const demoLeads = [
  { firstName: 'Mariam', lastName: 'Akhtar', code: 'GB', visaType: 'Student Visa', source: 'Website Form', stage: LeadStage.NEW, daysAgo: 0 },
  { firstName: 'Hamza', lastName: 'Siddiqui', code: 'CA', visaType: 'Study Permit', source: 'Referral', stage: LeadStage.QUALIFIED, daysAgo: 1 },
  { firstName: 'Noor', lastName: 'Aslam', code: 'AE', visaType: 'Tourist Visa', source: 'WhatsApp', stage: LeadStage.CONTACTED, daysAgo: 2 },
  { firstName: 'Daniyal', lastName: 'Qureshi', code: 'AU', visaType: 'Student Visa', source: 'Facebook', stage: LeadStage.NEW, daysAgo: 3 },
  { firstName: 'Eman', lastName: 'Rashid', code: 'SA', visaType: 'Tourist E-Visa', source: 'Walk-in', stage: LeadStage.CONSULTATION_BOOKED, daysAgo: 4 },
  { firstName: 'Rayan', lastName: 'Nawaz', code: 'US', visaType: 'Student Visa', source: 'Phone Call', stage: LeadStage.PROPOSAL_SENT, daysAgo: 5 },
  { firstName: 'Laiba', lastName: 'Sheikh', code: 'TR', visaType: 'Student Visa', source: 'Referral', stage: LeadStage.NURTURE, daysAgo: 6 },
  { firstName: 'Taha', lastName: 'Mirza', code: 'QA', visaType: 'Work Visa', source: 'Website Form', stage: LeadStage.NEW, daysAgo: 7 },
  { firstName: 'Alina', lastName: 'Butt', code: 'CA', visaType: 'Visitor Visa (TRV)', source: 'Instagram', stage: LeadStage.CONTACTED, daysAgo: 8 },
  { firstName: 'Saad', lastName: 'Yousaf', code: 'GB', visaType: 'Standard Visitor Visa', source: 'WhatsApp', stage: LeadStage.QUALIFIED, daysAgo: 9 },
  { firstName: 'Mehak', lastName: 'Khan', code: 'AE', visaType: 'Employment Visa', source: 'Walk-in', stage: LeadStage.CONSULTATION_BOOKED, daysAgo: 10 },
  { firstName: 'Zain', lastName: 'Raza', code: 'AU', visaType: 'Visitor Visa', source: 'Facebook', stage: LeadStage.NEW, daysAgo: 12 },
];

const demoCases = [
  { status: CaseStatus.DOCUMENTS_RECEIVED, outcome: CaseOutcome.PENDING, daysAgo: 0 },
  { status: CaseStatus.UNDER_REVIEW, outcome: CaseOutcome.PENDING, daysAgo: 2 },
  { status: CaseStatus.READY_FOR_SUBMISSION, outcome: CaseOutcome.PENDING, daysAgo: 4 },
  { status: CaseStatus.SUBMITTED, outcome: CaseOutcome.PENDING, daysAgo: 6 },
  { status: CaseStatus.AWAITING_DECISION, outcome: CaseOutcome.PENDING, daysAgo: 8 },
  { status: CaseStatus.DOCUMENTS_REQUESTED, outcome: CaseOutcome.PENDING, daysAgo: 10 },
  { status: CaseStatus.APPROVED, outcome: CaseOutcome.APPROVED, daysAgo: 12 },
  { status: CaseStatus.APPROVED, outcome: CaseOutcome.APPROVED, daysAgo: 13 },
];

const demoInvoices = [
  { total: 72000, paid: 72000, status: InvoiceStatus.PAID, daysAgo: 1 },
  { total: 118000, paid: 59000, status: InvoiceStatus.PARTIALLY_PAID, daysAgo: 3 },
  { total: 95000, paid: 0, status: InvoiceStatus.ISSUED, daysAgo: 5 },
  { total: 65000, paid: 35000, status: InvoiceStatus.PARTIALLY_PAID, daysAgo: 7 },
  { total: 48000, paid: 12000, status: InvoiceStatus.PARTIALLY_PAID, daysAgo: 10 },
  { total: 125000, paid: 0, status: InvoiceStatus.ISSUED, daysAgo: 12 },
];

const dateDaysAgo = (days: number) => new Date(Date.now() - days * DAY_IN_MS);
const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY_IN_MS);
const numbered = (value: number) => String(value).padStart(2, '0');

async function main() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) throw new Error('DATABASE_URL is required to seed demo data.');

  const databaseHost = new URL(databaseUrl).hostname.toLowerCase();
  if (
    process.env.NODE_ENV === 'production' ||
    !['localhost', '127.0.0.1', '::1', '[::1]'].includes(databaseHost)
  ) {
    throw new Error('Demo seeding is restricted to a local, non-production database.');
  }

  const business = await prisma.business.findFirst({
    where: { name: 'Go Source Placement Services' },
    select: { id: true, name: true },
  });
  if (!business) {
    throw new Error('Business not found. Run the standard database seed before demo seeding.');
  }

  const added = { clients: 0, applicants: 0, cases: 0, leads: 0, invoices: 0 };
  const countryReferences = new Map<string, { id: string; visaTypes: Map<string, string> }>();

  for (const countrySeed of demoCountries) {
    let country = await prisma.country.findFirst({
      where: { businessId: business.id, code: countrySeed.code },
    });
    if (!country) {
      country = await prisma.country.create({
        data: {
          businessId: business.id,
          code: countrySeed.code,
          name: countrySeed.name,
        },
      });
    }

    const visaTypes = new Map<string, string>();
    for (const name of countrySeed.visaTypes) {
      let visaType = await prisma.visaType.findFirst({
        where: { businessId: business.id, countryId: country.id, name },
      });
      if (!visaType) {
        visaType = await prisma.visaType.create({
          data: { businessId: business.id, countryId: country.id, name },
        });
      }
      visaTypes.set(name, visaType.id);
    }

    countryReferences.set(country.code, { id: country.id, visaTypes });
  }

  const clientReferences: Array<{ id: string; applicantId: string }> = [];
  for (const [index, person] of demoPeople.entries()) {
    const email = `demo.client.${numbered(index + 1)}@example.com`;
    let client = await prisma.client.findFirst({
      where: { businessId: business.id, email },
    });
    if (!client) {
      client = await prisma.client.create({
        data: {
          businessId: business.id,
          clientType: ClientType.INDIVIDUAL,
          firstName: person.firstName,
          lastName: person.lastName,
          email,
          city: person.city,
          country: 'Pakistan',
          consentStatus: ConsentStatus.GRANTED,
          consentMethod: 'Demo seed',
          notes: DEMO_NOTE,
        },
      });
      added.clients += 1;
    }

    const passportNumber = `DEMO-PK-2026-${numbered(index + 1)}`;
    let applicant = await prisma.applicant.findFirst({
      where: { businessId: business.id, passportNumber },
    });
    if (!applicant) {
      applicant = await prisma.applicant.create({
        data: {
          businessId: business.id,
          clientId: client.id,
          firstName: person.firstName,
          lastName: person.lastName,
          nationality: 'Pakistani',
          passportNumber,
          passportExpiryDate: new Date('2030-01-01T00:00:00.000Z'),
          email,
          notes: DEMO_NOTE,
        },
      });
      added.applicants += 1;
    }

    clientReferences.push({ id: client.id, applicantId: applicant.id });
  }

  const caseReferences: string[] = [];
  for (const [index, caseSeed] of demoCases.entries()) {
    const person = demoPeople[index];
    const clientReference = clientReferences[index];
    const country = countryReferences.get(person.code);
    const visaTypeId = country?.visaTypes.get(person.visaType);
    if (!country || !visaTypeId) {
      throw new Error(`Missing seeded destination or visa type for ${person.firstName} ${person.lastName}.`);
    }

    const reference = `GS-DEMO-2026-${numbered(index + 1)}`;
    let caseRecord = await prisma.case.findUnique({ where: { reference } });
    if (!caseRecord) {
      const createdAt = dateDaysAgo(caseSeed.daysAgo);
      caseRecord = await prisma.case.create({
        data: {
          businessId: business.id,
          clientId: clientReference.id,
          applicantId: clientReference.applicantId,
          countryId: country.id,
          visaTypeId,
          reference,
          status: caseSeed.status,
          outcome: caseSeed.outcome,
          purpose: `Demo ${person.visaType.toLowerCase()}`,
          travelDate: addDays(createdAt, 60),
          decisionDate:
            caseSeed.outcome === CaseOutcome.APPROVED ? addDays(createdAt, 3) : undefined,
          internalNotes: DEMO_NOTE,
          createdAt,
          updatedAt: createdAt,
        },
      });
      added.cases += 1;
    }
    caseReferences.push(caseRecord.id);
  }

  for (const [index, leadSeed] of demoLeads.entries()) {
    const email = `demo.lead.${numbered(index + 1)}@example.com`;
    const existingLead = await prisma.lead.findFirst({
      where: { businessId: business.id, email },
      select: { id: true },
    });
    if (existingLead) continue;

    const country = countryReferences.get(leadSeed.code);
    const visaTypeId = country?.visaTypes.get(leadSeed.visaType);
    if (!country || !visaTypeId) {
      throw new Error(`Missing seeded destination or visa type for ${leadSeed.firstName} ${leadSeed.lastName}.`);
    }

    const createdAt = dateDaysAgo(leadSeed.daysAgo);
    await prisma.lead.create({
      data: {
        businessId: business.id,
        firstName: leadSeed.firstName,
        lastName: leadSeed.lastName,
        email,
        source: leadSeed.source,
        stage: leadSeed.stage,
        countryId: country.id,
        visaTypeId,
        purpose: `Demo ${leadSeed.visaType.toLowerCase()}`,
        notes: DEMO_NOTE,
        createdAt,
        updatedAt: createdAt,
      },
    });
    added.leads += 1;
  }

  for (const [index, invoiceSeed] of demoInvoices.entries()) {
    const invoiceNumber = `DEMO-INV-2026-${numbered(index + 1)}`;
    const existingInvoice = await prisma.invoice.findUnique({
      where: { invoiceNumber },
      select: { id: true },
    });
    if (existingInvoice) continue;

    const clientIndex = index % clientReferences.length;
    const issueDate = dateDaysAgo(invoiceSeed.daysAgo);
    const reference = numbered(index + 1);
    await prisma.$transaction(async (transaction) => {
      const invoice = await transaction.invoice.create({
        data: {
          businessId: business.id,
          clientId: clientReferences[clientIndex].id,
          caseId: caseReferences[clientIndex],
          invoiceNumber,
          status: invoiceSeed.status,
          issueDate,
          dueDate: addDays(issueDate, 21),
          subtotal: invoiceSeed.total,
          totalAmount: invoiceSeed.total,
          paidAmount: invoiceSeed.paid,
          currency: 'PKR',
          notes: DEMO_NOTE,
          items: {
            create: {
              description: 'Visa consultation and processing demo package',
              quantity: 1,
              unitPrice: invoiceSeed.total,
              totalPrice: invoiceSeed.total,
            },
          },
          createdAt: issueDate,
          updatedAt: issueDate,
        },
        select: { id: true },
      });

      if (invoiceSeed.paid > 0) {
        await transaction.payment.create({
          data: {
            businessId: business.id,
            invoiceId: invoice.id,
            amount: invoiceSeed.paid,
            currency: 'PKR',
            method: PaymentMethod.BANK_TRANSFER,
            status: PaymentStatus.COMPLETED,
            reference: `DEMO-RECEIPT-${reference}`,
            transactionId: `DEMO-TXN-${reference}`,
            notes: DEMO_NOTE,
            paidAt: issueDate,
          },
        });
      }
    });
    added.invoices += 1;
  }

  const totals = {
    clients: await prisma.client.count({ where: { businessId: business.id } }),
    applicants: await prisma.applicant.count({ where: { businessId: business.id } }),
    cases: await prisma.case.count({ where: { businessId: business.id } }),
    leads: await prisma.lead.count({ where: { businessId: business.id } }),
    invoices: await prisma.invoice.count({ where: { businessId: business.id } }),
  };
  const [approvedCases, activeCases, recentLeads, invoices] = await Promise.all([
    prisma.case.count({ where: { businessId: business.id, status: CaseStatus.APPROVED } }),
    prisma.case.count({
      where: {
        businessId: business.id,
        status: {
          notIn: [CaseStatus.CLOSED, CaseStatus.APPROVED, CaseStatus.REFUSED, CaseStatus.WITHDRAWN],
        },
      },
    }),
    prisma.lead.count({
      where: { businessId: business.id, createdAt: { gte: new Date(Date.now() - 14 * DAY_IN_MS) } },
    }),
    prisma.invoice.findMany({
      where: { businessId: business.id },
      select: { totalAmount: true, paidAmount: true },
    }),
  ]);
  const totalBilled = invoices.reduce((sum, invoice) => sum + Number(invoice.totalAmount), 0);
  const totalCollected = invoices.reduce((sum, invoice) => sum + Number(invoice.paidAmount), 0);
  const dashboardPreview = {
    leadsLast14Days: recentLeads,
    totalCases: totals.cases,
    activeCases,
    approvedCases,
    collectionRate: totalBilled ? Math.round((totalCollected / totalBilled) * 100) : 0,
    approvalRate: totals.cases ? Math.round((approvedCases / totals.cases) * 100) : 0,
    totalBilled,
    totalCollected,
  };

  console.log(`Demo data seeded for ${business.name}.`);
  console.log(`Added: ${JSON.stringify(added)}`);
  console.log(`Business totals: ${JSON.stringify(totals)}`);
  console.log(`Dashboard preview: ${JSON.stringify(dashboardPreview)}`);
}

main()
  .catch((error) => {
    console.error('Demo data seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
