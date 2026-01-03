import bcrypt from "bcryptjs";

export class AuthRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  async createUser(email, password, firstName, lastName, phone = null) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone: phone || null,
        role: "CLIENT",
      },
    });
  }
  async findByEmail(email) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findByEmailWithCard(email) {
    return await this.prisma.user.findUnique({
      where: { email },
      include: { clientCard: true },
    });
  }

  async findByID(userID) {
    return this.prisma.user.findUnique({
      where: { id: userID },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        createdAt: true,

        clientCard: true,

        orders: {
          orderBy: { createdAt: "desc" },
          include: {
            items: {
              include: {
                bouquet: {
                  select: {
                    id: true,
                    name: true,
                    imageUrl: true,
                    price: true,
                  },
                },
              },
            },
            delivery: true,
            packaging: true,
          },
        },
      },
    });
  }
}
