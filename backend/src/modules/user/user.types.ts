import { Document, Types } from 'mongoose';
import { Role } from '../../shared/constants/roles.constant';

export interface IAddress {
  _id?: Types.ObjectId;
  name: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface IUser {
  name: string;
  email: string;
  // Optional — users created via email-OTP verification may never set these.
  phone?: string;
  password?: string;
  role: Role;
  avatar: string | null;
  addresses: IAddress[];
  refreshTokenHash: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

export type SafeUser = Omit<IUser, 'password' | 'refreshTokenHash'> & { _id: Types.ObjectId };

export interface IUserRepository {
  create(data: Partial<IUser>): Promise<IUserDocument>;
  findById(id: string): Promise<IUserDocument | null>;
  findByIdWithPassword(id: string): Promise<IUserDocument | null>;
  findByEmail(email: string): Promise<IUserDocument | null>;
  findByEmailWithPassword(email: string): Promise<IUserDocument | null>;
  findByPhone(phone: string): Promise<IUserDocument | null>;
  updateRefreshTokenHash(id: string, hash: string | null): Promise<void>;
  updateProfile(id: string, data: Partial<Pick<IUser, 'name' | 'phone' | 'avatar'>>): Promise<IUserDocument | null>;
  addAddress(id: string, address: IAddress): Promise<IUserDocument | null>;
  updateAddress(userId: string, addressId: string, data: Partial<IAddress>): Promise<IUserDocument | null>;
  removeAddress(userId: string, addressId: string): Promise<IUserDocument | null>;
  unsetDefaultAddresses(userId: string): Promise<void>;
}
