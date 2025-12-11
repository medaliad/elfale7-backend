FROM node:20-alpine AS builder

WORKDIR /app

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

# Copy package files and tsconfigs
COPY package*.json ./
COPY tsconfig*.json ./

# Install production dependencies and ts-node for seeding
RUN npm install --only=production --legacy-peer-deps && npm install --no-save ts-node

# Copy Prisma schema and migrations
COPY prisma ./prisma/

# Copy built application
COPY --from=builder /app/dist ./dist

# Copy templates
COPY --from=builder /app/src/templates ./src/templates

EXPOSE 3000

ENV NODE_ENV=production

# Generate Prisma client in production
RUN npx prisma generate --schema=./prisma/schema.prisma

# Start app
CMD npx prisma generate --schema=./prisma/schema.prisma && npx prisma db push && NODE_ENV=production npx prisma db seed && node dist/src/main.js
