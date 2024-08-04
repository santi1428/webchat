FROM node:22.0.0-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8000
RUN npm run build
CMD ["npm", "run", "start"]
