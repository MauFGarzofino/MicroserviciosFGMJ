import express from "express";
import fetch from "node-fetch";
import amqplib from "amqplib";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;
const USERS_URL = process.env.USERS_URL || "http://localhost:4001";
const AMQP_URL = process.env.AMQP_URL || "amqp://guest:guest@localhost:5672";
const EXCHANGE = process.env.EXCHANGE || "domain.events";
const ROUTING_KEY = process.env.ROUTING_KEY || "order.created";

let amqpChannel;

async function initAmqp() {
    const conn = await amqplib.connect(AMQP_URL);
    const ch = await conn.createChannel();
    await ch.assertExchange(EXCHANGE, "topic", { durable: true });
    amqpChannel = ch;
    console.log("[orders-svc] AMQP ready");
}
initAmqp().catch(err => {
    console.error("AMQP init error:", err);
    process.exit(1);
});

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/orders", async (req, res) => {
    try {
        const { userId, items = [] } = req.body || {};
        if (!userId || !Array.isArray(items))
            return res.status(400).json({ message: "userId and items[] required" });

        // --- Comunicación SÍNCRONA (HTTP) ---
        const resp = await fetch(`${USERS_URL}/users/${userId}`);
        if (!resp.ok) {
            return res.status(400).json({ message: "Invalid userId" });
        }
        const user = await resp.json();

        // Simula creación de orden
        const order = {
            id: `o_${Date.now()}`,
            userId: user.id,
            items,
            total: items.reduce((acc, it) => acc + (it.price || 0) * (it.qty || 1), 0),
            createdAt: new Date().toISOString()
        };

        // --- Publicación ASÍNCRONA (RabbitMQ) ---
        const payload = Buffer.from(JSON.stringify(order));
        amqpChannel.publish(EXCHANGE, ROUTING_KEY, payload, {
            contentType: "application/json",
            persistent: true
        });

        return res.status(201).json({ message: "order created", order });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ message: "internal error" });
    }
});

app.listen(PORT, () => {
    console.log(`[orders-svc] listening on :${PORT}`);
});
