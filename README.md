# 📅 API de Gestão de Reservas

API RESTful completa para gerenciamento institucional de reservas de salas, laboratórios e auditórios.

Desenvolvida com Node.js, Express, PostgreSQL e Sequelize, seguindo arquitetura **Service-Repository Pattern** com separação clara de responsabilidades.

---

## 🚀 Tecnologias

| Tecnologia | Finalidade |
|---|---|
| **Node.js** | Runtime JavaScript |
| **Express.js** | Framework web |
| **PostgreSQL** | Banco de dados relacional |
| **Sequelize ORM** | Mapeamento objeto-relacional |
| **JWT** | Autenticação stateless |
| **bcrypt** | Hash de senhas |
| **Swagger/OpenAPI** | Documentação interativa |
| **Helmet** | Segurança HTTP |
| **CORS** | Cross-Origin Resource Sharing |
| **express-async-errors** | Tratamento de erros assíncronos |
| **dotenv** | Variáveis de ambiente |

---

## 📁 Estrutura do Projeto

```
src/
├── config/
│   ├── database.js       # Configuração Sequelize/PostgreSQL
│   ├── swagger.js        # Configuração OpenAPI/Swagger
│   └── auth.js           # Configuração JWT
│
├── controllers/          # Camada HTTP (req/res)
├── services/             # Regras de negócio
├── repositories/         # Acesso ao banco de dados
├── models/               # Modelos Sequelize
├── routes/               # Definição das rotas + Swagger JSDoc
├── middlewares/          # Auth, RBAC, erros, validações
├── validations/          # Validação de entrada por entidade
├── utils/                # ApiError, jwtUtils, dateUtils
│
├── app.js                # Configuração Express
└── server.js             # Entrypoint da aplicação

database/
├── migrations/           # Migrations do banco
└── seeders/              # Dados iniciais
```

---

## ⚙️ Instalação

### Pré-requisitos

- Node.js >= 18.x
- PostgreSQL >= 14.x
- npm >= 9.x

### Clonar e instalar dependências

```bash
git clone <url-do-repositorio>
cd reservas-api
npm install
```

---

## 🔧 Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:

```env
# Server
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=reservas_db
DB_USER=postgres
DB_PASS=postgres

# JWT
JWT_SECRET=seu_segredo_super_seguro_aqui
JWT_EXPIRES_IN=8h

# BCrypt
BCRYPT_ROUNDS=12
```

---

## 🗄️ Banco de Dados

### Criar banco

```bash
# Via psql
createdb reservas_db

# Ou no psql
CREATE DATABASE reservas_db;
```

### Executar migrations

```bash
npm run db:migrate
```

### Popular dados iniciais

```bash
npm run db:seed
```

### Reset completo (drop → migrate → seed)

```bash
npm run db:reset
```

---

## ▶️ Execução

### Desenvolvimento (com nodemon)

```bash
npm run dev
```

### Produção

```bash
npm start
```

A API estará disponível em: `http://localhost:3000`

---

## 📚 Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/api-docs
```

A interface Swagger permite:
- Visualizar todos os endpoints
- Testar requisições diretamente no navegador
- Informar o Bearer Token JWT para rotas protegidas
- Consultar schemas das entidades

---

## 🔐 Autenticação

A API utiliza **JWT (JSON Web Token)** via Bearer Token.

### Fluxo

1. Registrar ou fazer login → recebe `token`
2. Incluir o token no header de cada requisição protegida:

```
Authorization: Bearer <seu_token>
```

### Credenciais padrão (seed)

| Usuário | E-mail | Senha | Role |
|---|---|---|---|
| Administrador | admin@reservas.com | admin123 | ADMIN |
| Usuário Padrão | user@reservas.com | user123 | USER |

---

## 📋 Rotas da API

### 🔑 Auth

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/auth/register` | Registrar usuário | ❌ |
| POST | `/auth/login` | Login e obtenção do token | ❌ |

### 👤 Users

| Método | Rota | Descrição | Role |
|---|---|---|---|
| GET | `/users` | Listar usuários | ADMIN |
| GET | `/users/:id` | Buscar por ID | AUTH |
| PUT | `/users/:id` | Atualizar usuário | AUTH* |
| DELETE | `/users/:id` | Desativar usuário (soft delete) | AUTH* |

