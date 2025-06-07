const Category = require("../models/Category");

const categoryController = {
  // @desc    Create a new category
  // @route   POST /api/categories
  // @access  Private/Admin
  createCategory: (req, res) => {
    const { name, description, image_url } = req.body;
    if (!name) {
      return res.status(400).json({ message: "O nome da categoria é obrigatório." });
    }
    Category.create({ name, description, image_url }, (err, category) => {
      if (err) {
        console.error("Erro ao criar categoria:", err);
        if (err.message.includes("UNIQUE constraint failed")) {
             return res.status(400).json({ message: "Já existe uma categoria com este nome." });
        }
        return res.status(500).json({ message: "Erro interno do servidor ao criar categoria." });
      }
      res.status(201).json({ message: "Categoria criada com sucesso!", category });
    });
  },

  // @desc    Get all categories
  // @route   GET /api/categories
  // @access  Public
  getAllCategories: (req, res) => {
    Category.findAll((err, categories) => {
      if (err) {
        console.error("Erro ao buscar categorias:", err);
        return res.status(500).json({ message: "Erro interno do servidor ao buscar categorias." });
      }
      res.json(categories);
    });
  },

  // @desc    Get category by ID
  // @route   GET /api/categories/:id
  // @access  Public
  getCategoryById: (req, res) => {
    const { id } = req.params;
    Category.findById(id, (err, category) => {
      if (err) {
        console.error(`Erro ao buscar categoria ${id}:`, err);
        return res.status(500).json({ message: "Erro interno do servidor ao buscar categoria." });
      }
      if (!category) {
        return res.status(404).json({ message: "Categoria não encontrada." });
      }
      res.json(category);
    });
  },

  // @desc    Update a category
  // @route   PUT /api/categories/:id
  // @access  Private/Admin
  updateCategory: (req, res) => {
    const { id } = req.params;
    const { name, description, image_url } = req.body;

    // Basic validation: at least one field must be present
    if (name === undefined && description === undefined && image_url === undefined) {
        return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
    }
    
    Category.update(id, { name, description, image_url }, (err, result) => {
      if (err) {
        console.error(`Erro ao atualizar categoria ${id}:`, err);
         if (err.message.includes("UNIQUE constraint failed")) {
             return res.status(400).json({ message: "Já existe uma categoria com este nome." });
        }
        return res.status(500).json({ message: "Erro interno do servidor ao atualizar categoria." });
      }
      if (result.changes === 0) {
        return res.status(404).json({ message: "Categoria não encontrada para atualização." });
      }
      res.json({ message: "Categoria atualizada com sucesso!" });
    });
  },

  // @desc    Delete a category
  // @route   DELETE /api/categories/:id
  // @access  Private/Admin
  deleteCategory: (req, res) => {
    const { id } = req.params;
    // Optional: Check if category has products before deleting
    // Product.findByCategory(id, (err, products) => { ... });

    Category.delete(id, (err, result) => {
      if (err) {
        console.error(`Erro ao deletar categoria ${id}:`, err);
        // Handle potential foreign key constraint errors if products depend on it and ON DELETE is not SET NULL/CASCADE
        return res.status(500).json({ message: "Erro interno do servidor ao deletar categoria." });
      }
      if (result.changes === 0) {
        return res.status(404).json({ message: "Categoria não encontrada para exclusão." });
      }
      res.json({ message: "Categoria excluída com sucesso!" });
    });
  }
};

module.exports = categoryController;

