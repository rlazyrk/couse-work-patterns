import ClientCardFactory from "../patterns/factory/ClientCardFactory.js";

class ClientCardController {
  constructor(provider) {
    this.clientCardRepository = provider.clientCardRepository;
  }

  async getAll(req, res, next) {
    try {
      const cards = await this.clientCardRepository.getAll();

      res.json({ cards });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const card = await this.clientCardRepository.findById(id);

      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }

      res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  async getByUserId(req, res, next) {
    try {
      const { userId } = req.params;

      if (req.user.role !== "ADMIN" && req.user.id !== userId) {
        return res.status(403).json({ error: "Access denied" });
      }

      const card = await this.clientCardRepository.findByUserId(userId);

      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }

      res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { userId, cardType } = req.body;

      const existingCard = await this.clientCardRepository.findByUserId(userId);

      if (existingCard) {
        return res.status(400).json({ error: "User already has a card" });
      }

      const card = await this.clientCardRepository.create(cardType, userId);

      res.status(201).json({ card });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { bonusPoints, deliveryDiscountPercent, type } = req.body;

      const updateData = {};
      if (bonusPoints !== undefined)
        updateData.bonusPoints = parseInt(bonusPoints);
      if (deliveryDiscountPercent !== undefined) {
        updateData.deliveryDiscountPercent = parseInt(deliveryDiscountPercent);
      }
      if (type) {
        
        const config = ClientCardFactory.getCardConfig(type);
        updateData.type = type;
        updateData.deliveryDiscountPercent = config.deliveryDiscountPercent;
      }

      const card = await this.clientCardRepository.update(id, updateData);

      res.json({ card });
    } catch (error) {
      next(error);
    }
  }

  async addBonusPoints(req, res, next) {
    try {
      const { id } = req.params;
      const { points } = req.body;

      const card = await this.clientCardRepository.addBonusPoints(id, points);

      res.json({ card });
    } catch (error) {
      next(error);
    }
  }
}

export default ClientCardController;
