import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entities/User";
import { Portfolio } from "./entities/Portfolio";
import { Trade } from "./entities/Trade";

// Use Environment Variables OR fallback to localhost
const host = process.env.DB_HOST || "localhost";
const port = Number(process.env.DB_PORT) || 5432;
const username = process.env.DB_USERNAME || "admin";
const password = process.env.DB_PASSWORD || "admin";
const database = process.env.DB_NAME || "sentiment_db";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: host,
    port: port,
    username: username,
    password: password,
    database: database,
    synchronize: true, // Auto-create tables (Dev mode only)
    logging: false,
    entities: [User, Portfolio, Trade],
    migrations: [],
    subscribers: [],
});