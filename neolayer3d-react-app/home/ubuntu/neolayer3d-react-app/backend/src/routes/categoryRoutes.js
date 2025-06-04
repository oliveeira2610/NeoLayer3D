const express = require("express");
const categoryController = require("../controllers/categoryController");
const { protect, admin } = require("../middleware/authMiddleware"); // Import middleware

const router = express.Router();

// Public routes
router.get("/", categoryController.getAllCategories);
router.get("/:id", categoryController.getCategoryById);

// Admin routes
router.post("/", protect, admin, categoryController.createCategory);
router.put("/:id", protect, admin, categoryController.updateCategory);
router.delete("/:id", protect, admin, categoryController.deleteCategory);

module.exports = router;

