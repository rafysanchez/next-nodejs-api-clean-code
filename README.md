# 👥 User Management System — Full Stack Architecture & Developer Guide

Aplicação Full-Stack moderna para gerenciamento completo de usuários (CRUD), construída com **Node.js/Express**, **React 19**, **TypeScript**, **Tailwind CSS** e **Vitest**.

---

## 🚀 Visão Geral do Sistema

A aplicação foi desenvolvida seguindo os princípios de **Clean Architecture**, **Single Responsibility (SoC)** e **Repository Pattern**, garantindo separação completa entre a camada de backend e a camada de interface do usuário.

```
[ Navegador / React UI ]
        │  ▲
        │  │ (JSON / HTTP REST)
        ▼  │
 [ userService.ts ] ──► [ Express App (server.ts / server/app.ts) ]
                               │
                               ▼
                       [ userController.ts ]
                               │
                               ▼
                     [ inMemoryStore.ts ] (Repository Pattern)
```

---

## 📁 Estrutura de Diretórios Detalhada

```text
├── server/                          # 🟢 BACKEND (Node.js / Express / Clean Architecture)
│   ├── app.ts                       # Setup da aplicação Express e middlewares
│   ├── controllers/
│   │   └── userController.ts        # Controladores HTTP (validação de payloads, status code 200/201/400/404/409/500)
│   ├── db/
│   │   └── inMemoryStore.ts         # Camada de Dados em memória (Repository Pattern com filtragem e ordenação)
│   ├── routes/
│   │   └── userRoutes.ts            # Rotas REST (/api/users, /stats, /reset, /:id, etc.)
│   └── types/
│       └── user.ts                  # Entidades, DTOs e tipos exclusivos do servidor
│
├── src/                             # 🔵 FRONTEND (React 19 / Context API / Tailwind CSS)
│   ├── App.tsx                      # Dashboard principal e montagem dos componentes
│   ├── main.tsx                     # Entry point da aplicação React
│   ├── types.ts                     # Contratos de tipos do cliente
│   ├── index.css                    # Estilos globais e Tailwind v4
│   ├── components/                  # Componentes modulares desacoplados
│   │   ├── Header.tsx               # Topbar, busca e indicador de saúde do backend
│   │   ├── StatsCards.tsx           # Cards métricos interativos com filtros por status
│   │   ├── FilterBar.tsx            # Filtros dinâmicos por cargo, departamento, status e busca
│   │   ├── UserTable.tsx            # Tabela de dados responsiva com ações rápidas de CRUD
│   │   ├── UserGrid.tsx             # Visualização em cartões (cards)
│   │   ├── UserFormModal.tsx        # Modal de Criação / Edição com validação em tempo real
│   │   ├── UserDetailsModal.tsx     # Modal de visualização detalhada do perfil
│   │   ├── DeleteConfirmModal.tsx   # Modal de confirmação segura de exclusão
│   │   └── ToastContainer.tsx       # Sistema de notificações flutuantes (feedback UX)
│   ├── context/
│   │   └── UserContext.tsx          # Gerenciamento de estado global com React Context
│   └── services/
│       └── userService.ts           # Camada de cliente HTTP (abstração das chamadas fetch)
│
├── tests/                           # 🧪 SUÍTE DE TESTES AUTOMATIZADOS (Vitest)
│   ├── unit/
│   │   ├── userRepository.test.ts   # Testes unitários do repositório de dados
│   │   └── userService.test.ts      # Testes unitários do cliente de serviço frontend
│   └── integration/
│       └── userApi.test.ts          # Testes de integração do fluxo de rotas e CRUD
│
├── server.ts                        # Ponto de entrada do servidor (bootstrapping e Vite middleware)
├── vitest.config.ts                 # Configuração do Vitest
├── AGENTS.md                        # Guia de diretrizes arquiteturais para LLMs e Agentes de IA
└── README.md                        # Esta documentação
```

---

## 🛠️ Endpoints da API REST (`/api/users`)

| Método | Endpoint | Descrição |
| :--- | :--- | :--- |
| `GET` | `/api/users` | Lista usuários com suporte a busca (`search`), filtros (`role`, `department`, `status`) e ordenação (`sortBy`, `sortOrder`). |
| `GET` | `/api/users/stats` | Retorna métricas consolidadas (total, ativos, inativos, pendentes e distribuição por departamento/cargo). |
| `GET` | `/api/users/:id` | Retorna os detalhes de um usuário específico por ID. |
| `POST` | `/api/users` | Cadastra um novo usuário com validação de campos e prevenção de e-mail duplicado. |
| `PUT` | `/api/users/:id` | Atualiza os dados cadastrais de um usuário. |
| `PATCH` | `/api/users/:id/status` | Altera pontualmente o status do usuário (`active`, `inactive`, `pending`). |
| `DELETE` | `/api/users/:id` | Remove um usuário da base de dados. |
| `POST` | `/api/users/reset` | Restaura a base de dados de demonstração com os dados iniciais padrão. |

---

## 🧪 Testes Automatizados com Vitest

O projeto conta com suíte de testes unitários e de integração utilizando **Vitest**:

### Executando os testes:
```bash
# Executa todos os testes unitários e de integração uma única vez
npm run test

# Executa em modo interativo com Hot-Reload (TDD)
npm run test:watch
```

### Cobertura dos testes:
- **Repositório (`userRepository.test.ts`)**: Validação de CRUD completo, buscas multi-campos, filtros por cargo/departamento, ordenação e cálculo de métricas.
- **Serviço HTTP (`userService.test.ts`)**: Validação do encapsulamento de chamadas `fetch` e tratamento amigável de erros da API.
- **Integração (`userApi.test.ts`)**: Fluxo integrado ponta a ponta do ciclo de vida do usuário.

---

## 💻 Como Rodar o Projeto

```bash
# Instalar dependências
npm install

# Iniciar servidor em desenvolvimento (Frontend + Backend integrados)
npm run dev

# Executar suíte de testes
npm run test

# Compilar para produção
npm run build

# Iniciar em produção
npm run start
```
