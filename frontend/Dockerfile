FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]