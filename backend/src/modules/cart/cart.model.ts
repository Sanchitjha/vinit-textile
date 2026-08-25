import { Schema, model } from 'mongoose';
import { ICartDocument, ICartItem } from './cart.types';

const CartItemSchema = new Schema<ICartItem>(
  {
    saree: { type: Schema.Types.ObjectId, ref: 'Saree', required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const CartSchema = new Schema<ICartDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: { type: [CartItemSchema], default: [] },
  },
  { timestamps: true },
);

export const CartModel = model<ICartDocument>('Cart', CartSchema);
