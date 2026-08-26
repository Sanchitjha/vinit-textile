import { WishlistModel } from './wishlist.model';
import { IWishlistDocument } from './wishlist.types';

export class WishlistRepository {
  async findOrCreateByUser(userId: string): Promise<IWishlistDocument> {
    const existing = await WishlistModel.findOne({ user: userId }).exec();
    if (existing) return existing;
    return WishlistModel.create({ user: userId, sarees: [] });
  }

  addSaree(userId: string, sareeId: string): Promise<IWishlistDocument> {
    return WishlistModel.findOneAndUpdate(
      { user: userId },
      { $addToSet: { sarees: sareeId } },
      { new: true, upsert: true },
    ).exec() as Promise<IWishlistDocument>;
  }

  removeSaree(userId: string, sareeId: string): Promise<IWishlistDocument | null> {
    return WishlistModel.findOneAndUpdate(
      { user: userId },
      { $pull: { sarees: sareeId } },
      { new: true },
    ).exec();
  }
}
