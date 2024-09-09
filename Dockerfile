FROM node:22.0.0-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
# RUN npx prisma db push
# RUN npx prisma db seed
CMD ["npm", "run", "start"]
EXPOSE 8000


