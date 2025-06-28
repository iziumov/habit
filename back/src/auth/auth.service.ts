import bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client'; // Assuming User model is defined in Prisma

interface TokenPayload {
  id: string;
  email: string;
}

export type UserResponse = Omit<User, 'password' | 'refreshToken'>;

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserResponse;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto): Promise<AuthResponse> {
    const user: User | null = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new BadRequestException('Email is not correct');
    }

    const isMatch: boolean = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new BadRequestException('Email or password is not correct');
    }

    const tokens = await this.generateToken({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const existingUser: User | null = await this.userService.findByEmail(
      dto.email,
    );
    if (existingUser) {
      throw new BadRequestException('User with this email already exist');
    }

    const passwordHash: string = await bcrypt.hash(dto.password, 10);
    const user: User = await this.userService.create({
      ...dto,
      password: passwordHash,
    });

    const tokens = await this.generateToken({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async getMe(userId: string): Promise<UserResponse> {
    const user = await this.userService.findMe(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async logout(userId: string): Promise<{ message: string }> {
    await this.userService.update(userId, { refreshToken: null });
    return { message: 'Logout successful' };
  }

  private async generateToken(
    user: TokenPayload,
  ): Promise<{ access_token: string; refresh_token: string }> {
    const payload: TokenPayload = { id: user.id, email: user.email };

    const access_token: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET_KEY,
      expiresIn: '15m',
    });

    const refresh_token: string = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET_KEY,
      expiresIn: '7d',
    });

    await this.userService.update(user.id, { refreshToken: refresh_token });

    return { access_token, refresh_token };
  }

  async refreshTokens(
    userId: string,
    refreshToken: string,
  ): Promise<AuthResponse> {
    const user = await this.userService.findByIdWithToken(userId);

    if (!user || !user.refreshToken || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateToken({
      id: user.id,
      email: user.email,
    });

    return {
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }
}
