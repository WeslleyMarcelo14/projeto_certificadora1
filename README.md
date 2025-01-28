# Sistema de Gestão e Controle de Tarefas e Estoque

## Descrição do Projeto

O **Sistema de Gestão e Controle de Tarefas e Estoque** foi concebido para atender organizações que necessitam de uma plataforma centralizada para gerenciar tarefas e doações de estoque. Ele organiza e automatiza processos de registro, acompanhamento e edição de dados, oferecendo funcionalidades específicas para administradores e usuários comuns.

O sistema é dividido em módulos que incluem:

- Controle de tarefas
- Controle de estoque
- Gerenciamento de usuários
- Gerenciamento de produtos

O foco do sistema é garantir usabilidade e eficiência para todos os tipos de usuários.

---

## Tecnologias Utilizadas

O projeto utiliza as seguintes tecnologias e bibliotecas:

### **Stack Principal:**

- **Next.js** (v15.1.6)
- **TailwindCSS** (com suporte a animações via `tailwindcss-animate`)
- **Shadcn** (componentes estilizados)
- **Radix-UI** (com suporte ao tema via `@radix-ui/themes`)

### **Autenticação:**

- **Next-Auth** (v4.24.11) - Login com Google configurado para restringir acesso a usuários da organização UTFPR (@alunos.utfpr.edu.br).

### **Bibliotecas Adicionais:**

- `autoprefixer` (v10.4.20) - Processamento de CSS
- `class-variance-authority` (v0.7.1) - Gerenciamento de classes CSS
- `clsx` (v2.1.1) - Manipulação condicional de classes
- `lucide-react` (v0.474.0) - Ícones modernos e customizáveis
- `react-icons` (v5.4.0) - Biblioteca de ícones adicionais
- `tailwind-merge` (v2.6.0) - Mesclagem de classes CSS do Tailwind

---

## Configuração de Autenticação

Atualmente, o sistema permite login **apenas para usuários da organização UTFPR** com e-mails no domínio `@alunos.utfpr.edu.br`. Isso foi configurado para garantir um ambiente seguro e controlado para o público-alvo principal: **alunos e professores da UTFPR**.

Essa escolha elimina a necessidade de implementar e gerenciar mecanismos de recuperação de senha, como SMTP ou métodos de recuperação por telefone/e-mail, simplificando a experiência do usuário. Utilizar o Google como provedor de autenticação resolve esses problemas de forma eficiente e segura.

### **Opção de Público Externo:**

Caso o projeto seja replicado, é possível alterar a configuração para permitir o login de usuários externos. Isso pode ser feito marcando a opção de público-alvo externo na configuração da API do Google.

---

## Configuração de Cores

A paleta de cores do projeto foi cuidadosamente selecionada a partir dos posts do Instagram [@bonsfluidosutfpr](https://www.instagram.com/bonsfluidosutfpr/). Ela pode ser facilmente editada no arquivo `tailwind.config.ts`. As cores atuais configuradas no projeto incluem:

```javascript
  theme: {
    extend: {
      colors: {
        softPink: "#FBF6F7", // branco rosado bem claro
        lightPink: "#F3BAC6", // rosa claro
        earthyRed: "#BC5349", // vermelho terroso
        vibrantPink: "#F25363", // rosa avermelhado vibrante
        mediumPink: "#DD5F69" // rosa médio com tom avermelhado
      }
    }
  }
```

Você pode visualizar a paleta completa na imagem abaixo:

![Paleta de Cores](./public/colors.jpg)

---

## Variáveis de Ambiente

As variáveis de ambiente utilizadas no projeto devem ser configuradas no arquivo `.env`. Exemplo:

```env
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=seu_client_id
GOOGLE_CLIENT_SECRET=seu_client_secret
```

---

## Funcionalidades Principais

### **1. Módulo de Tarefas:**

- Criação, edição e exclusão de tarefas.
- Acompanhamento do progresso de tarefas.
- Organização por status e prioridades.

### **2. Módulo de Estoque:**

- Registro de itens doados.
- Controle de quantidade e estado do estoque.
- Relatórios detalhados sobre entradas e saídas.

### **3. Gerenciamento de Usuários:**

- Administração de permissões de acesso (administrador ou usuário comum).
- Visualização de atividades realizadas por usuários.

---

## Pré-requisitos e Instalação

### **Requisitos do Sistema:**

- Node.js (v18 ou superior)
- Gerenciador de pacotes (NPM ou Yarn)

### **Passos para Instalação:**

1. Clone o repositório:

   ```bash
   git clone https://github.com/seu-repositorio.git
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Configure as variáveis de ambiente no arquivo `.env`:

   ```env
   GOOGLE_CLIENT_ID=seu_client_id
   GOOGLE_CLIENT_SECRET=seu_client_secret
   ```

4. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

5. Acesse o sistema em: [http://localhost:3000](http://localhost:3000)
