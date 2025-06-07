-- Insert sample users
INSERT INTO users (name, email, password, is_admin, created_at) VALUES 
('Admin User', 'admin@example.com', '$2a$10$xS8J3Zb5Jz6Z1Z1Z1Z1Z1e', 1, '2023-01-01 10:00:00'),
('John Doe', 'john.doe@example.com', '$2a$10$xS8J3Zb5Jz6Z1Z1Z1Z1Z1e', 0, '2023-01-15 14:30:00'),
('Jane Smith', 'jane.smith@example.com', '$2a$10$xS8J3Zb5Jz6Z1Z1Z1Z1Z1e', 0, '2023-02-10 09:15:00'),
('Robert Johnson', 'robert.j@example.com', '$2a$10$xS8J3Zb5Jz6Z1Z1Z1Z1Z1e', 0, '2023-03-05 16:45:00'),
('Emily Davis', 'emily.d@example.com', '$2a$10$xS8J3Zb5Jz6Z1Z1Z1Z1Z1e', 0, '2023-04-20 11:20:00');

-- Insert categories (some already inserted by default)
INSERT OR IGNORE INTO categories (name, description, image_url) VALUES 
('Peças Funcionais', 'Peças mecânicas e funcionais para diversos usos', 'https://example.com/images/categories/functional.jpg'),
('Decoração', 'Itens decorativos para casa e escritório', 'https://example.com/images/categories/decor.jpg'),
('Protótipos', 'Modelos e protótipos para desenvolvimento', 'https://example.com/images/categories/prototypes.jpg'),
('Educacional', 'Materiais educacionais e didáticos', 'https://example.com/images/categories/educational.jpg'),
('Personalizado', 'Produtos customizados sob demanda', 'https://example.com/images/categories/custom.jpg'),
('Ferramentas', 'Utensílios e ferramentas impressas', 'https://example.com/images/categories/tools.jpg'),
('Jogos', 'Peças e acessórios para jogos de tabuleiro', 'https://example.com/images/categories/games.jpg');

-- Insert products
INSERT INTO products (name, description, price, original_price, stock, sku, image_url, category_id, material, rating, rating_count, is_featured, is_active) VALUES 
('Suporte para Celular', 'Suporte ergonômico para smartphone com ajuste de ângulo', 24.90, 29.90, 50, 'SUP-CEL-001', 'https://example.com/images/products/phone-stand.jpg', 1, 'PLA', 4.5, 12, 1, 1),
('Vaso Decorativo Geométrico', 'Vaso moderno com design geométrico para plantas pequenas', 39.90, 49.90, 30, 'VAS-DEC-001', 'https://example.com/images/products/geometric-vase.jpg', 2, 'PETG', 4.2, 8, 1, 1),
('Protótipo de Engrenagem', 'Modelo demonstrativo de sistema de engrenagens', 89.90, NULL, 15, 'PRO-ENG-001', 'https://example.com/images/products/gear-prototype.jpg', 3, 'ABS', 4.7, 5, 0, 1),
('Modelo Molecular', 'Kit educacional de moléculas para estudo de química', 129.90, 149.90, 20, 'EDU-MOL-001', 'https://example.com/images/products/molecular-model.jpg', 4, 'PLA', 4.8, 10, 1, 1),
('Porta-chaves Personalizado', 'Porta-chaves com nome ou logo personalizado', 34.90, NULL, 100, 'PER-PCH-001', 'https://example.com/images/products/keychain.jpg', 5, 'PLA', 4.3, 15, 0, 1),
('Organizador de Cabos', 'Organizador de fios e cabos para mesa de trabalho', 29.90, 39.90, 40, 'ORG-CAB-001', 'https://example.com/images/products/cable-organizer.jpg', 1, 'PETG', 4.1, 7, 0, 1),
('Luminária Moderna', 'Luminária de mesa com design contemporâneo', 79.90, 99.90, 25, 'LUM-MOD-001', 'https://example.com/images/products/modern-lamp.jpg', 2, 'PLA', 4.6, 9, 1, 1),
('Quebra-cabeça 3D', 'Quebra-cabeça tridimensional com peças intercambiáveis', 59.90, NULL, 35, 'JOG-QCB-001', 'https://example.com/images/products/3d-puzzle.jpg', 7, 'PLA', 4.4, 6, 0, 1);

