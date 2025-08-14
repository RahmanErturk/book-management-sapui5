# 1. Use Node.js 18 as the base image
FROM node:18

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json and package-lock.json
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application files
COPY . .

# 6. Build TypeScript files
RUN npm run build

# 7. Expose the application port
EXPOSE 3000

# 8. Start the application
CMD ["npm", "start"]
# 9. Seed the database (optional, can be run manually)
# RUN npm run seed