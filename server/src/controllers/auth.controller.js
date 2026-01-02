import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class AuthController {
  constructor(provider) {
    this.repository = provider.authRepository;
    this.cardRepository = provider.clientCardRepository;
  }

  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName, phone, cardType } =
        req.body;

      const existingUser = await this.repository.findByEmail(email);

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const user = await this.repository.createUser(
        email,
        password,
        firstName,
        lastName,
        phone
      );
      if (cardType) {
        await this.cardRepository.create(cardType, user.id);
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.status(201).json({
        message: "User registered successfully",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      console.log(email, password);

      const user = await this.repository.findByEmailWithCard(email);
      console.log(user);

      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        return res.status(401).json({ error: "Invalid credentials" });
      }
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
      );

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          clientCard: user.clientCard,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async getMe(req, res, next) {
    const userID = req.user.id;
    try {
      const user = await this.repository.findByID(userID);

      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
}

export default AuthController;
