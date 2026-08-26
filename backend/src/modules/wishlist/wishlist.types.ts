import { Document, Types } from 'mongoose';

export interface IWishlist {
  user: Types.ObjectId;
  sarees: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export type IWishlistDocument = IWishlist & Document;
