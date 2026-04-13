# ---- Etapa 1: Build ----
FROM node:22-slim AS builder

WORKDIR /app

# Instalar dependencias necesarias para Prisma/OpenSSL
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copiar archivos esenciales
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependencias (solo para build)
RUN npm install --force

# Copiar el código fuente
COPY . .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar Next.js en modo producción
RUN npm run build


# ---- Etapa 2: Runtime ----
FROM node:22-alpine AS runner

WORKDIR /app

# Instalar OpenSSL (necesario para Prisma)
RUN apk add --no-cache openssl

# Copiar lo necesario desde builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/public ./public
COPY --from=builder /app/scripts ./scripts




# Iniciar app
CMD ["npm", "run", "start"]
