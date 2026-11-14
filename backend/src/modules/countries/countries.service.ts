import prisma from '../../shared/prisma';

export class CountriesService {
  static async list(businessId: string) {
    return prisma.country.findMany({
      where: { businessId, isActive: true },
      include: {
        visaTypes: { where: { isActive: true } },
      },
      orderBy: { name: 'asc' },
    });
  }

  static async create(businessId: string, data: any) {
    return prisma.country.create({
      data: { ...data, businessId },
    });
  }

  static async createVisaType(businessId: string, countryId: string, data: any) {
    return prisma.visaType.create({
      data: { ...data, businessId, countryId },
    });
  }
}

