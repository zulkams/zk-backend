import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const request = context.switchToHttp().getRequest<Request>();
      const authHeader = request.headers['authorization'];
      if (!authHeader || !authHeader.startsWith('Bearer ')) return false;
      const token = authHeader.slice(7);
      const user = await this.authService.verifyToken(token);
      if (!user) return false;
      request['user'] = user;
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  }
}
