import prisma from '../../shared/prisma';

export class ApplicantsService {
  static async list(businessId: string, query: any) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '20');
    const skip = (page - 1) * limit;

    const where: any = { businessId };
    if (query.clientId) where.clientId = query.clientId;
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search } },
        { lastName: { contains: query.search } },
        { passportNumber: { contains: query.search } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.applicant.count({ where }),
      prisma.applicant.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          client: true,
          _count: { select: { cases: true, documents: true } },
        },
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getById(id: string, businessId: string) {
    return prisma.applicant.findFirst({
      where: { id, businessId },
      include: {
        client: true,
        cases: {
          include: { country: true, visaType: true },
        },
        documents: true,
      },
    });
  }

  static async create(businessId: string, data: any) {
    return prisma.applicant.create({
      data: {
        ...data,
        businessId,
      },
    });
  }

  static async update(id: string, businessId: string, data: any) {
    return prisma.applicant.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, businessId: string) {
    return prisma.applicant.delete({
      where: { id },
    });
  }
}

