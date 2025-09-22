# Petshop App Monorepo

Este repositorio contiene una aplicación completa de comercio electrónico para una tienda de mascotas. El proyecto está organizado como un monorepo gestionado con pnpm e incluye:

- **apps/api**: API REST construida con NestJS y Prisma.
- **apps/web**: Frontend construido con Next.js 13 (App Router) y Tailwind CSS.
- **docker-compose.yml**: Entorno de desarrollo local con base de datos PostgreSQL.

## Requisitos

- Node.js >= 18
- pnpm >= 8
- Docker y Docker Compose (opcional, para levantar los servicios)

## Scripts principales

```bash
pnpm install       # instala dependencias en todos los paquetes
pnpm dev:api       # levanta la API en modo desarrollo
pnpm dev:web       # levanta la aplicación web en modo desarrollo
pnpm build         # construye todos los paquetes
pnpm lint          # ejecuta linters en todos los paquetes
pnpm test          # ejecuta pruebas en todos los paquetes
```

## Uso con Docker

```bash
docker-compose up --build
```

Esto levantará la API, la aplicación web y una base de datos PostgreSQL.

## Estructura del repositorio

```
petshop-app/
├── apps/
│   ├── api/
│   └── web/
├── docker-compose.yml
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
└── README.md
```

Cada aplicación incluye su propio README y scripts específicos.
