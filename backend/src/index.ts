import "reflect-metadata";
import express from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import AppRoutes from "./AppRoutes"; // <--- Importing your new master file

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect Database
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Database connected successfully!");

        // Use the Master Routes
        app.use("/api", AppRoutes);

        // Health Check Endpoint
app.get('/api/health', async (req, res) => {
    try {
        // Simple query to check DB connection
        await AppDataSource.query('SELECT 1');
        res.json({ status: 'ok', db_status: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', db_status: 'disconnected' });
    }
});
        // Start Server
        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => console.log("❌ Database connection failed:", error));