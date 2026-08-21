# User Management System

Aplicacao full-stack para gerenciamento de usuarios com CRUD completo, usando Node.js/Express no backend, React 19 com TypeScript no frontend e PostgreSQL como persistencia.

## Arquitetura

O projeto segue separacao clara entre backend e frontend:

```text
server/
  app.ts                  # Configuracao do Express
  controllers/            # Orquestracao HTTP
  db/                     # Bootstrap e repositorio PostgreSQL
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
React UI -> src/services/userService.ts -> Express -> userController -> userRepository -> PostgreSQL
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

1. Instale dependencias: `npm install`
2. Suba o banco: `docker compose up -d db`
3. Rode a aplicacao: `npm run dev`

Aplicacao local: `http://localhost:3000`

## Variaveis de ambiente

Copie `.env.example` e ajuste se necessario:

- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL` opcional

## Testes e build

```bash
npm run test
npm run test:unit
npm run test:integration
npm run lint
npm run build
npm run start
```

## Docker

O Docker Compose sobe tres servicos:

- `db`: PostgreSQL com volume persistente
- `api`: backend Express
- `web`: frontend estatico em Nginx com proxy para `/api`

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

## AWS

O projeto ficou preparado para AWS com configuracao de upstream dinamica no Nginx:

- local: `API_UPSTREAM=http://api:3000`
- ECS com `web` e `api` no mesmo task: `API_UPSTREAM=http://127.0.0.1:3000`
- ECS com servicos separados: `API_UPSTREAM` apontando para o endpoint interno da API

Arquivos adicionados:

- `.env.aws.example`
- `docker-compose.aws.yml`
- `deploy/aws/README.md`

## Testes automatizados

Os testes existentes cobrem:

- Repositorio PostgreSQL
- Servico HTTP do frontend
- Fluxo de integracao HTTP da API com Express
- Validacoes de entrada (`400`), duplicidade (`409`) e recursos ausentes (`404`)
