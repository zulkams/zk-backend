import { Controller, Post, Body, Req, UseGuards, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { AuthGuard } from './auth.guard';

export interface LoginDto {
  readonly username: string;
  readonly password: string;
}

export interface AuthenticatedRequest extends Request {
  readonly user?: {
    readonly sub: number;
    readonly username: string;
  };
}

type ApiResponse<T = unknown> =
  | {
      readonly success: true;
      readonly data: T;
    }
  | {
      readonly success: false;
      readonly message: string;
    };

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: LoginDto): Promise<ApiResponse<{ token: string }>> {
    const { username, password } = body;

    if (!username?.trim() || !password?.trim()) {
      return {
        success: false,
        message: 'Username and password are required',
      };
    }

    try {
      const result = await this.authService.login(username, password);
      return result
        ? { success: true, data: result }
        : { success: false, message: 'Invalid credentials' };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      return { success: false, message };
    }
  }

  @Post('logout')
  async logout(): Promise<ApiResponse<unknown>> {
    await Promise.resolve();
    return { success: true, data: {} };
  }

  @Get('session')
  @UseGuards(AuthGuard)
  session(
    @Req() req: AuthenticatedRequest,
  ): ApiResponse<{ user: NonNullable<AuthenticatedRequest['user']> }> {
    return req.user
      ? { success: true, data: { user: req.user } }
      : { success: false, message: 'User not found in session' };
  }
}
