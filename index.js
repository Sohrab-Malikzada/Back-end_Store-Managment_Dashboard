// index.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";

// Import Routes
import productsRoutes from "./routes/productsRoute.js";
import authRoutes from "./routes/auth.js";
import userManagementRoutes from "./routes/userManagement.js";

// Initialize app
dotenv.config();

// Create Express app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/users", userManagementRoutes);
app.use("/products", productsRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Supermarket API is working!😊");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Internal Server Error");
});
 
// Start Server
const PORT = process.env.PORT || 3000;
const uri = process.env.MONGO_URI;
const dbName = process.env.DB_NAME;
const client = new MongoClient(uri);

// Function to create a new user with default permissions
async function startServer() {
  try {

    // Connect to MongoDB
    await client.connect();
    const db = client.db(dbName);
    app.locals.db = db;

    // Log connection success
    console.log("Connected to MongoDB");

    // Start Express server
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });

    // Example: Create an admin user if none exists
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
}

// Invoke the function to start the server
startServer();
