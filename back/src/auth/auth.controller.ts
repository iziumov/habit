import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService, UserResponse } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { AuthGuard } from './auth.guard';
import { RefreshGuard } from './refresh.guard';

interface RequestWithUser extends Request {
  user: {
    id: string;
    email: string;
    refreshToken: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() dto: LoginDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.login(dto);
  }

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.authService.register(dto);
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Req() req: RequestWithUser): Promise<UserResponse | null> {
    return await this.authService.getMe(req.user.id);
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refreshTokens(
    @Req() req: RequestWithUser,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    return this.authService.refreshTokens(req.user.id, req.user.refreshToken);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: RequestWithUser): Promise<{ message: string }> {
    return this.authService.logout(req.user.id);
  }
}
