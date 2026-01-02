export class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getUserWithCard(userId) {
    return await this.prisma.user.findUnique({
      where: { id: userId },
      include: { clientCard: true },
    });
  }

  async getBouquetById(bouquetId) {
    return await this.prisma.bouquet.findUnique({ where: { id: bouquetId } });
  }

  async getPackagingById(packagingId) {
    return await this.prisma.packaging.findUnique({
      where: { id: packagingId },
    });
  }

  async getDeliveryById(deliveryId) {
    return await this.prisma.delivery.findUnique({ where: { id: deliveryId } });
  }

  async createOrder(data) {
    return await this.prisma.order.create({
      data,
      include: {
        items: { include: { bouquet: true } },
        delivery: true,
        packaging: true,
      },
    });
  }

  async findById(id) {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: { include: { bouquet: true } },
        delivery: true,
        packaging: true,
      },
    });
  }

  async findMany(where) {
    return await this.prisma.order.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        items: { include: { bouquet: true } },
        delivery: true,
        packaging: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateStatus(orderId, newStatus) {
    return await this.prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus },
      include: {
        items: { include: { bouquet: true } },
        delivery: true,
        packaging: true,
      },
    });
  }
}
