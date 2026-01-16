import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import { Portfolio } from "../entities/Portfolio";
import * as bcrypt from "bcryptjs"; // Ensure you have installed bcryptjs types if needed
import * as jwt from "jsonwebtoken";

export class AuthController {
  
  static async register(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);
      const portfolioRepository = AppDataSource.getRepository(Portfolio);

      // Check if user exists
      const existingUser = await userRepository.findOne({ where: { username } });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create User
      const user = new User();
      user.username = username;
      user.password = hashedPassword;
      await userRepository.save(user);

      // Create Portfolio for the new user
      const portfolio = new Portfolio();
      portfolio.user = user;
      portfolio.balance = 100000.00; // Use 'balance' instead of 'current_cash'
      
      await portfolioRepository.save(portfolio);

      return res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
      console.error("Registration error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const userRepository = AppDataSource.getRepository(User);

      // Find user
      const user = await userRepository.findOne({ 
        where: { username },
        relations: ["portfolio"] 
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      // Generate Token (simple hardcoded secret for dev)
      const token = jwt.sign(
        { userId: user.id, username: user.username }, 
        process.env.JWT_SECRET || "secret_key", 
        { expiresIn: "1h" }
      );

      return res.json({ 
        token, 
        user: { 
            id: user.id, 
            username: user.username,
            portfolioId: user.portfolio ? user.portfolio.id : null 
        } 
      });
    } catch (error) {
      console.error("Login error:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }
}