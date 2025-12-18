FROM node:20-bullseye

# Встановлюємо інструменти для збірки (потрібні для sqlite3)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential python3 git ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Копіюємо файли залежностей
COPY package*.json ./

# Встановлюємо залежності
RUN npm ci --production

# КЛЮЧОВИЙ МОМЕНТ: Примусова перезбірка sqlite3 під Linux
RUN npm rebuild sqlite3

COPY . .

# Папка для бази даних та файлів (має збігатися з mountPath у k8s)
RUN mkdir -p /data && chown node:node /data
# Якщо ваш код шукає БД в /app/uploads, залиште як було, 
# але в deployment.yaml у вас вказано /data

RUN mkdir -p /app/uploads

EXPOSE 8081

CMD ["node", "server.js"]