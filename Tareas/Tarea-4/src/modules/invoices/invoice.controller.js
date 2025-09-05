import Invoice from '../../models/invoice.model.js';
import Client from '../../models/client.model.js';

import mongoose from 'mongoose';

const { isValidObjectId } = mongoose;

function parseDateOrNull(input) {
    if (!input) return null;
    const d = new Date(input);
    return isNaN(d.getTime()) ? null : d;
}

export async function list(req, res) {
    try {
        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
        const skip = (page - 1) * limit;

        const [items, total] = await Promise.all([
            Invoice.find()
                .populate('client', 'ci firstName lastName sex')
                .populate('details.product', 'name brand')
                .sort({ date: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean({ virtuals: true }),
            Invoice.countDocuments(),
        ]);

        return res.json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            items,
        });
    } catch (err) {
        return res.status(500).json({ message: 'Error al listar facturas', error: err.message });
    }
}

export async function getOne(req, res) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) return res.status(400).json({ message: 'ID de factura inválido' });

        const doc = await Invoice.findById(id)
            .populate('client', 'ci firstName lastName sex')
            .populate('details.product', 'name brand');

        if (!doc) return res.status(404).json({ message: 'Factura no encontrada' });

        // Asegura virtuales al serializar
        const item = doc.toObject({ virtuals: true });
        return res.json(item);
    } catch (err) {
        return res.status(500).json({ message: 'Error al obtener factura', error: err.message });
    }
}

export async function create(req, res) {
    try {
        const { date, clientId } = req.body;

        // Validaciones
        const parsed = parseDateOrNull(date);
        if (!parsed) return res.status(400).json({ message: 'Fecha inválida (use ISO-8601 o YYYY-MM-DD)' });

        if (!isValidObjectId(clientId)) {
            return res.status(400).json({ message: 'Cliente inválido' });
        }
        const client = await Client.findById(clientId).lean();
        if (!client) return res.status(400).json({ message: 'Cliente inválido' });

        const created = await Invoice.create({ date: parsed, client: clientId, details: [] });
        const item = await Invoice.findById(created._id)
            .populate('client', 'ci firstName lastName sex')
            .lean({ virtuals: true });

        return res.status(201).json(item);
    } catch (err) {
        return res.status(500).json({ message: 'Error al crear factura', error: err.message });
    }
}

export async function update(req, res) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'ID de factura inválido' });
        }

        const payload = {};

        if (req.body.date !== undefined) {
            const parsed = parseDateOrNull(req.body.date);
            if (!parsed) return res.status(400).json({ message: 'Fecha inválida (use ISO-8601 o YYYY-MM-DD)' });
            payload.date = parsed;
        }

        if (req.body.clientId !== undefined) {
            const { clientId } = req.body;
            if (!isValidObjectId(clientId)) {
                return res.status(400).json({ message: 'Cliente inválido' });
            }
            const client = await Client.findById(clientId).lean();
            if (!client) return res.status(400).json({ message: 'Cliente inválido' });
            payload.client = clientId;
        }

        const updated = await Invoice.findByIdAndUpdate(id, payload, { new: true })
            .populate('client', 'ci firstName lastName sex')
            .populate('details.product', 'name brand')
            .lean({ virtuals: true });

        if (!updated) return res.status(404).json({ message: 'Factura no encontrada' });
        return res.json(updated);
    } catch (err) {
        return res.status(500).json({ message: 'Error al actualizar factura', error: err.message });
    }
}

export async function remove(req, res) {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            return res.status(400).json({ message: 'ID de factura inválido' });
        }

        const deleted = await Invoice.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: 'Factura no encontrada' });

        return res.json({ message: 'Factura eliminada' });
    } catch (err) {
        return res.status(500).json({ message: 'Error al eliminar factura', error: err.message });
    }
}
