const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { protect } = require("../middleware/authMiddleware");
const { promisify } = require("util");

const dbPath = path.resolve(__dirname, "../../database/database.db");
const db = new sqlite3.Database(dbPath);

// promisify db methods para usar async/await
const dbAll = promisify(db.all).bind(db);
const dbRun = function (sql, params) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
};

// GET /api/cart
router.get("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const query = `
      SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.image_url
      FROM cart_items ci
      JOIN products p ON ci.product_id = p.id
      WHERE ci.user_id = ?
    `;

    const rows = await dbAll(query, [userId]);
    console.log("Carrinho buscado com sucesso:", rows);
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar carrinho:", err);
    res.status(500).json({ message: "Erro ao buscar carrinho." });
  }
});

// POST /api/cart
router.post("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, quantity } = req.body;

    const query = `
      INSERT INTO cart_items (user_id, product_id, quantity)
      VALUES (?, ?, ?)
      ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = quantity + excluded.quantity
    `;

    await dbRun(query, [userId, product_id, quantity]);

    console.log(`Item adicionado/atualizado no carrinho: userId=${userId}, product_id=${product_id}, quantity=${quantity}`);
    res.status(200).json({ message: "Item adicionado ao carrinho." });
  } catch (err) {
    console.error("Erro ao adicionar item:", err);
    res.status(500).json({ message: "Erro ao adicionar item." });
  }
});

// PUT /api/cart/:product_id
router.put("/:product_id", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.product_id;
    const { quantity } = req.body;

    const query = `UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?`;

    await dbRun(query, [quantity, userId, productId]);

    console.log(`Quantidade atualizada: userId=${userId}, product_id=${productId}, quantity=${quantity}`);
    res.json({ message: "Quantidade atualizada." });
  } catch (err) {
    console.error("Erro ao atualizar quantidade:", err);
    res.status(500).json({ message: "Erro ao atualizar quantidade." });
  }
});

// DELETE /api/cart/:product_id
router.delete("/:product_id", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.product_id;

    const query = `DELETE FROM cart_items WHERE user_id = ? AND product_id = ?`;

    await dbRun(query, [userId, productId]);

    console.log(`Item removido do carrinho: userId=${userId}, product_id=${productId}`);
    res.json({ message: "Item removido." });
  } catch (err) {
    console.error("Erro ao remover item:", err);
    res.status(500).json({ message: "Erro ao remover item." });
  }
});

// DELETE /api/cart (limpar todo o carrinho do usuário)
router.delete("/", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const query = `DELETE FROM cart_items WHERE user_id = ?`;
    await dbRun(query, [userId]);

    console.log(`Carrinho limpo para o usuário: userId=${userId}`);
    res.json({ message: "Carrinho limpo com sucesso." });
  } catch (err) {
    console.error("Erro ao limpar carrinho:", err);
    res.status(500).json({ message: "Erro ao limpar carrinho." });
  }
});


module.exports = router;
