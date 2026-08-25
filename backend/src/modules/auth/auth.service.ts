import { ConflictError, UnauthorizedError } from '../../shared/errors';
import { Role } from '../../shared/constants/roles.constant';
import { AuthRepository } from './auth.repository';
import { LoginDtoType, RegisterDtoType } from './auth.dto';
import { AuthResult, TokenPair } from './auth.types';
import { TokenService } from './token.service';

export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository = new AuthRepository(),
    private readonly tokenService: TokenService = new TokenService(),
  ) {}

  async register(dto: RegisterDtoType): Promise<AuthResult> {
    const [existingEmail, existingPhone] = await Promise.all([
      this.authRepository.findByEmail(dto.email),
      this.authRepository.findByPhone(dto.phone),
    ]);
    if (existingEmail) throw new ConflictError('Email is already registered', 'EMAIL_TAKEN');
    if (existingPhone) throw new ConflictError('Phone number is already registered', 'PHONE_TAKEN');

    const user = await this.authRepository.createUser({
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      password: dto.password,
      role: Role.CUSTOMER,
    });

    const tokens = await this.issueAndPersistTokens(user.id, user.role);
    return { user, tokens };
  }

  async login(dto: LoginDtoType): Promise<AuthResult> {
    const user = await this.authRepository.findByEmailWithPassword(dto.email);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const isValid = await user.comparePassword(dto.password);
    if (!isValid) {
      throw new UnauthorizedError('Invalid email or password', 'INVALID_CREDENTIALS');
    }

    const tokens = await this.issueAndPersistTokens(user.id, user.role);
    return { user, tokens };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    let userId: string;
    try {
      userId = this.tokenService.verifyRefreshToken(refreshToken).sub;
    } catch {
      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    const user = await this.authRepository.findByIdWithRefreshHash(userId);
    if (!user?.refreshTokenHash) {
      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    const matches = await this.tokenService.compareRefreshToken(refreshToken, user.refreshTokenHash);
    if (!matches) {
      // Possible token reuse after rotation — revoke the session defensively.
      await this.authRepository.updateRefreshTokenHash(userId, null);
      throw new UnauthorizedError('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    return this.issueAndPersistTokens(user.id, user.role);
  }

  async logout(userId: string): Promise<void> {
    await this.authRepository.updateRefreshTokenHash(userId, null);
  }

  private async issueAndPersistTokens(userId: string, role: Role): Promise<TokenPair> {
    const tokens = this.tokenService.issueTokenPair(userId, role);
    const hash = await this.tokenService.hashRefreshToken(tokens.refreshToken);
    await this.authRepository.updateRefreshTokenHash(userId, hash);
    return tokens;
  }
}
