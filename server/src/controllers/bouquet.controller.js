class BouquetController {
  constructor(provider) {
    this.bouquetRepository = provider.bouquetRepository;
  }

  async getAll(req, res, next) {
    try {
      const { 
        eventTypeId, 
        isActive, 
        isCustom,
        search,
        priceMin,
        priceMax,
        eventTypeIds, // для множинного вибору типів подій
      } = req.query;

      const where = {};
      
      // Фільтр за типом події (один або кілька)
      if (eventTypeIds) {
        const ids = Array.isArray(eventTypeIds) 
          ? eventTypeIds 
          : eventTypeIds.split(",").filter(Boolean);
        if (ids.length > 0) {
          where.eventTypeId = { in: ids };
        }
      } else if (eventTypeId) {
        where.eventTypeId = eventTypeId;
      }
      
      if (isActive !== undefined) where.isActive = isActive === "true";
      
      // Якщо запитуються кастомні букети
      if (isCustom === "true") {
        where.isCustom = true;
        // Якщо користувач не авторизований, не показуємо кастомні букети
        if (!req.user || !req.user.id) {
          return res.json({ bouquets: [] });
        }
        // Якщо користувач не адмін, показуємо тільки його кастомні букети
        if (req.user.role !== "ADMIN") {
          where.createdById = req.user.id;
        }
        // Якщо адмін - показуємо всі кастомні букети (не додаємо фільтр createdById)
      } else {
        // Якщо не запитуються кастомні, виключаємо їх з результату (показуємо тільки стандартні)
        where.isCustom = false;
      }

      const bouquets = await this.bouquetRepository.getAll(
        where,
        search,
        priceMin,
        priceMax
      );

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
        flowers,
        req.user?.id || null
      );

      res.status(201).json({ bouquet });
    } catch (error) {
      next(error);
    }
  }

  async createCustom(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const {
        name,
        description,
        price,
        imageUrl,
        eventTypeId,
        flowers,
      } = req.body;

      if (!name || !description || !price) {
        return res.status(400).json({ error: "Name, description, and price are required" });
      }

      if (!flowers || !Array.isArray(flowers) || flowers.length === 0) {
        return res.status(400).json({ error: "At least one flower is required" });
      }

      const bouquet = await this.bouquetRepository.create(
        name,
        description,
        price,
        imageUrl || null,
        true, // isCustom = true
        eventTypeId || null,
        flowers,
        req.user.id // createdById
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

  async getMyCustomBouquets(req, res, next) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const where = {
        isCustom: true,
        createdById: req.user.id,
      };

      const bouquets = await this.bouquetRepository.getAll(where, null, null, null);

      res.json({ bouquets });
    } catch (error) {
      next(error);
    }
  }
}

export default BouquetController;
