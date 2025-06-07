const productController = require('../../src/controllers/productController');
const Product = require('../../src/models/Product');
const Category = require('../../src/models/Category');

// Mock dos modelos
jest.mock('../../src/models/Product');
jest.mock('../../src/models/Category');

describe('Product Controller', () => {
  let req, res;
  
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock do objeto de requisição
    req = {
      params: {},
      query: {},
      body: {}
    };
    
    // Mock do objeto de resposta
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });
  
  describe('getAllProducts', () => {
    test('deve retornar todos os produtos', async () => {
      // Mock dos produtos
      const mockProducts = [
        { id: 1, name: 'Produto 1', price: 100 },
        { id: 2, name: 'Produto 2', price: 200 }
      ];
      
      // Configura o mock para retornar os produtos
      Product.findAll.mockImplementation((filters, callback) => {
        callback(null, mockProducts);
      });
      
      // Chama o método do controlador
      productController.getAllProducts(req, res);
      
      // Verifica se o método do modelo foi chamado corretamente
      expect(Product.findAll).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.json).toHaveBeenCalledWith(mockProducts);
    });
    
    test('deve retornar erro 500 se houver falha na busca', async () => {
      // Configura o mock para retornar erro
      Product.findAll.mockImplementation((filters, callback) => {
        callback(new Error('Erro ao buscar produtos'), null);
      });
      
      // Chama o método do controlador
      productController.getAllProducts(req, res);
      
      // Verifica se o método do modelo foi chamado corretamente
      expect(Product.findAll).toHaveBeenCalled();
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });
    
    test('deve aplicar filtros corretamente', async () => {
      // Configura os parâmetros de consulta
      req.query = {
        category: '1',
        search: 'teste',
        priceMin: '50',
        priceMax: '200',
        sortBy: 'price_asc'
      };
      
      // Configura o mock para verificar os filtros
      Product.findAll.mockImplementation((filters, callback) => {
        // Verifica se os filtros foram passados corretamente
        expect(filters.category).toBe('1');
        expect(filters.search).toBe('teste');
        expect(filters.priceMin).toBe('50');
        expect(filters.priceMax).toBe('200');
        expect(filters.sortBy).toBe('price_asc');
        
        callback(null, []);
      });
      
      // Chama o método do controlador
      productController.getAllProducts(req, res);
      
      // Verifica se o método do modelo foi chamado
      expect(Product.findAll).toHaveBeenCalled();
    });
  });
  
  describe('getProductById', () => {
    test('deve retornar um produto específico', async () => {
      // Mock do produto
      const mockProduct = { id: 1, name: 'Produto 1', price: 100 };
      
      // Configura o parâmetro de ID
      req.params.id = '1';
      
      // Configura o mock para retornar o produto
      Product.findById.mockImplementation((id, callback) => {
        expect(id).toBe('1');
        callback(null, mockProduct);
      });
      
      // Chama o método do controlador
      productController.getProductById(req, res);
      
      // Verifica se o método do modelo foi chamado corretamente
      expect(Product.findById).toHaveBeenCalledWith('1', expect.any(Function));
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.json).toHaveBeenCalledWith(mockProduct);
    });
    
    test('deve retornar 404 se o produto não for encontrado', async () => {
      // Configura o parâmetro de ID
      req.params.id = '999';
      
      // Configura o mock para retornar null (produto não encontrado)
      Product.findById.mockImplementation((id, callback) => {
        callback(null, null);
      });
      
      // Chama o método do controlador
      productController.getProductById(req, res);
      
      // Verifica se o método do modelo foi chamado corretamente
      expect(Product.findById).toHaveBeenCalledWith('999', expect.any(Function));
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
    });
  });
  
  describe('createProduct', () => {
    test('deve criar um novo produto com sucesso', async () => {
      // Dados do produto a ser criado
      const productData = {
        name: 'Novo Produto',
        description: 'Descrição do produto',
        price: 150,
        stock: 10,
        image_url: 'imagem.jpg',
        category_id: 1
      };
      
      // Configura o corpo da requisição
      req.body = productData;
      
      // Mock da categoria
      const mockCategory = { id: 1, name: 'Categoria Teste' };
      
      // Configura o mock para verificar a categoria
      Category.findById.mockImplementation((id, callback) => {
        expect(id).toBe(1);
        callback(null, mockCategory);
      });
      
      // Configura o mock para criar o produto
      Product.create.mockImplementation((data, callback) => {
        expect(data.name).toBe(productData.name);
        expect(data.price).toBe(productData.price);
        callback(null, { id: 1, ...productData });
      });
      
      // Chama o método do controlador
      productController.createProduct(req, res);
      
      // Verifica se os métodos dos modelos foram chamados corretamente
      expect(Category.findById).toHaveBeenCalledWith(1, expect.any(Function));
      expect(Product.create).toHaveBeenCalled();
      
      // Verifica se a resposta foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: expect.any(String),
        product: expect.objectContaining({ id: 1, name: 'Novo Produto' })
      });
    });
    
    test('deve retornar 400 se dados obrigatórios estiverem faltando', async () => {
      // Dados incompletos do produto
      req.body = {
        name: 'Produto Incompleto',
        // Faltando price e category_id
      };
      
      // Chama o método do controlador
      productController.createProduct(req, res);
      
      // Verifica se a resposta de erro foi enviada corretamente
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: expect.any(String) });
      
      // Verifica que o produto não foi criado
      expect(Product.create).not.toHaveBeenCalled();
    });
  });
});

