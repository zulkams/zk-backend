import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

export interface JwtPayload {
  readonly sub: number;
  readonly username: string;
}

export interface RefreshTokenPayload {
  readonly sub: number;
  readonly username: string;
  readonly tokenId: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    username: string,
    password: string,
  ): Promise<{ token: string } | null> {
    if (typeof username !== 'string' || typeof password !== 'string') {
      return null;
    }

    const user = await this.userService.validateUser(username, password);
    if (!user) return null;

    const payload: JwtPayload = {
      sub: user.id,
      username: user.username,
    };
    // Set token to never expire (or a very long time, e.g. 10 years)
    const token = this.jwtService.sign(payload, { expiresIn: '10y' });
    return { token };
  }

  // Revoke refresh token (logout or rotation)
  // Revoke refresh token logic disabled

  async verifyToken(token: string): Promise<JwtPayload | null> {
    if (typeof token !== 'string' || token.trim() === '') {
      return null;
    }

    try {
      return (await this.jwtService.verifyAsync<JwtPayload>(token)) ?? null;
    } catch {
      return null;
    }
  }

  // Refresh token logic disabled
}
