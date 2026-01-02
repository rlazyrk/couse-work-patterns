export class FlowerRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async getAll(where) {
    return await this.prisma.flower.findMany({
      where,
      orderBy: { name: "asc" },
    });
  }

  async getById(id) {
    return await this.prisma.flower.findUnique({ where: { id } });
  }

  async create(name, price, imageUrl) {
    return await this.prisma.flower.create({
      data: { name, price: parseFloat(price), imageUrl: imageUrl || null },
    });
  }

  async update(id, updateData) {
    return await this.prisma.flower.update({ where: { id }, data: updateData });
  }

  async deleteById(id) {
    return await this.prisma.flower.delete({ where: { id } });
  }
}
