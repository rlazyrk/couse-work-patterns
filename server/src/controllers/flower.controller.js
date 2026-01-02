class FlowerController {
  constructor(provider) {
    this.repository = provider.flowerRepository;
  }

  async getAll(req, res, next) {
    try {
      const { isActive } = req.query;
      const where = {};
      if (isActive !== undefined) where.isActive = isActive === "true";

      const flowers = await this.repository.getAll(where);

      res.json({ flowers });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const flower = await this.repository.getById(id);

      if (!flower) {
        return res.status(404).json({ error: "Flower not found" });
      }

      res.json({ flower });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name, price, imageUrl } = req.body;

      const flower = await this.repository.create(name, price, imageUrl);

      res.status(201).json({ flower });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name, price, imageUrl, isActive } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (isActive !== undefined) updateData.isActive = isActive;

      const flower = await this.repository.update(id, updateData);

      res.json({ flower });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.repository.deleteById(id);

      res.json({ message: "Flower deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default FlowerController;
