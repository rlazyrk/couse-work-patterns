export class NotificationRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll(where, take = 50) {
    return await this.prisma.notification.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
    });
  }

  async getUnreadCount(where) {
    return await this.prisma.notification.count({ where });
  }

  async findById(id) {
    return await this.prisma.notification.findUnique({ where: { id } });
  }

  async markAsRead(id) {
    return await this.prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });
  }

  async markAllAsRead(userId) {
    return await this.prisma.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true },
    });
  }

  async create(data) {
    return await this.prisma.notification.create({ data });
  }
}
