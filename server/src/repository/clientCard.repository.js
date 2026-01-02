import ClientCardFactory from "../patterns/factory/ClientCardFactory.js";

export class ClientCardRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }
  async create(cardType, userID) {
    const cardData = ClientCardFactory.createCard(cardType, userID);
    return this.prisma.clientCard.create({ data: cardData });
  }

  async getAll() {
    return this.prisma.clientCard.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findById(id) {
    return this.prisma.clientCard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findByUserId(userId) {
    return this.prisma.clientCard.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async update(id, updateData) {
    return this.prisma.clientCard.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: { id: true, email: true, firstName: true, lastName: true },
        },
      },
    });
  }

  async addBonusPoints(id, points) {
    return this.prisma.clientCard.update({
      where: { id },
      data: { bonusPoints: { increment: parseInt(points) } },
    });
  }
}
