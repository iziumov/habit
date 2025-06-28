import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  HttpCode,
  Query,
} from '@nestjs/common';
import { HabitLogService } from './habit_log.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserId } from 'src/auth/user-id.decorator';

@UseGuards(AuthGuard)
@Controller('habit-log')
export class HabitLogController {
  constructor(private readonly habitLogService: HabitLogService) {}

  @Post(':id/checkin')
  @HttpCode(200)
  async checkin(@Param('id') habitId: string, @UserId() userId: string) {
    return await this.habitLogService.checkin(habitId, userId);
  }

  @Get(':id/streak')
  @HttpCode(200)
  async getStreak(@Param('id') habitId: string, @UserId() userId: string) {
    return await this.habitLogService.getStreak(habitId, userId);
  }

  @Get(':id/logs')
  @HttpCode(200)
  async getLogs(
    @Param('id') habitId: string,
    @UserId() userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 30,
  ) {
    return await this.habitLogService.getLogs(habitId, userId, page, limit);
  }
}
