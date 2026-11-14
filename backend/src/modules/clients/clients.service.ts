import prisma from '../../shared/prisma';

export class ClientsService {
  static async list(businessId: string, query: any) {
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '20');
    const skip = (page - 1) * limit;

    const where: any = { businessId };
    if (query.search) {
      where.OR = [
        { firstName: { contains: query.search } },
        { lastName: { contains: query.search } },
        { email: { contains: query.search } },
        { phone: { contains: query.search } },
      ];
    }

    const [total, data] = await Promise.all([
      prisma.client.count({ where }),
      prisma.client.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          applicants: true,
          _count: { select: { cases: true, invoices: true } },
        },
      }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static async getById(id: string, businessId: string) {
    return prisma.client.findFirst({
      where: { id, businessId },
      include: {
        applicants: true,
        cases: {
          include: { country: true, visaType: true },
        },
        invoices: true,
      },
    });
  }

  static async create(businessId: string, data: any) {
    return prisma.client.create({
      data: {
        ...data,
        businessId,
      },
    });
  }

  static async update(id: string, businessId: string, data: any) {
    return prisma.client.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, businessId: string) {
    return prisma.client.delete({
      where: { id },
    });
  }
}

