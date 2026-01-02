import {
  OrderSubject,
  NotificationObserver,
  BonusObserver,
} from "../patterns/observer/OrderObserver.js";
import { DeliveryDiscountContext } from "../patterns/strategy/DeliveryDiscountStrategy.js";

class OrderService {
  constructor(provider) {
    this.provider = provider;
    this.orderRepository = provider.orderRepository;
    this.orderSubject = new OrderSubject();
    this.deliveryDiscountContext = new DeliveryDiscountContext();

    this.orderSubject.attach(new NotificationObserver(provider.prisma));
    this.orderSubject.attach(new BonusObserver(provider.prisma));
  }

  async createOrder(userId, orderData) {
    const {
      items,
      deliveryId,
      packagingId,
      deliveryAddress,
      deliveryDate,
      notes,
    } = orderData;

    const user = await this.orderRepository.getUserWithCard(userId);

    let totalPrice = 0;
    const orderItems = [];

    for (const item of items) {
      let itemPrice = 0;

      if (item.bouquetId) {
        const bouquet = await this.orderRepository.getBouquetById(
          item.bouquetId
        );
        if (!bouquet) throw new Error(`Bouquet ${item.bouquetId} not found`);
        itemPrice = bouquet.price;
      } else if (item.customPrice) {
        itemPrice = item.customPrice;
      }

      const quantity = item.quantity || 1;
      const itemTotal = itemPrice * quantity;
      totalPrice += itemTotal;

      orderItems.push({
        quantity,
        price: itemTotal,
        bouquetId: item.bouquetId || null,
      });
    }

    let packagingPrice = 0;
    if (packagingId) {
      const packaging = await this.orderRepository.getPackagingById(
        packagingId
      );
      if (packaging) {
        packagingPrice = packaging.price;
        totalPrice += packagingPrice;
      }
    }

    let deliveryPrice = 0;
    if (deliveryId) {
      const delivery = await this.orderRepository.getDeliveryById(deliveryId);
      if (delivery) {
        const originalDeliveryPrice = delivery.price;

        if (user?.clientCard) {
          deliveryPrice = this.deliveryDiscountContext.calculate(
            originalDeliveryPrice,
            user.clientCard.type,
            user.clientCard.deliveryDiscountPercent
          );
        } else {
          deliveryPrice = originalDeliveryPrice;
        }

        totalPrice += deliveryPrice;
      }
    }

    const orderPayload = {
      userId,
      status: "PENDING",
      totalPrice,
      deliveryAddress: deliveryAddress || null,
      deliveryDate: deliveryDate ? new Date(deliveryDate) : null,
      notes: notes || null,
      deliveryId: deliveryId || null,
      packagingId: packagingId || null,
      items: { create: orderItems },
    };

    const order = await this.orderRepository.createOrder(orderPayload);
    
    await this.orderSubject.notify(order, "PENDING");

    return order;
  }

  async updateOrderStatus(orderId, newStatus) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) throw new Error("Order not found");

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      newStatus
    );

    // Сповіщення про зміну статусу
    await this.orderSubject.notify(updatedOrder, newStatus);

    return updatedOrder;
  }
}

export default OrderService;
