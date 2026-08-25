import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { AddCartItemDtoType, UpdateCartItemDtoType } from './cart.dto';
import { CartService } from './cart.service';

export class CartController {
  constructor(private readonly cartService: CartService = new CartService()) {}

  getCart = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.cartService.getCart(req.user!.id);
    ApiResponse.success(res, 'Cart fetched successfully', cart);
  };

  addItem = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as AddCartItemDtoType;
    const cart = await this.cartService.addItem(req.user!.id, dto.sareeId, dto.quantity);
    ApiResponse.success(res, 'Item added to cart', cart, 201);
  };

  updateItem = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateCartItemDtoType;
    const cart = await this.cartService.updateItem(req.user!.id, req.params.sareeId, dto.quantity);
    ApiResponse.success(res, 'Cart item updated', cart);
  };

  removeItem = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.cartService.removeItem(req.user!.id, req.params.sareeId);
    ApiResponse.success(res, 'Item removed from cart', cart);
  };

  clearCart = async (req: Request, res: Response): Promise<void> => {
    const cart = await this.cartService.clearCart(req.user!.id);
    ApiResponse.success(res, 'Cart cleared', cart);
  };
}
