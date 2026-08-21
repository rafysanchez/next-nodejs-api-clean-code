# AGENTS.md - Diretrizes de Arquitetura e Engenharia para LLMs e Agentes

Este documento orienta agentes autonomos e desenvolvedores sobre as regras arquiteturais, convencoes de codigo e fluxo de dados estabelecidos neste projeto.

---

## 1. Principios Arquiteturais Fundamentais

1. **Separacao rigida Backend vs. Frontend**
   - `/server`: contem regra de negocio, validacoes HTTP, bootstrap de banco e persistencia.
   - `/src`: contem interface React, estado via Context API e componentes de apresentacao.
   - **Regra**: o frontend nunca acessa o banco diretamente nem replica logica de persistencia. Toda mutacao passa por `/src/services/userService.ts`, consumindo as rotas REST em `/api/users`.

2. **Clean Architecture e Repository Pattern**
   - Os controladores em `/server/controllers` orquestram request/response.
   - Os repositorios em `/server/db` abstraem acesso ao armazenamento.
   - O projeto usa PostgreSQL como persistencia principal por meio de `userRepository.ts`.
   - O bootstrap de schema e seed fica em `postgres.ts` e `seedUsers.ts`.

3. **Containers como runtime padrao**
   - O ambiente local padrao e `docker compose` com tres servicos: `db`, `api` e `web`.
   - O container `web` usa Nginx e faz proxy de `/api` para o backend via `API_UPSTREAM`.
   - O container `db` e apenas para desenvolvimento local. Em cloud, a referencia e um banco gerenciado.

4. **Tipagem e contratos**
   - Backend: `/server/types/user.ts`
   - Frontend: `/src/types.ts`
   - As interfaces devem permanecer alinhadas entre backend, frontend e persistencia.

---

## 2. Mapeamento de Responsabilidades por Diretorio

| Diretorio | Responsabilidade | O que DEVE conter | O que NAO deve conter |
| :--- | :--- | :--- | :--- |
| `/server/db` | Camada de dados | Queries SQL, mapeamento de linhas, bootstrap do PostgreSQL, seed inicial | Logica HTTP (`req`/`res`) |
| `/server/controllers` | Orquestracao HTTP | Validacoes de entrada, status codes, chamadas ao repositorio | SQL inline ou manipulacao de estado de UI |
| `/server/routes` | Mapeamento de rotas Express | Endpoints REST (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) | Regra de negocio inline |
| `/src/services` | Cliente HTTP do frontend | Classes/metodos assincromos com `fetch` tipado | Hooks React, acesso ao DOM, acesso a banco |
| `/src/context` | Gerenciamento de estado | Context API, cache local, toasts, sincronizacao com `userService` | `fetch` bruto espalhado |
| `/src/components` | Interface visual | Componentes acessiveis e responsivos | Chamadas de rede diretas |
| `/tests` | Suite automatizada | Testes unitarios e de integracao | Codigo de producao |
| `/deploy/aws` | Documentacao de deploy | Notas de arquitetura e configuracao para AWS | Codigo de runtime da aplicacao |
| `/docker` | Scripts auxiliares de containers | Entrypoints e scripts shell de inicializacao | Regra de negocio da aplicacao |

---

## 3. Persistencia e Banco de Dados

Estado atual:

- O projeto nao usa mais armazenamento em memoria.
- O repositorio ativo e `/server/db/userRepository.ts`.
- A conexao com o PostgreSQL fica em `/server/db/postgres.ts`.
- O seed inicial fica em `/server/db/seedUsers.ts`.

Regras:

- Toda alteracao de estrutura de `User` deve refletir:
  1. `/server/types/user.ts`
  2. `/src/types.ts`
  3. schema/bootstrap em `/server/db/postgres.ts`
  4. CRUD SQL em `/server/db/userRepository.ts`
  5. seed em `/server/db/seedUsers.ts`, se aplicavel
  6. formulario e visualizadores no frontend
  7. testes automatizados

