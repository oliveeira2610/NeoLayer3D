# NeoLayer3D - Plataforma de E-commerce para Impressão 3D

## Visão Geral

NeoLayer3D é uma plataforma completa de e-commerce especializada em produtos de impressão 3D. O sistema inclui um frontend em React e um backend em Node.js/Express, oferecendo uma experiência de compra intuitiva e funcionalidades administrativas robustas.

## Estrutura do Projeto

O projeto está organizado em duas partes principais:

```
NeoLayer3D/
├── backend/         # API RESTful em Node.js/Express
├── frontend/        # Interface de usuário em React
└── neolayer3d/      # Arquivos HTML/CSS originais (referência)
```

## Requisitos

- Node.js (v16+)
- npm ou yarn
- SQLite (incluído como dependência)

## Instalação e Configuração

### Backend

1. Navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do diretório backend com o seguinte conteúdo:
   ```
   PORT=5001
   JWT_SECRET=seu_segredo_super_secreto_aqui
   JWT_EXPIRES_IN=1h
   ```

4. Configure o banco de dados:
   ```bash
   node database/setup.js
   ```

5. Inicie o servidor:
   ```bash
   npm start
   ```

O servidor backend estará rodando em `http://localhost:5001`.

### Frontend

1. Navegue até a pasta do frontend:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Crie um arquivo `.env` na raiz do diretório frontend com o seguinte conteúdo:
   ```
   VITE_API_URL=http://localhost:5001/api
   ```

4. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

O frontend estará disponível em `http://localhost:5173`.

## Funcionalidades Principais

### Cliente

- Navegação por categorias de produtos
- Filtros avançados (preço, nome, etc.)
- Visualização detalhada de produtos
- Carrinho de compras
- Cadastro e login de usuários
- Perfil de usuário com histórico de pedidos
- Páginas informativas (Sobre, Contato)

### Administração

- Dashboard com estatísticas
- Gerenciamento de produtos
- Gerenciamento de categorias
- Gerenciamento de usuários
- Gerenciamento de pedidos

## Testes

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

## Tecnologias Utilizadas

### Backend
- Node.js
- Express
- SQLite
- JWT para autenticação
- Bcrypt para criptografia de senhas

### Frontend
- React
- React Router
- Axios
- Context API para gerenciamento de estado
- CSS puro para estilização

## Estrutura do Banco de Dados

O sistema utiliza SQLite com as seguintes tabelas principais:

- `users`: Armazena informações dos usuários
- `products`: Catálogo de produtos
- `categories`: Categorias de produtos
- `orders`: Pedidos realizados
- `order_items`: Itens de cada pedido

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Faça commit das suas alterações (`git commit -m 'Adiciona nova funcionalidade'`)
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## Autor

NeoLayer3D Team

