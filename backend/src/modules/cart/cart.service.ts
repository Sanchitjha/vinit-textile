import { BadRequestError, NotFoundError } from '../../shared/errors';
import { SareeRepository } from '../saree/saree.repository';
import { ISareeDocument } from '../saree/saree.types';
import { CartRepository } from './cart.repository';
import { CartItemView, CartView, ICartDocument } from './cart.types';

export class CartService {
  constructor(
    private readonly cartRepository: CartRepository = new CartRepository(),
    private readonly sareeRepository: SareeRepository = new SareeRepository(),
  ) {}

  async getCart(userId: string): Promise<CartView> {
    const cart = await this.cartRepository.findOrCreateByUser(userId);
    return this.toView(cart);
  }

  async addItem(userId: string, sareeId: string, quantity: number): Promise<CartView> {
    const saree = await this.assertPurchasable(sareeId);
    const cart = await this.cartRepository.findOrCreateByUser(userId);
    const existing = cart.items.find((item) => item.saree.toString() === sareeId);
    const nextQuantity = (existing?.quantity ?? 0) + quantity;

    if (nextQuantity > saree.stock) {
      throw new BadRequestError(`Only ${saree.stock} unit(s) of "${saree.name}" in stock`, 'INSUFFICIENT_STOCK');
    }

    const updated = await this.cartRepository.incrementItem(userId, sareeId, quantity);
    return this.toView(updated);
  }

  async updateItem(userId: string, sareeId: string, quantity: number): Promise<CartView> {
    const saree = await this.assertPurchasable(sareeId);
    if (quantity > saree.stock) {
      throw new BadRequestError(`Only ${saree.stock} unit(s) of "${saree.name}" in stock`, 'INSUFFICIENT_STOCK');
    }

    const updated = await this.cartRepository.setItemQuantity(userId, sareeId, quantity);
    if (!updated) throw new NotFoundError('Item not found in cart', 'CART_ITEM_NOT_FOUND');
    return this.toView(updated);
  }

  async removeItem(userId: string, sareeId: string): Promise<CartView> {
    const updated = await this.cartRepository.removeItem(userId, sareeId);
    if (!updated) throw new NotFoundError('Cart not found', 'CART_NOT_FOUND');
    return this.toView(updated);
  }

  async clearCart(userId: string): Promise<CartView> {
    const updated = await this.cartRepository.clear(userId);
    if (!updated) throw new NotFoundError('Cart not found', 'CART_NOT_FOUND');
    return this.toView(updated);
  }

  private async assertPurchasable(sareeId: string): Promise<ISareeDocument> {
    const saree = await this.sareeRepository.findById(sareeId);
    if (!saree || !saree.isActive) {
      throw new NotFoundError('Saree not found', 'SAREE_NOT_FOUND');
    }
    if (saree.stock <= 0) {
      throw new BadRequestError(`"${saree.name}" is out of stock`, 'OUT_OF_STOCK');
    }
    return saree;
  }

  private async toView(cart: ICartDocument): Promise<CartView> {
    if (cart.items.length === 0) {
      return { items: [], subtotal: 0, itemCount: 0 };
    }

    const sareeIds = cart.items.map((item) => item.saree.toString());
    const sarees = await this.sareeRepository.findManyByIds(sareeIds);
    const sareeMap = new Map(sarees.map((saree) => [saree.id, saree]));

    const items: CartItemView[] = cart.items
      .filter((item) => sareeMap.has(item.saree.toString()))
      .map((item) => {
        const saree = sareeMap.get(item.saree.toString()) as ISareeDocument;
        return {
          saree: {
            id: saree.id,
            name: saree.name,
            slug: saree.slug,
            image: saree.images[0] ?? null,
            price: saree.price,
            stock: saree.stock,
            isActive: saree.isActive,
          },
          quantity: item.quantity,
          lineTotal: saree.price * item.quantity,
        };
      });

    const subtotal = items.reduce((sum, item) => sum + item.lineTotal, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return { items, subtotal, itemCount };
  }
}
