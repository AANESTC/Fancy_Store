# Use Node.js to build and serve the React frontend
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package.json files from the frontend directory
COPY fancy-store-client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the frontend source code
COPY fancy-store-client/ ./

# Build the Vite React app for production
RUN npm run build

# Install a simple Node.js static file server
RUN npm install -g serve

# Expose the port (Render will automatically bind to this)
EXPOSE 3000

# Start the server, serving the 'dist' directory and handling React Router (-s)
CMD ["serve", "-s", "dist", "-l", "3000"]
