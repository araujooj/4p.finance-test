# 4p.finance - Projeto de Teste

Este monorepo contém um sistema de banco digital simples que permite que usuários realizem transações (depósitos e saques).

## Estrutura do Projeto

- `apps/frontend`: Frontend do sistema bancário com React (vite)
- `apps/nodejs-transaction-test`: Backend do sistema bancário
- `shared/schemas`: Esquemas Zod compartilhados entre frontend e backend

## Como Executar o Backend

### Pré-requisitos

- Node.js (versão recomendada: 18+)
- pnpm (gerenciador de pacotes)

### Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
pnpm install
```

### Iniciando o Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento com hot-reload:

```bash
pnpm dev:backend
```

Este comando automaticamente:

1. Executa as migrações do banco de dados SQLite
2. Inicia o compilador TypeScript em modo watch para os schemas compartilhados
3. Inicia o servidor backend

Não é necessário executar comandos de migração separadamente.

## Como executar o frontend

Depois de iniciar o servidor de desenvolvimento do backend, você pode iniciar o frontend:

```bash
pnpm dev:frontend
```

Isso inicia o frontend em modo hot-reload, conectado a API do backend em `http://localhost:3000`.

### Visualizando o Banco de Dados

Para visualizar o banco de dados SQLite através da interface do Drizzle Studio:

```bash
pnpm db:studio
```

### Executando os Testes

Para rodar os testes automatizados do backend:

```bash
pnpm test:backend
```

Isso executa todos os testes, incluindo testes de serviços, rotas e proteção contra race conditions.

## API Endpoints

### Usuários

- **POST /users**: Criar um novo usuário
- **GET /users/:userId**: Obter detalhes de um usuário, incluindo saldo

### Transações

- **POST /users/:userId/deposit**: Realizar um depósito
- **POST /users/:userId/withdraw**: Realizar um saque
- **GET /users/:userId/statement**: Obter extrato de transações
  - Parâmetro opcional: `?includeDeleted=true` para incluir transações excluídas

### Gerenciamento de Transações

- **PUT /users/transactions/:transactionId**: Atualizar uma transação existente
- **DELETE /users/transactions/:transactionId**: Excluir uma transação (exclusão lógica)
- **POST /users/transactions/:transactionId/restore**: Restaurar uma transação excluída

## Tecnologias Utilizadas

### Backend

- Node.js + Express
- TypeScript
- SQLite + Drizzle ORM
- Zod para validação de dados
- Vitest para testes automatizados

### Frontend

- React com TypeScript
- Vite (ferramenta de build)
- Tailwind CSS para estilização
- Radix UI para componentes
- TanStack Query para gerenciamento de estado e cache
- Zod para validação de formulários
- NUQS para gerenciamento de estado via parâmetros de URL
- Context API para gerenciamento de estado global
