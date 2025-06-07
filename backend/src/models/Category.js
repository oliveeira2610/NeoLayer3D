const connectDB = require("../config/db");

const db = connectDB();

const Category = {
  create: (categoryData, callback) => {
    const { name, description, image_url } = categoryData;
    const sql = "INSERT INTO categories (name, description, image_url) VALUES (?, ?, ?)";
    db.run(sql, [name, description, image_url], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, name, description, image_url });
    });
  },

  findAll: (callback) => {
    const sql = "SELECT * FROM categories ORDER BY name ASC";
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  },

  findById: (id, callback) => {
    const sql = "SELECT * FROM categories WHERE id = ?";
    db.get(sql, [id], (err, row) => {
      callback(err, row);
    });
  },

  update: (id, categoryData, callback) => {
    const { name, description, image_url } = categoryData;
    const fields = [];
    const values = [];

    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (description !== undefined) {
      fields.push("description = ?");
      values.push(description);
    }
    if (image_url !== undefined) {
      fields.push("image_url = ?");
      values.push(image_url);
    }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar"));
    }

    values.push(id);
    const sql = `UPDATE categories SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, values, function (err) {
      callback(err, { changes: this.changes });
    });
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM categories WHERE id = ?";
    db.run(sql, [id], function (err) {
      // Check for foreign key constraints if necessary before deleting
      callback(err, { changes: this.changes });
    });
  }
};

module.exports = Category;

