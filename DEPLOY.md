# Guia de Implantação - NeoLayer3D

Este documento fornece instruções detalhadas para implantar o sistema NeoLayer3D em ambientes de produção.

## Requisitos de Sistema

- Node.js v16.0.0 ou superior
- npm v8.0.0 ou superior (ou yarn)
- Servidor web (Nginx ou Apache) para produção
- Mínimo de 1GB de RAM
- 2GB de espaço em disco

## Implantação do Backend

### 1. Preparação do Ambiente

```bash
# Clonar o repositório
git clone https://github.com/oliveeira2610/NeoLayer3D.git
cd NeoLayer3D/backend

# Instalar dependências
npm install --production
```

### 2. Configuração

Crie um arquivo `.env` na raiz do diretório backend com as seguintes variáveis:

```
PORT=5001
JWT_SECRET=seu_segredo_super_secreto_aqui
JWT_EXPIRES_IN=1h
```

Para ambientes de produção, recomenda-se:
- Usar um segredo JWT forte e aleatório
- Configurar um tempo de expiração de token adequado (ex: 1h)
- Armazenar o arquivo `.env` fora do controle de versão

### 3. Configuração do Banco de Dados

```bash
# Inicializar o banco de dados
node database/setup.js
```

Para ambientes de produção, considere:
- Fazer backup regular do arquivo SQLite
- Ou migrar para um sistema de banco de dados mais robusto como PostgreSQL ou MySQL

### 4. Iniciar o Servidor

#### Método Direto

```bash
# Iniciar o servidor
npm start
```

#### Usando PM2 (Recomendado para Produção)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar o servidor com PM2
pm2 start src/server.js --name neolayer3d-backend

# Configurar para iniciar automaticamente após reinicialização
pm2 startup
pm2 save
```

## Implantação do Frontend

### 1. Preparação do Ambiente

```bash
# Navegar para o diretório frontend
cd ../frontend

# Instalar dependências
npm install
```

### 2. Configuração

Crie um arquivo `.env` na raiz do diretório frontend:

```
VITE_API_URL=https://seu-dominio.com/api
```

Substitua `https://seu-dominio.com/api` pelo URL real da sua API em produção.

### 3. Construir para Produção

```bash
# Gerar build de produção
npm run build
```

Isso criará uma pasta `dist` com os arquivos estáticos otimizados para produção.

### 4. Servir os Arquivos Estáticos

#### Usando Nginx (Recomendado)

Instale o Nginx:

```bash
sudo apt update
sudo apt install nginx
```

Configure um site no Nginx:

```nginx
# /etc/nginx/sites-available/neolayer3d
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;
    
    root /caminho/para/NeoLayer3D/frontend/dist;
    index index.html;
    
    # Configuração para Single Page Application
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Proxy para a API
    location /api/ {
        proxy_pass http://localhost:5001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Ative o site e reinicie o Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/neolayer3d /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Usando Apache

Configure um VirtualHost no Apache:

```apache
<VirtualHost *:80>
    ServerName seu-dominio.com
    ServerAlias www.seu-dominio.com
    
    DocumentRoot /caminho/para/NeoLayer3D/frontend/dist
    
    <Directory /caminho/para/NeoLayer3D/frontend/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>
    
    # Configuração para Single Page Application
    FallbackResource /index.html
    
    # Proxy para a API
    ProxyPass /api http://localhost:5001/api
    ProxyPassReverse /api http://localhost:5001/api
</VirtualHost>
```

Crie um arquivo `.htaccess` na pasta `dist`:

```
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Reinicie o Apache:

```bash
sudo systemctl restart apache2
```

## Configuração de HTTPS (Recomendado)

### Usando Certbot com Nginx

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

### Usando Certbot com Apache

```bash
sudo apt install certbot python3-certbot-apache
sudo certbot --apache -d seu-dominio.com -d www.seu-dominio.com
```

## Monitoramento e Manutenção

### Logs do Backend

Se estiver usando PM2:

```bash
pm2 logs neolayer3d-backend
```

### Backup do Banco de Dados

Crie um script de backup para o SQLite:

```bash
#!/bin/bash
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_DIR="/caminho/para/backups"
mkdir -p $BACKUP_DIR
cp /caminho/para/NeoLayer3D/backend/database.sqlite $BACKUP_DIR/database_$TIMESTAMP.sqlite
```

Configure um cron job para executar regularmente:

```
0 2 * * * /caminho/para/script_backup.sh
```

### Atualizações

Para atualizar o sistema:

```bash
# Parar serviços
pm2 stop neolayer3d-backend

# Fazer backup do banco de dados
cp /caminho/para/NeoLayer3D/backend/database.sqlite /caminho/para/backups/database_pre_update.sqlite

# Atualizar código
git pull

# Instalar novas dependências
cd backend
npm install --production
cd ../frontend
npm install

# Reconstruir frontend
npm run build

# Reiniciar serviços
pm2 start neolayer3d-backend
```

## Solução de Problemas

### Erro de Conexão com o Backend

Verifique:
- Se o servidor backend está rodando
- Se as configurações de proxy no servidor web estão corretas
- Se as portas necessárias estão abertas no firewall

```bash
# Verificar status do backend
pm2 status neolayer3d-backend

# Verificar logs
pm2 logs neolayer3d-backend

# Verificar se a porta está aberta
sudo netstat -tulpn | grep 5001
```

### Problemas com o Frontend

Verifique:
- Se o build foi gerado corretamente
- Se o servidor web está configurado para lidar com Single Page Applications
- Se o arquivo `.env` tem o URL da API correto

### Problemas de Permissão

```bash
# Corrigir permissões de arquivos
sudo chown -R www-data:www-data /caminho/para/NeoLayer3D/frontend/dist
sudo chmod -R 755 /caminho/para/NeoLayer3D/frontend/dist
```

## Contato para Suporte

Em caso de problemas na implantação, entre em contato:

- Email: suporte@neolayer3d.com.br
- GitHub: https://github.com/oliveeira2610/NeoLayer3D/issues

