class OrderObserver {
  update(order, event) {
    throw new Error("Method must be implemented");
  }
}

class NotificationObserver extends OrderObserver {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async update(order, event, data = {}) {
    const notifications = {
      IN_PROGRESS: {
        message: `Ваше замовлення #${order.id.slice(0, 8)} прийнято в роботу`,
        type: "SYSTEM",
      },
      READY: {
        message: `Ваше замовлення #${order.id.slice(0, 8)} готове до доставки!`,
        type: "ORDER_READY",
      },
      IN_DELIVERY: {
        message: `Ваше замовлення #${order.id.slice(0, 8)} в дорозі`,
        type: "SYSTEM",
      },
      DELIVERED: {
        message: `Ваше замовлення #${order.id.slice(
          0,
          8
        )} доставлено. Дякуємо за покупку!`,
        type: "ORDER_DELIVERED",
      },
    };

    const notification = notifications[event];
    if (notification) {
      await this.prisma.notification.create({
        data: {
          userId: order.userId,
          message: notification.message,
          type: notification.type,
          metadata: {
            orderId: order.id,
            status: event,
          },
        },
      });
    }
  }
}

class BonusObserver extends OrderObserver {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async update(order, event, data = {}) {
    if (event === "DELIVERED") {
      const user = await this.prisma.user.findUnique({
        where: { id: order.userId },
        include: { clientCard: true },
      });

      if (user && user.clientCard) {
        const bonusPoints = Math.floor(parseFloat(order.totalPrice) * 0.01);

        await this.prisma.clientCard.update({
          where: { id: user.clientCard.id },
          data: {
            bonusPoints: {
              increment: bonusPoints,
            },
          },
        });
        await this.prisma.notification.create({
          data: {
            userId: order.userId,
            message: `Вам нараховано ${bonusPoints} бонусних балів за замовлення #${order.id.slice(
              0,
              8
            )}`,
            type: "BONUS_ACCRUED",
            metadata: {
              orderId: order.id,
              bonusPoints,
            },
          },
        });
      }
    }
  }
}

class BonusUsedObserver extends OrderObserver {
  constructor(prisma) {
    super();
    this.prisma = prisma;
  }

  async update(order, event, data = {}) {
    if (
      event === "BONUS_USED" &&
      data.bonusPointsUsed &&
      data.bonusPointsUsed > 0
    ) {
      await this.prisma.notification.create({
        data: {
          userId: order.userId,
          message: `Використано ${
            data.bonusPointsUsed
          } бонусних балів для оплати замовлення #${order.id.slice(0, 8)}`,
          type: "BONUS_USED",
          metadata: {
            orderId: order.id,
            bonusPointsUsed: data.bonusPointsUsed,
          },
        },
      });
    }
  }
}

class OrderSubject {
  constructor() {
    this.observers = [];
  }

  attach(observer) {
    this.observers.push(observer);
  }

  detach(observer) {
    this.observers = this.observers.filter((obs) => obs !== observer);
  }

  async notify(order, event, data = {}) {
    for (const observer of this.observers) {
      try {
        await observer.update(order, event, data);
      } catch (error) {
        console.error("Observer error:", error);
      }
    }
  }
}

export {
  OrderSubject,
  OrderObserver,
  NotificationObserver,
  BonusObserver,
  BonusUsedObserver,
};
