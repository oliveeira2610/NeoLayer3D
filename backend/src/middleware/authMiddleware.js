const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");

const protect = async (req, res, next) => {
  console.log("🛡️ Middleware 'protect' ativado");

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      console.log("🔑 Token recebido:", token);

      const decoded = jwt.verify(token, jwtSecret);
      console.log("📜 Token decodificado:", decoded);

      const dbPath = path.resolve(__dirname, "../../database/database.db");
      const db = new sqlite3.Database(dbPath);

      // promisify para usar await
      const dbGet = promisify(db.get).bind(db);

      const user = await dbGet(`SELECT * FROM users WHERE id = ?`, [decoded.id]);

      if (!user) {
        console.error("❌ Usuário não encontrado no middleware");
        return res.status(401).json({ message: "Não autorizado, token falhou." });
      }

      console.log("✅ Usuário autenticado no middleware:", user.email);

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin === 1,
      };

      next();
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
