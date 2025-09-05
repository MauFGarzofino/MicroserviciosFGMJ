import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 150 },
  description: { type: String },
  brand: { type: String },
  stock: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
