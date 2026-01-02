class EventTypeController {
  constructor(provider) {
    this.repository = provider.eventTypeRepository;
  }

  async getAll(req, res, next) {
    try {
      const eventTypes = await this.repository.getAll();
      res.json({ eventTypes });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const eventType = await this.repository.getById(id);

      if (!eventType) {
        return res.status(404).json({ error: "Event type not found" });
      }

      res.json({ eventType });
    } catch (error) {
      next(error);
    }
  }

  async create(req, res, next) {
    try {
      const { name } = req.body;
      const eventType = await this.repository.create(name);
      res.status(201).json({ eventType });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const eventType = await this.repository.update(id, { name });

      res.json({ eventType });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.repository.deleteById(id);

      res.json({ message: "Event type deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default EventTypeController;
