import { ClientSession } from 'mongoose';
import { CartModel } from './cart.model';
import { ICartDocument } from './cart.types';

export class CartRepository {
  async findOrCreateByUser(userId: string): Promise<ICartDocument> {
    const existing = await CartModel.findOne({ user: userId }).exec();
    if (existing) return existing;
    return CartModel.create({ user: userId, items: [] });
  }

  findByUser(userId: string): Promise<ICartDocument | null> {
    return CartModel.findOne({ user: userId }).exec();
  }

  async incrementItem(userId: string, sareeId: string, quantity: number): Promise<ICartDocument> {
    const updated = await CartModel.findOneAndUpdate(
      { user: userId, 'items.saree': sareeId },
      { $inc: { 'items.$.quantity': quantity } },
      { new: true },
    ).exec();
    if (updated) return updated;

    return CartModel.findOneAndUpdate(
      { user: userId },
      { $push: { items: { saree: sareeId, quantity } } },
      { new: true, upsert: true },
    ).exec() as Promise<ICartDocument>;
  }

  setItemQuantity(userId: string, sareeId: string, quantity: number): Promise<ICartDocument | null> {
    return CartModel.findOneAndUpdate(
      { user: userId, 'items.saree': sareeId },
      { $set: { 'items.$.quantity': quantity } },
      { new: true },
    ).exec();
  }

  removeItem(userId: string, sareeId: string): Promise<ICartDocument | null> {
    return CartModel.findOneAndUpdate(
      { user: userId },
      { $pull: { items: { saree: sareeId } } },
      { new: true },
    ).exec();
  }

  clear(userId: string, session?: ClientSession): Promise<ICartDocument | null> {
    return CartModel.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true, session: session ?? null },
    ).exec();
  }
}
