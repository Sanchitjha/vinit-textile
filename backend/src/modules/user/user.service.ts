import { NotFoundError } from '../../shared/errors';
import { UserRepository } from './user.repository';
import { AddressDtoType, UpdateAddressDtoType, UpdateProfileDtoType } from './user.dto';
import { IUserDocument } from './user.types';

export class UserService {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async getProfile(userId: string): Promise<IUserDocument> {
    const user = await this.userRepository.findById(userId);
    if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    return user;
  }

  async updateProfile(userId: string, data: UpdateProfileDtoType): Promise<IUserDocument> {
    const user = await this.userRepository.updateProfile(userId, data);
    if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    return user;
  }

  async listAddresses(userId: string): Promise<IUserDocument['addresses']> {
    const user = await this.getProfile(userId);
    return user.addresses;
  }

  async addAddress(userId: string, dto: AddressDtoType): Promise<IUserDocument['addresses']> {
    if (dto.isDefault) {
      await this.userRepository.unsetDefaultAddresses(userId);
    }
    const user = await this.userRepository.addAddress(userId, dto);
    if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    return user.addresses;
  }

  async updateAddress(
    userId: string,
    addressId: string,
    dto: UpdateAddressDtoType,
  ): Promise<IUserDocument['addresses']> {
    if (dto.isDefault) {
      await this.userRepository.unsetDefaultAddresses(userId);
    }
    const user = await this.userRepository.updateAddress(userId, addressId, dto);
    if (!user) throw new NotFoundError('Address not found', 'ADDRESS_NOT_FOUND');
    return user.addresses;
  }

  async removeAddress(userId: string, addressId: string): Promise<IUserDocument['addresses']> {
    const user = await this.userRepository.removeAddress(userId, addressId);
    if (!user) throw new NotFoundError('User not found', 'USER_NOT_FOUND');
    return user.addresses;
  }
}
