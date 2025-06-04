const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/jwt");
const User = require("../models/User");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, jwtSecret);

      // Get user from the token (excluding password)
      User.findById(decoded.user.id, (err, user) => {
        if (err || !user) {
          console.error("Erro ao buscar usuário do token:", err);
          return res.status(401).json({ message: "Não autorizado, token falhou." });
        }
        
        // Attach user to the request object (without password)
        req.user = {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.is_admin === 1
        };
        next();
      });
    } catch (error) {
      console.error("Erro na verificação do token:", error);
      res.status(401).json({ message: "Não autorizado, token inválido." });
    }
  } else {
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

