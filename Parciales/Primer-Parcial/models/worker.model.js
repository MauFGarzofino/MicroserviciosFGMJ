import mongoose from 'mongoose';

const workerSchema = new mongoose.Schema(
    {
        nombres: { type: String, required: true, trim: true, maxlength: 100 },
        apellidos: { type: String, required: true, trim: true, maxlength: 100 },
        fecha_nacimiento: { type: Date, required: true },
        direccion: { type: String, required: true, trim: true, maxlength: 200 },
        celular: { type: String, required: true, trim: true, maxlength: 30 },
        correo: { type: String, required: true, trim: true, maxlength: 150, unique: true }
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('Worker', workerSchema)
