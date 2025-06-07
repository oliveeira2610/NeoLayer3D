# Documentação Técnica - NeoLayer3D

## Arquitetura do Sistema

O NeoLayer3D é construído seguindo uma arquitetura cliente-servidor com separação clara entre frontend e backend:

### Frontend (React)

```
frontend/
├── public/            # Arquivos estáticos
├── src/
│   ├── components/    # Componentes reutilizáveis
│   │   ├── common/    # Componentes genéricos (botões, cards, etc.)
│   │   └── layout/    # Componentes de layout (header, footer, etc.)
│   ├── contexts/      # Contextos React para gerenciamento de estado
│   ├── layouts/       # Layouts de página (MainLayout, AdminLayout)
│   ├── pages/         # Componentes de página
│   │   └── Admin/     # Páginas administrativas
│   ├── services/      # Serviços de API e utilitários
│   ├── styles/        # Estilos globais
│   ├── tests/         # Testes automatizados
│   ├── App.jsx        # Componente principal e configuração de rotas
│   └── main.jsx       # Ponto de entrada da aplicação
└── package.json       # Dependências e scripts
```

### Backend (Node.js/Express)

```
backend/
├── database/          # Scripts de configuração do banco de dados
├── src/
│   ├── config/        # Configurações (banco de dados, autenticação)
│   ├── controllers/   # Controladores para manipulação de requisições
│   ├── middleware/    # Middlewares (autenticação, validação)
│   ├── models/        # Modelos de dados
│   ├── routes/        # Definição de rotas da API
│   └── server.js      # Ponto de entrada do servidor
├── tests/             # Testes automatizados
└── package.json       # Dependências e scripts
```

## Fluxo de Dados

1. **Requisição do Cliente**: O frontend React faz requisições HTTP para a API.
2. **Processamento da API**: O backend processa a requisição através de middlewares e controladores.
3. **Interação com o Banco de Dados**: Os modelos interagem com o banco de dados SQLite.
4. **Resposta ao Cliente**: O backend envia uma resposta JSON ao frontend.
5. **Renderização**: O frontend atualiza a interface com os dados recebidos.

## API Endpoints

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/api/auth/register` | Registra um novo usuário |
| POST | `/api/auth/login` | Autentica um usuário |

### Produtos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/products` | Lista todos os produtos (com filtros opcionais) |
| GET | `/api/products/:id` | Obtém detalhes de um produto específico |
| POST | `/api/products` | Cria um novo produto (admin) |
| PUT | `/api/products/:id` | Atualiza um produto existente (admin) |
| DELETE | `/api/products/:id` | Remove um produto (admin) |

### Categorias

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/categories` | Lista todas as categorias |
| GET | `/api/categories/:id` | Obtém detalhes de uma categoria específica |
| POST | `/api/categories` | Cria uma nova categoria (admin) |
| PUT | `/api/categories/:id` | Atualiza uma categoria existente (admin) |
| DELETE | `/api/categories/:id` | Remove uma categoria (admin) |

### Usuários

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/users` | Lista todos os usuários (admin) |
| GET | `/api/users/:id` | Obtém detalhes de um usuário específico |
| PUT | `/api/users/:id` | Atualiza um usuário existente |
| DELETE | `/api/users/:id` | Remove um usuário (admin) |

### Pedidos

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api/orders` | Lista todos os pedidos (admin) ou pedidos do usuário atual |
| GET | `/api/orders/:id` | Obtém detalhes de um pedido específico |
| POST | `/api/orders` | Cria um novo pedido |
| PUT | `/api/orders/:id/status` | Atualiza o status de um pedido (admin) |

## Autenticação e Autorização

O sistema utiliza JSON Web Tokens (JWT) para autenticação:

1. O usuário faz login com email e senha.
2. O servidor valida as credenciais e gera um token JWT.
3. O token é armazenado no localStorage do navegador.
4. O token é enviado no cabeçalho Authorization em requisições subsequentes.
5. Middlewares de autenticação validam o token e verificam permissões.

## Modelo de Dados

### Usuário
- id: INTEGER (chave primária)
- name: TEXT
- email: TEXT (único)
- password: TEXT (hash bcrypt)
- is_admin: INTEGER (0/1)
- created_at: TIMESTAMP

### Categoria
- id: INTEGER (chave primária)
- name: TEXT
- description: TEXT
- created_at: TIMESTAMP

### Produto
- id: INTEGER (chave primária)
- name: TEXT
- description: TEXT
- price: REAL
- stock: INTEGER
- image_url: TEXT
- category_id: INTEGER (chave estrangeira)
- created_at: TIMESTAMP

### Pedido
- id: INTEGER (chave primária)
- user_id: INTEGER (chave estrangeira)
- status: TEXT
- total: REAL
- created_at: TIMESTAMP

### Item de Pedido
- id: INTEGER (chave primária)
- order_id: INTEGER (chave estrangeira)
- product_id: INTEGER (chave estrangeira)
- quantity: INTEGER
- price: REAL

## Gerenciamento de Estado

O frontend utiliza a Context API do React para gerenciamento de estado:

- **AuthContext**: Gerencia autenticação e informações do usuário.
- **CartContext**: Gerencia o carrinho de compras.

## Responsividade

O design é totalmente responsivo, adaptando-se a diferentes tamanhos de tela:

- **Desktop**: Layout completo com sidebar e múltiplas colunas.
- **Tablet**: Layout adaptado com menos colunas e elementos reorganizados.
- **Mobile**: Layout simplificado com menu hambúrguer e elementos empilhados.

## Segurança

- Senhas são armazenadas com hash bcrypt.
- Autenticação via JWT com expiração configurável.
- Validação de entrada em todas as requisições.
- Proteção contra CSRF e XSS.
- Middlewares de autorização para rotas administrativas.

## Testes

O projeto inclui testes automatizados para garantir a qualidade do código:

- **Testes Unitários**: Testam componentes e funções isoladamente.
- **Testes de Integração**: Testam a interação entre diferentes partes do sistema.
- **Testes de API**: Verificam o comportamento dos endpoints da API.

## Melhorias Futuras

- Implementação de sistema de pagamento.
- Integração com serviços de envio para cálculo de frete.
- Sistema de avaliações e comentários para produtos.
- Painel de análise de vendas mais detalhado.
- Otimização de performance com lazy loading e code splitting.

## Solução de Problemas Comuns

### Erro de conexão com a API
- Verifique se o servidor backend está rodando.
- Confirme se a variável de ambiente `VITE_API_URL` está configurada corretamente.
- Verifique se há problemas de CORS nas configurações do servidor.

### Problemas de autenticação
- Limpe o localStorage e faça login novamente.
- Verifique se o token JWT não expirou.
- Confirme se as credenciais estão corretas.

### Erros no banco de dados
- Execute o script de configuração do banco de dados novamente.
- Verifique se há problemas de permissão no arquivo do banco SQLite.

## Contato e Suporte

Para questões técnicas ou suporte, entre em contato com a equipe de desenvolvimento:

- Email: suporte@neolayer3d.com.br
- GitHub: https://github.com/neolayer3d

