const mongoose = require('mongoose');

const AgendaSchema = new mongoose.Schema(
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
        toJSON: {
            virtuals: true,
            versionKey: false,
            transform: (_doc, ret) => { ret.id = ret._id; delete ret._id; }
        },
        toObject: {
            virtuals: true,
            versionKey: false,
            transform: (_doc, ret) => { ret.id = ret._id; delete ret._id; }
        }
    }
);

AgendaSchema.index({ correo: 1 });

const AgendaModel = mongoose.model('Agenda', AgendaSchema);
module.exports = { AgendaModel };
