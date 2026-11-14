import prisma from '../../shared/prisma';
import { InvoiceStatus, PaymentMethod } from '@prisma/client';

export class InvoicesService {
  static async list(businessId: string, query: any) {
    const where: any = { businessId };
    if (query.status) where.status = query.status;

    return prisma.invoice.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    });
  }

  static async getById(id: string, businessId: string) {
    return prisma.invoice.findFirst({
      where: { id, businessId },
      include: {
        client: true,
        items: true,
        payments: true,
      },
    });
  }

  static async create(businessId: string, data: any, userId?: string) {
    const count = await prisma.invoice.count({ where: { businessId } });
    const invoiceNumber = `INV-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(count + 1).padStart(4, '0')}`;

    const items = data.items || [];
    let subtotal = 0;
    items.forEach((it: any) => {
      subtotal += Number(it.unitPrice || 0) * Number(it.quantity || 1);
    });
    const taxAmount = Number(data.taxAmount || 0);
    const totalAmount = subtotal + taxAmount - Number(data.discount || 0);

    return prisma.invoice.create({
      data: {
        businessId,
        clientId: data.clientId,
        caseId: data.caseId || null,
        invoiceNumber,
        dueDate: new Date(data.dueDate || Date.now() + 14 * 86400000),
        subtotal,
        taxAmount,
        totalAmount,
        notes: data.notes,
        createdById: userId,
        items: {
          create: items.map((it: any) => ({
            description: it.description,
            quantity: Number(it.quantity || 1),
            unitPrice: Number(it.unitPrice),
            totalPrice: Number(it.unitPrice) * Number(it.quantity || 1),
          })),
        },
      },
      include: { items: true },
    });
  }

  static async recordPayment(invoiceId: string, businessId: string, data: any, userId?: string) {
    const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, businessId } });
    if (!invoice) throw new Error('Invoice not found');

    const paymentAmount = Number(data.amount);
    const payment = await prisma.payment.create({
      data: {
        businessId,
        invoiceId,
        amount: paymentAmount,
        currency: data.currency || invoice.currency,
        method: data.method || PaymentMethod.CASH,
        reference: data.reference,
        notes: data.notes,
        paidAt: new Date(),
        recordedById: userId,
      },
    });

    const newPaidAmount = Number(invoice.paidAmount) + paymentAmount;
    let newStatus = invoice.status;
    if (newPaidAmount >= Number(invoice.totalAmount)) {
      newStatus = InvoiceStatus.PAID;
    } else if (newPaidAmount > 0) {
      newStatus = InvoiceStatus.PARTIALLY_PAID;
    }

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
    });

    return payment;
  }
}

