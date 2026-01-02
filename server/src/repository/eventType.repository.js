export class EventTypeRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll() {
    return await this.prisma.eventType.findMany({
      include: { _count: { select: { bouquets: true } } },
      orderBy: { name: "asc" },
    });
  }

  async getById(id) {
    return await this.prisma.eventType.findUnique({
      where: { id },
      include: { bouquets: { where: { isActive: true } } },
    });
  }

  async create(name) {
    return await this.prisma.eventType.create({ data: { name } });
  }

  async update(id, data) {
    return await this.prisma.eventType.update({ where: { id }, data });
  }

  async deleteById(id) {
    return await this.prisma.eventType.delete({ where: { id } });
  }
}
