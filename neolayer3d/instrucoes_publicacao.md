# Instruções para Publicação no GitHub Pages - NeoLayer3D

Este documento contém instruções detalhadas para publicar o site NeoLayer3D no GitHub Pages.

## Pré-requisitos

1. Uma conta no GitHub (crie uma em [github.com](https://github.com) se ainda não tiver)
2. Git instalado em seu computador (baixe em [git-scm.com](https://git-scm.com/downloads))

## Passo a Passo para Publicação

### 1. Criar um novo repositório no GitHub

1. Acesse [github.com](https://github.com) e faça login em sua conta
2. Clique no botão "+" no canto superior direito e selecione "New repository"
3. Nomeie o repositório como `neolayer3d` (ou outro nome de sua preferência)
4. Deixe o repositório como público
5. Não inicialize o repositório com README, .gitignore ou licença
6. Clique em "Create repository"

### 2. Preparar os arquivos localmente

1. Abra o terminal ou prompt de comando
2. Navegue até a pasta onde estão os arquivos do site NeoLayer3D
3. Inicialize um repositório Git local:
   ```
   git init
   ```
4. Adicione todos os arquivos ao repositório:
   ```
   git add .
   ```
5. Faça o commit inicial:
   ```
   git commit -m "Versão inicial do site NeoLayer3D"
   ```

### 3. Conectar ao repositório remoto e enviar os arquivos

1. Conecte seu repositório local ao repositório remoto no GitHub:
   ```
   git remote add origin https://github.com/SEU-USUARIO/neolayer3d.git
   ```
   (Substitua "SEU-USUARIO" pelo seu nome de usuário do GitHub)

2. Envie os arquivos para o GitHub:
   ```
   git push -u origin master
   ```
   ou, se estiver usando a branch principal como "main":
   ```
   git push -u origin main
   ```

### 4. Configurar o GitHub Pages

1. Acesse a página do seu repositório no GitHub
2. Clique em "Settings" (Configurações)
3. Role para baixo até encontrar a seção "GitHub Pages"
4. Em "Source" (Fonte), selecione a branch principal (master ou main)
5. Clique em "Save" (Salvar)
6. Aguarde alguns minutos para que o GitHub Pages publique seu site

### 5. Acessar o site publicado

1. Após a publicação, o GitHub fornecerá um URL para seu site
2. O URL geralmente segue o formato: `https://SEU-USUARIO.github.io/neolayer3d/`
3. Acesse este URL para verificar se o site foi publicado corretamente

## Atualizando o Site

Para fazer atualizações no site após a publicação inicial:

1. Faça as alterações necessárias nos arquivos locais
2. Adicione as alterações ao Git:
   ```
   git add .
   ```
3. Faça um novo commit:
   ```
   git commit -m "Descrição das alterações"
   ```
4. Envie as alterações para o GitHub:
   ```
   git push
   ```
5. O GitHub Pages atualizará automaticamente o site em alguns minutos

## Solução de Problemas Comuns

### O site não aparece ou mostra erro 404

- Verifique se a branch correta está selecionada nas configurações do GitHub Pages
- Certifique-se de que existe um arquivo `index.html` na raiz do repositório
- Aguarde alguns minutos, pois o GitHub Pages pode levar um tempo para processar as alterações

### Imagens ou recursos não carregam

- Verifique se os caminhos para imagens e outros recursos estão corretos (use caminhos relativos)
- Certifique-se de que todos os arquivos de recursos foram enviados para o GitHub

### Problemas com JavaScript ou funcionalidades dinâmicas

- Abra o console do navegador para verificar se há erros de JavaScript
- Certifique-se de que todas as bibliotecas externas estão sendo carregadas corretamente

## Observações Importantes

- O GitHub Pages hospeda apenas sites estáticos, então todas as funcionalidades dinâmicas são simuladas no lado do cliente
- O armazenamento de dados é feito localmente no navegador do usuário através do localStorage
- Para manter os dados de produtos atualizados, você precisará editar os arquivos JSON e fazer novos commits

## Recursos Adicionais

- [Documentação oficial do GitHub Pages](https://docs.github.com/pt/pages)
- [Guia de uso do Git](https://git-scm.com/book/pt-br/v2)
- [Documentação do localStorage](https://developer.mozilla.org/pt-BR/docs/Web/API/Window/localStorage)

Em caso de dúvidas ou problemas, sinta-se à vontade para abrir uma issue no repositório do GitHub ou entrar em contato com o desenvolvedor.
