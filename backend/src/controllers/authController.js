const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/jwt");

const authController = {
  register: (req, res) => {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Todos os campos são obrigatórios." });
    }

    // Check if user already exists
    User.findByEmail(email, (err, user) => {
      if (err) {
        console.error("Erro ao buscar usuário por email:", err);
        return res.status(500).json({ message: "Erro interno do servidor ao verificar email." });
      }
      if (user) {
        return res.status(400).json({ message: "E-mail já cadastrado." });
      }

      // Create new user
      User.create({ name, email, password }, (err, newUser) => {
        if (err) {
          console.error("Erro ao criar usuário:", err);
          // Check for unique constraint error specifically
          if (err.message.includes("UNIQUE constraint failed: users.email")) {
            return res.status(400).json({ message: "E-mail já cadastrado." });
          }
          return res.status(500).json({ message: "Erro interno do servidor ao registrar usuário." });
        }
        // Don't send password back, even hashed
        const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email };
        res.status(201).json({ message: "Usuário registrado com sucesso!", user: userResponse });
      });
    });
  },

  login: (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "E-mail e senha são obrigatórios." });
    }

    User.findByEmail(email, (err, user) => {
      if (err) {
        console.error("Erro ao buscar usuário por email:", err);
        return res.status(500).json({ message: "Erro interno do servidor ao tentar fazer login." });
      }
      if (!user) {
        return res.status(401).json({ message: "Credenciais inválidas." }); // Use generic message
      }

      // Compare password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Erro ao comparar senhas:", err);
          return res.status(500).json({ message: "Erro interno do servidor ao verificar senha." });
        }
        if (!isMatch) {
          return res.status(401).json({ message: "Credenciais inválidas." }); // Use generic message
        }

        // Generate JWT
        const payload = {
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            isAdmin: user.is_admin === 1 // Ensure boolean
          }
        };

        jwt.sign(
          payload,
          jwtSecret,
          { expiresIn: jwtExpiresIn },
          (err, token) => {
            if (err) {
              console.error("Erro ao gerar token JWT:", err);
              return res.status(500).json({ message: "Erro interno do servidor ao gerar token." });
            }
            res.json({ 
              message: "Login bem-sucedido!", 
              token, 
              user: payload.user // Send user info back
            });
          }
        );
      });
    });
  }
};

module.exports = authController;

