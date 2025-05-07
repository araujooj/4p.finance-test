# 4p.finance - Projeto de Teste

Este monorepo contém um sistema de banco digital simples que permite que usuários realizem transações (depósitos e saques).

## Estrutura do Projeto

- `apps/frontend`: Frontend do sistema bancário com React (vite)
- `apps/nodejs-transaction-test`: Backend do sistema bancário
- `shared/schemas`: Esquemas Zod compartilhados entre frontend e backend

## Como executar o frontend

todo

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

### Executando Migrações do Banco de Dados

Antes de iniciar o servidor, é necessário executar as migrações do banco de dados:

```bash
# Gerar migrações a partir do schema
pnpm db:generate

# Aplicar migrações ao banco de dados SQLite
pnpm db:migrate
```

### Iniciando o Servidor de Desenvolvimento

Para iniciar o servidor de desenvolvimento com hot-reload:

```bash
pnpm dev
```

Este comando:

1. Executa as migrações do banco de dados
2. Inicia o compilador TypeScript em modo watch para os schemas compartilhados
3. Inicia o servidor backend

### Visualizando o Banco de Dados

Para visualizar o banco de dados SQLite através da interface do Drizzle Studio:

```bash
pnpm db:studio
```

## API Endpoints

- **POST /users**: Criar um novo usuário
- **GET /users/:userId**: Obter detalhes de um usuário, incluindo saldo
- **POST /users/:userId/deposit**: Realizar um depósito
- **POST /users/:userId/withdraw**: Realizar um saque
- **GET /users/:userId/statement**: Obter extrato de transações

## Tecnologias Utilizadas

- Node.js + Express
- TypeScript
- SQLite + Drizzle ORM
- Zod para validação de dados
