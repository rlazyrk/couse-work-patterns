import { DeliveryDiscountContext } from "../patterns/strategy/DeliveryDiscountStrategy.js";
import jwt from "jsonwebtoken";

class DeliveryController {
  constructor(provider) {
    this.repository = provider.deliveryRepository;
    this.orderRepository = provider.orderRepository;
    this.deliveryDiscountContext = new DeliveryDiscountContext();
  }

  async getUserFromToken(req) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
      }
      const token = authHeader.substring(7);
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded;
    } catch (error) {
      return null;
    }
  }

  async getAll(req, res, next) {
    try {
      const { isActive } = req.query;
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === "true";

      const deliveries = await this.repository.getAll(where);

      // Якщо користувач авторизований, розраховуємо ціну з урахуванням знижки
      // Перевіряємо req.user (якщо middleware встановив) або токен з заголовка
      const userToken = req.user || await this.getUserFromToken(req);
      if (userToken?.userId || userToken?.id) {
        try {
          const userId = userToken.userId || userToken.id;
          const user = await this.orderRepository.getUserWithCard(userId);
          if (user?.clientCard) {
            const deliveriesWithDiscount = deliveries.map((delivery) => {
              const originalPrice = delivery.price;
              const discountedPrice = this.deliveryDiscountContext.calculate(
                originalPrice,
                user.clientCard.type,
                user.clientCard.deliveryDiscountPercent
              );
              return {
                ...delivery,
                originalPrice,
                price: discountedPrice,
                discountApplied: discountedPrice < originalPrice,
                discountPercent: user.clientCard.deliveryDiscountPercent,
              };
            });
            return res.json({ deliveries: deliveriesWithDiscount });
          }
        } catch (error) {
          // Якщо помилка при отриманні користувача, просто повертаємо стандартні ціни
          console.error("Error getting user for delivery discount:", error);
        }
      }

      res.json({ deliveries });
    } catch (error) {
      next(error);
    }
  }

  async calculatePrice(req, res, next) {
    try {
      const { deliveryId } = req.params;
      const delivery = await this.repository.getById(deliveryId);

      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }

      let finalPrice = delivery.price;
      let discountApplied = false;
      let discountPercent = 0;
      if (req.user && req.user.id) {
        const user = await this.orderRepository.getUserWithCard(req.user.id);
        if (user?.clientCard) {
          const originalPrice = delivery.price;
          finalPrice = this.deliveryDiscountContext.calculate(
            originalPrice,
            user.clientCard.type,
            user.clientCard.deliveryDiscountPercent
          );
          discountApplied = finalPrice < originalPrice;
          discountPercent = user.clientCard.deliveryDiscountPercent;
        }
      }

      res.json({
        deliveryId: delivery.id,
        originalPrice: delivery.price,
        finalPrice,
        discountApplied,
        discountPercent,
      });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const delivery = await this.repository.getById(id);

      if (!delivery) {
        return res.status(404).json({ error: "Delivery not found" });
      }

      res.json({ delivery });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { type, price } = req.body;

      const delivery = await this.repository.create(type, price);

      res.status(201).json({ delivery });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { type, price, isActive } = req.body;

      const updateData = {};
      if (type) updateData.type = type;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (isActive !== undefined) updateData.isActive = isActive;

      const delivery = await this.repository.update(id, updateData);

      res.json({ delivery });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.repository.deleteById(id);

      res.json({ message: "Delivery deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default DeliveryController;
