import prisma from '../../shared/prisma';

export class TasksService {
  static async list(businessId: string, query: any) {
    const where: any = { businessId };
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;
    if (query.caseId) where.caseId = query.caseId;

    return prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        case: { select: { id: true, reference: true } },
      },
    });
  }

  static async create(businessId: string, data: any, userId?: string) {
    return prisma.task.create({
      data: {
        ...data,
        businessId,
        createdById: userId,
      },
    });
  }

  static async update(id: string, businessId: string, data: any) {
    return prisma.task.update({
      where: { id },
      data,
    });
  }

  static async delete(id: string, businessId: string) {
    return prisma.task.delete({
      where: { id },
    });
  }
}

