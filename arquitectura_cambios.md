## Problemas detectados en el repositorio original

Durante el análisis inicial se detectaron varios problemas estructurales:

- Acoplamiento entre módulos de dominio y autenticación.
- Flujo de creación de productos fragmentado en múltiples endpoints.
- Lógica de persistencia mezclada con lógica de negocio.
- Ausencia de eventos de dominio para desacoplar módulos.
- Dependencia directa entre módulos.

# Cambios y decisiones de arquitectura

Durante el desarrollo se realizaron una serie de ajustes y mejoras en la
arquitectura del proyecto con el objetivo de mejorar el desacoplamiento
entre módulos, simplificar el flujo de creación de entidades y facilitar
la evolución del sistema.

## Variables de entorno

Se eliminaron las variables de por defecto que exponian en el codigo diferentes accesos.

## Configuración de CORS

Se agregó configuración de **CORS** en el backend para permitir el consumo de la API.

## Unificación del proceso de creación de productos

Se unificó la creación de productos para que pueda realizarse **mediante
una única request**.

Anteriormente el flujo requería: 1. Crear el producto 2. Crear los
detalles del producto en una request separada

Este enfoque dificultaba la consistencia de los datos y el manejo de
eventos.

Con el nuevo flujo: - Un producto se crea **completamente en una sola
operación** - Incluye toda la información necesaria para ser listado
inmediatamente

Esto facilita además el disparo de eventos de dominio asociados a la
creación del producto.

## Aislamiento de la lógica del ORM

Se aisló la lógica relacionada con el ORM en repositorios dedicados.

La lógica de acceso a datos se centralizó en:

product.repository.ts

Esto permite:

-   Reducir el acoplamiento entre servicios y la implementación del ORM
-   Facilitar una futura migración a otro ORM
-   Evitar que cambios de un ORM a otro afecten en múltiples partes del sistema

En esta arquitectura:

-   **Repository** → acceso a datos
-   **Service** → lógica de negocio y orquestación

## Eventos de dominio implementados

Se implementaron dos eventos principales del dominio:

### product.created
Se emite cuando un producto es creado.

Consumidores:
- Servicio de eventos SSE para notificar al frontend.
- Permite que otros módulos reaccionen sin depender de ProductService.

### product.variation.created
Se emite cuando se crea una variación de producto.

Consumidor:
- InventoryService, que crea automáticamente el registro de inventario correspondiente.

Motivación:
Esto permite desacoplar el inventario del módulo de productos.

## Consumidores de eventos

Los eventos se consumen mediante `@OnEvent` utilizando `EventEmitter2`.

Esto permite que distintos módulos reaccionen a cambios del dominio sin depender directamente entre sí.

Ejemplo:

- InventoryEvents escucha `product.variation.created`
- EventsModule escucha `product.created` 
- ProductEvents escucha ambos

## Comunicación asincrónica con el frontend

Para reflejar cambios derivados de eventos de dominio se implementó Server Sent Events (SSE).

El backend expone un endpoint:

/events

El frontend mantiene una conexión persistente mediante `EventSource`.

Cuando ocurre un evento de dominio el backend lo publica y el frontend actualiza el catálogo automáticamente.

## Gestión de eventos SSE

Se creó un módulo dedicado para la gestión de eventos:

events

Este módulo es responsable de:

-   Emitir eventos SSE
-   Mantener la conexión con los clientes
-   Notificar cambios en tiempo real al frontend

De esta forma la lógica de comunicación en tiempo real queda separada de la lógica de negocio.

## Módulo de inventario

Se creó el módulo:

inventory

Este módulo es responsable de la gestión del inventario de las
variaciones de productos.

Además se agregaron endpoints para crear **variaciones de producto**, lo que permite introducir un segundo evento de dominio.

Al crear una variación de producto se emite el evento:

product.variation.created

Este evento es utilizado para generar automáticamente un registro de inventario asociado. **Inventory no debe saber de la existencia de ProductService**

Esto mantiene los módulos desacoplados y facilita la extensión del sistema.

## Ejecutar el proyecto

### Backend

cd backend
npm install
npm run start:dev

Para uso local realizar los siguientes pasos:

1) Ejecutar los siguientes comandos

Vamos a realizar la migracion de la base de datos de forma local

```bash
npm run migration:run
```

Creamos todas las entidades y datos necesarios para el uso del la base de datos y el sistema

```bash
npm run seed:run
```

2) Ir a typeOrm.config.ts y descomentar el siguinte apartado
```
export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10),
  database: process.env.DATABASE_NAME,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  entities: [process.env.DATABASE_ENTITIES],
  migrations: ['dist/database/migration/history/*.js'],
  logger: 'simple-console',
  synchronize: false, // never use TRUE in production!
  logging: true, // for debugging in dev Area only
};
```

y luego comentar el siguiente codigo (Para utilizar la conexion con supabase)

```
 export const dataSourceOptions: DataSourceOptions = {
   type: 'postgres',
   url: process.env.DATABASE_URL,
   ssl: { rejectUnauthorized: false },
   entities: [process.env.DATABASE_ENTITIES],
   migrations: ['dist/database/migration/history/*.js'],
   logger: 'simple-console',
   synchronize: false,
   logging: true,
 };
```

### Base de datos

Se utilizó PostgreSQL (Supabase).
Configurar variables de entorno en `.env`.