import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { WishlistService } from './wishlist.service';

export class WishlistController {
  constructor(private readonly wishlistService: WishlistService = new WishlistService()) {}

  getWishlist = async (req: Request, res: Response): Promise<void> => {
    const sarees = await this.wishlistService.getWishlist(req.user!.id);
    ApiResponse.success(res, 'Wishlist fetched successfully', sarees);
  };

  addSaree = async (req: Request, res: Response): Promise<void> => {
    const sarees = await this.wishlistService.addSaree(req.user!.id, req.params.sareeId);
    ApiResponse.success(res, 'Saree added to wishlist', sarees, 201);
  };

  removeSaree = async (req: Request, res: Response): Promise<void> => {
    const sarees = await this.wishlistService.removeSaree(req.user!.id, req.params.sareeId);
    ApiResponse.success(res, 'Saree removed from wishlist', sarees);
  };
}
