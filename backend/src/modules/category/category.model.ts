import { Schema, model } from 'mongoose';
import { ICategoryDocument } from './category.types';

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String },
    parentCategory: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

CategorySchema.index({ parentCategory: 1 });

export const CategoryModel = model<ICategoryDocument>('Category', CategorySchema);
