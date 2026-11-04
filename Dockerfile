# Stage 1: Build React frontend
FROM node:22-alpine AS frontend-build

WORKDIR /frontend

COPY frontend/package*.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build


# Stage 2: Backend application
FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY backend/package*.json ./

RUN npm ci --omit=dev

COPY backend/ .

COPY --from=frontend-build /frontend/dist ./public

EXPOSE 8080

CMD ["npm", "start"]