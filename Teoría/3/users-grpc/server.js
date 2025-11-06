import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import express from "express";

const PROTO_PATH = "./users.proto";
const pkgDef = await protoLoader.load(PROTO_PATH, { keepCase: true, longs: String, enums: String, defaults: true, oneofs: true });
const proto = grpc.loadPackageDefinition(pkgDef).users;

const usersDb = {
    "u1": { id: "u1", name: "Ana", email: "ana@example.com" },
    "u2": { id: "u2", name: "Mau", email: "mau@example.com" }
};

function GetUser(call, callback) {
    const { id } = call.request || {};
    const user = usersDb[id];
    if (!user) return callback(null, { found: false });
    callback(null, { found: true, ...user });
}

// --- Servidor gRPC ---
const server = new grpc.Server();
server.addService(proto.UsersService.service, { GetUser });

const GRPC_PORT = "0.0.0.0:50051";
server.bindAsync(GRPC_PORT, grpc.ServerCredentials.createInsecure(), (err) => {
    if (err) { console.error("gRPC bind error:", err); process.exit(1); }
    console.log("[users-grpc] gRPC on", GRPC_PORT);
    server.start();
});

// --- Health HTTP (opcional, útil para pruebas/compose) ---
const app = express();
app.get("/health", (_, res) => res.json({ ok: true, service: "users-grpc" }));
app.listen(4001, () => console.log("[users-grpc] HTTP health on :4001"));