- O campo `email` deve permanecer unico no banco e na validacao de controller.
- O campo `status` deve aceitar apenas `active`, `inactive` ou `pending`.
- O nome deve continuar com minimo de 3 caracteres.

---

## 4. Padrao de Testes Automatizados

Arquivos principais:

- Repositorio: `/tests/unit/userRepository.test.ts`
- Servico HTTP do frontend: `/tests/unit/userService.test.ts`
- Integracao: `/tests/integration/userApi.test.ts`

Comandos:

```bash
npm run test
npm run test:unit
npm run test:integration
npm run test:watch
```

Observacoes importantes:

- Os testes usam PostgreSQL real.
- Os testes de integracao usam `supertest` para exercitar endpoints HTTP reais do Express.
- O `vitest` foi configurado para executar arquivos sem paralelismo (`fileParallelism: false` e `maxWorkers: 1`) para evitar disputa entre suites que resetam a mesma tabela.
- Se novos testes mexerem no banco, preserve isolamento usando `userRepository.reset()` ou estrategia equivalente.

---

## 5. Runtime Local e Docker

Stack local esperada:

- `db`: PostgreSQL 16 em container
- `api`: Node.js/Express
- `web`: Nginx servindo o build do frontend e proxyando `/api`

Arquivos relevantes:

- `Dockerfile`
- `docker-compose.yml`
- `nginx.conf.template`
- `docker/nginx-entrypoint.sh`
- `.env.example`

Regras:

- Nao hardcode hostname de backend no frontend estatico; use `API_UPSTREAM` no Nginx.
- Para desenvolvimento local, `API_UPSTREAM=http://api:3000`.
- Health checks devem continuar simples e usar `/api/health`.

---

## 6. Preparacao para AWS

Direcao atual do projeto:

- Containers publicados em registry
- Banco gerenciado fora do Compose
- Topologia alvo para MVP: `ECR + ECS Fargate + RDS PostgreSQL`

Arquivos relevantes:

- `.env.aws.example`
- `docker-compose.aws.yml`
- `/deploy/aws/README.md`

Regras:

- O Postgres em container local nao deve ser tratado como estrategia de producao.
- Em AWS, prefira RDS PostgreSQL.
- Se `web` e `api` rodarem no mesmo task ECS, use `API_UPSTREAM=http://127.0.0.1:3000`.
- Se rodarem separados, `API_UPSTREAM` deve apontar para o endpoint interno da API.

---

## 7. Regras para Novas Features criadas por LLMs

- **Adicionar novos campos em usuarios**
  1. Atualize `/server/types/user.ts` e `/src/types.ts`.
  2. Atualize schema/bootstrap em `/server/db/postgres.ts`.
  3. Atualize CRUD SQL em `/server/db/userRepository.ts`.
  4. Atualize validacoes em `/server/controllers/userController.ts`.
  5. Atualize seed em `/server/db/seedUsers.ts`, se o campo fizer parte do dataset inicial.
  6. Atualize `UserFormModal.tsx`, `UserDetailsModal.tsx`, `UserTable.tsx` e outros componentes afetados.
  7. Atualize ou crie testes.

- **Alterar comportamento de persistencia**
  - Mantenha controller desacoplado de SQL.
  - Nao espalhe acesso ao `pool` fora de `/server/db`.
  - Preserve contratos REST existentes, salvo mudanca explicitamente pedida.

- **Alterar deploy/containerizacao**
  - Preserve compatibilidade com `docker compose` local.
  - Se mexer no Nginx, valide tanto `localhost:3000/api/health` quanto `localhost:3001/api/health`.

- **Validacoes obrigatorias no backend**
  - Email unico: HTTP `409`
  - Nome com minimo de 3 caracteres: HTTP `400`
  - Status valido (`active`, `inactive`, `pending`): HTTP `400`
