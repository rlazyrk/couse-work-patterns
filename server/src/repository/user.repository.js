export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll() {
    return await this.prisma.user.findMany({
      include: {
        clientCard: true,
        _count: {
          select: { orders: true },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        clientCard: true,
        createdAt: true,
        _count: true,
      },
    });
  }

  async getById(id) {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        clientCard: true,
        orders: {
          include: {
            items: {
              include: {
                bouquet: true,
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  async update(id, data) {
    return await this.prisma.user.update({ where: { id }, data });
  }

  async deleteById(id) {
    return await this.prisma.user.delete({ where: { id } });
  }
  async getByIdWithCard(id) {
    return await this.prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { clientCard: true },
    });
  }
}
