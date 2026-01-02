class UserController {
  constructor(provider) {
    this.repository = provider.userRepository;
  }

  async getAll(req, res, next) {
    try {
      const users = await this.repository.getAll();
      res.json({ users });
    } catch (error) {
      next(error);
    }
  }

  async getById(req, res, next) {
    try {
      const { id } = req.params;
      const user = await this.repository.getById(id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const { firstName, lastName, phone } = req.body;

      const user = await this.repository.update(id, {
        firstName,
        lastName,
        phone,
      });

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      await this.repository.deleteById(id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      next(error);
    }
  }
}

export default UserController;
