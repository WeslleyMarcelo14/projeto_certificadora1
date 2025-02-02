# Sistema de Gestão e Controle de Tarefas e Estoque

O **Sistema de Gestão e Controle de Tarefas e Estoque** foi concebido para atender organizações que necessitam de uma plataforma centralizada para gerenciar tarefas e doações de estoque. Ele organiza e automatiza processos de registro, acompanhamento e edição de dados, oferecendo funcionalidades específicas para administradores e usuários comuns.

O sistema é dividido em módulos que incluem:

- Controle de tarefas
- Controle de estoque
- Gerenciamento de usuários
- Gerenciamento de produtos

O foco do sistema é garantir usabilidade e eficiência para todos os tipos de usuários.

---

## Tecnologias Utilizadas

### **Stack Principal:**

- **Next.js** (v15.1.6)
- **TailwindCSS** (com suporte a animações via `tailwindcss-animate`)
- **Shadcn** (componentes estilizados)
- **Radix-UI** (com suporte ao tema via `@radix-ui/themes`)

### **Autenticação:**

- **Next-Auth** (v4.24.11) - Login com Google configurado para restringir acesso a usuários da organização UTFPR (`@alunos.utfpr.edu.br`).

### **Bibliotecas Adicionais:**

- `autoprefixer` (v10.4.20)
- `class-variance-authority` (v0.7.1)
- `clsx` (v2.1.1)
- `lucide-react` (v0.474.0)
- `react-icons` (v5.4.0)
- `tailwind-merge` (v2.6.0)

---

## Configuração de Autenticação

Atualmente, o sistema permite login **apenas para usuários da organização UTFPR**, com e-mails no domínio `@alunos.utfpr.edu.br`. Isso elimina a necessidade de gerenciar mecanismos de recuperação de senha, como SMTP ou métodos de recuperação por telefone/e-mail, e simplifica a experiência do usuário.

Para liberar o acesso de usuários externos, basta configurar o **Google** para receber um público-alvo externo (ou remover a verificação de domínio).

---

## Configuração de Cores

A paleta de cores do projeto foi selecionada a partir dos posts do Instagram [@bonsfluidosutfpr](https://www.instagram.com/bonsfluidosutfpr/) e pode ser editada em `tailwind.config.ts`.

Exemplo de cores atuais:

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

As variáveis de ambiente utilizadas devem ser configuradas no arquivo `.env`, por exemplo:

```env
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
PORT=4000
FORCE_ADMIN=true
```

---

## Funcionalidades Principais

### **1. Módulo de Tarefas:**

- Criação, edição e exclusão de tarefas
- Acompanhamento do progresso de tarefas
- Organização por status e prioridades

### **2. Módulo de Estoque:**

- Registro de itens doados
- Controle de quantidade e estado do estoque
- Relatórios detalhados sobre entradas e saídas

### **3. Gerenciamento de Usuários:**

- Administração de permissões (administrador ou usuário comum)
- Visualização de atividades realizadas por usuários

---

## Pré-requisitos e Instalação

### **Requisitos do Sistema:**

- Node.js (v18 ou superior)
- Gerenciador de pacotes (NPM ou Yarn)

### **Passos para Instalação:**

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
   GOOGLE_CLIENT_ID=seu_client_id
   GOOGLE_CLIENT_SECRET=seu_client_secret
   ```

4. **Execute o servidor de desenvolvimento:**

   ```bash
   npm run dev
   ```

5. Acesse o sistema em: [http://localhost:3000](http://localhost:3000)

---

## Uso via Docker

Este projeto possui um **`docker-compose.yml`** e um **`Dockerfile`** na raiz, além de estar disponível como uma imagem pré-compilada no **Docker Hub**:
[**othallys/certificadora1**](https://hub.docker.com/r/othallys/certificadora1)

Existem duas formas de rodar a aplicação via Docker:

### **1. Usando o `Dockerfile` e `docker-compose.yml` Localmente**

1. Garanta que você tenha o **Docker** e **Docker Compose** instalados.
2. Ajuste seu `.env` com as variáveis de ambiente necessárias.
3. Na raiz do projeto, rode:

   ```bash
   docker compose up -d
   ```

4. O Next.js subirá na porta definida (por exemplo, **4000**).
5. Acesse: [http://localhost:4000](http://localhost:4000).

### **2. Usando a Imagem Pronta do Docker Hub**

Se você **não deseja compilar** localmente, basta usar a imagem **`othallys/certificadora1:latest`**:

```yaml
version: "3.8"

services:
  nextjs:
    image: othallys/certificadora1:latest
    ports:
      - "4000:4000"
    environment:
      GOOGLE_CLIENT_ID: "seu_client_id"
      GOOGLE_CLIENT_SECRET: "seu_client_secret"
      NEXTAUTH_SECRET: "uma_secret_qualquer"
      PORT: 4000
```

> Se você precisar de um banco de dados PostgreSQL, inclua também o serviço no `docker-compose.yml` (por exemplo, `postgres`) e defina `DATABASE_URL` conforme necessário.

Para **atualizar** quando houver uma nova versão no Docker Hub:

```bash
docker compose pull
docker compose up -d
```
