const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

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

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
});
