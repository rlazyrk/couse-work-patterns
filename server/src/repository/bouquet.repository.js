export class BouquetRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async getAll(where) {
    return await this.prisma.bouquet.findMany({
      where: where,
      include: {
        eventType: true,
        flowers: {
          include: {
            flower: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getByID(bouquetID) {
    return await this.prisma.bouquet.findUnique({
      where: { id: bouquetID },
      include: {
        eventType: true,
        flowers: {
          include: {
            flower: true,
          },
        },
      },
    });
  }

  async create(
    name,
    description,
    price,
    imageUrl,
    isCustom,
    eventTypeId,
    flowers
  ) {
    return await this.prisma.bouquet.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        isCustom: isCustom || false,
        eventTypeId: eventTypeId || null,
        flowers: flowers
          ? {
              create: flowers.map((f) => ({
                flowerId: f.flowerId,
                quantity: f.quantity,
              })),
            }
          : undefined,
      },
      include: {
        eventType: true,
        flowers: {
          include: {
            flower: true,
          },
        },
      },
    });
  }

  async update(id, data) {
    if (data.flowers) {
      await this.prisma.bouquetFlower.deleteMany({
        where: { bouquetId: id },
      });

      await this.prisma.bouquetFlower.createMany({
        data: flowers.map((f) => ({
          bouquetId: id,
          flowerId: f.flowerId,
          quantity: f.quantity,
        })),
      });
    }

    return await this.prisma.bouquet.update({
      where: { id },
      data: data,
      include: {
        eventType: true,
        flowers: {
          include: {
            flower: true,
          },
        },
      },
    });
  }
  async findById(id) {
    return await this.prisma.bouquet.findUnique({
      where: { id },
      include: {
        eventType: true,
        flowers: {
          include: {
            flower: true,
          },
        },
      },
    });
  }

  async deleteById(id) {
    const bouquet = await this.prisma.bouquet.findUnique({ where: { id } });
    if (!bouquet) {
      return;
    }
    await this.prisma.bouquet.delete({
      where: { id },
    });
  }
}
