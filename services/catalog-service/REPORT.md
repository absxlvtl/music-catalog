Music Catalog Microservice (Kubernetes + Docker + Minikube)
# Загальна інформація

Проєкт реалізує мікросервіс Catalog Service для роботи з музичними альбомами, що підтримує CRUD-операції, збереження у SQLite та експонує API через HTTP.
Сервіс контейнеризований у Docker та задеплоєний у Kubernetes (Minikube).

# Архітектура проєкту

Проєкт складається з одного мікросервісу:
Catalog Service (Node.js)

Реалізує API:

GET /albums
GET /albums/:id
POST /albums
PUT /albums/:id
DELETE /albums/:id
GET /health-check

Сервіс використовує:

ConfigMap — конфігурація (порт, назва БД)
Secret — секретні ключі (токени, паролі)
Persistent Volume (внутрішній каталог /data) — сховище SQLite
Deployment — керування Pod-ами
Service (NodePort) — відкриває доступ до API
Архітектурна ASCII-схема наведена нижче у звіті.

# Технології

Node.js 20
Express.js
SQLite3
Docker
Kubernetes (Minikube)
Kubectl
Docker Desktop
YAML Kubernetes manifests

# Dockerfile

FROM node:20

WORKDIR /app
COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p /data

EXPOSE 3000
CMD ["node", "server.js"]

# DEPLOY (покрокове розгортання)
1 Запуск Minikube
minikube start --driver=docker

2 Активувати Docker всередині Minikube
minikube -p minikube docker-env --shell powershell | Invoke-Expression

3 Створення образу
docker build -t catalog-service:local .

4 Завантажити образ у Minikube
minikube image load catalog-service:local

5 Застосувати Kubernetes Manifests
kubectl apply -f k8s/

6 Перевірка Pod'ів
kubectl get pods -n catalog-ns

7 Перегляд логів
kubectl logs -n catalog-ns <pod-name>

8 Отримати URL сервісу
minikube service catalog-service -n catalog-ns --url

# Health Check

GET /health-check

Очікується відповідь:
{ "status": "OK" }

Це потрібно для Kubernetes probes.

# Архітектурна ASCII-схема
                  +---------------------+
                  |     User / Client   |
                  +----------+----------+
                             |
                             v
                +------------+-------------+
                | Kubernetes Node (Minikube)|
                +------------+-------------+
                             |
               +-------------+-------------+
               |      Pod: Catalog API     |
               |  (Node.js + Express + DB) |
               +-------------+-------------+
                             |
        +--------------------+----------------------+
        |                                            |
+-------v-------+                           +--------v--------+
|  ConfigMap    |                           |    Secret       |
| (PORT, DB)    |                           | (TOKEN, KEY)    |
+---------------+                           +-----------------+
                             |
                             v
                    +--------+--------+
                    |   SQLite DB     |
                    |   /data volume  |
                    +-----------------+
                             |
                             v
             +---------------+----------------+
             | Service (NodePort 32000)       |
             +---------------+----------------+
                             |
                             v
                   External Network Access

# Висновок

У проєкті реалізовано повноцінний мікросервіс каталогу музики з контейнеризацією Docker та розгортанням у Kubernetes.
Використано ключові ресурси: Deployment, Service, Namespace, Secret, ConfigMap та persistent volume.

Сервіс може масштабуватись, конфігуруватись без перекомпіляції, керуватись Kubernetes, що відповідає вимогам курсової роботи.