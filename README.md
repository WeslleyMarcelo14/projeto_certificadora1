# Sistema de Gestão e Controle de Tarefas e Estoque

O Sistema de Gestão e Controle de Tarefas e Estoque é uma plataforma completa para organizações que necessitam de um ambiente centralizado para gerenciar tarefas e controlar doações de estoque. Ele automatiza processos de registro, acompanhamento e edição de dados, oferecendo funcionalidades específicas para administradores e usuários comuns.

Acesse a aplicação web em: https://certificadora1.43464994.xyz/

# Projeto para Disciplina EC45G - Certificadora Da Competência 1 - C51 (2024_02)

# Integrantes
- Allan Vinicios Ferraz dos Santos
- Henry Ossamu Chida
- Thallys Silva dos Santos Correia
- Weslley Marcelo Pereira

## Sumário

- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Configuração de Autenticação](#configuração-de-autenticação)
- [Configuração de Cores](#configuração-de-cores)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Funcionalidades Principais](#funcionalidades-principais)
- [Pré-requisitos e Instalação](#pré-requisitos-e-instalação)
- [Uso via Docker](#uso-via-docker)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## Tecnologias Utilizadas

### Stack Principal

- **Next.js** (v15.1.6)
- **TailwindCSS** (com suporte a animações via `tailwindcss-animate`)
- **Shadcn** (componentes estilizados)
- **Radix-UI** (com suporte ao tema via `@radix-ui/themes`)

### Autenticação

- **Next-Auth** (v4.24.11) – Login com Google, restrito a usuários da organização UTFPR (`@alunos.utfpr.edu.br`).

### Bibliotecas Adicionais

- `autoprefixer` (v10.4.20)
- `class-variance-authority` (v0.7.1)
- `clsx` (v2.1.1)
- `lucide-react` (v0.474.0)
- `react-icons` (v5.4.0)
- `tailwind-merge` (v2.6.0)

---

## Configuração de Autenticação

O acesso ao sistema é permitido apenas para usuários com e-mail no domínio `@alunos.utfpr.edu.br`, garantindo segurança e simplicidade ao eliminar a necessidade de recuperação de senha. Para liberar o acesso a usuários externos, configure o Google para abranger um público maior ou remova a verificação de domínio.

---

## Configuração de Cores

A paleta de cores foi inspirada nos posts do Instagram [@bonsfluidosutfpr](https://www.instagram.com/bonsfluidosutfpr/) e pode ser personalizada em `tailwind.config.ts`.

Exemplo de configuração de cores:

```javascript
theme: {
  extend: {
    colors: {
      softPink: "#FBF6F7",
      lightPink: "#F3BAC6",
      earthyRed: "#BC5349",
      vibrantPink: "#F25363",
      mediumPink: "#DD5F69"
    }
  }
}
```

![Paleta de Cores](./public/colors.jpg)

---

## Variáveis de Ambiente

Configure as variáveis de ambiente no arquivo `.env`. Exemplo:

```env
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
PORT=4000
FORCE_ADMIN=true
```

---

## Funcionalidades Principais

### 1. Módulo de Estoque

- Registro de itens doados
- Controle de quantidade do estoque
- Registro dos produtos aceitos

### 3. Gerenciamento de Usuários

- Administração de permissões (administrador ou usuário comum)
- Monitoramento das atividades dos usuários

---

## Pré-requisitos e Instalação

### Requisitos do Sistema

- Node.js (v18 ou superior)
- Gerenciador de pacotes (NPM ou Yarn)

### Instalação

1. **Clone o repositório:**

   ```bash
   git clone https://github.com/seu-repositorio.git
   ```

2. **Instale as dependências:**

   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente no arquivo `.env`:**

   ```env
   NEXTAUTH_URL=http://localhost:3000/
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
   PORT=4000
   TOKEN_DOCKER=your_docker_token
   FORCE_ADMIN=true
   ```

4. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

5. **Acesse o sistema em:**
   [http://localhost:3000](http://localhost:3000)

---

## Uso via Docker

O projeto inclui um `docker-compose.yml` e um `Dockerfile` na raiz, além de uma imagem pré-compilada disponível no Docker Hub:
[**othallys/certificadora1**](https://hub.docker.com/r/othallys/certificadora1)

### Opções de Execução

#### 1. Localmente com Docker Compose

1. Certifique-se de ter Docker e Docker Compose instalados.
2. Configure as variáveis de ambiente no arquivo `.env`.
3. Na raiz do projeto, execute:

   ```bash
   docker compose up -d
   ```

4. Acesse o sistema na porta definida (ex.: [http://localhost:4000](http://localhost:4000)).

#### 2. Usando a Imagem do Docker Hub

Para executar sem compilar localmente, utilize a imagem `othallys/certificadora1:latest`:

```yaml
version: "3.8"

services:
  nextjs:
    image: othallys/certificadora1:latest
    ports:
      - "4000:4000"
    environment:
      NEXTAUTH_URL=http://localhost:3000/
      GOOGLE_CLIENT_ID=your_google_client_id
      GOOGLE_CLIENT_SECRET=your_google_client_secret
      NEXTAUTH_SECRET=your_nextauth_secret
      DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
      PORT=4000
      TOKEN_DOCKER=your_docker_token
      FORCE_ADMIN=true
```

> Para utilizar um banco de dados PostgreSQL, inclua o serviço correspondente no `docker-compose.yml` e configure a `DATABASE_URL` conforme necessário.

**Para conseguir a chave** https://console.cloud.google.com/ - Escolher a chave do tipo: OAuth 2.0 Client IDs

**Nota:** Substitua os valores de exemplo por suas credenciais reais. Nunca compartilhe informações sensíveis em repositórios públicos.

Para atualizar a imagem:

```bash
docker compose pull
docker compose up -d
```

---
