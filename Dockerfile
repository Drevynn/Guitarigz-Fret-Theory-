# Multi-stage Dockerfile for Guitarigz (Express + Vite + Node)
# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests
COPY package.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Build Vite frontend assets and bundle server.ts via esbuild
RUN npm run build

# Stage 2: Production Runner
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package definition and installed dependencies
COPY package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Expose web server port
EXPOSE 3000

# Launch server
CMD ["node", "dist/server.cjs"]
