const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const dbPath = path.resolve(__dirname, "../database/database.db");

let db = null;

const connectDB = () => {
  if (db) {
    return db;
  }
  db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
      console.error("Erro ao conectar ao banco de dados:", err.message);
      throw err; // Lança o erro para que a aplicação saiba que a conexão falhou
    } else {
      console.log("Conectado ao banco de dados SQLite.");
    }
  });
  return db;
};

module.exports = connectDB;

