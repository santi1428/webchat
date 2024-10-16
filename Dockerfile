FROM node:22.0.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production 
RUN npm install --global pm2
RUN npm install @prisma/client
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 8000
USER node
CMD [ "pm2-runtime", "npm", "--", "start" ]
