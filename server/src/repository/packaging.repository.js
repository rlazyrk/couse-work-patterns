export class PackagingRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll(where) {
    return await this.prisma.packaging.findMany({
      where,
      orderBy: { price: "asc" },
    });
  }

  async getById(id) {
    return await this.prisma.packaging.findUnique({ where: { id } });
  }

  async create(type, price) {
    return await this.prisma.packaging.create({
      data: { type, price: parseFloat(price) },
    });
  }

  async update(id, updateData) {
    return await this.prisma.packaging.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteById(id) {
    return await this.prisma.packaging.delete({ where: { id } });
  }
}
