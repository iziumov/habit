import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

interface JwtPayload {
  id: string;
  email: string;
  // Add other properties from your JWT payload here
}

interface RequestWithUser extends Request {
  user: JwtPayload & { refreshToken: string };
  body: {
    refreshToken?: string;
  };
}

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const refreshToken: string | undefined = request.body?.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret: process.env.JWT_REFRESH_SECRET_KEY,
        },
      );

      request.user = {
        ...payload,
        refreshToken,
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }

    return true;
  }
}
