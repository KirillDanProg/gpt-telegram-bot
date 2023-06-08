# Используем официальный образ Node.js в качестве базового образа
FROM node:16-alpine

# Установка директории приложения внутри контейнера
WORKDIR /app

# Копирование зависимостей проекта
COPY package*.json ./

# Установка зависимостей
RUN npm ci

# Копирование остальных файлов проекта
COPY . .

ENV PORT=3000

EXPOSE $PORT

# Install pm2 globally
RUN npm install -g pm2

# Установка команды запуска приложения
CMD ["pm2-runtime", "start", "./src/main.js", "--name", "tg-bot"]
