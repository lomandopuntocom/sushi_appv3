FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY index.html ./
COPY vite.config.js ./
COPY public ./public
COPY img ./public/img
COPY src ./src

RUN npm run build

EXPOSE 5173

CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]
