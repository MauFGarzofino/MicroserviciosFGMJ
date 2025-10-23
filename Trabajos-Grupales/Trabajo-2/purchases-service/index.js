import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import amqp from 'amqplib';

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://localhost';
const PORT = parseInt(process.env.PORT || '5003', 10);

const EXCHANGE_NAME = process.env.EXCHANGE_NAME || 'ticketing.exchange';
const EXCHANGE_TYPE = process.env.EXCHANGE_TYPE || 'topic';
const ROUTING_KEY = process.env.ROUTING_KEY || 'purchase.paid';

let channel;

async function initRabbit() {
    const conn = await amqp.connect(RABBITMQ_URL);
    channel = await conn.createChannel();

    // el producer asegura el exchange
    await channel.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
    console.log(`[amqp] Conectado. Exchange asegurado: ${EXCHANGE_NAME} (${EXCHANGE_TYPE})`);

    const shutdown = async () => { try { await channel.close(); await conn.close(); } catch { } process.exit(0); };
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
}

async function publishNotification(payload, messageId) {
    if (!channel) throw new Error('AMQP channel not ready');
    const body = Buffer.from(JSON.stringify(payload));
    const ok = channel.publish(EXCHANGE_NAME, ROUTING_KEY, body, {
        contentType: 'application/json',
        persistent: true,
        ...(messageId ? { messageId } : {})
    });
    if (!ok) await new Promise(resolve => channel.once('drain', resolve));
}

const app = express();
app.use(express.json());

app.post('/purchases/:id/pay', async (req, res) => {
    const { id: purchaseId } = req.params;
    const { to, name, qty } = req.body || {};
    //if (!to) return res.status(400).json({ error: "Falta 'to' (email del usuario)" });

    // Evento con las props de la práctica
    const event = {
        name: "Hackaton USFX",
        date: "2025-11-15",
        location: "Auditorio Principal",
        capacity: 150,
        price: 50.0
    };

    // qty conversión
    const quantity = Number.isFinite(Number(qty)) ? Number(qty) : 2;
    const total = quantity * event.price;

    const fullPayload = {
        purchaseId,
        user: { email: to, name: name || "Participante" },
        event,
        qty: quantity,
        total,
        paidAt: new Date().toISOString()
    };

    try {
        await publishNotification(fullPayload, purchaseId); // pasa purchaseId como messageId
        return res.json({ status: 'paid', queued: true, purchaseId });
    } catch (e) {
        console.error('[amqp] Error publicando:', e.message);
        return res.status(500).json({ error: 'No se pudo encolar la notificación' });
    }
});

initRabbit()
    .then(() => app.listen(PORT, () => console.log(`[http] Purchases escuchando en :${PORT}`)))
    .catch((e) => { console.error('Fatal:', e); process.exit(1); });
