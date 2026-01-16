# Use the official Node.js 18 image (Alpine is smaller/faster)
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Compile TypeScript to JavaScript
RUN npm run build

# Expose the API port
EXPOSE 3001

# Command to start the server
CMD ["npm", "run", "start"]