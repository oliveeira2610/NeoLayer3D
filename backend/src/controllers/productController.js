const Product = require("../models/Product");
const Category = require("../models/Category"); // Needed for validation

const productController = {
  // @desc    Create a new product
  // @route   POST /api/products
  // @access  Private/Admin
  createProduct: (req, res) => {
    const { name, description, price, stock, image_url, category_id } = req.body;

    // Basic validation
    if (!name || price === undefined || category_id === undefined) {
      return res.status(400).json({ message: "Nome, preço e ID da categoria são obrigatórios." });
    }
    if (isNaN(parseFloat(price)) || parseFloat(price) < 0) {
        return res.status(400).json({ message: "Preço inválido." });
    }
    if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
        return res.status(400).json({ message: "Estoque inválido." });
    }

    // Optional: Validate if category_id exists
    Category.findById(category_id, (err, category) => {
        if (err) {
            console.error(`Erro ao validar categoria ${category_id}:`, err);
            // Proceed without validation if there's an error, or return 500
            // return res.status(500).json({ message: "Erro interno ao validar categoria." });
        }
        if (!category && !err) { // Only return error if category truly doesn't exist
            return res.status(400).json({ message: `Categoria com ID ${category_id} não encontrada.` });
        }

        // Proceed to create product
        Product.create({ name, description, price: parseFloat(price), stock: parseInt(stock) || 0, image_url, category_id: parseInt(category_id) }, (err, product) => {
          if (err) {
            console.error("Erro ao criar produto:", err);
            return res.status(500).json({ message: "Erro interno do servidor ao criar produto." });
          }
          res.status(201).json({ message: "Produto criado com sucesso!", product });
        });
    });
  },

  // @desc    Get all products (with optional filters)
  // @route   GET /api/products
  // @access  Public
  getAllProducts: (req, res) => {
    // Extract filters from query parameters (e.g., /api/products?category=1&search=term)
    const filters = {
        category: req.query.category,
        search: req.query.search,
        priceMin: req.query.priceMin,
        priceMax: req.query.priceMax,
        sortBy: req.query.sortBy
    };

    Product.findAll(filters, (err, products) => {
      if (err) {
        console.error("Erro ao buscar produtos:", err);
        return res.status(500).json({ message: "Erro interno do servidor ao buscar produtos." });
      }
      res.json(products);
    });
  },

  // @desc    Get product by ID
  // @route   GET /api/products/:id
  // @access  Public
  getProductById: (req, res) => {
    const { id } = req.params;
    Product.findById(id, (err, product) => {
      if (err) {
        console.error(`Erro ao buscar produto ${id}:`, err);
        return res.status(500).json({ message: "Erro interno do servidor ao buscar produto." });
      }
      if (!product) {
        return res.status(404).json({ message: "Produto não encontrado." });
      }
      res.json(product);
    });
  },

  // @desc    Update a product
  // @route   PUT /api/products/:id
  // @access  Private/Admin
  updateProduct: (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, image_url, category_id } = req.body;

    // Basic validation
    if (name === undefined && description === undefined && price === undefined && stock === undefined && image_url === undefined && category_id === undefined) {
        return res.status(400).json({ message: "Nenhum dado fornecido para atualização." });
    }
    if (price !== undefined && (isNaN(parseFloat(price)) || parseFloat(price) < 0)) {
        return res.status(400).json({ message: "Preço inválido." });
    }
     if (stock !== undefined && (isNaN(parseInt(stock)) || parseInt(stock) < 0)) {
        return res.status(400).json({ message: "Estoque inválido." });
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (stock !== undefined) updateData.stock = parseInt(stock);
    if (image_url !== undefined) updateData.image_url = image_url;
    if (category_id !== undefined) updateData.category_id = parseInt(category_id);

    // Optional: Validate category_id if provided
    const validateAndUpdate = () => {
        Product.update(id, updateData, (err, result) => {
          if (err) {
            console.error(`Erro ao atualizar produto ${id}:`, err);
            return res.status(500).json({ message: "Erro interno do servidor ao atualizar produto." });
          }
          if (result.changes === 0) {
            return res.status(404).json({ message: "Produto não encontrado para atualização." });
          }
          res.json({ message: "Produto atualizado com sucesso!" });
        });
    };

    if (category_id !== undefined) {
        Category.findById(category_id, (err, category) => {
            if (err) {
                console.error(`Erro ao validar categoria ${category_id} na atualização:`, err);
                // Decide whether to proceed or return error
                // return res.status(500).json({ message: "Erro interno ao validar categoria." });
            }
            if (!category && !err) {
                return res.status(400).json({ message: `Categoria com ID ${category_id} não encontrada.` });
            }
            validateAndUpdate(); // Proceed if category exists or validation skipped
        });
    } else {
        validateAndUpdate(); // Proceed if category_id is not being updated
    }
  },

  // @desc    Delete a product
  // @route   DELETE /api/products/:id
  // @access  Private/Admin
  deleteProduct: (req, res) => {
    const { id } = req.params;
    Product.delete(id, (err, result) => {
      if (err) {
        console.error(`Erro ao deletar produto ${id}:`, err);
        return res.status(500).json({ message: "Erro interno do servidor ao deletar produto." });
      }
      if (result.changes === 0) {
        return res.status(404).json({ message: "Produto não encontrado para exclusão." });
      }
      res.json({ message: "Produto excluído com sucesso!" });
    });
  }
};

module.exports = productController;

