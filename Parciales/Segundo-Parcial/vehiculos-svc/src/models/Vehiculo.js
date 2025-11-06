import mongoose from 'mongoose';

const VehiculoSchema = new mongoose.Schema({
    placa: { type: String, required: true, unique: true },
    tipo: { type: String, required: true },
    capacidad: {
        type: Number,
        required: true,
    },
    estado: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Vehiculo', VehiculoSchema);
