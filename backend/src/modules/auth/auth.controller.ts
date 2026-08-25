import { CookieOptions, Request, Response } from 'express';
import { env } from '../../config/env';
import { ApiResponse } from '../../shared/responses/ApiResponse';
import { UnauthorizedError } from '../../shared/errors';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { LoginDtoType, RegisterDtoType } from './auth.dto';

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

const refreshCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: 'strict',
  maxAge: REFRESH_COOKIE_MAX_AGE_MS,
  path: '/',
};

export class AuthController {
  constructor(
    private readonly authService: AuthService = new AuthService(),
    private readonly userRepository: UserRepository = new UserRepository(),
  ) {}

  register = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as RegisterDtoType;
    const { user, tokens } = await this.authService.register(dto);
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, refreshCookieOptions);
    ApiResponse.success(res, 'Registered successfully', { user, accessToken: tokens.accessToken }, 201);
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const dto = req.body as LoginDtoType;
    const { user, tokens } = await this.authService.login(dto);
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, refreshCookieOptions);
    ApiResponse.success(res, 'Logged in successfully', { user, accessToken: tokens.accessToken });
  };

  me = async (req: Request, res: Response): Promise<void> => {
    const user = await this.userRepository.findById(req.user!.id);
    if (!user) throw new UnauthorizedError('User no longer exists', 'USER_NOT_FOUND');
    ApiResponse.success(res, 'Profile fetched successfully', user);
  };

  refresh = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies?.[REFRESH_COOKIE_NAME];
    if (!token) throw new UnauthorizedError('Refresh token missing', 'REFRESH_TOKEN_MISSING');

    const tokens = await this.authService.refresh(token);
    res.cookie(REFRESH_COOKIE_NAME, tokens.refreshToken, refreshCookieOptions);
    ApiResponse.success(res, 'Token refreshed successfully', { accessToken: tokens.accessToken });
  };

  logout = async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
      await this.authService.logout(req.user.id);
    }
    res.clearCookie(REFRESH_COOKIE_NAME, { ...refreshCookieOptions, maxAge: undefined });
    ApiResponse.success(res, 'Logged out successfully');
  };
}
