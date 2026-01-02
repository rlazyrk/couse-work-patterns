class DeliveryController {
  constructor(provider) {
    this.repository = provider.deliveryRepository;
  }

  async getAll(req, res, next) {
    try {
      const { isActive } = req.query;
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === "true";

      const deliveries = await this.repository.getAll(where);

      res.json({ deliveries });
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
