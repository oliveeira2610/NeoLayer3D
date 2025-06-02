/**
 * NeoLayer3D - Banco de Dados e Funcionalidades
 * Este arquivo implementa a camada de persistência e manipulação de dados
 * utilizando localStorageDB e arquivos JSON estáticos
 */

// Inicialização do banco de dados local
let db;
let products = [];
let categories = [];

// Função para inicializar o banco de dados
async function initDatabase() {
    try {
        // Carregar dados estáticos
        await loadStaticData();
        
        // Inicializar localStorageDB
        db = new localStorageDB("neolayer3d", localStorage);
        
        // Verificar se é a primeira execução
        if (db.isNew()) {
            console.log("Inicializando banco de dados local...");
            
            // Criar tabelas necessárias
            db.createTable("cart", ["product_id", "quantity", "price", "options", "added_at"]);
            db.createTable("favorites", ["product_id", "added_at"]);
            db.createTable("user_data", ["key", "value"]);
            
            // Salvar as alterações
            db.commit();
        }
        
        // Atualizar contador do carrinho
        updateCartCount();
        
        return true;
    } catch (error) {
        console.error("Erro ao inicializar banco de dados:", error);
        return false;
    }
}

// Função para carregar dados estáticos dos arquivos JSON
async function loadStaticData() {
    try {
        // Carregar produtos
        const productsResponse = await fetch('/data/products.json');
        products = await productsResponse.json();
        
        // Carregar categorias
        const categoriesResponse = await fetch('/data/categories.json');
        categories = await categoriesResponse.json();
        
        console.log(`Dados carregados: ${products.length} produtos, ${categories.length} categorias`);
        return true;
    } catch (error) {
        console.error("Erro ao carregar dados estáticos:", error);
        return false;
    }
}

// Funções para manipulação de produtos
function getProducts(filters = {}) {
    let filteredProducts = [...products];
    
    // Aplicar filtros se existirem
    if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    if (filters.featured) {
        filteredProducts = filteredProducts.filter(p => p.featured);
    }
    
    if (filters.new) {
        filteredProducts = filteredProducts.filter(p => p.new);
    }
    
    if (filters.popular) {
        filteredProducts = filteredProducts.filter(p => p.popular);
    }
    
    if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice);
    }
    
    if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice);
    }
    
    // Ordenação
    if (filters.sort) {
        switch (filters.sort) {
            case 'price-asc':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name-asc':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'rating-desc':
                filteredProducts.sort((a, b) => b.rating - a.rating);
                break;
            default:
                // Sem ordenação específica
                break;
        }
    }
    
    return filteredProducts;
}

function getProductById(id) {
    return products.find(p => p.id === parseInt(id));
}

function getProductsByCategory(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return [];
    
    return products.filter(p => p.category === category.name);
}

function getFeaturedProducts(limit = 4) {
    return products
        .filter(p => p.featured)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

function getNewProducts(limit = 4) {
    return products
        .filter(p => p.new)
        .slice(0, limit);
}

function getPopularProducts(limit = 4) {
    return products
        .filter(p => p.popular || p.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit);
}

function getRelatedProducts(productId, limit = 4) {
    const product = getProductById(productId);
    if (!product) return [];
    
    return products
        .filter(p => p.id !== product.id && p.category === product.category)
        .sort(() => 0.5 - Math.random()) // Ordenação aleatória
        .slice(0, limit);
}

// Funções para manipulação de categorias
function getCategories() {
    return categories;
}

function getFeaturedCategories(limit = 4) {
    return categories
        .filter(c => c.featured)
        .slice(0, limit);
}

function getCategoryById(id) {
    return categories.find(c => c.id === id);
}

// Funções para manipulação do carrinho
function getCartItems() {
    return db.query("cart");
}

function addToCart(productId, quantity = 1, options = null) {
    const product = getProductById(productId);
    if (!product) return false;
    
    // Verificar se o produto já está no carrinho
    const existingItem = db.query("cart", {product_id: productId});
    
    if (existingItem.length > 0) {
        // Atualizar quantidade
        const newQuantity = existingItem[0].quantity + quantity;
        db.update("cart", {product_id: productId}, function(item) {
            item.quantity = newQuantity;
            return item;
        });
    } else {
        // Adicionar novo item
        db.insert("cart", {
            product_id: productId,
            quantity: quantity,
            price: product.price,
            options: options,
            added_at: new Date().toISOString()
        });
    }
    
    db.commit();
    updateCartCount();
    return true;
}

function updateCartItem(productId, quantity) {
    if (quantity <= 0) {
        return removeFromCart(productId);
    }
    
    db.update("cart", {product_id: productId}, function(item) {
        item.quantity = quantity;
        return item;
    });
    
    db.commit();
    updateCartCount();
    return true;
}

function removeFromCart(productId) {
    db.deleteRows("cart", {product_id: productId});
    db.commit();
    updateCartCount();
    return true;
}

function clearCart() {
    db.truncate("cart");
    db.commit();
    updateCartCount();
    return true;
}

function getCartTotal() {
    const items = getCartItems();
    let subtotal = 0;
    
    items.forEach(item => {
        const product = getProductById(item.product_id);
        if (product) {
            subtotal += product.price * item.quantity;
        }
    });
    
    const shipping = subtotal > 200 ? 0 : 15.90;
    const discount = 0; // Implementar lógica de desconto se necessário
    
    return {
        subtotal: subtotal,
        shipping: shipping,
        discount: discount,
        total: subtotal + shipping - discount
    };
}

function updateCartCount() {
    const cartItems = getCartItems();
    const cartCount = document.querySelector('.cart-count');
    
    if (cartCount) {
        let totalItems = 0;
        cartItems.forEach(item => {
            totalItems += item.quantity;
        });
        
        cartCount.textContent = totalItems;
    }
}

// Funções para favoritos
function getFavorites() {
    return db.query("favorites");
}

function addToFavorites(productId) {
    const product = getProductById(productId);
    if (!product) return false;
    
    // Verificar se o produto já está nos favoritos
    const existingItem = db.query("favorites", {product_id: productId});
    
    if (existingItem.length === 0) {
        // Adicionar aos favoritos
        db.insert("favorites", {
            product_id: productId,
            added_at: new Date().toISOString()
        });
        
        db.commit();
    }
    
    return true;
}

function removeFromFavorites(productId) {
    db.deleteRows("favorites", {product_id: productId});
    db.commit();
    return true;
}

// Funções para dados do usuário
function getUserData(key) {
    const data = db.query("user_data", {key: key});
    return data.length > 0 ? data[0].value : null;
}

function setUserData(key, value) {
    const existingData = db.query("user_data", {key: key});
    
    if (existingData.length > 0) {
        db.update("user_data", {key: key}, function(item) {
            item.value = value;
            return item;
        });
    } else {
        db.insert("user_data", {
            key: key,
            value: value
        });
    }
    
    db.commit();
    return true;
}

// Inicializar banco de dados quando o documento estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    // Verificar se localStorageDB está disponível
    if (typeof localStorageDB === 'undefined') {
        console.error("localStorageDB não encontrado. Carregando biblioteca...");
        
        // Criar e adicionar script de localStorageDB
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/localStorageDB/2.3.1/localstoragedb.min.js';
        script.onload = function() {
            console.log("localStorageDB carregado com sucesso!");
            initDatabase();
        };
        script.onerror = function() {
            console.error("Erro ao carregar localStorageDB!");
        };
        document.head.appendChild(script);
    } else {
        initDatabase();
    }
    
    // Adicionar listeners para botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
            alert('Produto adicionado ao carrinho!');
        });
    });
});
