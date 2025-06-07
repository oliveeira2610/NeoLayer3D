const connectDB = require("../config/db");

const db = connectDB();

const Product = {
  create: (productData, callback) => {
    const { name, description, price, stock, image_url, category_id } = productData;
    const sql = "INSERT INTO products (name, description, price, stock, image_url, category_id) VALUES (?, ?, ?, ?, ?, ?)";
    db.run(sql, [name, description, price, stock, image_url, category_id], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, ...productData });
    });
  },

  findAll: (filters, callback) => {
    let sql = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.image_url, p.created_at, 
        c.id as category_id, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    const whereClauses = [];
    const values = [];

    if (filters) {
      // Filtro por categoria
      if (filters.category) {
        whereClauses.push("p.category_id = ?");
        values.push(filters.category);
      }
      
      // Filtro por termo de busca
      if (filters.search) {
        whereClauses.push("(p.name LIKE ? OR p.description LIKE ?)");
        values.push(`%${filters.search}%`);
        values.push(`%${filters.search}%`);
      }
      
      // Filtro por preço mínimo
      if (filters.priceMin !== undefined && filters.priceMin !== null && filters.priceMin !== '') {
        whereClauses.push("p.price >= ?");
        values.push(parseFloat(filters.priceMin));
      }
      
      // Filtro por preço máximo
      if (filters.priceMax !== undefined && filters.priceMax !== null && filters.priceMax !== '') {
        whereClauses.push("p.price <= ?");
        values.push(parseFloat(filters.priceMax));
      }
    }

    if (whereClauses.length > 0) {
      sql += " WHERE " + whereClauses.join(" AND ");
    }

    // Ordenação
    if (filters && filters.sortBy) {
      switch (filters.sortBy) {
        case 'newest':
          sql += " ORDER BY p.created_at DESC";
          break;
        case 'oldest':
          sql += " ORDER BY p.created_at ASC";
          break;
        case 'price_asc':
          sql += " ORDER BY p.price ASC";
          break;
        case 'price_desc':
          sql += " ORDER BY p.price DESC";
          break;
        case 'name_asc':
          sql += " ORDER BY p.name ASC";
          break;
        case 'name_desc':
          sql += " ORDER BY p.name DESC";
          break;
        default:
          sql += " ORDER BY p.created_at DESC";
      }
    } else {
      // Ordenação padrão: mais recentes primeiro
      sql += " ORDER BY p.created_at DESC";
    }

    // Paginação (se implementada no futuro)
    // if (filters && filters.limit) {
    //   sql += " LIMIT ?";
    //   values.push(parseInt(filters.limit));
    //   
    //   if (filters.offset) {
    //     sql += " OFFSET ?";
    //     values.push(parseInt(filters.offset));
    //   }
    // }

    db.all(sql, values, (err, rows) => {
      callback(err, rows);
    });
  },

  findById: (id, callback) => {
    const sql = `
      SELECT 
        p.id, p.name, p.description, p.price, p.stock, p.image_url, p.created_at, 
        c.id as category_id, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.id = ?
    `;
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  },

  update: (id, productData, callback) => {
    const { name, description, price, stock, image_url, category_id } = productData;
    const fields = [];
    const values = [];

    if (name !== undefined) { fields.push("name = ?"); values.push(name); }
    if (description !== undefined) { fields.push("description = ?"); values.push(description); }
    if (price !== undefined) { fields.push("price = ?"); values.push(price); }
    if (stock !== undefined) { fields.push("stock = ?"); values.push(stock); }
    if (image_url !== undefined) { fields.push("image_url = ?"); values.push(image_url); }
    if (category_id !== undefined) { fields.push("category_id = ?"); values.push(category_id); }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar"));
    }

    values.push(id);
    const sql = `UPDATE products SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, values, function (err) {
      callback(err, { changes: this.changes });
    });
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM products WHERE id = ?";
    db.run(sql, [id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
};

module.exports = Product;

