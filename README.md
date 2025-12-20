# Music Catalog — Course Project (Web Programming)

**Коротко:** простий бекенд (Node.js + Express + SQLite) і фронтенд (React) для керування каталогом музичних треків та плейлистів. Проєкт створено як курсової роботи з предмету *Веб програмування*.



## запуск бекенду
cd D:\VScode\WEB2\services\catalog-service
npm ci
node server.js
http://localhost:8081. Health: GET /health. API: /tracks, /playlists.

## запуск фронтенду
cd D:\VScode\WEB2\frontend-react
npm run dev
http://localhost:5173

## Docker / Kubernetes

Dockerfile: services/catalog-service/Dockerfile (образ під Debian — сумісність з sqlite3).

Kubernetes manifests: services/catalog-service/k8s/ (namespace, configmap, secret, deployment, service).

Для локального тесту з minikube:

cd services/catalog-service
minikube image build -t catalog-service:local .
kubectl apply -f k8s/
kubectl -n catalog-ns rollout restart deployment/catalog-deployment
kubectl -n catalog-ns get pods

## Документація

## Архітектура системи
![System Architecture](./diagrams/architecture.png)

API contract: docs/api/openapi.yaml

ADR & architecture: docs/adr/*

REPORT (повний звіт): REPORT.md

Що реалізовано

CRUD для tracks і playlists

Idempotency / X-Request-Id / Retry-підхід (base)

Health & Metrics endpoints

React SPA з базовими сторінками: Tracks, Track Details, Playlists, Now Playing

Dockerfile + Kubernetes manifests