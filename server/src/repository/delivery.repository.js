export class DeliveryRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll(where) {
    return await this.prisma.delivery.findMany({
      where,
      orderBy: { price: "asc" },
    });
  }

  async getById(id) {
    return await this.prisma.delivery.findUnique({ where: { id } });
  }

  async create(type, price) {
    return await this.prisma.delivery.create({
      data: { type, price: parseFloat(price) },
    });
  }

  async update(id, updateData) {
    return await this.prisma.delivery.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteById(id) {
    return await this.prisma.delivery.delete({ where: { id } });
  }
}
