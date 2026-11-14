FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY backend/package.json ./backend/package.json

# Install dependencies workspace-wide
RUN npm ci

# Copy the backend source code
COPY backend ./backend

# Generate Prisma client and build
RUN npx prisma generate --schema=backend/prisma/schema.prisma
RUN npm run build:backend

EXPOSE 3000

CMD ["npm", "run", "start", "--workspace=./backend"]