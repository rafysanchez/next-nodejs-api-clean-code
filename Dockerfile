FROM node:22-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder

COPY . .
RUN npm run build

FROM node:22-alpine AS api

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist/api.cjs ./dist/api.cjs
COPY --from=builder /app/dist/api.cjs.map ./dist/api.cjs.map

EXPOSE 3000

CMD ["npm", "run", "start:api"]

FROM nginx:1.27-alpine AS web

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/index.html /usr/share/nginx/html/index.html
COPY --from=builder /app/dist/assets /usr/share/nginx/html/assets

EXPOSE 80
