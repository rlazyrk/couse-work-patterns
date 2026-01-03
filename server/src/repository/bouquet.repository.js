export class BouquetRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async getAll(where, search, priceMin, priceMax) {
    const whereClause = { ...where };


    if (search && search.trim()) {
      const searchTerm = search.trim();
      if (Object.keys(whereClause).length > 0) {
        whereClause.AND = [
          ...(whereClause.AND || []),
          {
            OR: [
              { name: { contains: searchTerm, mode: "insensitive" } },
              { description: { contains: searchTerm, mode: "insensitive" } },
            ],
          },
        ];
        delete whereClause.OR;
      } else {
        whereClause.OR = [
          { name: { contains: searchTerm, mode: "insensitive" } },
          { description: { contains: searchTerm, mode: "insensitive" } },
        ];
      }
    }


    const priceFilter = {};
    if (priceMin !== undefined && priceMin !== null && priceMin > 0) {
      priceFilter.gte = parseFloat(priceMin);
    }
    if (priceMax !== undefined && priceMax !== null && priceMax > 0) {
      priceFilter.lte = parseFloat(priceMax);
    }
    if (Object.keys(priceFilter).length > 0) {
      whereClause.price = priceFilter;
    }

    return await this.prisma.bouquet.findMany({
      where: whereClause,
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
    flowers,
    createdById = null
  ) {
    return await this.prisma.bouquet.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        imageUrl: imageUrl || null,
        isCustom: isCustom || false,
        eventTypeId: eventTypeId || null,
        createdById: createdById || null,
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
