import { IUserDocument } from '../user/user.types';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResult {
  user: IUserDocument;
  tokens: TokenPair;
}

export interface IAuthService {
  register(dto: { name: string; email: string; phone: string; password: string }): Promise<AuthResult>;
  login(dto: { email: string; password: string }): Promise<AuthResult>;
  refresh(refreshToken: string): Promise<TokenPair>;
  logout(userId: string): Promise<void>;
}
