const fs = require('fs');
const path = require('path');

// 1. DEFINE THE SHARED SECRET
const SECRET_KEY = "FINAL_FIX_SECRET_KEY";

// 2. DEFINE THE NEW PASSPORT CONTENT
const passportContent = `
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: "${SECRET_KEY}", // <--- WRITTEN BY SCRIPT
};

export const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
    try {
        console.log("🔓 [PASSPORT] Checking User:", payload.id);
        const userRepository = AppDataSource.getRepository(User);
        const user = await userRepository.findOne({ where: { id: payload.id } });
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
});
`;

// 3. DEFINE THE NEW CONTROLLER CONTENT
const controllerContent = `
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const userRepository = AppDataSource.getRepository(User);

export class AuthController {
    static register = async (req: Request, res: Response) => {
        const { username, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        const user = new User();
        user.username = username;
        user.email = email;
        user.password_hash = hashedPassword;
        user.role = "student";

        try {
            await userRepository.save(user);
            res.status(201).send("User created");
        } catch (error) {
            res.status(409).send("Username or email already in use");
        }
    };

    static login = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await userRepository.findOneOrFail({ where: { email } });
            if (!await bcrypt.compare(password, user.password_hash)) {
                res.status(401).send("Invalid credentials");
                return;
            }

            // <--- WRITTEN BY SCRIPT
            const token = jwt.sign(
                { id: user.id, username: user.username },
                "${SECRET_KEY}", 
                { expiresIn: "1h" }
            );

            res.send({ token });
        } catch (error) {
            res.status(401).send("Invalid credentials");
        }
    };
}
`;

// 4. WRITE THE FILES
console.log("--- STARTING AUTO-FIX ---");

// Fix Passport
const passportPath = path.join(__dirname, 'src', 'config', 'passport.ts');
fs.writeFileSync(passportPath, passportContent);
console.log("✅ Fixed: src/config/passport.ts");

// Fix Controller
const controllerPath = path.join(__dirname, 'src', 'controllers', 'AuthController.ts');
fs.writeFileSync(controllerPath, controllerContent);
console.log("✅ Fixed: src/controllers/AuthController.ts");

console.log("--- FILES UPDATED SUCCESSFULLY ---");
console.log("👉 NOW RESTART YOUR SERVER!");