-- Insert product images
INSERT INTO product_images (product_id, image_url, is_primary) VALUES 
(1, 'https://example.com/images/products/phone-stand-1.jpg', 1),
(1, 'https://example.com/images/products/phone-stand-2.jpg', 0),
(1, 'https://example.com/images/products/phone-stand-3.jpg', 0),
(2, 'https://example.com/images/products/geometric-vase-1.jpg', 1),
(2, 'https://example.com/images/products/geometric-vase-2.jpg', 0),
(3, 'https://example.com/images/products/gear-prototype-1.jpg', 1),
(4, 'https://example.com/images/products/molecular-model-1.jpg', 1),
(4, 'https://example.com/images/products/molecular-model-2.jpg', 0),
(5, 'https://example.com/images/products/keychain-1.jpg', 1),
(5, 'https://example.com/images/products/keychain-2.jpg', 0),
(6, 'https://example.com/images/products/cable-organizer-1.jpg', 1),
(7, 'https://example.com/images/products/modern-lamp-1.jpg', 1),
(7, 'https://example.com/images/products/modern-lamp-2.jpg', 0),
(8, 'https://example.com/images/products/3d-puzzle-1.jpg', 1),
(8, 'https://example.com/images/products/3d-puzzle-2.jpg', 0);

-- Insert product variants
INSERT INTO product_variants (product_id, name, price_modifier, stock, sku) VALUES 
(1, 'Pequeno', 0, 20, 'SUP-CEL-001-S'),
(1, 'Grande', 5.00, 30, 'SUP-CEL-001-L'),
(2, 'Branco', 0, 15, 'VAS-DEC-001-WH'),
(2, 'Preto', 0, 15, 'VAS-DEC-001-BK'),
(5, 'Personalização Simples', 0, 60, 'PER-PCH-001-STD'),
(5, 'Personalização Complexa', 10.00, 40, 'PER-PCH-001-PRM'),
(7, 'Branco Fosco', 0, 10, 'LUM-MOD-001-WH'),
(7, 'Preto Brilhante', 0, 15, 'LUM-MOD-001-BK'),
(8, 'Animais', 0, 20, 'JOG-QCB-001-ANM'),
(8, 'Edifícios', 0, 15, 'JOG-QCB-001-BLD');

-- Insert reviews
INSERT INTO reviews (product_id, user_id, rating, title, comment, created_at) VALUES 
(1, 2, 5, 'Ótimo suporte!', 'Muito resistente e funcional, recomendo!', '2023-02-01 18:30:00'),
(1, 3, 4, 'Bom produto', 'Funciona bem, mas poderia ser mais ajustável', '2023-02-15 10:20:00'),
(2, 4, 5, 'Amei o vaso!', 'Ficou lindo na minha sala, exatamente como na foto', '2023-03-10 14:15:00'),
(3, 5, 5, 'Excelente para demonstrações', 'Perfeito para mostrar aos alunos como engrenagens funcionam', '2023-03-20 09:45:00'),
(4, 2, 5, 'Kit educacional completo', 'Todas as peças vieram perfeitas, ótimo para estudo', '2023-04-05 16:30:00'),
(4, 3, 4, 'Bom, mas poderia ter mais peças', 'Atende bem, mas seria ótimo se tivesse mais variedade', '2023-04-12 11:10:00'),
(5, 4, 4, 'Boa qualidade', 'Ficou legal com meu nome, mas a cor poderia ser mais vibrante', '2023-05-01 13:25:00'),
(6, 5, 3, 'Funcional', 'Organiza os cabos, mas é um pouco frágil', '2023-05-15 17:40:00'),
(7, 2, 5, 'Luminária incrível', 'Design moderno e iluminação perfeita', '2023-06-01 20:15:00'),
(8, 3, 4, 'Divertido', 'Bom passatempo, peças encaixam bem', '2023-06-10 15:30:00');

UPDATE users SET name = 'Gabriel de Oliveira Rodrigues', email = 'bielolirodrigues@gmail.com', is_admin = 1 WHERE id = 1;
