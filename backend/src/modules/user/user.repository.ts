import { UserModel } from './user.model';
import { IAddress, IUser, IUserDocument, IUserRepository } from './user.types';

export class UserRepository implements IUserRepository {
  create(data: Partial<IUser>): Promise<IUserDocument> {
    return UserModel.create(data);
  }

  findById(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).exec();
  }

  findByIdWithPassword(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).select('+password').exec();
  }

  findByEmail(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).exec();
  }

  findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ email: email.toLowerCase() }).select('+password').exec();
  }

  findByPhone(phone: string): Promise<IUserDocument | null> {
    return UserModel.findOne({ phone }).exec();
  }

  findByIdWithRefreshHash(id: string): Promise<IUserDocument | null> {
    return UserModel.findById(id).select('+refreshTokenHash').exec();
  }

  async updateRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    await UserModel.findByIdAndUpdate(id, { refreshTokenHash: hash }).exec();
  }

  updateProfile(
    id: string,
    data: Partial<Pick<IUser, 'name' | 'phone' | 'avatar'>>,
  ): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  addAddress(id: string, address: IAddress): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, { $push: { addresses: address } }, { new: true }).exec();
  }

  async updateAddress(
    userId: string,
    addressId: string,
    data: Partial<IAddress>,
  ): Promise<IUserDocument | null> {
    const setPayload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      setPayload[`addresses.$.${key}`] = value;
    }
    return UserModel.findOneAndUpdate(
      { _id: userId, 'addresses._id': addressId },
      { $set: setPayload },
      { new: true },
    ).exec();
  }

  removeAddress(userId: string, addressId: string): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(
      userId,
      { $pull: { addresses: { _id: addressId } } },
      { new: true },
    ).exec();
  }

  async unsetDefaultAddresses(userId: string): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { 'addresses.$[].isDefault': false } },
    ).exec();
  }

  async findAllPaginated(
    filter: Record<string, unknown>,
    pagination: { skip: number; limit: number },
  ): Promise<{ items: IUserDocument[]; total: number }> {
    const [items, total] = await Promise.all([
      UserModel.find(filter).sort({ createdAt: -1 }).skip(pagination.skip).limit(pagination.limit).exec(),
      UserModel.countDocuments(filter).exec(),
    ]);
    return { items, total };
  }

  setActiveStatus(id: string, isActive: boolean): Promise<IUserDocument | null> {
    return UserModel.findByIdAndUpdate(id, { isActive }, { new: true }).exec();
  }
}
