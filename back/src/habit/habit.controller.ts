import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { CreateHabitDto } from './dto/create-habit.dto';
import { UserId } from 'src/auth/user-id.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('habit')
export class HabitController {
  constructor(private habitService: HabitService) {}

  @Post()
  @HttpCode(200)
  create(@Body() dto: CreateHabitDto, @UserId() userId: string) {
    return this.habitService.create(userId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  delete(@Param('id') id: string, @UserId() userId: string) {
    return this.habitService.delete(userId, id);
  }

  @Get(':id')
  @HttpCode(200)
  findOne(@Param('id') id: string, @UserId() userId: string) {
    return this.habitService.findOne(userId, id);
  }

  @Get()
  @HttpCode(200)
  findAll(@UserId() userId: string) {
    return this.habitService.findAll(userId);
  }
}
