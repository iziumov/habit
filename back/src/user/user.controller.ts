import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from 'src/auth/auth.service'; // Assuming UserResponse is defined here

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async getById(@Param('id') id: string): Promise<UserResponse | null> {
    return await this.userService.findById(id);
  }
}
