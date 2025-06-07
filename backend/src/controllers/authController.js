const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { jwtSecret, jwtExpiresIn } = require("../config/jwt");

const authController = {
 register: (req, res) => {
  console.log("Dados recebidos:", req.body);
  

  const { name, email, password, birth_date, cpf_cnpj, phone, cep, street, number, complement, district, city, state } = req.body;

  if (!name || !email || !password || !cpf_cnpj) {
    return res.status(400).json({ message: "Campos obrigatórios faltando." });
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
      User.create({ name, email, password, birth_date, cpf_cnpj, phone, cep, street, number, complement, district, city, state }, (err, newUser) => {
        if (err) {
          console.error("Erro ao criar usuário:", err);
          if (err.message.includes("UNIQUE constraint failed: users.email")) {
            return res.status(400).json({ message: "E-mail já cadastrado." });
          }
          return res.status(500).json({ message: "Erro interno do servidor ao registrar usuário." });
        }

        // Monta payload para gerar token
        const payload = {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          isAdmin: newUser.is_admin === 1 // ou false se não houver esse campo
        };

        // Gera token JWT
        jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn }, (err, token) => {
          if (err) {
            console.error("Erro ao gerar token JWT:", err);
            return res.status(500).json({ message: "Erro interno ao gerar token." });
          }

          // Retorna resposta com token e dados do usuário
          res.status(201).json({
            message: "Usuário registrado com sucesso!",
            token,
            user: payload
          });
        });
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
        return res.status(401).json({ message: "Credenciais inválidas." });
      }

      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) {
          console.error("Erro ao comparar senhas:", err);
          return res.status(500).json({ message: "Erro interno ao verificar senha." });
        }
        if (!isMatch) {
          return res.status(401).json({ message: "Credenciais inválidas." });
        }

        const payload = {
          id: user.id,
          name: user.name,
          email: user.email,
          isAdmin: user.is_admin === 1
        };

        jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiresIn }, (err, token) => {
          if (err) {
            console.error("Erro ao gerar token JWT:", err);
            return res.status(500).json({ message: "Erro interno ao gerar token." });
          }
          res.json({
            message: "Login bem-sucedido!",
            token,
            user: payload
          });
        });
      });
    });
  }
};

module.exports = authController;
