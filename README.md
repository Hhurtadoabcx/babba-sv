# Babba — Backend de monitoreo IoT en tiempo real

Backend desarrollado con **Node.js** y **Express.js** para recibir, procesar y transmitir datos de sensores relacionados con salud y seguridad.

El sistema recibe datos de acelerómetro, giroscopio, ritmo cardíaco y SpO2, genera alertas cuando detecta movimientos bruscos y transmite información en tiempo real mediante Supabase.

## Tecnologías utilizadas

- Node.js
- Express.js
- JavaScript
- Supabase
- PostgreSQL
- Supabase Realtime
- REST API

## Funcionalidades principales

- Recepción de datos de acelerómetro y giroscopio.
- Recepción de datos de ritmo cardíaco y SpO2.
- Detección de posibles caídas o movimientos bruscos mediante umbrales.
- Registro de notificaciones en Supabase.
- Broadcast de datos en tiempo real usando Supabase Realtime Channels.
- Backend desacoplado para integrarse con una aplicación móvil.

## Flujo general

```txt
Sensores / App móvil
        ↓
API Express
        ↓
Procesamiento de datos
        ↓
Supabase PostgreSQL + Realtime Channels
        ↓
Clientes suscritos / alertas
```

## Endpoints principales

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Verifica que la API esté activa |
| POST | `/send-sensor-data/accelerometer-gyroscope` | Recibe datos de acelerómetro y giroscopio |
| POST | `/send-sensor-data/heart-rate-spo2` | Recibe datos de ritmo cardíaco y SpO2 |

## Variables de entorno

Crea un archivo `.env` basado en `.env.example`.

```env
SUPABASE_URL=tu_url_de_supabase
SUPABASE_KEY=tu_clave_de_supabase
PORT=3000
```

## Instalación y ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/Hhurtadoabcx/babba-sv.git
cd babba-sv
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Ejecutar el servidor

```bash
npm start
```

La API se ejecutará por defecto en:

```txt
http://localhost:3000
```

## Ejemplo de payload

### Acelerómetro y giroscopio

```json
{
  "ax": 13.2,
  "ay": 1.4,
  "az": 9.8,
  "gx": 0.1,
  "gy": 0.2,
  "gz": 0.3
}
```

### Ritmo cardíaco y SpO2

```json
{
  "heartRate": 78,
  "spo2": 97
}
```

## Estado del proyecto

Proyecto académico/prototipo orientado a practicar integración entre backend, datos de sensores, Supabase y transmisión en tiempo real.

## Aprendizajes

- Diseño de endpoints REST con Express.
- Manejo de datos provenientes de sensores.
- Integración con Supabase.
- Uso de Realtime Channels.
- Detección básica de alertas por umbral.
