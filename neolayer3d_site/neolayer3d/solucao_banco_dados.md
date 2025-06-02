# Solução de Banco de Dados para GitHub Pages - NeoLayer3D

Após pesquisa sobre soluções de banco de dados compatíveis com GitHub Pages, que é uma plataforma de hospedagem estática sem suporte a backend tradicional, defini a seguinte estratégia:

## Solução Escolhida: localStorageDB + JSON Estático

### Componentes da Solução:

1. **Arquivos JSON Estáticos**
   - Armazenamento de dados iniciais em arquivos JSON no repositório
   - Categorias, produtos e informações estáticas serão carregados destes arquivos
   - Vantagem: Fácil manutenção e atualização através de commits no GitHub

2. **localStorageDB**
   - Biblioteca JavaScript que fornece uma camada de abstração sobre o localStorage do navegador
   - Permite criar estruturas semelhantes a bancos de dados e tabelas
   - Suporta operações CRUD (Create, Read, Update, Delete)
   - Vantagem: Persistência de dados do usuário entre sessões

3. **Implementação Híbrida**
   - Dados iniciais carregados dos arquivos JSON estáticos
   - Modificações do usuário (carrinho, favoritos, etc.) armazenadas no localStorage
   - Simulação de operações de banco de dados totalmente no cliente

### Estrutura de Dados:

```
/data/
  ├── products.json     # Catálogo completo de produtos
  ├── categories.json   # Categorias e subcategorias
  ├── featured.json     # Produtos em destaque
  └── testimonials.json # Depoimentos de clientes
```

### Implementação:

1. **Inicialização**
   ```javascript
   // Inicializar o banco de dados local
   var db = new localStorageDB("neolayer3d", localStorage);
   
   // Verificar se é a primeira execução
   if (db.isNew()) {
     // Criar tabelas necessárias
     db.createTable("cart", ["product_id", "quantity", "price", "added_at"]);
     db.createTable("favorites", ["product_id", "added_at"]);
     db.createTable("user_data", ["key", "value"]);
     
     // Salvar as alterações
     db.commit();
   }
   ```

2. **Carregamento de Dados Estáticos**
   ```javascript
   // Carregar produtos do arquivo JSON
   async function loadProducts() {
     const response = await fetch('/data/products.json');
     const products = await response.json();
     return products;
   }
   ```

3. **Operações de Carrinho**
   ```javascript
   // Adicionar produto ao carrinho
   function addToCart(productId, quantity, price) {
     db.insert("cart", {
       product_id: productId,
       quantity: quantity,
       price: price,
       added_at: new Date().toISOString()
     });
     db.commit();
   }
   
   // Obter itens do carrinho
   function getCartItems() {
     return db.query("cart");
   }
   ```

### Limitações e Soluções:

1. **Limitação**: Sem persistência entre dispositivos
   **Solução**: Opção para exportar/importar dados via JSON

2. **Limitação**: Tamanho limitado do localStorage (geralmente 5-10MB)
   **Solução**: Gerenciamento eficiente de dados, removendo itens antigos quando necessário

3. **Limitação**: Sem processamento de pagamentos reais
   **Solução**: Simulação de checkout com feedback visual

4. **Limitação**: Sem autenticação de usuários
   **Solução**: Simulação de login/registro com dados armazenados localmente

### Vantagens da Abordagem:

1. Compatibilidade total com GitHub Pages
2. Experiência de usuário semelhante a um e-commerce real
3. Persistência de dados entre visitas no mesmo dispositivo
4. Fácil manutenção e atualização de produtos
5. Carregamento rápido por ser totalmente client-side
6. Sem necessidade de servidores ou bancos de dados externos

Esta solução oferece um equilíbrio entre funcionalidade e as limitações de uma hospedagem estática, permitindo criar uma experiência de e-commerce convincente sem backend tradicional.
