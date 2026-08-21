# AGENTS.md — Diretrizes de Arquitetura e Engenharia para LLMs & Agentes

Este documento orienta agentes autônomos de IA e desenvolvedores sobre as regras arquiteturais, convenções de código e fluxo de dados estabelecidos neste projeto.

---

## 🏛️ 1. Princípios Arquiteturais Fundamentais

1. **Separação Rígida Backend vs. Frontend**:
   - `/server`: Contém toda a regra de negócio, validações de requisição HTTP, modelos de dados e persistência.
   - `/src`: Contém a interface do usuário em React, gerenciamento de estado via Context API e componentes de apresentação.
   - **Regra**: O Frontend **nunca** acessa a base de dados diretamente ou replica lógica de validação de persistência. Toda mutação passa por `/src/services/userService.ts` que consome as rotas REST (`/api/users`).

2. **Clean Architecture & Repository Pattern**:
   - Os controladores (`/server/controllers`) orquestram requisições e respostas.
   - Os repositórios (`/server/db`) abstraem o armazenamento (atualmente em memória com `InMemoryUserRepository`, preparado para troca por banco SQL/NoSQL sem tocar nos controladores).

3. **Tipagem e Contratos**:
   - Backend: `/server/types/user.ts` (DTOs como `CreateUserDTO`, `UpdateUserDTO`, `UserQueryParams`).
   - Frontend: `/src/types.ts` (Contratos de UI, formulários, modais e notificações).

---

## 📂 2. Mapeamento de Responsabilidades por Diretório

| Diretório | Responsabilidade | O que DEVE conter | O que NÃO deve conter |
| :--- | :--- | :--- | :--- |
| `/server/db` | Camada de Acesso a Dados | Métodos de CRUD, filtros, ordenação e estado em memória | Lógica de HTTP (Express `req`/`res`) |
| `/server/controllers` | Orquestração HTTP | Validações de entrada, status codes (`200`, `201`, `400`, `404`, `409`, `500`) | Acesso direto a queries brutas ou estado de UI |
| `/server/routes` | Mapeamento de Rotas Express | Definição de endpoints REST (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) | Lógica de negócio inline |
| `/src/services` | Clientes HTTP do Frontend | Classes e métodos assíncronos com `fetch` tipado | Hooks do React ou manipulação de DOM |
| `/src/context` | Gerenciamento de Estado | React Context (`UserContext`), caching de dados, Toasts | Chamadas `fetch` brutas não encapsuladas |
| `/src/components` | Componentes de Interface | Componentes visuais atômicos, acessíveis e responsivos com Tailwind | Chamadas de rede diretas |
| `/tests` | Suíte de Testes Automatizados | Testes unitários de repositório, serviços e testes de integração | Código de produção |

---

## 🧪 3. Padrão de Testes Automatizados (Vitest)

Ao implementar ou alterar novas funcionalidades, siga o padrão de testes existente:
- **Testes Unitários de Repositório**: `/tests/unit/userRepository.test.ts`
- **Testes Unitários de Serviços**: `/tests/unit/userService.test.ts`
- **Testes de Integração de API**: `/tests/integration/userApi.test.ts`

### Como rodar os testes:
```bash
npm run test          # Executa todos os testes e exibe sumário
npm run test:watch    # Modo interativo para desenvolvimento TDD
```

---

## 🛡️ 4. Regras para Novas Features criadas por LLMs

- **Adicionar Novos Campos em Usuários**:
  1. Atualize a interface em `/server/types/user.ts` e `/src/types.ts`.
  2. Atualize os métodos de criação e atualização em `/server/db/inMemoryStore.ts`.
  3. Atualize o validador no `userController.ts`.
  4. Adicione o campo no formulário `UserFormModal.tsx` e visualizadores `UserDetailsModal.tsx` / `UserTable.tsx`.
  5. Crie ou atualize o teste correspondente em `/tests/unit/userRepository.test.ts`.

- **Validações Obrigatórias no Backend**:
  - E-mail único (retornar HTTP 409 em duplicidade).
  - Nome com no mínimo 3 caracteres (retornar HTTP 400).
  - Status válido (`active`, `inactive`, `pending`).
