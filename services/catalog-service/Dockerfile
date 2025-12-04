# Використовуємо Debian, бо sqlite3 не працює на Alpine
FROM node:20

WORKDIR /app

# Копіюємо package*.json
COPY package*.json ./

# Встановлюємо залежності (НЕ production, бо потрібно зібрати sqlite3)
RUN npm install

# Копіюємо увесь проєкт
COPY . .

# Створюємо місце для бази даних
RUN mkdir -p /data

ENV PORT=8081
ENV DB_PATH=/data/catalog.db

EXPOSE 8081

CMD ["node", "server.js"]
