import bcrypt from 'bcrypt';
import { ConflictError, UnauthorizedError } from '../../shared/errors';
import { Role } from '../../shared/constants/roles.constant';
import { sendOtpEmail } from '../../shared/services/mailer.service';
import { AuthRepository } from './auth.repository';
import { LoginDtoType, RegisterDtoType, VerifyOtpDtoType } from './auth.dto';
import { AuthResult, TokenPair } from './auth.types';
import { TokenService } from './token.service';

const OTP_CODE_HASH_ROUNDS = 10;
const OTP_TTL_MS = 10 * 60 * 1000; // 10 minutes
const OTP_MAX_ATTEMPTS = 5;

function generateOtpCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

  async sendOtp(email: string): Promise<void> {
    const code = generateOtpCode();
    const codeHash = await bcrypt.hash(code, OTP_CODE_HASH_ROUNDS);
    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await this.authRepository.createOtp(email, codeHash, expiresAt);
    await sendOtpEmail(email, code);
  }

  /** Verifies the code and logs the user in, creating an account on first use. */
  async verifyOtp(dto: VerifyOtpDtoType): Promise<AuthResult> {
    const record = await this.authRepository.findActiveOtp(dto.email);
    if (!record) {
      throw new UnauthorizedError('Code expired or not found — request a new one', 'OTP_NOT_FOUND');
    }
    if (record.attempts >= OTP_MAX_ATTEMPTS) {
      throw new UnauthorizedError('Too many attempts — request a new code', 'OTP_LOCKED');
    }

    const isValid = await bcrypt.compare(dto.code, record.codeHash);
    if (!isValid) {
      await this.authRepository.incrementOtpAttempts(record.id);
      throw new UnauthorizedError('Invalid code', 'INVALID_OTP');
    }
    await this.authRepository.consumeOtp(record.id);

    let user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      user = await this.authRepository.createUser({
        name: dto.name?.trim() || dto.email.split('@')[0],
        email: dto.email,
        role: Role.CUSTOMER,
      });
    }

    const tokens = await this.issueAndPersistTokens(user.id, user.role);
    return { user, tokens };
  }

  private async issueAndPersistTokens(userId: string, role: Role): Promise<TokenPair> {
    const tokens = this.tokenService.issueTokenPair(userId, role);
    const hash = await this.tokenService.hashRefreshToken(tokens.refreshToken);
    await this.authRepository.updateRefreshTokenHash(userId, hash);
    return tokens;
  }
}
