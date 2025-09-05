import mongoose from 'mongoose';

const invoiceDetailSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    unitPrice: { type: Number, required: true, min: 0 }
}, { _id: true });

const invoiceSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    details: { type: [invoiceDetailSchema], default: [] }
}, { timestamps: true });

// total - virtualizado
invoiceSchema.virtual('total').get(function () {
    return this.details.reduce((acc, d) => acc + d.quantity * d.unitPrice, 0);
});

invoiceSchema.set('toJSON', { virtuals: true });
invoiceSchema.set('toObject', { virtuals: true });

export default mongoose.model('Invoice', invoiceSchema);
