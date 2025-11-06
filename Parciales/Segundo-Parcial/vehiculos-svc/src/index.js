import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import Vehiculo from './models/Vehiculo.js';
import { swaggerSpec } from './swagger.js';
import swaggerUi from 'swagger-ui-express';
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;
const GRPC_PORT = 50051;
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret';
await mongoose.connect('mongodb://mongo:27017/vehiculos_db');

function requireAuth(req, res, next) {
    const header = req.headers.authorization || '';
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) return res.status(401).json({ error: 'Token faltante' });
    try {
        req.user = jwt.verify(match[1], JWT_SECRET, { algorithms: ['HS256'] });
        return next();
    } catch {
        return res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @openapi
 * /vehiculos:
 *   get:
 *     summary: Lista todos los vehículos
 *     responses:
 *       200:
 *         description: OK
 */
app.get('/vehiculos', async (_req, res) => {
    res.json(await Vehiculo.find());
});

/**
 * @openapi
 * /vehiculos/:
 *   post:
 *     summary: Crea un vehículo
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [placa, tipo, capacidad, estado]
 *             properties:
 *               placa:     { type: string, example: "1234XYZ" }
 *               tipo:      { type: string, example: "bus" }
 *               capacidad: { type: integer, example: 45 }
 *               estado:    { type: string, example: "activo" }
 *     responses:
 *       201: { description: Creado }
 */
app.post('/vehiculos', requireAuth, async (req, res) => {
    try {
        const v = await Vehiculo.create(req.body);
        res.status(201).json(v);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/vehiculos/:id', async (req, res) => {
    const v = await Vehiculo.findById(req.params.id);
    if (!v) return res.status(404).json({ error: 'No encontrado' });
    res.json(v);
});

app.patch('/vehiculos/:id', requireAuth, async (req, res) => {
    const v = await Vehiculo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!v) return res.status(404).json({ error: 'No encontrado' });
    res.json(v);
});

app.delete('/vehiculos/:id', requireAuth, async (req, res) => {
    const v = await Vehiculo.findByIdAndDelete(req.params.id);
    if (!v) return res.status(404).json({ error: 'No encontrado' });
    res.json({ eliminado: true });
});

// gRPC
const protoPath = '/app/shared/vehiculo.proto';
const pkgDef = protoLoader.loadSync(protoPath);
const vehiculoProto = grpc.loadPackageDefinition(pkgDef).vehiculo;

function VerificarExistencia(call, callback) {
    Vehiculo.exists({ placa: call.request.placa })
        .then(e => callback(null, { existe: !!e }))
        .catch(err => callback(err));
}

const server = new grpc.Server();
server.addService(vehiculoProto.VehiculoService.service, { VerificarExistencia });
server.bindAsync(`0.0.0.0:${GRPC_PORT}`, grpc.ServerCredentials.createInsecure(), () => server.start());

app.listen(PORT, () => console.log(`vehiculos Rest:${PORT} | gRPC:${GRPC_PORT}`));
