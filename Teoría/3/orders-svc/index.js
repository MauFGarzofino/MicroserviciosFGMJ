import express from "express";
import amqplib from "amqplib";
import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 4002;

// --- AMQP ---
const AMQP_URL = process.env.AMQP_URL || "amqp://guest:guest@rabbitmq:5672";
const EXCHANGE = process.env.EXCHANGE || "domain.events";
const ROUTING_KEY = process.env.ROUTING_KEY || "order.created";
let amqpChannel;

async function connectAmqp() {
    const conn = await amqplib.connect(AMQP_URL);
    const ch = await conn.createChannel();
    await ch.assertExchange(EXCHANGE, "topic", { durable: true });
    amqpChannel = ch;
    console.log("[orders-svc] AMQP ready");
}

async function waitForAmqp(maxRetries = 20, delayMs = 1500) {
    let attempt = 1;
    while (attempt <= maxRetries) {
        try {
            await connectAmqp();
            return;
        } catch (e) {
            console.warn(`[orders-svc] AMQP not ready (try ${attempt}/${maxRetries}): ${e.code || e.message}`);
            await new Promise(r => setTimeout(r, delayMs));
            delayMs = Math.min(Math.floor(delayMs * 1.3), 10000); // backoff
            attempt++;
        }
    }
    throw new Error("AMQP connection failed after retries");
}

// Lanza el retry al inicio:
waitForAmqp().catch((e) => {
    console.error("AMQP fatal:", e);
    process.exit(1);
});

// --- gRPC client ---
const USERS_GRPC_ADDR = process.env.USERS_GRPC_ADDR || "users-grpc:50051";
const PROTO_PATH = "users.proto";
const pkgDef = await protoLoader.load(PROTO_PATH, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const usersProto = grpc.loadPackageDefinition(pkgDef).users;

const usersClient = new usersProto.UsersService(
    USERS_GRPC_ADDR,
    grpc.credentials.createInsecure()
);

function getUserById(id) {
    return new Promise((resolve, reject) => {
        usersClient.GetUser({ id }, (err, resp) => {
            if (err) return reject(err);
            resolve(resp);
        });
    });
}

app.get("/health", (_, res) => res.json({ ok: true }));

app.post("/orders", async (req, res) => {
    try {
        const { userId, items = [] } = req.body || {};
        if (!userId || !Array.isArray(items))
            return res.status(400).json({ message: "userId and items[] required" });

        // --- validación SÍNCRONA via gRPC ---
        const userResp = await getUserById(userId);
        if (!userResp?.found) return res.status(400).json({ message: "Invalid userId" });

        const order = {
            id: `o_${Date.now()}`,
            userId: userResp.id,
            items,
            total: items.reduce((acc, it) => acc + (it.price || 0) * (it.qty || 1), 0),
            createdAt: new Date().toISOString()
        };

        // --- evento ASÍNCRONO ---
        if (!amqpChannel) {
            // Si quieres, responde 503 hasta que AMQP esté listo
            return res.status(503).json({ message: "broker not ready, retry later" });
        }
        amqpChannel.publish(EXCHANGE, ROUTING_KEY, Buffer.from(JSON.stringify(order)), {
            contentType: "application/json",
            persistent: true
        });
        res.status(201).json({ message: "order created", order });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "internal error" });
    }
});

app.listen(PORT, () => console.log(`[orders-svc] on :${PORT}, using gRPC @ ${USERS_GRPC_ADDR}`));
