const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");
const User = require("../models/User");
const path = require("path");

const protect = (req, res, next) => {
  let token;

  console.log("🛡️ Middleware 'protect' ativado");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Token recebido:", token);

      const decoded = jwt.verify(token, jwtSecret);
      console.log("📜 Token decodificado:", decoded);

      // Se você estiver usando SQLite puro, o User.findById pode não funcionar.
      // Troque isso por uma consulta manual, assim como nas outras rotas:
      const dbPath = path.resolve(__dirname, '../../database/database.db');
      const sqlite3 = require('sqlite3').verbose();
      const db = new sqlite3.Database(dbPath);

      const query = `SELECT * FROM users WHERE id = ?`;
      db.get(query, [decoded.id], (err, user) => {
        if (err || !user) {
          console.error("❌ Erro ao buscar usuário no middleware:", err);
          return res.status(401).json({ message: "Não autorizado, token falhou." });
        }

        console.log("✅ Usuário autenticado no middleware:", user.email);

        req.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin === 1
        };
        next();
      });
    } catch (error) {
      console.error("❌ Erro na verificação do token:", error);
      res.status(401).json({ message: "Não autorizado, token inválido." });
    }
  } else {
    console.warn("⚠️ Nenhum token fornecido no cabeçalho.");
    res.status(401).json({ message: "Não autorizado, nenhum token fornecido." });
  }
};


const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: "Acesso negado. Rota apenas para administradores." });
  }
};

module.exports = { protect, admin };

