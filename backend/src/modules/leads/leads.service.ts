import prisma from '../../shared/prisma';
import { LeadStage } from '@prisma/client';

export class LeadsService {
  static async list(businessId: string, query: any) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '20');
    const skip = (page - 1) * limit;

    const where: any = { businessId };
    if (query.stage) where.stage = query.stage;
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search } },
        { lastName: { contains: query.search } },
        { email: { contains: query.search } },
        { phone: { contains: query.search } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.lead.count({ where }),
      prisma.lead.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          country: true,
          visaType: true,
          assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
      }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: string, businessId: string) {
    return prisma.lead.findFirst({
      where: { id, businessId },
      include: {
        country: true,
        visaType: true,
        assignedTo: true,
      },
    });
  }

  static async create(businessId: string, data: any, userId?: string) {
    return prisma.lead.create({
      data: {
        ...data,
        businessId,
        createdById: userId,
      },
      include: {
        country: true,
        visaType: true,
      },
    });
  }

  static async update(id: string, businessId: string, data: any) {
    return prisma.lead.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, businessId: string) {
    return prisma.lead.delete({
      where: { id },
    });
  }

  static async convert(id: string, businessId: string) {
    const lead = await prisma.lead.findFirst({
      where: { id, businessId },
    });
    if (!lead) throw new Error('Lead not found');

    // Create client
    const client = await prisma.client.create({
      data: {
        businessId,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
        preferredLanguage: lead.preferredLanguage || 'en',
      },
    });

    // Create applicant
    const applicant = await prisma.applicant.create({
      data: {
        businessId,
        clientId: client.id,
        firstName: lead.firstName,
        lastName: lead.lastName,
        email: lead.email,
        phone: lead.phone,
      },
    });

    // Update lead
    await prisma.lead.update({
      where: { id: lead.id },
      data: {
        stage: LeadStage.WON,
        convertedClientId: client.id,
      },
    });

    return { client, applicant };
  }
}

