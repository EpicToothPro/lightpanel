FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json tsconfig.json next.config.ts postcss.config.mjs eslint.config.mjs ./
RUN npm ci || npm install
COPY public ./public
COPY src ./src
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
COPY package*.json ./
RUN npm ci --only=production || npm install --only=production
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts

EXPOSE 3000
CMD ["npm", "start"]
