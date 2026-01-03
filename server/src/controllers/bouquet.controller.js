class BouquetController {
  constructor(provider) {
    this.bouquetRepository = provider.bouquetRepository;
  }

  async getAll(req, res, next) {
    try {
      const { eventTypeId, isActive, isCustom } = req.query;

      const where = {};
      if (eventTypeId) where.eventTypeId = eventTypeId;
      if (isActive !== undefined) where.isActive = isActive === "true";
      if (isCustom !== false) where.isCustom = isCustom === "true";

      const bouquets = await this.bouquetRepository.getAll(where);

      res.json({ bouquets });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      console.log(id);
      const bouquet = await this.bouquetRepository.getByID(id);

      if (!bouquet) {
        return res.status(404).json({ error: "Bouquet not found" });
      }

      res.json({ bouquet });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const {
        name,
        description,
        price,
        imageUrl,
        isCustom,
        eventTypeId,
        flowers,
      } = req.body;
      const bouquet = await this.bouquetRepository.create(
        name,
        description,
        price,
        imageUrl,
        isCustom,
        eventTypeId,
        flowers
      );

      res.status(201).json({ bouquet });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        price,
        imageUrl,
        isActive,
        isCustom,
        eventTypeId,
        flowers,
      } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (price !== undefined) updateData.price = parseFloat(price);
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (isActive !== undefined) updateData.isActive = isActive;
      if (isCustom !== undefined) updateData.isCustom = isCustom;
      if (eventTypeId !== undefined) updateData.eventTypeId = eventTypeId;

      const bouquet = await this.bouquetRepository.update(id, data);

      const updatedBouquet = await this.bouquetRepository.findById(id);

      res.json({ bouquet: updatedBouquet });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.bouquetRepository.deleteById(id);

      res.json({ message: "Bouquet deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default BouquetController;
