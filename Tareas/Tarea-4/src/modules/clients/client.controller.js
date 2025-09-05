import mongoose from 'mongoose';
import Client from '../../models/client.model.js';
import Invoice from '../../models/invoice.model.js';

const { isValidObjectId } = mongoose;

export async function list(req, res) {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const items = await Client.find()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        // total de documentos
        const total = await Client.countDocuments();

        res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items,
        });
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener clientes', error: err.message });
    }
}

export async function getOne(req, res) {
    const item = await Client.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(item);
}
export async function create(req, res) {
    const exists = await Client.findOne({ ci: req.body.ci });
    if (exists) return res.status(409).json({ message: 'CI ya registrado' });
    const item = await Client.create(req.body);
    res.status(201).json(item);
}
export async function update(req, res) {
    const item = await Client.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(item);
}
export async function remove(req, res) {
    const item = await Client.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado' });
}

export async function listByClient(req, res) {
    try {
        const { clientId } = req.params;

        if (!isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Cliente inválido' });
        }

        const clientExists = await Client.exists({ _id: clientId });
        if (!clientExists) return res.status(404).json({ message: 'Cliente no encontrado' });

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;

        const filter = { client: clientId };

        const [items, total] = await Promise.all([
            Invoice.find(filter)
                .populate('client', 'ci firstName lastName sex')
                .populate('details.product', 'name brand')
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean({ virtuals: true }),
            Invoice.countDocuments(filter),
        ]);

        return res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error al listar facturas del cliente', error: err.message });
    }
}