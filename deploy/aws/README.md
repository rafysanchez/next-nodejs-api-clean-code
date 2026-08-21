# AWS Deploy Notes

Este projeto ficou preparado para um deploy simples em AWS com:

- `web` em container Nginx
- `api` em container Node.js
- `PostgreSQL` fora do Compose, preferencialmente em RDS

## Topologia recomendada

Para um MVP, a topologia mais simples e coerente com o projeto atual e:

1. `Amazon ECS Fargate` para os containers `web` e `api`
2. `Amazon RDS for PostgreSQL` para persistencia
3. `Amazon ECR` para armazenar as imagens
4. `Application Load Balancer` na frente do servico `web`

## Variaveis importantes

- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DATABASE_URL` opcional
- `API_UPSTREAM`

## Estrategia de deploy

### Opcao A: um task ECS com dois containers

- `api` exposta apenas internamente na porta `3000`
- `web` exposta na porta `80`
- `API_UPSTREAM=http://127.0.0.1:3000`

Essa opcao preserva o proxy `/api` do Nginx e exige menos mudanca estrutural.

### Opcao B: dois servicos ECS separados

- `web` em um servico
- `api` em outro servico
- `API_UPSTREAM` apontando para o endpoint interno/publico da API

Essa opcao escala melhor separadamente, mas adiciona um pouco mais de configuracao.

## Build das imagens

```bash
docker build --target api -t your-registry/next-nodejs-api-clean-code-api:latest .
docker build --target web -t your-registry/next-nodejs-api-clean-code-web:latest .
```

## Observacoes

- O banco local do Compose nao deve ir para producao.
- Em AWS, use seguranca de rede para permitir conexao do `api` ao RDS.
- O endpoint `/api/health` ja pode ser usado como health check da API.
