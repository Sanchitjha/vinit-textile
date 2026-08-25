import { Document, Types } from 'mongoose';
import { OrderStatus } from '../../shared/constants/orderStatus.constant';
import { PaymentMethod, PaymentStatus } from '../../shared/constants/paymentStatus.constant';
import { IAddress } from '../user/user.types';

export interface IOrderItem {
  saree: Types.ObjectId;
  name: string;
  image: string | null;
  price: number;
  quantity: number;
}

export interface IOrder {
  orderNumber: string;
  user: Types.ObjectId;
  items: IOrderItem[];
  shippingAddress: IAddress;
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

export type IOrderDocument = IOrder & Document;

export interface CreateOrderItemInput {
  sareeId: string;
  quantity: number;
}
