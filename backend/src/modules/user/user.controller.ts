import { Request, Response } from 'express';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { AddressDtoType, UpdateAddressDtoType, UpdateProfileDtoType } from './user.dto';
import { UserService } from './user.service';

export class UserController {
  constructor(private readonly userService: UserService = new UserService()) {}

  getMe = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userService.getProfile(req.user!.id);
    ApiResponse.success(res, 'Profile fetched successfully', user);
  };

  updateMe = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateProfileDtoType;
    const user = await this.userService.updateProfile(req.user!.id, dto);
    ApiResponse.success(res, 'Profile updated successfully', user);
  };

  listAddresses = async (req: Request, res: Response): Promise<void> => {
    const addresses = await this.userService.listAddresses(req.user!.id);
    ApiResponse.success(res, 'Addresses fetched successfully', addresses);
  };

  addAddress = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as AddressDtoType;
    const addresses = await this.userService.addAddress(req.user!.id, dto);
    ApiResponse.success(res, 'Address added successfully', addresses, 201);
  };

  updateAddress = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as UpdateAddressDtoType;
    const addresses = await this.userService.updateAddress(req.user!.id, req.params.id, dto);
    ApiResponse.success(res, 'Address updated successfully', addresses);
  };

  removeAddress = async (req: Request, res: Response): Promise<void> => {
    const addresses = await this.userService.removeAddress(req.user!.id, req.params.id);
    ApiResponse.success(res, 'Address removed successfully', addresses);
  };
}
