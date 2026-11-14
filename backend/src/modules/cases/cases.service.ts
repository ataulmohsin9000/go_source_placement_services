import prisma from '../../shared/prisma';
import { CaseStatus, CaseOutcome } from '@prisma/client';

export class CasesService {
  static async list(businessId: string, query: any) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '20');
    const skip = (page - 1) * limit;

    const where: any = { businessId };
    if (query.status) where.status = query.status;
    if (query.countryId) where.countryId = query.countryId;
    if (query.clientId) where.clientId = query.clientId;
    if (query.search) {
      where.OR = [
        { reference: { contains: query.search } },
        { applicant: { firstName: { contains: query.search } } },
        { applicant: { lastName: { contains: query.search } } },
        { client: { firstName: { contains: query.search } } },
        { client: { lastName: { contains: query.search } } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.case.count({ where }),
      prisma.case.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          applicant: true,
          country: true,
          visaType: true,
          assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
          _count: { select: { documents: true, tasks: true, checklistItems: true } },
        },
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getById(id: string, businessId: string) {
    return prisma.case.findFirst({
      where: { id, businessId },
      include: {
        client: true,
        applicant: true,
        country: true,
        visaType: true,
        assignedTo: true,
        checklistItems: {
          include: { requirementTemplate: true },
        },
        documents: {
          include: { versions: true },
        },
        tasks: true,
        caseEvents: {
          orderBy: { createdAt: 'desc' },
          include: { user: { select: { firstName: true, lastName: true } } },
        },
      },
    });
  }

  static async create(businessId: string, data: any, userId?: string) {
    const count = await prisma.case.count({ where: { businessId } });
    const reference = `GS-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(4, '0')}`;

    const newCase = await prisma.case.create({
      data: {
        ...data,
        businessId,
        reference,
        createdById: userId,
      },
      include: {
        client: true,
        applicant: true,
        country: true,
        visaType: true,
      },
    });

    // Auto-create initial event
    await prisma.caseEvent.create({
      data: {
        caseId: newCase.id,
        userId,
        eventType: 'CASE_CREATED',
        title: 'Case Created',
        description: `Case ${reference} opened for applicant ${newCase.applicant.firstName} ${newCase.applicant.lastName}`,
      },
    });

    return newCase;
  }

  static async updateStatus(id: string, businessId: string, status: CaseStatus, userId?: string, reason?: string) {
    const existing = await prisma.case.findFirst({ where: { id, businessId } });
    if (!existing) throw new Error('Case not found');

    const updated = await prisma.case.update({
      where: { id },
      data: { status },
    });

    await prisma.caseEvent.create({
      data: {
        caseId: id,
        userId,
        eventType: 'STATUS_CHANGED',
        title: `Status changed to ${status}`,
        description: reason || `Case moved from ${existing.status} to ${status}`,
      },
    });

    return updated;
  }

  static async recordOutcome(id: string, businessId: string, outcome: CaseOutcome, reason?: string, userId?: string) {
    const updated = await prisma.case.update({
      where: { id },
      data: {
        outcome,
        decisionDate: new Date(),
        outcomeNotes: reason,
        status: outcome === CaseOutcome.APPROVED ? CaseStatus.APPROVED : CaseStatus.REFUSED,
      },
    });

    await prisma.caseEvent.create({
      data: {
        caseId: id,
        userId,
        eventType: 'OUTCOME_DECIDED',
        title: `Visa ${outcome}`,
        description: reason || `Decision recorded: ${outcome}`,
      },
    });

    return updated;
  }
}

