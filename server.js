const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');
const os = require('os');

const app = express();
const PORT = 3000;
const SUPABASE_URL = 'https://qbymoxgxlzamxhonbwdd.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFieW1veGd4bHphbXhob25id2RkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUzODQ4MjcsImV4cCI6MjAzMDk2MDgyN30.BlsOkzyg0m4KnjEqWvA7SkeEMbrKF0bJKJgGU6ghOas';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

app.use(bodyParser.json());

let accelerometerGyroscopeData;
let heartRateSpo2Data;
const ACCELERATION_THRESHOLD = 12.6;

app.post('/send-sensor-data/accelerometer-gyroscope', async (req, res) => {
  accelerometerGyroscopeData = req.body;
  console.log('Datos de giroscopio y acelerómetro recibidos:', accelerometerGyroscopeData);

  try {
    await sendCombinedDataToSupabase();
  } catch (err) {
    console.error('Error enviando datos a Supabase:', err.message);
    res.sendStatus(500);
    return;
  }

  const { ax, ay, az } = accelerometerGyroscopeData;
  if (Math.abs(ax) > ACCELERATION_THRESHOLD || Math.abs(ay) > ACCELERATION_THRESHOLD || Math.abs(az) > ACCELERATION_THRESHOLD) {
    console.log('¡Alerta de movimiento brusco detectado!');
    try {
      await triggerAlertChannel();
      await storeNotification('Alerta de movimiento brusco detectado!');
    } catch (err) {
      console.error('Error al guardar la notificación en Supabase:', err.message);
      res.sendStatus(500);
      return;
    }
  }

  res.sendStatus(200);
});

app.post('/send-sensor-data/heart-rate-spo2', async (req, res) => {
  heartRateSpo2Data = req.body;
  console.log('Datos de ritmo cardíaco y SpO2 recibidos:', heartRateSpo2Data);

  try {
    await sendCombinedDataToSupabase();
    res.sendStatus(200);
  } catch (err) {
    console.error('Error enviando datos a Supabase:', err.message);
    res.sendStatus(500);
  }
});

// Definir la ruta raíz
app.get('/', (req, res) => {
  res.send('¡Bienvenido a la API de Babba!');
});

async function sendCombinedDataToSupabase() {
  const combinedPayload = {
    accelerometerGyroscopeData: accelerometerGyroscopeData,
    heartRateSpo2Data: heartRateSpo2Data
  };
  console.log('Broadcasting data via Supabase:', JSON.stringify(combinedPayload, null, 2));
  await supabase.channel('room-1').send({
    type: 'broadcast',
    event: 'new-data',
    payload: combinedPayload,
  });
}

async function triggerAlertChannel() {
  await supabase.channel('alerts').send({
    type: 'broadcast',
    event: 'movement-alert',
    payload: { alert: true }
  });
}

async function storeNotification(message) {
  const { data, error } = await supabase
    .from('notificaciones')
    .insert([
      {
        timestamp: new Date().toISOString(),
        mensaje: message,
        device_id: 'DEVICE123'
      }
    ]);

  if (error) {
    throw new Error(error.message);
  }
}

const interfaces = os.networkInterfaces();
let ipAddress;
for (const key in interfaces) {
  for (const interface of interfaces[key]) {
    if (interface.family === 'IPv4' && !interface.internal) {
      ipAddress = interface.address;
      break;
    }
  }
  if (ipAddress) break;
}

if (!ipAddress) {
  console.error('No se pudo encontrar una dirección IPv4 válida.');
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`Server running at http://${ipAddress}:${PORT}`);
});