> *USER só pode atualizar/desativar a si mesmo

### 🏢 Rooms

| Método | Rota | Descrição | Role |
|---|---|---|---|
| GET | `/rooms` | Listar salas | AUTH |
| GET | `/rooms/available?start=&end=` | Salas disponíveis no período | AUTH |
| GET | `/rooms/:id` | Buscar por ID | AUTH |
| POST | `/rooms` | Criar sala | ADMIN |
| PUT | `/rooms/:id` | Atualizar sala | ADMIN |
| DELETE | `/rooms/:id` | Desativar sala (soft delete) | ADMIN |

### 📅 Reservations

| Método | Rota | Descrição | Role |
|---|---|---|---|
| GET | `/reservations` | Listar todas as reservas | ADMIN |
| GET | `/reservations/my` | Minhas reservas | AUTH |
| GET | `/reservations/room/:roomId` | Agenda de uma sala | AUTH |
| POST | `/reservations` | Criar reserva | AUTH |
| DELETE | `/reservations/:id` | Cancelar reserva | AUTH* |

> *USER só pode cancelar as próprias reservas

---

## 📦 Exemplos de Requisições

### Registrar usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Maria Souza",
    "email": "maria@email.com",
    "password": "senha123"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@reservas.com",
    "password": "admin123"
  }'
```

### Criar sala (ADMIN)

```bash
curl -X POST http://localhost:3000/rooms \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sala 301",
    "type": "SALA",
    "capacity": 35,
    "location": "Bloco A, 3º Andar"
  }'
```

### Buscar salas disponíveis

```bash
curl -X GET "http://localhost:3000/rooms/available?start=2025-08-15T09:00:00.000Z&end=2025-08-15T11:00:00.000Z" \
  -H "Authorization: Bearer <token>"
```

### Criar reserva

```bash
curl -X POST http://localhost:3000/reservations \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "roomId": 1,
    "startDateTime": "2025-08-15T09:00:00.000Z",
    "endDateTime": "2025-08-15T11:00:00.000Z"
  }'
```

### Listar salas com filtro e paginação

```bash
curl -X GET "http://localhost:3000/rooms?type=LABORATORIO&page=1&limit=5" \
  -H "Authorization: Bearer <token>"
```

### Cancelar reserva

```bash
curl -X DELETE http://localhost:3000/reservations/1 \
  -H "Authorization: Bearer <token>"
```

---

## 🧠 Regras de Negócio

### ✅ Horário de funcionamento
Reservas permitidas apenas entre **07:00 e 22:00**.

### ✅ Datas passadas
Não é permitido criar reservas em datas/horários passados.

### ✅ Conflito de horários
A API detecta e bloqueia reservas sobrepostas na mesma sala.

Lógica: `newStart < existingEnd && newEnd > existingStart`

### ✅ Controle de acesso (RBAC)
- **ADMIN**: acesso total
- **USER**: acesso limitado às próprias reservas

### ✅ Soft Delete
Usuários e salas são desativados (`active = false`), não excluídos fisicamente.

---

## 📐 Padrão de Resposta

### Sucesso

```json
{
  "success": true,
  "message": "Operação realizada com sucesso",
  "data": { ... }
}
```

### Erro

```json
{
  "success": false,
  "message": "Descrição do erro"
}
```

### Paginação

```json
{
  "success": true,
  "data": {
    "data": [ ... ],
    "total": 25,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

## 🏥 Health Check

```
GET /health
```

```json
{
  "success": true,
  "message": "API de Gestão de Reservas está operacional",
  "timestamp": "2025-08-15T10:00:00.000Z",
  "environment": "development"
}
```

---

## 🔒 Segurança

- Senhas protegidas com **bcrypt** (12 rounds)
- **Helmet** para headers HTTP seguros
- **CORS** configurado
- JWT com expiração configurável
- Erros internos não expostos ao cliente

---

## 🧪 Códigos HTTP utilizados

| Código | Significado |
|---|---|
| 200 | OK |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 409 | Conflict |
| 500 | Internal Server Error |
