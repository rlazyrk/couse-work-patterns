export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,

        clientCard: true,

        _count: {
          select: {
            orders: true,
          },
        },
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
      where: { id },
      include: { clientCard: true },
    });
  }
}
