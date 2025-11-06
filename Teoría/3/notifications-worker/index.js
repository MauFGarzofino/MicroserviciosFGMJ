import amqplib from "amqplib";

const AMQP_URL = process.env.AMQP_URL || "amqp://guest:guest@localhost:5672";
const EXCHANGE = process.env.EXCHANGE || "domain.events";
const QUEUE = process.env.QUEUE || "notifications.order.created";
const ROUTING_KEY = process.env.ROUTING_KEY || "order.created";

(async () => {
    try {
        const conn = await amqplib.connect(AMQP_URL);
        const ch = await conn.createChannel();
        await ch.assertExchange(EXCHANGE, "topic", { durable: true });
        await ch.assertQueue(QUEUE, { durable: true });
        await ch.bindQueue(QUEUE, EXCHANGE, ROUTING_KEY);
        console.log(`[notifications-worker] listening ${QUEUE} (${ROUTING_KEY})`);

        ch.consume(QUEUE, (msg) => {
            if (!msg) return;
            const content = JSON.parse(msg.content.toString());
            // Simula "enviar email/notificación"
            console.log(`Notificando a userId=${content.userId} por orden=${content.id} total=${content.total}`);
            ch.ack(msg);
        }, { noAck: false });
    } catch (e) {
        console.error("Worker error:", e);
        process.exit(1);
    }
})();
