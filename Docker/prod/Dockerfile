# Stage 1: Build the frontend
FROM node:22-alpine AS frontend-builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY frontend/package*.json ./frontend/
RUN npm ci --prefix frontend

COPY frontend ./frontend
RUN npm run build --prefix frontend


# Stage 2: Run the application
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev

COPY backend ./backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

USER node

EXPOSE 5000

CMD ["npm", "start"]