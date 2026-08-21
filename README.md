# User Management System

Aplicacao full-stack para gerenciamento de usuarios com CRUD completo, usando Node.js/Express no backend e React 19 com TypeScript no frontend.

## Arquitetura

O projeto segue separacao clara entre backend e frontend:

```text
server/
  app.ts                  # Configuracao do Express
  controllers/            # Orquestracao HTTP
  db/                     # Repositorio em memoria
  routes/                 # Rotas REST
  types/                  # DTOs e tipos do backend

src/
  components/             # Componentes de UI
  context/                # Estado global com Context API
  services/               # Cliente HTTP do frontend
  types.ts                # Tipos do frontend

tests/
  integration/            # Testes de integracao da API
  unit/                   # Testes unitarios de repositorio e servico
```

Fluxo principal:

```text
React UI -> src/services/userService.ts -> Express -> userController -> inMemoryStore
```

## API

Base: `/api/users`

- `GET /api/users`
- `GET /api/users/stats`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/status`
- `DELETE /api/users/:id`
- `POST /api/users/reset`
- `GET /api/health`

## Desenvolvimento

```bash
npm install
npm run dev
```

Aplicacao local: `http://localhost:3000`

## Testes e build

```bash
npm run test
npm run lint
npm run build
npm run start
```

## Docker

O Docker Compose sobe dois servicos independentes:

- `api`: backend Express puro, sem servir assets do frontend
- `web`: frontend estatico em Nginx, com proxy de `/api` para `api:3000`

Subir tudo:

```bash
docker compose up --build -d
```

Com os containers em execucao:

- Frontend: `http://localhost:3000`
- API direta: `http://localhost:3001/api/health`
- API via frontend/proxy: `http://localhost:3000/api/health`

Parar:

```bash
docker compose down
```

## Testes automatizados

Os testes existentes cobrem:

- Repositorio em memoria
- Servico HTTP do frontend
- Fluxo de integracao da API
