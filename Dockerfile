# Stage 1: Build the React frontend
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY fancy-store-client/package*.json ./
RUN npm install
COPY fancy-store-client/ ./
RUN npm run build

# Stage 2: Prepare the Node.js backend + embed the built frontend
FROM node:20-alpine AS final
WORKDIR /app

# Copy backend files
COPY fancy-store-server/package*.json ./
RUN npm install --omit=dev
COPY fancy-store-server/ ./

# Copy the built React app into the expected location so server.js can serve it
COPY --from=frontend-build /frontend/dist /app/../fancy-store-client/dist

EXPOSE 5126
ENV NODE_ENV=production
ENV PORT=5126

CMD ["node", "server.js"]
