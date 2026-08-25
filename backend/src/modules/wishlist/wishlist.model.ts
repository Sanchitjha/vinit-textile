import { Schema, model } from 'mongoose';
import { IWishlistDocument } from './wishlist.types';

const WishlistSchema = new Schema<IWishlistDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    sarees: { type: [Schema.Types.ObjectId], ref: 'Saree', default: [] },
  },
  { timestamps: true },
);

export const WishlistModel = model<IWishlistDocument>('Wishlist', WishlistSchema);
