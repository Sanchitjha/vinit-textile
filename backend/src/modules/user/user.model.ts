import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import { Role } from '../../shared/constants/roles.constant';
import { IAddress, IUserDocument } from './user.types';

const SALT_ROUNDS = 10;

export const AddressSchema = new Schema<IAddress>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, default: 'India' },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true },
);

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: Object.values(Role), default: Role.CUSTOMER },
    avatar: { type: String, default: null },
    addresses: { type: [AddressSchema], default: [] },
    refreshTokenHash: { type: String, default: null, select: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.password;
        delete ret.refreshTokenHash;
        delete ret.__v;
        return ret;
      },
    },
  },
);

UserSchema.pre('save', async function preSave(next) {
  if (!this.isModified('password')) {
    next();
    return;
  }
  this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  next();
});

UserSchema.methods.comparePassword = function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const UserModel = model<IUserDocument>('User', UserSchema);
