import { UserRepository } from '../user/user.repository';
import { IUserDocument } from '../user/user.types';
import { IOtpDocument, OtpModel } from './otp.model';

export class AuthRepository {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

  async createOtp(email: string, codeHash: string, expiresAt: Date): Promise<void> {
    // Drop any previous unconsumed code for this email first, so only the
    // most recently requested code is ever valid.
    await OtpModel.deleteMany({ email: email.toLowerCase(), consumedAt: null });
    await OtpModel.create({ email: email.toLowerCase(), codeHash, expiresAt });
  }

  findActiveOtp(email: string): Promise<IOtpDocument | null> {
    return OtpModel.findOne({
      email: email.toLowerCase(),
      consumedAt: null,
      expiresAt: { $gt: new Date() },
    })
      .sort({ createdAt: -1 })
      .exec();
  }

  async incrementOtpAttempts(id: string): Promise<void> {
    await OtpModel.findByIdAndUpdate(id, { $inc: { attempts: 1 } }).exec();
  }

  async consumeOtp(id: string): Promise<void> {
    await OtpModel.findByIdAndUpdate(id, { consumedAt: new Date() }).exec();
  }

  findByEmailWithPassword(email: string): Promise<IUserDocument | null> {
    return this.userRepository.findByEmailWithPassword(email);
  }

  findByEmail(email: string): Promise<IUserDocument | null> {
    return this.userRepository.findByEmail(email);
  }

  findByPhone(phone: string): Promise<IUserDocument | null> {
    return this.userRepository.findByPhone(phone);
  }

  findById(id: string): Promise<IUserDocument | null> {
    return this.userRepository.findById(id);
  }

  findByIdWithRefreshHash(id: string): Promise<IUserDocument | null> {
    return this.userRepository.findByIdWithRefreshHash(id);
  }

  createUser(data: Parameters<UserRepository['create']>[0]): Promise<IUserDocument> {
    return this.userRepository.create(data);
  }

  updateRefreshTokenHash(id: string, hash: string | null): Promise<void> {
    return this.userRepository.updateRefreshTokenHash(id, hash);
  }
}
