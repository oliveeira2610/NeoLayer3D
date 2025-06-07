const connectDB = require("../config/db");
const bcrypt = require("bcryptjs");

const db = connectDB();

const User = {
  create: (userData, callback) => {
  const { name, email, password, birth_date, cpf_cnpj, phone, cep, street, number, complement, district, city, state } = userData;

  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return callback(err);
    }
    const sql = `
      INSERT INTO users (
        name, email, password, birth_date, cpf_cnpj, phone, cep, street, number, complement, district, city, state
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.run(sql, [name, email, hash, birth_date, cpf_cnpj, phone, cep, street, number, complement, district, city, state], function (err) {
      if (err) {
        return callback(err);
      }
      callback(null, { id: this.lastID, name, email });
    });
  });
},


  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.get(sql, [email], (err, row) => {
      callback(err, row);
    });
  },

  findById: (id, callback) => {
  const sql = `
    SELECT id, name, email, is_admin, birth_date, cpf_cnpj, phone, cep, street, number, complement, district, city, state, created_at 
    FROM users WHERE id = ?
  `;
  db.get(sql, [id], (err, row) => {
    callback(err, row);
  });
},


  // Adicionar mais métodos conforme necessário (findAll, update, delete, etc.)
  findAll: (callback) => {
    const sql = "SELECT id, name, email, is_admin, created_at FROM users";
    db.all(sql, [], (err, rows) => {
      callback(err, rows);
    });
  },

  update: (id, userData, callback) => {
    // Implementar lógica de atualização (cuidado com a senha)
    // Exemplo simples para atualizar nome ou is_admin
    const { name, is_admin } = userData;
    const fields = [];
    const values = [];
    if (name !== undefined) {
      fields.push("name = ?");
      values.push(name);
    }
    if (is_admin !== undefined) {
      fields.push("is_admin = ?");
      values.push(is_admin);
    }

    if (fields.length === 0) {
      return callback(new Error("Nenhum campo para atualizar"));
    }

    values.push(id);
    const sql = `UPDATE users SET ${fields.join(", ")} WHERE id = ?`;

    db.run(sql, values, function (err) {
      callback(err, { changes: this.changes });
    });
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM users WHERE id = ?";
    db.run(sql, [id], function (err) {
      callback(err, { changes: this.changes });
    });
  }
};

module.exports = User;

