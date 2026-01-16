// backend/src/routes/auth.ts
import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

// Route for Registration: POST /auth/register
router.post("/register", AuthController.register);

// Route for Login: POST /auth/login
router.post("/login", AuthController.login);

// 👇 FIX: Use 'export default' so index.ts can import it correctly
export default router;