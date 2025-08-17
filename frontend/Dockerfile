# UI5 Frontend Dockerfile
FROM node:20

# Working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy all source code
COPY . .

# UI5 tooling dev-server opens port 8080 by default
EXPOSE 8080

# Start command
CMD ["npm", "start"]
