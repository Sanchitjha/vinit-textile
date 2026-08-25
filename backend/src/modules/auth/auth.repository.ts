import { UserRepository } from '../user/user.repository';
import { IUserDocument } from '../user/user.types';

export class AuthRepository {
  constructor(private readonly userRepository: UserRepository = new UserRepository()) {}

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
