const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Caminho para o arquivo do banco de dados
const dbPath = path.resolve(__dirname, 'database.db');

// Conectar ao banco de dados (cria o arquivo se não existir)
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err.message);
  } else {
    console.log('Conectado ao banco de dados SQLite.');
    createTables();
  }
});

// Função para criar as tabelas
function createTables() {
   const createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_admin INTEGER DEFAULT 0,
  birth_date TEXT,      
  cpf_cnpj TEXT,        
  phone TEXT,           
  cep TEXT,
  street TEXT,         
  number TEXT,
  complement TEXT,
  district TEXT,       
  city TEXT,
  state TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

`;


  const createCategoriesTable = `
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      description TEXT,
      image_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createProductsTable = `
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      original_price REAL,
      stock INTEGER DEFAULT 0,
      sku TEXT UNIQUE,
      image_url TEXT,
      category_id INTEGER,
      material TEXT,
      rating REAL DEFAULT 0,
      rating_count INTEGER DEFAULT 0,
      is_featured INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
    );
  `;

  const createProductImagesTable = `
    CREATE TABLE IF NOT EXISTS product_images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      image_url TEXT NOT NULL,
      is_primary INTEGER DEFAULT 0,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `;

  const createProductVariantsTable = `
    CREATE TABLE IF NOT EXISTS product_variants (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      name TEXT NOT NULL,
      price_modifier REAL DEFAULT 0,
      stock INTEGER DEFAULT 0,
      sku TEXT,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
    );
  `;

  const createReviewsTable = `
    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      product_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      title TEXT,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  const createOrdersTable = `CREATE TABLE IF NOT EXISTS orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  status TEXT DEFAULT 'pending',
  total REAL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
);
`;

const createCartItemsTable = `
  CREATE TABLE IF NOT EXISTS cart_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(product_id) REFERENCES products(id),
    UNIQUE(user_id, product_id)
  );
`;

  db.serialize(() => {
    db.run(createUsersTable, (err) => {
      if (err) console.error('Erro ao criar tabela users:', err.message);
      else console.log('Tabela users criada ou já existente.');
    });

    db.run(createCategoriesTable, (err) => {
      if (err) console.error('Erro ao criar tabela categories:', err.message);
      else console.log('Tabela categories criada ou já existente.');
    });

    db.run(createProductsTable, (err) => {
      if (err) console.error('Erro ao criar tabela products:', err.message);
      else console.log('Tabela products criada ou já existente.');
    });

    db.run(createProductImagesTable, (err) => {
      if (err) console.error('Erro ao criar tabela product_images:', err.message);
      else console.log('Tabela product_images criada ou já existente.');
    });

    db.run(createProductVariantsTable, (err) => {
      if (err) console.error('Erro ao criar tabela product_variants:', err.message);
      else console.log('Tabela product_variants criada ou já existente.');
    });

    db.run(createReviewsTable, (err) => {
      if (err) console.error('Erro ao criar tabela reviews:', err.message);
      else console.log('Tabela reviews criada ou já existente.');
    });
    db.run(createCartItemsTable, (err) => {
      if (err) console.error('Erro ao criar tabela cart_items:', err.message);
      else console.log('Tabela cart_items criada ou já existente.');
    });

    db.run(createOrdersTable, (err) => {
        if (err) {console.error('Erro ao criar tabela orders:', err.message);
        } else {console.log('Tabela orders criada ou já existente.');}
      });

    });

  



  // Fechar a conexão com o banco de dados após criar as tabelas
  db.close((err) => {
    if (err) {
      console.error('Erro ao fechar a conexão com o banco de dados:', err.message);
    } else {
      console.log('Conexão com o banco de dados fechada.');
    }
  });
}

