require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("../src/config/db"); // Although models connect individually, it's good practice to have it

// Import routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes"); // Assuming userRoutes will be created later if needed for user management
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(express.json()); // Parse JSON request bodies

// Define Routes
app.get("/", (req, res) => {
  res.send("API NeoLayer3D está rodando...");
});

app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes); // Keep commented if not implemented yet
app.use("/api/categories", categoryRoutes); // Use category routes
app.use("/api/products", productRoutes); // Use product routes

// Error Handling Middleware (Placeholder - implement if needed)
// const errorMiddleware = require("./middleware/errorMiddleware");
// app.use(errorMiddleware);

const PORT = process.env.PORT || 5001; // Use 5001 to avoid conflict with Vite default 5173

app.listen(PORT, () => console.log(`Servidor backend rodando na porta ${PORT}`));

