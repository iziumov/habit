import { Module } from '@nestjs/common';
import { HabitLogService } from './habit_log.service';
import { HabitLogController } from './habit_log.controller';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule],
  controllers: [HabitLogController],
  providers: [HabitLogService],
})
export class HabitLogModule {}
