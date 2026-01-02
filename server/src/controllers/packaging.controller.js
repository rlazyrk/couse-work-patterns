class PackagingController {
  constructor(provider) {
    this.repository = provider.packagingRepository;
  }

  async getAll(req, res, next) {
    try {
      const { isActive } = req.query;
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === "true";

      const packaging = await this.repository.getAll(where);

      res.json({ packaging });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const packaging = await this.repository.getById(id);

      if (!packaging) {
        return res.status(404).json({ error: "Packaging not found" });
      }

      res.json({ packaging });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { type, price } = req.body;

      const packaging = await this.repository.create(type, price);

      res.status(201).json({ packaging });
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

      const packaging = await this.repository.update(id, updateData);

      res.json({ packaging });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.repository.deleteById(id);

      res.json({ message: "Packaging deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default PackagingController;
