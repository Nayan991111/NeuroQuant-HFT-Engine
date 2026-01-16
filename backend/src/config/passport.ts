import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import * as dotenv from "dotenv";

dotenv.config();

const options: StrategyOptions = {
    // 1. Where to find the token (in the Authorization header)
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    // 2. The secret key to verify the signature (Must match AuthController)
    secretOrKey: process.env.JWT_SECRET || "super_secret_jwt_key_123", 
};

export const jwtStrategy = new JwtStrategy(options, async (payload, done) => {
    try {
        const userRepository = AppDataSource.getRepository(User);
        
        // 3. Find the user based on the "userId" inside the token
        const user = await userRepository.findOne({ 
            where: { id: payload.userId } 
        });

        if (user) {
            // If user found, let them in!
            return done(null, user);
        } else {
            // If user not found in DB, block them
            return done(null, false);
        }
    } catch (error) {
        return done(error, false);
    }
});