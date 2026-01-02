import OrderService from "../services/order.service.js";

class OrderController {
  constructor(provider) {
    this.orderService = new OrderService(provider);
    this.repository = provider.orderRepository;
  }

  async getAll(req, res, next) {
    try {
      const { status, userId } = req.query;
      const where = {};

      if (req.user.role !== "ADMIN") {
        where.userId = req.user.id;
      } else if (userId) {
        where.userId = userId;
      }

      if (status) {
        where.status = status;
      }

      const orders = await this.repository.findMany(where);
      res.json({ orders });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const order = await this.repository.findById(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      // Перевірка доступу
      if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      res.json({ order });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const order = await this.orderService.createOrder(req.user.id, req.body);
      res.status(201).json({ order });
    } catch (error) {
      next(error);
    }
  }

  async updateStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
      }

      const order = await this.orderService.updateOrderStatus(id, status);
      res.json({ order });
    } catch (error) {
      next(error);
    }
  }

  async cancel(req, res, next) {
    try {
      const { id } = req.params;
      const order = await this.repository.findById(id);

      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }

      if (req.user.role !== "ADMIN" && order.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }


      if (!["PENDING", "IN_PROGRESS"].includes(order.status)) {
        return res
          .status(400)
          .json({ error: "Cannot cancel order in this status" });
      }

      const cancelledOrder = await this.orderService.updateOrderStatus(
        id,
        "CANCELLED"
      );
      res.json({ order: cancelledOrder });
    } catch (error) {
      next(error);
    }
  }
}

export default OrderController;
