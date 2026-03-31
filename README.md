# 🏫 Sistema de Gestión de Inventario Escolar - API Backend

> Proyecto de Grado - Universidad Católica de Pereira

Este repositorio contiene la lógica de servidor y API REST para el sistema de control de activos institucionales. Construido con una arquitectura modular, segura y escalable.

## 🚀 Tecnologías Utilizadas

| Tecnología | Propósito |
| :--- | :--- |
| **Node.js** | Entorno de ejecución de JavaScript |
| **Express** | Framework web para la creación de la API |
| **Prisma ORM** | Gestión y modelado de la base de datos |
| **PostgreSQL** | Motor de base de datos relacional |
| **JWT** | Autenticación segura basada en tokens |
| **Bcrypt.js** | Encriptación de contraseñas de alta seguridad |

## 🛠️ Características Principales

- **RBAC (Control de Acceso Basado en Roles):** Implementación de permisos diferenciados para `ADMIN`, `COORDINADOR` y `DOCENTE`.
- **Seguridad Robusta:** Middlewares de validación de tokens JWT en rutas protegidas.
- **Relaciones de Datos:** Gestión compleja entre Usuarios, Productos y el historial de Préstamos.
- **Integridad de Stock:** Sistema de triggers lógicos para descontar/aumentar stock según aprobaciones.

## 📋 Pasos para la Instalación

1. **Clonar el repositorio e instalar dependencias:**
   ```bash
   npm install
   ```

2. **Configurar el archivo de entorno (`.env`):**
   Crea un archivo `.env` en la raíz con lo siguiente:
   ```env
   DATABASE_URL="postgresql://USUARIO:PASSWORD@localhost:5432/inventario_db?schema=public"
   JWT_SECRET="tu_clave_secreta_super_segura"
   PORT=4000
   ```

3. **Sincronizar la Base de Datos con Prisma:**
   ```bash
   npx prisma migrate dev --name init
   ```

4. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   *El servidor correrá en: `http://localhost:4000`*

## 👤 Autor
- **Nombre:** Sebastian Patiño
- **Institución:** Universidad Católica de Pereira
