# Babba — Backend de monitoreo IoT en tiempo real

Backend desarrollado con Node.js y Express para recibir, procesar y almacenar datos de sensores relacionados con salud y seguridad. El sistema permite registrar información de acelerómetro, giroscopio, ritmo cardíaco y SpO2, además de generar alertas y transmitir datos en tiempo real usando Supabase.

## Tecnologías

- Node.js
- Express.js
- Supabase
- PostgreSQL
- Supabase Realtime
- REST API

## Funcionalidades

- Recepción de datos de acelerómetro y giroscopio.
- Recepción de datos de ritmo cardíaco y SpO2.
- Detección de posibles caídas o movimientos bruscos mediante umbrales.
- Registro de alertas en Supabase.
- Transmisión de datos en tiempo real a clientes suscritos.
- Arquitectura backend desacoplada para integrarse con una app móvil.

## Instalación

```bash
git clone https://github.com/Hhurtadoabcx/babba-sv.git
cd babba-sv
npm install