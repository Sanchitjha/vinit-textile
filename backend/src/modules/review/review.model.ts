import { Schema, model } from 'mongoose';
import { IReviewDocument } from './review.types';

const ReviewSchema = new Schema<IReviewDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    saree: { type: Schema.Types.ObjectId, ref: 'Saree', required: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    images: { type: [String], default: [] },
    isApproved: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ReviewSchema.index({ saree: 1 });
ReviewSchema.index({ user: 1, saree: 1 }, { unique: true });

export const ReviewModel = model<IReviewDocument>('Review', ReviewSchema);
