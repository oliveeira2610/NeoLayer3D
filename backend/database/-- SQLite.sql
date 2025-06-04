-- SQLite
INSERT OR IGNORE INTO users (name, email, password, is_admin) VALUES
  ('Admin', 'admin@neolayer.com', '$2b$10$N9qo8uLOickgx2ZMRZoMy.Mrq1V4m4X5XH3WtB6CcJd7fQ0Fz7JQe', 1),
  ('João Silva', 'joao@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0),
  ('Maria Souza', 'maria@email.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 0);

-- Categorias
INSERT OR IGNORE INTO categories (name, description, image_url) VALUES
  ('Eletrônicos', 'Dispositivos eletrônicos e gadgets', '/images/categories/eletronicos.jpg'),
  ('Informática', 'Produtos de informática e computadores', '/images/categories/informatica.jpg'),
  ('Games', 'Jogos e consoles', '/images/categories/games.jpg');

-- Produtos
INSERT OR IGNORE INTO products (name, description, price, stock, image_url, category_id) VALUES
  ('Smartphone Neo X', 'Smartphone com tela de 6.5 polegadas, 128GB de armazenamento', 1999.90, 50, '/images/products/smartphone.jpg', 1),
  ('Notebook Pro', 'Notebook com processador i7, 16GB RAM, SSD 512GB', 4599.00, 30, '/images/products/notebook.jpg', 2),
  ('Console GameStation 5', 'Console de última geração com 1TB de armazenamento', 4499.90, 20, '/images/products/console.jpg', 3),
  ('Fones de Ouvido Bluetooth', 'Fones sem fio com cancelamento de ruído', 499.90, 100, '/images/products/fones.jpg', 1);