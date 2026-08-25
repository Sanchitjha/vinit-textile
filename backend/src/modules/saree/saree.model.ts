import { Schema, model } from 'mongoose';
import { ISareeDocument } from './saree.types';

const SareeSchema = new Schema<ISareeDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    subCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    images: { type: [String], required: true, validate: (v: string[]) => v.length > 0 },
    price: { type: Number, required: true, min: 0 },
    compareAtPrice: { type: Number, min: 0 },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    fabric: { type: String, required: true, trim: true },
    sareeType: { type: String, trim: true },
    weave: { type: String, trim: true },
    color: { type: String, required: true, trim: true },
    colors: { type: [String], default: [] },
    pattern: { type: String, trim: true },
    borderType: { type: String, trim: true },
    blousePiece: { type: Boolean, default: false },
    blouseColor: { type: String, trim: true },
    sareeLength: { type: Number },
    blouseLength: { type: Number },
    occasion: { type: [String], default: [] },
    region: { type: String, trim: true },
    tags: { type: [String], default: [] },
    careInstructions: { type: String },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    ratings: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

SareeSchema.index({ category: 1 });
SareeSchema.index({ fabric: 1 });
SareeSchema.index({ sareeType: 1 });
SareeSchema.index({ color: 1 });
SareeSchema.index({ price: 1 });
SareeSchema.index({ isFeatured: 1 });
SareeSchema.index({ name: 'text', description: 'text', tags: 'text' });

export const SareeModel = model<ISareeDocument>('Saree', SareeSchema);
