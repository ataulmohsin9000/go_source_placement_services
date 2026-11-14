FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json ./backend/package.json
COPY frontend/package.json ./frontend/package.json
RUN npm ci

COPY backend ./backend
COPY frontend ./frontend

RUN npx prisma generate --schema=backend/prisma/schema.prisma
RUN npm run build:backend

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=./backend"]
