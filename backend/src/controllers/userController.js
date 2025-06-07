// controllers/userController.js
const db = require('../config/db'); // ou seu ORM

exports.getUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await db('users').where({ id: userId }).first();
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};
