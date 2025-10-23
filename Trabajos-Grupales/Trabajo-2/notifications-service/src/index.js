import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import amqp from 'amqplib';
import nodemailer from 'nodemailer';

const {
    RABBITMQ_URL = 'amqp://localhost',
    EXCHANGE_NAME = 'ticketing.exchange',
    EXCHANGE_TYPE = 'topic',
    ROUTING_KEY = 'purchase.paid',
    QUEUE_NAME = 'notifications.q',
    DLX_NAME = 'ticketing.dlx',
    DLQ_NAME = 'notifications.dlq',
    PREFETCH = '10',
    PORT = '5004',
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
    FROM_EMAIL = 'no-reply@tickets.local'
} = process.env;

let transporter; // objeto nodemailer

// Para usar SMTP real o Ethereal
async function initTransporter() {
    if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
        transporter = nodemailer.createTransport({
            host: SMTP_HOST,
            port: SMTP_PORT ? parseInt(SMTP_PORT) : 587,
            secure: SMTP_SECURE === 'true',
            auth: { user: SMTP_USER, pass: SMTP_PASS }
        });
        await transporter.verify();
        console.log(`[email] Usando SMTP real en ${SMTP_HOST}`);
    } else {
        const testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: { user: testAccount.user, pass: testAccount.pass }
        });
        console.log(`[email] Usando Ethereal: ${testAccount.user}`);
    }
}

// { to, subject, text, html? }
function isSimplePayload(p) {
    return p && typeof p === 'object' && p.to && p.subject;
}

function validatePayload(p) {
    if (isSimplePayload(p)) return; // formato simple OK
    if (!p || typeof p !== 'object') throw new Error('Payload inválido');
    if (!p.user || !p.user.email) throw new Error('Falta user.email');
    if (!p.event || !p.event.name) throw new Error('Falta event.name');
    if (!p.qty) throw new Error('Falta qty');
    if (typeof p.total === 'undefined') throw new Error('Falta total');
}

async function sendPurchaseEmail(p) {
    validatePayload(p);

    // Si viene formato simple
    if (isSimplePayload(p)) {
        const info = await transporter.sendMail({
            from: FROM_EMAIL,
            to: p.to,
            subject: p.subject,
            text: p.text || "",
            html: p.html
        });
        const preview = nodemailer.getTestMessageUrl(info);
        if (preview) console.log('[email] Preview URL:', preview);
        return;
    }

    // Formato completo
    const subject = `Compra confirmada ${p.purchaseId ? '#' + p.purchaseId : ''}`;
    const text = `Hola ${p.user.name ?? 'cliente'}, tu compra de ${p.qty} entrada(s) para "${p.event.name}" fue confirmada. Total: ${p.total}.`;
    const html = `
  <h2>Confirmación de compra</h2>
  <p>Hola <b>${p.user?.name ?? 'participante'}</b>,</p>
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 5px solid #3498db; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
            <p style="margin: 5px 0;"><strong>Evento:</strong> <b>${p.event.name}</b></p>
            <p style="margin: 5px 0;"><strong>Fecha y Lugar:</strong> <b>${p.event.date}</b> · <b>${p.event.location}</b></p>
            <p style="margin: 5px 0; color: #7f8c8d;">Capacidad total: ${p.event.capacity}</p>
        </div>
  <p>Cantidad: <b>${p.qty}</b> · Precio x entrada: <b>${p.event.price}</b> · Total: <b>${p.total}</b></p>
  <p>Compra: <b>${p.purchaseId ?? '-'}</b> · Pagado el: <b>${p.paidAt ?? '-'}</b></p>
  <hr/>
`;
    const info = await transporter.sendMail({
        from: FROM_EMAIL,
        to: p.user.email,
        subject,
        text,
        html
    });
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) console.log('[email] Preview URL:', preview);
}

async function startConsumer() {
    const conn = await amqp.connect(RABBITMQ_URL);
    const ch = await conn.createChannel();


    await ch.assertExchange(EXCHANGE_NAME, EXCHANGE_TYPE, { durable: true });
    await ch.assertExchange(DLX_NAME, 'fanout', { durable: true });


    await ch.assertQueue(QUEUE_NAME, {
        durable: true,
        arguments: { 'x-dead-letter-exchange': DLX_NAME }
    });


    await ch.assertQueue(DLQ_NAME, { durable: true });
    await ch.bindQueue(QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY);
    await ch.bindQueue(DLQ_NAME, DLX_NAME, '');


    ch.prefetch(parseInt(PREFETCH));
    console.log(`[amqp] Esperando mensajes en ${QUEUE_NAME} (binding ${ROUTING_KEY})`);


    const processed = new Set(); // deduplicación simple


    ch.consume(QUEUE_NAME, async (msg) => {
        if (!msg) return;
        console.log(msg.content.toString());
        try {
            const content = msg.content.toString();
            const payload = JSON.parse(content);
            const key = payload?.purchaseId;


            if (key && processed.has(key)) {
                console.log('[amqp] Duplicado, ack directo:', key);
                ch.ack(msg);
                return;
            }

            await sendPurchaseEmail(payload);
            if (key) processed.add(key);
            ch.ack(msg);
        } catch (err) {
            console.error('[amqp] Error procesando mensaje → a DLQ:', err.message);
            ch.nack(msg, false, false); // no requeue → DLQ
        }
    });


    // Cierre ordenado
    const shutdown = async () => {
        try { await ch.close(); await conn.close(); } catch { }
        process.exit(0);
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
}

async function main() {
    await initTransporter();
    await startConsumer();


    const app = express();
    app.use(express.json());


    app.get('/health', (req, res) => res.json({ status: 'ok' }));


    // Endpoint de prueba manual
    app.post('/send-test', async (req, res) => {
        try {
            await sendPurchaseEmail(req.body);
            res.json({ status: 'sent' });
        } catch (e) {
            res.status(400).json({ error: e.message });
        }
    });


    app.listen(parseInt(PORT), () => {
        console.log(`[http] Notifications escuchando en :${PORT}`);
    });
}

main().catch((e) => {
    console.error('Fatal:', e);
    process.exit(1);
});