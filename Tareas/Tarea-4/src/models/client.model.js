import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    ci: { type: String, required: true, unique: true, trim: true, maxlength: 20 },
    firstName: { type: String, required: true, trim: true, maxlength: 100 },
    lastName: { type: String, required: true, trim: true, maxlength: 100 },
    sex: { type: String, enum: ['M', 'F', 'O'], required: true }
}, { timestamps: true });

export default mongoose.model('Client', clientSchema);
