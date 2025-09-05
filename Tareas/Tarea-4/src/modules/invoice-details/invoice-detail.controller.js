import mongoose from 'mongoose';
import Invoice from '../../models/invoice.model.js';
import Product from '../../models/product.model.js';

const { isValidObjectId } = mongoose;
export async function list(req, res) {
    const { invoiceId } = req.params;

    const invoice = await Invoice.findById(invoiceId)
        .populate('details.product', 'name brand');
    if (!invoice) return res.status(404).json({ message: 'Factura no encontrada' });

    return res.json(invoice.details);
}

export async function add(req, res) {
    const { productId, quantity, unitPrice } = req.body;
    const { invoiceId } = req.params;

    if (!isValidObjectId(invoiceId)) {
        return res.status(400).json({ message: 'ID de factura inválido' });
    }
    if (!isValidObjectId(productId)) {
        return res.status(400).json({ message: 'Producto inválido' });
    }
    if (!(Number.isFinite(quantity) && quantity >= 1) || !(Number.isFinite(unitPrice) && unitPrice >= 0)) {
        return res.status(422).json({ message: 'quantity y unitPrice deben ser numéricos válidos' });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Factura no encontrada' });

    const product = await Product.findById(productId);
    if (!product) return res.status(400).json({ message: 'Producto inválido' });

    // Agregar ítem
    invoice.details.push({ product: productId, quantity, unitPrice });
    await invoice.save();

    // Re-cargar con populate y devolver el último
    const populated = await invoice.populate('details.product', 'name brand');
    const created = populated.details[populated.details.length - 1];

    return res.status(201).json(created);
}

export async function update(req, res) {
    const { invoiceId, detailId } = req.params;
    const { productId, quantity, unitPrice } = req.body;

    if (!isValidObjectId(invoiceId)) {
        return res.status(400).json({ message: 'ID de factura inválido' });
    }
    if (!isValidObjectId(detailId)) {
        return res.status(400).json({ message: 'ID de detalle inválido' });
    }

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Factura no encontrada' });

    const detail = invoice.details.id(detailId);
    if (!detail) return res.status(404).json({ message: 'Detalle no encontrado' });

    if (productId !== undefined) {
        if (!isValidObjectId(productId)) {
            return res.status(400).json({ message: 'Producto inválido' });
        }
        const product = await Product.findById(productId);
        if (!product) return res.status(400).json({ message: 'Producto inválido' });
        detail.product = productId;
    }
    if (quantity !== undefined) {
        if (!(Number.isFinite(quantity) && quantity >= 1)) {
            return res.status(422).json({ message: 'quantity debe ser un entero >= 1' });
        }
        detail.quantity = quantity;
    }
    if (unitPrice !== undefined) {
        if (!(Number.isFinite(unitPrice) && unitPrice >= 0)) {
            return res.status(422).json({ message: 'unitPrice debe ser un número >= 0' });
        }
        detail.unitPrice = unitPrice;
    }

    await invoice.save();

    const populated = await invoice.populate('details.product', 'name brand');
    const updated = populated.details.id(detailId);
    return res.json(updated);
}

export async function remove(req, res) {
    const { invoiceId, detailId } = req.params;
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) return res.status(404).json({ message: 'Factura no encontrada' });

    const subdoc = invoice.details.id(detailId);
    if (!subdoc) return res.status(404).json({ message: 'Detalle no encontrado' });

    subdoc.deleteOne();
    await invoice.save();
    res.json({ message: 'Detalle eliminado' });
}
