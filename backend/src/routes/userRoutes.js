// src/routes/userRoutes.js
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const authenticateToken = require('../middleware/authMiddleware');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const dbPath = path.resolve(__dirname, '../../database/database.db');
const db = new sqlite3.Database(dbPath);

// POST /api/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email e senha são obrigatórios.' });
  }

  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], async (err, user) => {
    if (err) {
      console.error('Erro ao consultar usuário:', err.message);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const token = jwt.sign(
      {
        id: user.id,
        name: user.name,
        email: user.email,
        isAdmin: user.is_admin === 1
      },
      'secreto_super_seguro', // ⚠️ Substitua por variável de ambiente em produção!
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token });
  });

});


router.get('/users/:id', (req, res) => {
  const userId = req.params.id;
  const query = `
    SELECT
      id,
      name,
      email,
      phone,
      cpf_cnpj,
      birth_date,
      cep,
      street,
      number,
      complement,
      district,
      city,
      state
    FROM users
    WHERE id = ?
  `;
  db.get(query, [userId], (err, user) => {
    if (err) {
      console.error('Erro ao consultar usuário:', err.message);
      return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado.' });
    }
    res.json(user);
  });
});


router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id;

  console.log('🔐 Requisição para troca de senha recebida');
  console.log('Usuário logado (ID):', userId);
  console.log('Senha atual informada:', currentPassword);
  console.log('Nova senha informada:', newPassword);

  const query = `SELECT * FROM users WHERE id = ?`;
  db.get(query, [userId], async (err, user) => {
    if (err || !user) {
      console.error('❌ Erro ao buscar usuário:', err);
      return res.status(500).json({ message: 'Erro ao buscar usuário.' });
    }

    console.log('Hash armazenado no banco:', user.password);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    console.log('Resultado da comparação de senha:', isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: 'Senha atual incorreta.' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);
    const updateQuery = `UPDATE users SET password = ? WHERE id = ?`;

    db.run(updateQuery, [hashedNew, userId], (err) => {
      if (err) {
        console.error('❌ Erro ao atualizar senha:', err);
        return res.status(500).json({ message: 'Erro ao atualizar senha.' });
      }

      console.log('✅ Senha alterada com sucesso!');
      res.status(200).json({ message: 'Senha alterada com sucesso.' });
    });
  });
});



router.put('/users/:id', protect, (req, res) => {
  const userId = parseInt(req.params.id, 10);

  // Garantir que o usuário só atualize o próprio perfil
  if (userId !== req.user.id) {
    return res.status(403).json({ message: 'Acesso negado.' });
  }

  const {
    name,
    phone,
    cpf_cnpj,
    birth_date,
    cep,
    street,
    number,
    complement,
    district,
    city,
    state
  } = req.body;

  const query = `
    UPDATE users SET
      name = ?,
      phone = ?,
      cpf_cnpj = ?,
      birth_date = ?,
      cep = ?,
      street = ?,
      number = ?,
      complement = ?,
      district = ?,
      city = ?,
      state = ?
    WHERE id = ?
  `;

  db.run(
    query,
    [
      name,
      phone,
      cpf_cnpj,
      birth_date,
      cep,
      street,
      number,
      complement,
      district,
      city,
      state,
      userId
    ],
    function(err) {
      if (err) {
        console.error('Erro ao atualizar usuário:', err.message);
        return res.status(500).json({ message: 'Erro ao atualizar perfil.' });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: 'Usuário não encontrado.' });
      }
      res.json({ message: 'Perfil atualizado com sucesso.' });
    }
  );
});

module.exports = router;
