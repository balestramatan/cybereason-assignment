# Use Node.js for the backend
FROM node:16

# Set working directory
WORKDIR /usr/src/app

# Copy backend dependencies
COPY yarn*.json ./

# Install dependencies
RUN yarn install

# Copy backend source code
COPY . .

# Expose backend port
EXPOSE 3001

# Start the backend server
CMD ["npm", "run", "start:dev"]