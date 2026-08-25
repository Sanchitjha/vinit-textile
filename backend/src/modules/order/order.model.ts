import { Schema, model } from 'mongoose';
import { OrderStatus } from '../../shared/constants/orderStatus.constant';
import { PaymentMethod, PaymentStatus } from '../../shared/constants/paymentStatus.constant';
import { AddressSchema } from '../user/user.model';
import { IOrderDocument, IOrderItem } from './order.types';

const OrderItemSchema = new Schema<IOrderItem>(
  {
    saree: { type: Schema.Types.ObjectId, ref: 'Saree', required: true },
    name: { type: String, required: true },
    image: { type: String, default: null },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false },
);

const OrderSchema = new Schema<IOrderDocument>(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: { type: [OrderItemSchema], required: true, validate: (v: IOrderItem[]) => v.length > 0 },
    shippingAddress: { type: AddressSchema, required: true },
    subtotal: { type: Number, required: true, min: 0 },
    discount: { type: Number, default: 0, min: 0 },
    couponCode: { type: String, default: null },
    shippingFee: { type: Number, default: 0, min: 0 },
    total: { type: Number, required: true, min: 0 },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod), required: true },
    paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
    orderStatus: { type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING },
  },
  { timestamps: true },
);

OrderSchema.index({ user: 1 });
OrderSchema.index({ orderStatus: 1 });
OrderSchema.index({ createdAt: -1 });

export const OrderModel = model<IOrderDocument>('Order', OrderSchema);
