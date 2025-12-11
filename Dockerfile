FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files and tsconfig
COPY package*.json ./
COPY tsconfig*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files and tsconfigs
COPY package*.json ./
COPY tsconfig*.json ./

# Install production dependencies
RUN npm install --only=production --legacy-peer-deps

# Copy Prisma schema and migrations
COPY prisma ./prisma/

# Copy built application
COPY --from=builder /app/dist ./dist


EXPOSE 3000

ENV NODE_ENV=production

# Generate Prisma client in production
RUN npx prisma generate --schema=./prisma/schema.prisma

# Start app
CMD npx prisma generate --schema=./prisma/schema.prisma && npx prisma db push && node dist/src/main.js
