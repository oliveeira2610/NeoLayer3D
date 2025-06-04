# NeoLayer3D - Aplicação React Vite + Node.js/Express + SQLite3

Este projeto é uma conversão do site HTML estático NeoLayer3D para uma aplicação web dinâmica utilizando React Vite para o frontend, Node.js com Express para o backend e SQLite3 como banco de dados.

## Estrutura do Projeto

O projeto está dividido em duas pastas principais:

- `/frontend`: Contém o código da aplicação React Vite.
- `/backend`: Contém o código do servidor Node.js/Express e o banco de dados SQLite.

Consulte o arquivo `project_structure.md` (incluído na raiz) para um detalhamento da estrutura de pastas planejada.

## Funcionalidades Implementadas (Core)

- **Backend:**
    - Servidor Express configurado.
    - Conexão com banco de dados SQLite3 (`database/database.db`).
    - Script de setup para criar tabelas (`database/setup.js`).
    - Modelos (Models) para Usuários, Categorias e Produtos.
    - Rotas (Routes) e Controladores (Controllers) para:
        - Autenticação (Registro e Login com JWT).
        - CRUD de Categorias (protegido por admin).
        - CRUD de Produtos (protegido por admin).
    - Middleware de autenticação (protect) e autorização (admin).
- **Frontend:**
    - Estrutura do projeto React Vite criada.
    - Configuração básica de rotas (React Router).
    - Serviço de API (`src/services/api.js`) para comunicação com o backend.
    - Contexto de Autenticação (`src/contexts/AuthContext.jsx`) para gerenciamento de estado de login.
    - Páginas de Login (`src/pages/LoginPage.jsx`) e Registro (`src/pages/RegisterPage.jsx`) funcionais.
    - Páginas básicas de gerenciamento (Admin) para Categorias (`src/pages/Admin/ManageCategoriesPage.jsx`) e Produtos (`src/pages/Admin/ManageProductsPage.jsx`) com CRUD funcional.
    - Estilização global básica (`src/styles/global.css`) baseada no CSS original.
    - Roteamento protegido para rotas administrativas.

## Funcionalidades Pendentes (Próximos Passos)

- Implementação completa das páginas públicas (Homepage, visualização de categorias/produtos, carrinho, sobre, contato).
- Implementação do layout principal (Header, Footer, Sidebar se necessário).
- Refinamento da estilização CSS em todos os componentes para corresponder totalmente ao design original e garantir responsividade completa.
- Implementação de funcionalidades adicionais (busca, filtros avançados, paginação, upload de imagens, etc.).
- Testes unitários e de integração.
- Criação de usuário administrador inicial (pode ser feito manualmente no DB ou via script).

## Como Executar o Projeto

**Pré-requisitos:**
- Node.js (versão 18 ou superior recomendada)
- npm (geralmente vem com o Node.js)

**1. Backend:**

   a. Navegue até a pasta do backend:
      ```bash
      cd backend
      ```
   b. Instale as dependências:
      ```bash
      npm install
      ```
   c. Crie o banco de dados e as tabelas (execute apenas uma vez):
      ```bash
      node database/setup.js
      ```
   d. Crie um arquivo `.env` na pasta `backend` com o seguinte conteúdo (ajuste se necessário):
      ```env
      PORT=5001
      JWT_SECRET=seu_segredo_super_secreto_aqui # Troque por uma chave segura
      JWT_EXPIRES_IN=1h 
      ```
   e. Inicie o servidor backend:
      ```bash
      npm start 
      ```
      (Ou `node src/server.js`. Considere adicionar `"start": "node src/server.js"` aos scripts no `package.json`)

**2. Frontend:**

   a. Abra outro terminal e navegue até a pasta do frontend:
      ```bash
      cd frontend
      ```
   b. Instale as dependências:
      ```bash
      npm install
      ```
    c. Crie um arquivo `.env` na pasta `frontend` (opcional, se quiser sobrescrever a URL da API padrão):
      ```env
      VITE_API_URL=http://localhost:5001/api 
      ```
   d. Inicie o servidor de desenvolvimento do frontend:
      ```bash
      npm run dev
      ```
   e. Abra seu navegador e acesse o endereço fornecido (geralmente `http://localhost:5173`).

**Observações:**

- Para criar um usuário administrador, você pode modificar o banco de dados `backend/database/database.db` manualmente (usando uma ferramenta como DB Browser for SQLite) e definir o campo `is_admin` para `1` para um usuário registrado, ou implementar uma rota/script específico para isso.
- A estilização e as páginas públicas precisam ser desenvolvidas para completar a aplicação.

