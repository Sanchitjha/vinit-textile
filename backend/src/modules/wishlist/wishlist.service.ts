import { NotFoundError } from '../../shared/errors';
import { SareeRepository } from '../saree/saree.repository';
import { ISareeDocument } from '../saree/saree.types';
import { WishlistRepository } from './wishlist.repository';

export class WishlistService {
  constructor(
    private readonly wishlistRepository: WishlistRepository = new WishlistRepository(),
    private readonly sareeRepository: SareeRepository = new SareeRepository(),
  ) {}

  async getWishlist(userId: string): Promise<ISareeDocument[]> {
    const wishlist = await this.wishlistRepository.findOrCreateByUser(userId);
    if (wishlist.sarees.length === 0) return [];
    return this.sareeRepository.findManyByIds(wishlist.sarees.map((id) => id.toString()));
  }

  async addSaree(userId: string, sareeId: string): Promise<ISareeDocument[]> {
    const saree = await this.sareeRepository.findById(sareeId);
    if (!saree) throw new NotFoundError('Saree not found', 'SAREE_NOT_FOUND');

    const wishlist = await this.wishlistRepository.addSaree(userId, sareeId);
    return this.sareeRepository.findManyByIds(wishlist.sarees.map((id) => id.toString()));
  }

  async removeSaree(userId: string, sareeId: string): Promise<ISareeDocument[]> {
    const wishlist = await this.wishlistRepository.removeSaree(userId, sareeId);
    if (!wishlist) throw new NotFoundError('Wishlist not found', 'WISHLIST_NOT_FOUND');
    if (wishlist.sarees.length === 0) return [];
    return this.sareeRepository.findManyByIds(wishlist.sarees.map((id) => id.toString()));
  }
}
