class NotificationController {
  constructor(provider) {
    this.repository = provider.notificationRepository;
  }

  async getAll(req, res, next) {
    try {
      const { isRead } = req.query;
      const where = {};

      if (req.user.role !== "ADMIN") {
        where.userId = req.user.id;
      }

      if (isRead !== undefined) {
        where.isRead = isRead === "true";
      }

      const notifications = await this.repository.getAll(where, 50);

      res.json({ notifications });
    } catch (error) {
      next(error);
    }
  }

  async getUnreadCount(req, res, next) {
    try {
      const where = { userId: req.user.id, isRead: false };
      const count = await this.repository.getUnreadCount(where);
      res.json({ count });
    } catch (error) {
      next(error);
    }
  }

  async markAsRead(req, res, next) {
    try {
      const { id } = req.params;

      const notification = await this.repository.findById(id);

      if (!notification) {
        return res.status(404).json({ error: "Notification not found" });
      }

      if (req.user.role !== "ADMIN" && notification.userId !== req.user.id) {
        return res.status(403).json({ error: "Access denied" });
      }

      const updated = await this.repository.markAsRead(id);

      res.json({ notification: updated });
    } catch (error) {
      next(error);
    }
  }

  async markAllAsRead(req, res, next) {
    try {
      await this.repository.markAllAsRead(req.user.id);
      res.json({ message: "All notifications marked as read" });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      if (req.user.role !== "ADMIN") {
        return res.status(403).json({ error: "Access denied" });
      }

      const { userId, message } = req.body;

      const notification = await this.repository.create({
        userId: userId || null,
        message,
      });

      res.status(201).json({ notification });
    } catch (error) {
      next(error);
    }
  }
}

export default NotificationController;
