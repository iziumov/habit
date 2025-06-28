import { Injectable } from '@nestjs/common';
import { differenceInDays, startOfDay, subDays } from 'date-fns';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class HabitLogService {
  constructor(private readonly prisma: PrismaService) {}

  async checkin(habitId: string, userId: string) {
    const today = startOfDay(new Date());

    const existingLog = await this.prisma.habitLog.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: today,
        },
      },
    });

    if (existingLog) {
      return await this.prisma.habitLog.update({
        where: { id: existingLog.id },
        data: {
          done: !existingLog.done,
        },
      });
    }

    return await this.prisma.habitLog.create({
      data: {
        habitId,
        userId,
        date: today,
        done: true,
      },
    });
  }

  async getStreak(
    habitId: string,
    userId: string,
  ): Promise<{ streak: number }> {
    const today = startOfDay(new Date());

    const logs = await this.prisma.habitLog.findMany({
      where: {
        habitId,
        userId,
        done: true,
        date: {
          lte: today,
        },
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        date: true,
      },
      take: 100,
    });

    if (logs.length === 0) {
      return { streak: 0 };
    }

    const lastLogDate = startOfDay(new Date(logs[0].date));
    const daysSinceLastLog = differenceInDays(today, lastLogDate);

    if (daysSinceLastLog > 1) {
      return { streak: 0 };
    }

    let streak = 1;
    let expectedDate = subDays(lastLogDate, 1);

    for (let i = 1; i < logs.length; i++) {
      const currentLogDate = startOfDay(new Date(logs[i].date));

      if (currentLogDate.getTime() === expectedDate.getTime()) {
        streak++;
        expectedDate = subDays(expectedDate, 1);
      } else {
        break;
      }
    }

    return { streak };
  }

  async getLogs(
    habitId: string,
    userId: string,
    page: number = 1,
    limit: number = 30,
  ) {
    return await this.prisma.habitLog.findMany({
      where: {
        habitId: habitId,
        userId: userId,
      },
      orderBy: {
        date: 'desc',
      },
      select: {
        id: true,
        date: true,
        done: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
  }
}
