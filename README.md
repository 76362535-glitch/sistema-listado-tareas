# Sistema Web de Listado de Tareas

Aplicación web desarrollada con **Node.js**, **Express**, **HTML**, **CSS**, **JavaScript**, persistencia en archivo **JSON**, pruebas con **Jest/Supertest** y despliegue con **Docker**.

## Funcionalidades

- Crear tareas.
- Editar tareas.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas.
- Filtrar por todas, pendientes o completadas.
- Buscar por título o descripción.
- Mostrar estadísticas.
- Persistir datos en `data/tasks.json`.

## Requisitos

- Node.js 20 o superior.
- npm.
- Docker Desktop (opcional).

## Instalación local

```bash
npm install
npm start
```

Abrir:

```text
http://localhost:3000
```

## Pruebas

```bash
npm test
```

Cobertura:

```bash
npm run test:coverage
```

## Docker

Construir y ejecutar:

```bash
docker build -t sistema-listado-tareas .
docker run -p 3000:3000 sistema-listado-tareas
```

Con Docker Compose:

```bash
docker compose up --build
```

## API REST

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/tasks` | Lista todas las tareas |
| GET | `/api/tasks/:id` | Obtiene una tarea |
| POST | `/api/tasks` | Crea una tarea |
| PUT | `/api/tasks/:id` | Actualiza una tarea |
| PATCH | `/api/tasks/:id/toggle` | Cambia el estado |
| DELETE | `/api/tasks/:id` | Elimina una tarea |
| GET | `/api/health` | Verifica el servicio |

## Flujo recomendado de Git

```bash
git init
git checkout -b develop
git add .
git commit -m "feat: aplicación inicial de listado de tareas"

git checkout -b feature/interfaz
git add .
git commit -m "feat: mejora de interfaz"

git checkout develop
git merge feature/interfaz

git checkout -b main
```

## Estructura

```text
sistema-listado-tareas/
├── .github/workflows/ci.yml
├── data/tasks.json
├── public/
├── src/
├── tests/
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```
