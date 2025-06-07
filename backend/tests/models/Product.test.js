const Product = require('../../src/models/Product');
const connectDB = require('../../src/config/db');

// Mock do banco de dados
jest.mock('../../src/config/db');

describe('Product Model', () => {
  let mockDb;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock do objeto de banco de dados
    mockDb = {
      run: jest.fn(),
      get: jest.fn(),
      all: jest.fn()
    };
    
    // Configura o mock para retornar o mockDb
    connectDB.mockReturnValue(mockDb);
  });
  
  describe('findAll', () => {
    test('deve buscar todos os produtos sem filtros', () => {
      // Mock callback
      const callback = jest.fn();
      
      // Chama o método do modelo
      Product.findAll({}, callback);
      
      // Verifica se o método do banco de dados foi chamado corretamente
      expect(mockDb.all).toHaveBeenCalled();
      
      // Verifica se a consulta SQL contém a junção com a tabela de categorias
      const sqlQuery = mockDb.all.mock.calls[0][0];
      expect(sqlQuery).toContain('LEFT JOIN categories c ON p.category_id = c.id');
      
      // Verifica se a ordenação padrão está presente
      expect(sqlQuery).toContain('ORDER BY p.created_at DESC');
    });
    
    test('deve aplicar filtros corretamente', () => {
      // Mock callback
      const callback = jest.fn();
      
      // Filtros a serem aplicados
      const filters = {
        category: 1,
        search: 'teste',
        priceMin: 50,
        priceMax: 200,
        sortBy: 'price_asc'
      };
      
      // Chama o método do modelo
      Product.findAll(filters, callback);
      
      // Verifica se o método do banco de dados foi chamado corretamente
      expect(mockDb.all).toHaveBeenCalled();
      
      // Verifica se a consulta SQL contém as cláusulas WHERE para os filtros
      const sqlQuery = mockDb.all.mock.calls[0][0];
      expect(sqlQuery).toContain('WHERE');
      expect(sqlQuery).toContain('p.category_id = ?');
      expect(sqlQuery).toContain('(p.name LIKE ? OR p.description LIKE ?)');
      expect(sqlQuery).toContain('p.price >= ?');
      expect(sqlQuery).toContain('p.price <= ?');
      
      // Verifica se a ordenação foi aplicada corretamente
      expect(sqlQuery).toContain('ORDER BY p.price ASC');
      
      // Verifica se os valores dos filtros foram passados corretamente
      const values = mockDb.all.mock.calls[0][1];
      expect(values).toContain(1); // category
      expect(values).toContain('%teste%'); // search (2x para name e description)
      expect(values).toContain(50); // priceMin
      expect(values).toContain(200); // priceMax
    });
  });
  
  describe('findById', () => {
    test('deve buscar um produto pelo ID', () => {
      // Mock callback
      const callback = jest.fn();
      
      // ID do produto a ser buscado
      const productId = 1;
      
      // Chama o método do modelo
      Product.findById(productId, callback);
      
      // Verifica se o método do banco de dados foi chamado corretamente
      expect(mockDb.get).toHaveBeenCalled();
      
      // Verifica se a consulta SQL contém a cláusula WHERE com o ID
      const sqlQuery = mockDb.get.mock.calls[0][0];
      expect(sqlQuery).toContain('WHERE p.id = ?');
      
      // Verifica se o ID foi passado corretamente
      const values = mockDb.get.mock.calls[0][1];
      expect(values).toEqual([productId]);
    });
  });
  
  describe('create', () => {
    test('deve criar um novo produto', () => {
      // Mock callback
      const callback = jest.fn();
      
      // Dados do produto a ser criado
      const productData = {
        name: 'Novo Produto',
        description: 'Descrição do produto',
        price: 150,
        stock: 10,
        image_url: 'imagem.jpg',
        category_id: 1
      };
      
      // Mock do resultado da inserção
      mockDb.run.mockImplementation(function(sql, values, cb) {
        // Simula o this.lastID do SQLite
        cb.call({ lastID: 1 });
      });
      
      // Chama o método do modelo
      Product.create(productData, callback);
      
      // Verifica se o método do banco de dados foi chamado corretamente
      expect(mockDb.run).toHaveBeenCalled();
      
      // Verifica se a consulta SQL é uma inserção
      const sqlQuery = mockDb.run.mock.calls[0][0];
      expect(sqlQuery).toContain('INSERT INTO products');
      
      // Verifica se os valores foram passados corretamente
      const values = mockDb.run.mock.calls[0][1];
      expect(values).toEqual([
        productData.name,
        productData.description,
        productData.price,
        productData.stock,
        productData.image_url,
        productData.category_id
      ]);
      
      // Verifica se o callback foi chamado com o produto criado
      expect(callback).toHaveBeenCalledWith(null, expect.objectContaining({
        id: 1,
        ...productData
      }));
    });
  });
  
  describe('update', () => {
    test('deve atualizar um produto existente', () => {
      // Mock callback
      const callback = jest.fn();
      
      // ID do produto a ser atualizado
      const productId = 1;
      
      // Dados a serem atualizados
      const updateData = {
        name: 'Produto Atualizado',
        price: 200
      };
      
      // Mock do resultado da atualização
      mockDb.run.mockImplementation(function(sql, values, cb) {
        // Simula o this.changes do SQLite
        cb.call({ changes: 1 });
      });
      
      // Chama o método do modelo
      Product.update(productId, updateData, callback);
      
      // Verifica se o método do banco de dados foi chamado corretamente
      expect(mockDb.run).toHaveBeenCalled();
      
      // Verifica se a consulta SQL é uma atualização
      const sqlQuery = mockDb.run.mock.calls[0][0];
      expect(sqlQuery).toContain('UPDATE products SET');
      expect(sqlQuery).toContain('name = ?');
      expect(sqlQuery).toContain('price = ?');
      expect(sqlQuery).toContain('WHERE id = ?');
      
      // Verifica se os valores foram passados corretamente
      const values = mockDb.run.mock.calls[0][1];
      expect(values).toContain(updateData.name);
      expect(values).toContain(updateData.price);
      expect(values).toContain(productId);
      
      // Verifica se o callback foi chamado com o resultado da atualização
      expect(callback).toHaveBeenCalledWith(null, { changes: 1 });
    });
    
    test('deve retornar erro se não houver campos para atualizar', () => {
      // Mock callback
      const callback = jest.fn();
      
      // ID do produto a ser atualizado
      const productId = 1;
      
      // Dados vazios para atualização
      const updateData = {};
      
      // Chama o método do modelo
      Product.update(productId, updateData, callback);
      
      // Verifica se o método do banco de dados não foi chamado
      expect(mockDb.run).not.toHaveBeenCalled();
      
      // Verifica se o callback foi chamado com erro
      expect(callback).toHaveBeenCalledWith(expect.any(Error));
    });
  });
  
  describe('delete', () => {
    test('deve excluir um produto pelo ID', () => {
      // Mock callback
      const callback = jest.fn();
      
      // ID do produto a ser excluído
      const productId = 1;
      
      // Mock do resultado da exclusão
      mockDb.run.mockImplementation(function(sql, values, cb) {
        // Simula o this.changes do SQLite
        cb.call({ changes: 1 });
      });
      
      // Chama o método do modelo
      Product.delete(productId, callback);
      
      // Verifica se o método do banco de dados foi chamado corretamente
      expect(mockDb.run).toHaveBeenCalled();
      
      // Verifica se a consulta SQL é uma exclusão
      const sqlQuery = mockDb.run.mock.calls[0][0];
      expect(sqlQuery).toContain('DELETE FROM products WHERE id = ?');
      
      // Verifica se o ID foi passado corretamente
      const values = mockDb.run.mock.calls[0][1];
      expect(values).toEqual([productId]);
      
      // Verifica se o callback foi chamado com o resultado da exclusão
      expect(callback).toHaveBeenCalledWith(null, { changes: 1 });
    });
  });
});

