const express = require('express');
const app = express();
const PORT = 3000;
const winston = require('winston');
const net = require('net');

app.use(express.json());

// Attempt to connect to Logstash at container name 'logstash' port 5044
let logstashStream = null;
function connectLogstash() {
  try {
    logstashStream = net.createConnection({ host: 'logstash', port: 5044 }, () => {
      console.log('Conectado a Logstash');
    });
    logstashStream.on('error', (err) => {
      console.error('Error stream logstash:', err.message);
    });
  } catch (e) {
    console.error('Error al crear conexión a Logstash:', e.message);
  }
}
// try to connect; Logstash may not be ready immediately
connectLogstash();

// Winston logger: console + stream to Logstash (JSON lines)
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(info => {
      // build a JSON string for Logstash
      const obj = {
        "@timestamp": info.timestamp,
        level: info.level,
        message: info.message,
        metadata: info.meta || {}
      };
      return JSON.stringify(obj);
    })
  ),
  transports: [
    new winston.transports.Console()
  ]
});

// Helper to send to Logstash stream if available
function sendToLogstash(req, res, level, message, extra = {}) {
  if (logstashStream && !logstashStream.destroyed) {
    try {
      const payload = {
        // Campos pedidos (level y route)
        level,                                      // "INFO" | "WARN" | "ERROR"
        message,                                    // descripción
        route: req?.originalUrl || req?.url || "",  // ruta solicitada
        statusCode: res?.statusCode,                // código HTTP
        method: req?.method,                        

        // Cualquier dato adicional propio del evento
        ...extra
      };
      logstashStream.write(JSON.stringify(payload) + '\n');
    } catch (e) {
      console.error('No se pudo enviar a Logstash:', e.message);
    }
  }
}

// In-memory "DB"
let personas = [
  { id: 1, nombre: "Carlos", edad: 30 },
  { id: 2, nombre: "Ana", edad: 25 }
];

app.get('/personas', (req, res) => {
  const msg = 'Consulta de todas las personas';
  logger.info(msg);
  sendToLogstash(req, res, 'INFO', msg, {
    event: 'get_personas',
    personas_count: personas.length
  }); res.json(personas);
});

app.get('/personas/:id', (req, res) => {
  const persona = personas.find(p => p.id == req.params.id);
  if (!persona) {
    const msg = `Persona con ID ${req.params.id} no encontrada`;
    logger.warn(msg);
    // Seteamos el status antes de enviar para que statusCode quede en 404
    res.status(404);
    sendToLogstash(req, res, 'WARN', msg, {
      event: 'get_persona_not_found',
      id: req.params.id
    });
    return res.json({ error: "No encontrada" });
  }
  const msg = `Persona encontrada: ${persona.nombre}`;
  logger.info(msg);
  sendToLogstash(req, res, 'INFO', msg, {
    event: 'get_persona',
    id: persona.id,
    nombre: persona.nombre
  });
  res.json(persona);
});


app.post('/personas', (req, res) => {
  const nueva = req.body;
  if (!nueva || !nueva.id) {
    const msg = 'Payload inválido al crear persona';
    logger.error(msg);
    res.status(400);
    sendToLogstash(req, res, 'ERROR', msg, {
      event: 'create_persona_invalid',
      payload: nueva
    });
    return res.json({ error: 'Payload inválido: requiere "id" y "nombre"' });
  }
  personas.push(nueva);
  const msg = `Nueva persona agregada: ${nueva.nombre || 'sin-nombre'}`;
  logger.info(msg);
  // 201 creado
  res.status(201);
  sendToLogstash(req, res, 'INFO', msg, {
    event: 'create_persona',
    persona: nueva
  });
  res.json(nueva);
});

app.get('/health', (req, res) => {
  const msg = 'Health check OK';
  logger.info(msg);
  sendToLogstash(req, res, 'INFO', msg, { event: 'health' });
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  const msg = `Microservicio corriendo en puerto ${PORT}`;
  logger.info(msg);
  sendToLogstash({ event: 'startup', message: msg });
});
