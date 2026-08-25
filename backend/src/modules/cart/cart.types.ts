import { Document, Types } from 'mongoose';

export interface ICartItem {
  saree: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

export type ICartDocument = ICart & Document;

export interface CartItemView {
  saree: {
    id: string;
    name: string;
    slug: string;
    image: string | null;
    price: number;
    stock: number;
    isActive: boolean;
  };
  quantity: number;
  lineTotal: number;
}

export interface CartView {
  items: CartItemView[];
  subtotal: number;
  itemCount: number;
}
