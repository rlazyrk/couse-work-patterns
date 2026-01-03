import { AuthRepository } from "../../repository/auth.repository.js";
import { BouquetRepository } from "../../repository/bouquet.repository.js";
import { ClientCardRepository } from "../../repository/clientCard.repository.js";
import { UserRepository } from "../../repository/user.repository.js";
import { PackagingRepository } from "../../repository/packaging.repository.js";
import { FlowerRepository } from "../../repository/flower.repository.js";
import { NotificationRepository } from "../../repository/notification.repository.js";
import { DeliveryRepository } from "../../repository/delivery.repository.js";
import { OrderRepository } from "../../repository/order.repository.js";
import { EventTypeRepository } from "../../repository/eventType.repository.js";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const provider = {
  eventTypeRepository: new EventTypeRepository(prisma),
  authRepository: new AuthRepository(prisma),
  bouquetRepository: new BouquetRepository(prisma),
  clientCardRepository: new ClientCardRepository(prisma),
  userRepository: new UserRepository(prisma),
  packagingRepository: new PackagingRepository(prisma),
  flowerRepository: new FlowerRepository(prisma),
  notificationRepository: new NotificationRepository(prisma),
  deliveryRepository: new DeliveryRepository(prisma),
  orderRepository: new OrderRepository(prisma),
  prisma,
};

export default provider;
