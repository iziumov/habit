import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from 'prisma/prisma.module';
import { HabitModule } from './habit/habit.module';
import { HabitLogModule } from './habit_log/habit_log.module';

@Module({
  imports: [AuthModule, UserModule, PrismaModule, HabitModule, HabitLogModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
